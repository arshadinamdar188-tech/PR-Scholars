-- Drop the overly permissive public SELECT policy on coupons
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

-- Add policy to allow edge functions (service role) to validate coupons
-- The service role already bypasses RLS, so no additional policy needed
-- This removes public access to coupon catalog while keeping admin access and edge function validation working

-- Note: Edge functions use service_role_key which bypasses RLS
-- Users can only validate coupons through the edge function, not query the full catalog