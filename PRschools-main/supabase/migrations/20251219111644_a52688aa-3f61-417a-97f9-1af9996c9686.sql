-- Create storage bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true);

-- Create policies for course thumbnails bucket
CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update course thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));