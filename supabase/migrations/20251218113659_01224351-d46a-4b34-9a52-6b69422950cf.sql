-- Create gallery_items table
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institute TEXT NOT NULL CHECK (institute IN ('padma', 'racademy')),
  gallery_type TEXT NOT NULL CHECK (gallery_type IN ('founders', 'achievers')),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active gallery items"
ON public.gallery_items
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can insert gallery items"
ON public.gallery_items
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update gallery items"
ON public.gallery_items
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete gallery items"
ON public.gallery_items
FOR DELETE
USING (true);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('galleries', 'galleries', true);

-- Storage policies
CREATE POLICY "Anyone can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'galleries');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'galleries');

CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'galleries');

CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'galleries');

-- Add trigger for updated_at
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data for Padma Founders Gallery
INSERT INTO public.gallery_items (institute, gallery_type, title, description, image_url, display_order) VALUES
('padma', 'founders', 'Founding Day Ceremony', 'The inauguration of Padma Maths Pro', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 1),
('padma', 'founders', 'First Batch of Students', 'Our pioneering batch of mathematics enthusiasts', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800', 2),
('padma', 'founders', 'Excellence Award Ceremony', 'Recognition of academic achievements', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 3);

-- Insert dummy data for Padma Achievers Gallery
INSERT INTO public.gallery_items (institute, gallery_type, title, description, image_url, display_order) VALUES
('padma', 'achievers', 'Board Exam Toppers 2024', 'Students who scored 95%+ in Mathematics', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', 1),
('padma', 'achievers', 'Olympiad Winners', 'National Mathematics Olympiad achievers', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800', 2),
('padma', 'achievers', 'Scholarship Recipients', 'Students awarded prestigious scholarships', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', 3);

-- Insert dummy data for RAcademy Founders Gallery
INSERT INTO public.gallery_items (institute, gallery_type, title, description, image_url, display_order) VALUES
('racademy', 'founders', 'Academy Inauguration', 'The beginning of a new journey for defence aspirants', 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800', 1),
('racademy', 'founders', 'Training Facilities', 'State-of-the-art physical training grounds', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 2),
('racademy', 'founders', 'First SSB Batch', 'Our first batch of SSB candidates', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', 3);

-- Insert dummy data for RAcademy Achievers Gallery
INSERT INTO public.gallery_items (institute, gallery_type, title, description, image_url, display_order) VALUES
('racademy', 'achievers', 'NDA Selection 2024', 'Candidates selected for NDA', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800', 1),
('racademy', 'achievers', 'SSB Interview Success', 'Students who cleared SSB interviews', 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800', 2),
('racademy', 'achievers', 'IMA Passing Out Parade', 'Our students at their commissioning ceremony', 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800', 3);