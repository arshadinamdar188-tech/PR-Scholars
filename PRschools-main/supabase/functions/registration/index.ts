import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const REGISTRATION_EMAIL_FROM = Deno.env.get("REGISTRATION_EMAIL_FROM") || "PR Scholars <noreply@prscholars.in>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://p-rschools.vercel.app";

interface InitiateRegistrationRequest {
  fullName: string;
  email?: string;
  mobile?: string;
  institute?: string;
  metadata?: Record<string, unknown>;
}

interface PreviewRegistrationRequest {
  token: string;
}

interface CompleteRegistrationRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeName(rawName: string): { firstName: string; lastName: string } {
  const safe = String(rawName || "").trim().replace(/\s+/g, " ");
  const [firstName = "", ...rest] = safe.split(" ");
  return {
    firstName,
    lastName: rest.join(" ") || "",
  };
}

function normalizeEmail(email?: string): string {
  return String(email || "").trim().toLowerCase();
}

function normalizeMobile(mobile?: string): string {
  return String(mobile || "").replace(/\D/g, "").slice(-10);
}

function validateEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validateMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/\d/.test(password)) return "Password must include at least one number.";
  return null;
}

function buildBaseUsername(firstName: string, lastName: string, mobile: string): string {
  const alpha = `${firstName}${lastName}`.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  const mobileDigits = mobile.slice(-4);
  const base = `${alpha}${mobileDigits}`;
  if (!base) return "user0000";
  if (base.length >= 8) return base.slice(0, 8);
  return `${base}${"0".repeat(8 - base.length)}`;
}

function mutateUsernameSeed(base: string, attempt: number): string {
  if (attempt === 0) return base;
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const suffixLength = Math.min(3, Math.max(1, attempt.toString().length));
  const prefix = base.slice(0, 8 - suffixLength);
  let seed = "";
  let n = attempt * 13;
  for (let i = 0; i < suffixLength; i += 1) {
    seed += chars[n % chars.length];
    n = Math.floor(n / chars.length) + 7;
  }
  return `${prefix}${seed}`.slice(0, 8);
}

async function isUsernameTaken(supabase: ReturnType<typeof createClient>, username: string): Promise<boolean> {
  const [{ data: account }, { data: pending }] = await Promise.all([
    supabase.from("student_accounts").select("id").eq("username", username).maybeSingle(),
    supabase.from("registration_requests").select("id").eq("username", username).eq("status", "pending").maybeSingle(),
  ]);
  return Boolean(account || pending);
}

async function generateUniqueUsername(
  supabase: ReturnType<typeof createClient>,
  firstName: string,
  lastName: string,
  mobile: string,
): Promise<string> {
  const base = buildBaseUsername(firstName, lastName, mobile);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const candidate = mutateUsernameSeed(base, attempt);
    if (/^[A-Za-z0-9]{8}$/.test(candidate)) {
      const taken = await isUsernameTaken(supabase, candidate);
      if (!taken) return candidate;
    }
  }
  throw new Error("Unable to generate a unique username. Please try again.");
}

async function sendCongratulationsEmail(email: string, firstName: string, username: string, setupLink: string): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error("Email service is not configured. Missing RESEND_API_KEY.");
  }

  const subject = "Welcome to PR Scholars - Set Your Password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2457d4;">Congratulations, ${firstName || "Learner"}!</h2>
      <p>Your registration with <strong>PR Scholars</strong> has been received successfully.</p>
      <p>Your user ID is:</p>
      <p style="font-size: 22px; font-weight: bold; color: #1f2937; letter-spacing: 1px;">${username}</p>
      <p>Click the button below to create your password:</p>
      <p>
        <a href="${setupLink}" style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #2457d4; color: #fff; text-decoration: none; font-weight: 600;">Create Password</a>
      </p>
      <p style="font-size: 12px; color: #6b7280;">This link expires in 48 hours.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #6b7280;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: REGISTRATION_EMAIL_FROM,
      to: [email],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Failed to send registration email:", errText);
    throw new Error("Failed to send registration email.");
  }
}

async function createAuthUser(
  supabase: ReturnType<typeof createClient>,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string,
): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      username,
      role: "student",
    },
  });

  if (error || !data.user?.id) {
    console.error("Auth user creation failed:", error);
    throw new Error(error?.message || "Failed to create auth user.");
  }

  return data.user.id;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ success: false, error: "Server is not configured correctly." }, 500);
    }

    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === "initiate" && req.method === "POST") {
      const body: InitiateRegistrationRequest = await req.json();
      const institute = (body.institute || "padma").toLowerCase();
      const { firstName, lastName } = sanitizeName(body.fullName || "");
      const email = normalizeEmail(body.email);
      const mobile = normalizeMobile(body.mobile);

      if (!firstName) return jsonResponse({ success: false, error: "First name is required." }, 400);
      if (!validateEmail(email)) return jsonResponse({ success: false, error: "Invalid email address." }, 400);
      if (!validateMobile(mobile)) return jsonResponse({ success: false, error: "Invalid mobile number." }, 400);

      const { data: existingAccount } = await supabase
        .from("student_accounts")
        .select("id")
        .or(`email.eq.${email},mobile.eq.${mobile}`)
        .maybeSingle();

      if (existingAccount) {
        return jsonResponse({ success: false, error: "An account already exists with this email or mobile." }, 409);
      }

      const { data: existingPending } = await supabase
        .from("registration_requests")
        .select("id, setup_token")
        .eq("status", "pending")
        .or(`email.eq.${email},mobile.eq.${mobile}`)
        .maybeSingle();

      if (existingPending?.setup_token) {
        const existingRedirectPath = `/padma/create-password?token=${encodeURIComponent(existingPending.setup_token)}`;
        return jsonResponse({
          success: true,
          message: "Registration already exists. Please continue password setup.",
          redirectPath: existingRedirectPath,
        });
      }

      const username = await generateUniqueUsername(supabase, firstName, lastName, mobile);
      const setupToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);

      const { data: requestData, error: requestError } = await supabase
        .from("registration_requests")
        .insert({
          institute,
          first_name: firstName,
          last_name: lastName || null,
          email,
          mobile,
          username,
          setup_token: setupToken,
          metadata: body.metadata || {},
        })
        .select("id")
        .single();

      if (requestError || !requestData?.id) {
        console.error("Failed to create registration request:", requestError);
        return jsonResponse({ success: false, error: "Unable to create registration request." }, 500);
      }

      const redirectPath = `/padma/create-password?token=${encodeURIComponent(setupToken)}`;
      const setupLink = `${SITE_URL}${redirectPath}`;

      await sendCongratulationsEmail(email, firstName, username, setupLink);

      return jsonResponse({
        success: true,
        message: "Registration successful. Please check your email to create password.",
        redirectPath,
        username,
      });
    }

    if (action === "preview" && req.method === "POST") {
      const body: PreviewRegistrationRequest = await req.json();
      const token = String(body.token || "").trim();
      if (!token) return jsonResponse({ success: false, error: "Invalid registration token." }, 400);

      const { data, error } = await supabase
        .from("registration_requests")
        .select("first_name, last_name, email, username, status, expires_at")
        .eq("setup_token", token)
        .maybeSingle();

      if (error || !data) {
        return jsonResponse({ success: false, error: "Registration link is invalid." }, 404);
      }

      if (data.status !== "pending") {
        return jsonResponse({ success: false, error: "This registration link has already been used." }, 409);
      }

      if (new Date(data.expires_at).getTime() < Date.now()) {
        return jsonResponse({ success: false, error: "Registration link has expired." }, 410);
      }

      return jsonResponse({
        success: true,
        data: {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          username: data.username,
        },
      });
    }

    if (action === "complete" && req.method === "POST") {
      const body: CompleteRegistrationRequest = await req.json();
      const token = String(body.token || "").trim();
      const password = String(body.password || "");
      const confirmPassword = String(body.confirmPassword || "");

      if (!token) return jsonResponse({ success: false, error: "Invalid registration token." }, 400);
      if (password !== confirmPassword) return jsonResponse({ success: false, error: "Passwords do not match." }, 400);

      const passwordError = validatePassword(password);
      if (passwordError) return jsonResponse({ success: false, error: passwordError }, 400);

      const { data: requestData, error: fetchError } = await supabase
        .from("registration_requests")
        .select("id, institute, first_name, last_name, email, mobile, username, status, expires_at")
        .eq("setup_token", token)
        .maybeSingle();

      if (fetchError || !requestData) {
        return jsonResponse({ success: false, error: "Registration link is invalid." }, 404);
      }

      if (requestData.status !== "pending") {
        return jsonResponse({ success: false, error: "This registration link has already been used." }, 409);
      }

      if (new Date(requestData.expires_at).getTime() < Date.now()) {
        await supabase
          .from("registration_requests")
          .update({ status: "expired" })
          .eq("id", requestData.id);
        return jsonResponse({ success: false, error: "Registration link has expired." }, 410);
      }

      const authUserId = await createAuthUser(
        supabase,
        requestData.email,
        password,
        requestData.first_name,
        requestData.last_name || "",
        requestData.username,
      );

      const { error: studentInsertError } = await supabase
        .from("student_accounts")
        .insert({
          auth_user_id: authUserId,
          institute: requestData.institute,
          username: requestData.username,
          first_name: requestData.first_name,
          last_name: requestData.last_name || null,
          email: requestData.email,
          mobile: requestData.mobile,
        });

      if (studentInsertError) {
        console.error("Failed to insert student account:", studentInsertError);
        return jsonResponse({ success: false, error: "Failed to save student account." }, 500);
      }

      const { error: updateError } = await supabase
        .from("registration_requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          setup_token: `used_${crypto.randomUUID().replace(/-/g, "")}`,
        })
        .eq("id", requestData.id);

      if (updateError) {
        console.error("Failed to update registration status:", updateError);
      }

      return jsonResponse({
        success: true,
        message: "Password created successfully.",
        username: requestData.username,
      });
    }

    return jsonResponse({ success: false, error: "Route not found." }, 404);
  } catch (error) {
    console.error("registration function error:", error);
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unexpected server error.",
    }, 500);
  }
});
