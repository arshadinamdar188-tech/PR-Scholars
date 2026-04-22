import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export type VerificationMode = "otp" | "link";

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Invalid email"),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  institute: z.string().trim().max(120).optional().default(""),
});

const OTP_SCHEMA = z.object({
  email: z.string().trim().email("Invalid email"),
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/\d/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

export type RegisterPayload = z.infer<typeof registerSchema> & {
  verificationMode?: VerificationMode;
};

export type StudentProfile = {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string;
  mobile: string;
  institute: string | null;
  status: string;
  verification_method: VerificationMode | null;
  created_at: string;
  verified_at: string | null;
  password_set_at: string | null;
  last_login_at: string | null;
};

const DEFAULT_VERIFICATION_MODE =
  (import.meta.env.VITE_AUTH_EMAIL_VERIFICATION_MODE as VerificationMode | undefined) || "otp";

function getCreatePasswordRedirectUrl() {
  const path = import.meta.env.VITE_AUTH_REDIRECT_PATH_CREATE_PASSWORD || "/student/create-password";
  return `${window.location.origin}${path}`;
}

function getResetPasswordRedirectUrl() {
  const path = import.meta.env.VITE_AUTH_REDIRECT_PATH_RESET_PASSWORD || "/student/reset-password";
  return `${window.location.origin}${path}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getAuthErrorMessage(error: any, fallback: string) {
  const raw = String(error?.message || fallback);

  if (/invalid login credentials/i.test(raw)) return "Login failed. Please check email and password.";
  if (/email not confirmed/i.test(raw)) return "Email not verified yet. Verify first and then login.";
  if (/token has expired|otp expired/i.test(raw)) return "OTP expired. Request a new code.";
  if (/token is invalid|invalid otp|otp/i.test(raw)) return "Wrong OTP. Please verify and try again.";
  if (/password should be at least|weak password/i.test(raw)) return "Weak password. Please use a stronger password.";
  if (/user already registered|already exists|duplicate/i.test(raw)) return "Email is already registered.";

  return raw;
}

async function insertPreRegistrationProfile(payload: RegisterPayload, mode: VerificationMode) {
  const normalizedEmail = normalizeEmail(payload.email);
  const { error } = await (supabase as any).from("student_profiles").insert(
    {
      email: normalizedEmail,
      full_name: payload.fullName.trim(),
      mobile: payload.mobile.trim(),
      institute: payload.institute?.trim() || null,
      status: "pending_verification",
      verification_method: mode,
      metadata_json: {},
    },
  );

  if (error) {
    const code = String((error as any)?.code || "");
    const message = String((error as any)?.message || "");

    // Duplicate email means a profile already exists; avoid anon upsert->update RLS failures.
    if (code === "23505" || /duplicate key value|unique constraint/i.test(message)) {
      return;
    }

    throw new Error(error.message || "Could not save pre-registration profile.");
  }
}

export async function registerStudent(payload: RegisterPayload) {
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid registration details.");
  }

  const mode = payload.verificationMode || DEFAULT_VERIFICATION_MODE;
  const normalizedEmail = normalizeEmail(parsed.data.email);

  await insertPreRegistrationProfile({ ...parsed.data, email: normalizedEmail, verificationMode: mode }, mode);

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: getCreatePasswordRedirectUrl(),
      data: {
        full_name: parsed.data.fullName.trim(),
        mobile: parsed.data.mobile.trim(),
      },
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, "Could not send verification email."));
  }

  return {
    verificationMode: mode,
    email: normalizedEmail,
    message:
      mode === "otp"
        ? "Verification code sent to your email."
        : "Verification link sent to your email.",
  };
}

export async function resendVerificationCode(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: getCreatePasswordRedirectUrl(),
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, "Could not resend verification email."));
  }
}

export async function verifyEmailOtp(payload: { email: string; otp: string }) {
  const parsed = OTP_SCHEMA.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid OTP details.");
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: normalizeEmail(parsed.data.email),
    token: parsed.data.otp,
    type: "email",
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, "OTP verification failed."));
  }

  await syncProfileAfterVerification(data?.user?.id || null, normalizeEmail(parsed.data.email));
}

async function syncProfileAfterVerification(userId: string | null, email: string) {
  if (!email) return;

  const profilePatch: Record<string, unknown> = {
    status: "active",
    verified_at: new Date().toISOString(),
  };

  if (userId) {
    profilePatch.auth_user_id = userId;
  }

  const { error } = await (supabase as any)
    .from("student_profiles")
    .update(profilePatch)
    .eq("email", normalizeEmail(email));

  if (error) {
    throw new Error(error.message || "Email verified, but profile sync failed.");
  }
}

export async function syncCurrentUserProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user?.email) return;
  await syncProfileAfterVerification(user.id, user.email);
}

export function validatePasswordStrength(password: string) {
  const parsed = passwordSchema.safeParse(password);
  if (parsed.success) return { valid: true, message: "Strong password" };
  return {
    valid: false,
    message: parsed.error.issues[0]?.message || "Weak password",
  };
}

export async function setInitialPassword(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    throw new Error("Password mismatch. Please ensure both passwords are the same.");
  }

  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message);
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) {
    throw new Error("Session expired. Verify your email again.");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(getAuthErrorMessage(error, "Could not set password."));
  }

  const { error: profileError } = await (supabase as any)
    .from("student_profiles")
    .update({
      auth_user_id: user.id,
      status: "active",
      password_set_at: new Date().toISOString(),
      verified_at: new Date().toISOString(),
    })
    .eq("email", normalizeEmail(user.email || ""));

  if (profileError) {
    throw new Error(profileError.message || "Password set, but profile update failed.");
  }
}

export async function loginWithEmailPassword(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, "Login failed."));
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (user?.email) {
    await (supabase as any)
      .from("student_profiles")
      .update({
        auth_user_id: user.id,
        status: "active",
        last_login_at: new Date().toISOString(),
      })
      .eq("email", normalizeEmail(user.email));
  }
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = normalizeEmail(email);

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: getResetPasswordRedirectUrl(),
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, "Could not send password reset email."));
  }

  // Integration point for future custom email providers (e.g. Resend):
  // replace this auth call with an Edge Function that generates a recovery link
  // and sends a branded template through your provider.
}

export async function updatePasswordFromRecovery(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    throw new Error("Password mismatch. Please ensure both passwords are the same.");
  }

  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(getAuthErrorMessage(error, "Could not update password."));
  }
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentStudentProfile() {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email) return null;

  const { data, error } = await (supabase as any)
    .from("student_profiles")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Could not load profile.");
  }

  return (data || null) as StudentProfile | null;
}

export async function logoutStudent() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || "Could not logout.");
  }
}
