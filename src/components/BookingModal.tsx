import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Tag, X, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
    institute: "padma" | "racademy";
  };
}

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingModal = ({ isOpen, onClose, course }: BookingModalProps) => {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const primaryColor = course.institute === "padma" ? "royal-blue" : "olive";
  const finalAmount = course.price - (couponApplied?.discountAmount || 0);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay/validate-coupon", {
        body: {
          code: couponCode,
          amount: course.price,
          institute: course.institute,
        },
      });

      if (error) throw error;

      if (data.valid) {
        setCouponApplied({
          code: data.coupon.code,
          discountAmount: data.coupon.discountAmount,
        });
        toast({
          title: "Coupon Applied!",
          description: `You saved ₹${data.coupon.discountAmount.toLocaleString("en-IN")}`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: data.error || "This coupon is not valid",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Coupon validation error:", error);
      toast({
        title: "Error",
        description: "Failed to validate coupon",
        variant: "destructive",
      });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode("");
  };

  const handleSubmit = async () => {
    // Validate form
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      // Load Razorpay script
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      // Create order
      const { data, error } = await supabase.functions.invoke("razorpay/create-order", {
        body: {
          courseId: course.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          amount: course.price,
          couponCode: couponApplied?.code,
          institute: course.institute,
          userType: "student",
        },
      });

      if (error) throw error;

      setOrderDetails(data);
      setStep("payment");

      // Open Razorpay checkout
      const options = {
        key: data.razorpayKeyId,
        amount: Math.round(data.amount * 100),
        currency: "INR",
        name: course.institute === "padma" ? "Padma Maths Pro" : "Colonel R's Academy",
        description: course.title,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          await handlePaymentSuccess(response, data.order.id);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: course.institute === "padma" ? "#3A6FF8" : "#5B7A3D",
        },
        modal: {
          ondismiss: function () {
            setStep("details");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("razorpay/verify-payment", {
        body: {
          orderId: orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        },
      });

      if (error) throw error;

      setStep("success");
      toast({
        title: "Payment Successful!",
        description: "You have been enrolled in the course",
      });
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast({
        title: "Payment Verification Failed",
        description: "Please contact support if amount was deducted",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleClose = () => {
    setStep("details");
    setFormData({ name: "", email: "", phone: "" });
    setCouponCode("");
    setCouponApplied(null);
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-${primaryColor}`}>
            {step === "success" ? "Booking Confirmed!" : "Book Course"}
          </DialogTitle>
          <DialogDescription>
            {step === "details" && "Enter your details to proceed with booking"}
            {step === "payment" && "Complete payment to confirm enrollment"}
            {step === "success" && "Your enrollment has been confirmed"}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4">
            {/* Course Info */}
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold text-foreground">{course.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-foreground">
                  ₹{finalAmount.toLocaleString("en-IN")}
                </span>
                {couponApplied && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="border-t pt-4">
              <Label className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4" />
                Have a coupon code?
              </Label>
              {couponApplied ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-300">
                      {couponApplied.code}
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      - ₹{couponApplied.discountAmount.toLocaleString("en-IN")} off
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={validateCoupon}
                    disabled={!couponCode.trim() || validatingCoupon}
                  >
                    {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className={`w-full ${course.institute === "padma" ? "bg-royal-blue hover:bg-royal-blue/90" : "bg-olive hover:bg-olive/90"}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Pay ₹{finalAmount.toLocaleString("en-IN")}
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Processing payment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Congratulations!</h3>
            <p className="text-muted-foreground mb-4">
              You have been successfully enrolled in <strong>{course.title}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;