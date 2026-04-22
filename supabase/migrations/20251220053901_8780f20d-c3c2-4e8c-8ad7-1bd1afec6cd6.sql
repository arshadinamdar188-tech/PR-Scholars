-- Drop existing policies that don't properly check admin role
DROP POLICY IF EXISTS "Admins can insert banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can update banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON public.banners;

-- Create proper admin policies using has_role function
CREATE POLICY "Admins can insert banners" 
ON public.banners 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update banners" 
ON public.banners 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete banners" 
ON public.banners 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));