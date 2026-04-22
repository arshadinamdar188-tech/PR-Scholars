import { supabase } from "@/integrations/supabase/client";

export interface InitiateRegistrationPayload {
  fullName: string;
  email: string;
  mobile: string;
  institute?: string;
  metadata?: Record<string, unknown>;
}

export interface InitiateRegistrationResult {
  success: boolean;
  message: string;
  redirectPath: string;
  username: string;
}

export interface RegistrationPreviewResult {
  success: boolean;
  data: {
    firstName: string;
    lastName: string | null;
    email: string;
    username: string;
  };
}

export interface CompleteRegistrationPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

interface FunctionResponse<T> {
  data: T | null;
  error: Error | null;
}

function getErrorMessage(fallback: string, payload?: any, error?: Error | null): string {
  if (payload?.error) return String(payload.error);
  if (error?.message) return error.message;
  return fallback;
}

async function invokeRegistrationFunction<T>(
  action: "initiate" | "preview" | "complete",
  body: Record<string, unknown>,
): Promise<T> {
  const { data, error }: FunctionResponse<any> = await supabase.functions.invoke(`registration/${action}`, { body });
  if (error) {
    throw new Error(getErrorMessage("Registration service is unavailable.", data, error));
  }
  if (!data?.success) {
    throw new Error(getErrorMessage("Registration request failed.", data, null));
  }
  return data as T;
}

export async function initiateRegistration(payload: InitiateRegistrationPayload): Promise<InitiateRegistrationResult> {
  return invokeRegistrationFunction<InitiateRegistrationResult>("initiate", payload);
}

export async function previewRegistration(token: string): Promise<RegistrationPreviewResult> {
  return invokeRegistrationFunction<RegistrationPreviewResult>("preview", { token });
}

export async function completeRegistration(payload: CompleteRegistrationPayload): Promise<{ success: boolean; message: string; username: string }> {
  return invokeRegistrationFunction("complete", payload);
}
