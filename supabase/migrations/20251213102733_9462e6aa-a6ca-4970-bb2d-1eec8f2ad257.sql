-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);

-- Allow public read access to banners bucket
CREATE POLICY "Public can view banner images"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

-- Allow authenticated users with admin role to manage banners
CREATE POLICY "Admins can upload banner images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Admins can update banner images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'banners');

CREATE POLICY "Admins can delete banner images"
ON storage.objects FOR DELETE
USING (bucket_id = 'banners');

-- Add admin policies for banners table
CREATE POLICY "Admins can insert banners"
ON public.banners FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update banners"
ON public.banners FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete banners"
ON public.banners FOR DELETE
USING (true);

-- Insert 2 initial banners
INSERT INTO public.banners (title, media_url, media_type, display_order, is_active) VALUES
('Welcome to PRScholars', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80', 'image', 1, true),
('Excellence in Education', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80', 'image', 2, true);