-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;

-- Create a new policy that allows admins to view all banners
CREATE POLICY "Anyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (is_active = true);

-- Create a separate policy for admins to view ALL banners
CREATE POLICY "Admins can view all banners" 
ON public.banners 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));