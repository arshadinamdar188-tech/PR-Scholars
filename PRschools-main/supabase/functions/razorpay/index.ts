import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface CreateOrderRequest {
  courseId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  couponCode?: string;
  institute: string;
  userType: string;
}

interface VerifyPaymentRequest {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

interface ValidateCouponRequest {
  code: string;
  amount: number;
  institute?: string;
}

async function createRazorpayOrder(amount: number, receipt: string) {
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: receipt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Razorpay order creation failed:", error);
    throw new Error("Failed to create Razorpay order");
  }

  return await response.json();
}

async function verifySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  if (!RAZORPAY_KEY_SECRET) {
    console.error("RAZORPAY_KEY_SECRET not configured");
    return false;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`${orderId}|${paymentId}`);
  const keyData = encoder.encode(RAZORPAY_KEY_SECRET);
  
  try {
    // Import key for HMAC-SHA256
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    // Generate signature
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
    
    // Convert to hex string
    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const isValid = generatedSignature === signature;
    
    if (!isValid) {
      console.error("Signature mismatch - expected:", generatedSignature, "received:", signature);
    }
    
    return isValid;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (action === "create-order" && req.method === "POST") {
      const body: CreateOrderRequest = await req.json();
      console.log("Creating order for:", body);

      // Generate order number
      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      let discountAmount = 0;
      let couponId = null;
      let finalAmount = body.amount;

      // Validate coupon if provided
      if (body.couponCode) {
        const { data: coupon, error: couponError } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", body.couponCode.toUpperCase())
          .eq("is_active", true)
          .single();

        if (coupon && !couponError) {
          const now = new Date();
          const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
          const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

          if (
            (!validFrom || now >= validFrom) &&
            (!validUntil || now <= validUntil) &&
            (!coupon.usage_limit || coupon.used_count < coupon.usage_limit) &&
            body.amount >= (coupon.min_order_amount || 0) &&
            (!coupon.institute || coupon.institute === body.institute)
          ) {
            if (coupon.discount_type === "percentage") {
              discountAmount = (body.amount * coupon.discount_value) / 100;
              if (coupon.max_discount) {
                discountAmount = Math.min(discountAmount, coupon.max_discount);
              }
            } else {
              discountAmount = coupon.discount_value;
            }
            couponId = coupon.id;
            finalAmount = body.amount - discountAmount;
          }
        }
      }

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(finalAmount, orderNumber);
      console.log("Razorpay order created:", razorpayOrder.id);

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          course_id: body.courseId,
          customer_name: body.customerName,
          customer_email: body.customerEmail,
          customer_phone: body.customerPhone,
          amount: body.amount,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          coupon_id: couponId,
          coupon_code: body.couponCode?.toUpperCase() || null,
          razorpay_order_id: razorpayOrder.id,
          payment_status: "pending",
          user_type: body.userType || "student",
          institute: body.institute,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw new Error("Failed to create order in database");
      }

      return new Response(
        JSON.stringify({
          success: true,
          order: order,
          razorpayOrderId: razorpayOrder.id,
          razorpayKeyId: RAZORPAY_KEY_ID,
          amount: finalAmount,
          discountAmount: discountAmount,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify-payment" && req.method === "POST") {
      const body: VerifyPaymentRequest = await req.json();
      console.log("Verifying payment for order:", body.orderId);

      // Verify signature with proper HMAC-SHA256
      const isValid = await verifySignature(
        body.razorpayOrderId,
        body.razorpayPaymentId,
        body.razorpaySignature
      );

      if (!isValid) {
        console.error("Payment signature verification failed for order:", body.orderId);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid payment signature" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update order with payment details
      const { data: order, error: updateError } = await supabase
        .from("orders")
        .update({
          razorpay_payment_id: body.razorpayPaymentId,
          razorpay_signature: body.razorpaySignature,
          payment_status: "completed",
        })
        .eq("id", body.orderId)
        .select()
        .single();

      if (updateError) {
        console.error("Order update error:", updateError);
        throw new Error("Failed to update order");
      }

      // Update coupon usage count if used
      if (order.coupon_id) {
        await supabase.rpc("increment_coupon_usage", { coupon_id: order.coupon_id });
      }

      console.log("Payment verified successfully for order:", order.order_number);

      return new Response(
        JSON.stringify({ success: true, order }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "validate-coupon" && req.method === "POST") {
      const body: ValidateCouponRequest = await req.json();
      console.log("Validating coupon:", body.code);

      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", body.code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !coupon) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid coupon code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const now = new Date();
      const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

      if (validFrom && now < validFrom) {
        return new Response(
          JSON.stringify({ valid: false, error: "Coupon is not yet active" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (validUntil && now > validUntil) {
        return new Response(
          JSON.stringify({ valid: false, error: "Coupon has expired" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return new Response(
          JSON.stringify({ valid: false, error: "Coupon usage limit reached" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (coupon.min_order_amount && body.amount < coupon.min_order_amount) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: `Minimum order amount is ₹${coupon.min_order_amount}` 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (coupon.institute && body.institute && coupon.institute !== body.institute) {
        return new Response(
          JSON.stringify({ valid: false, error: "Coupon not valid for this institute" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let discountAmount = 0;
      if (coupon.discount_type === "percentage") {
        discountAmount = (body.amount * coupon.discount_value) / 100;
        if (coupon.max_discount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount);
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      return new Response(
        JSON.stringify({
          valid: true,
          coupon: {
            code: coupon.code,
            discountType: coupon.discount_type,
            discountValue: coupon.discount_value,
            discountAmount: discountAmount,
            maxDiscount: coupon.max_discount,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in razorpay function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);