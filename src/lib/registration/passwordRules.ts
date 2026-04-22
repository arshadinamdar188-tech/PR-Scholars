export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordRules(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) errors.push("At least 8 characters required");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter required");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter required");
  if (!/\d/.test(password)) errors.push("At least one number required");

  return {
    valid: errors.length === 0,
    errors,
  };
}
