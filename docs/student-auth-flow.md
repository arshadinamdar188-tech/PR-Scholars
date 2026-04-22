# Student Auth Flow (Supabase)

## New Folder Structure

- `src/lib/auth/studentAuthService.ts`
- `src/components/auth/ProtectedRoute.tsx`
- `src/pages/student/Register.tsx`
- `src/pages/student/VerifyEmail.tsx`
- `src/pages/student/CreatePassword.tsx`
- `src/pages/student/Login.tsx`
- `src/pages/student/ForgotPassword.tsx`
- `src/pages/student/ResetPassword.tsx`
- `src/pages/student/Portal.tsx`
- `supabase/migrations/20260421183000_add_student_profiles_auth_flow.sql`

## Environment Variables

Use `.env` values (see `.env.example`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_AUTH_EMAIL_VERIFICATION_MODE=otp` (or `link`)
- `VITE_AUTH_REDIRECT_PATH_CREATE_PASSWORD=/student/create-password`
- `VITE_AUTH_REDIRECT_PATH_RESET_PASSWORD=/student/reset-password`

## Setup Steps

1. Run Supabase migration:
   - `npx supabase db push --include-all`
2. Ensure Supabase Auth email provider is configured in project settings.
3. In Supabase Auth URL settings, include your app URL(s) in redirect allowlist.
4. Deploy frontend with the environment variables above.

## How the Flow Works

1. Student opens `/student/register` and submits profile details.
2. App validates fields, checks duplicates in `student_profiles`, stores pending profile, then triggers Supabase Auth email verification.
3. If mode is OTP:
   - Student enters code on `/student/verify-email`.
4. If mode is link:
   - Student clicks email link and lands on `/student/create-password` with active session.
5. Student sets password on `/student/create-password`.
6. Profile is linked to `auth.users.id` and status becomes `active`.
7. Student logs in using `/student/login` (email + password).
8. Forgot password starts at `/student/forgot-password` and final update is on `/student/reset-password`.
9. `/student/portal` is protected by `ProtectedRoute`.

## Security Notes

- Passwords are handled only via Supabase Auth APIs.
- Passwords are never stored in custom tables or emailed.
- Student profile data is kept separate in `student_profiles` and linked by `auth_user_id`.
- RLS policies restrict profile read/update to the authenticated owner.

## OTP vs Link Limitation

Supabase email verification behavior (OTP vs magic link) is primarily controlled by Supabase Auth settings/templates.
The code is modular and supports both `otp` and `link`, but exact email format depends on Supabase project config.

## Resend Integration Point

`studentAuthService.ts` includes comments where built-in Supabase emails can be replaced by an Edge Function that sends branded emails with Resend.
