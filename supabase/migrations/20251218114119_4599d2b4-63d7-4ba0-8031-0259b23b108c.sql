-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institute TEXT NOT NULL CHECK (institute IN ('padma', 'racademy')),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2),
  duration TEXT,
  batch_size INTEGER DEFAULT 20,
  success_rate TEXT DEFAULT '90%+',
  mentor_name TEXT,
  mentor_title TEXT,
  mentor_image TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_features table
CREATE TABLE public.course_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Create course_syllabus table (units)
CREATE TABLE public.course_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Create course chapters table
CREATE TABLE public.course_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES public.course_units(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  topics TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Create course FAQs table
CREATE TABLE public.course_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_faqs ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (true);
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (true);

-- RLS policies for course_features
CREATE POLICY "Anyone can view course features" ON public.course_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage course features" ON public.course_features FOR ALL USING (true);

-- RLS policies for course_units
CREATE POLICY "Anyone can view course units" ON public.course_units FOR SELECT USING (true);
CREATE POLICY "Admins can manage course units" ON public.course_units FOR ALL USING (true);

-- RLS policies for course_chapters
CREATE POLICY "Anyone can view course chapters" ON public.course_chapters FOR SELECT USING (true);
CREATE POLICY "Admins can manage course chapters" ON public.course_chapters FOR ALL USING (true);

-- RLS policies for course_faqs
CREATE POLICY "Anyone can view course faqs" ON public.course_faqs FOR SELECT USING (true);
CREATE POLICY "Admins can manage course faqs" ON public.course_faqs FOR ALL USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Padma Maths Pro courses
INSERT INTO public.courses (institute, slug, title, subtitle, description, price, original_price, duration, batch_size, mentor_name, mentor_title, thumbnail_url, display_order) VALUES
('padma', '9th-cbse', '9th Maths CBSE', 'Foundation Course', 'Build a strong foundation in Mathematics with comprehensive coverage of CBSE 9th standard syllabus. Interactive classes, practice problems, and personalized attention.', 15000, 20000, '10 months', 20, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', 1),
('padma', '9th-icse', '9th Maths ICSE', 'Foundation Course', 'Master ICSE Mathematics with detailed explanations and extensive practice. Perfect preparation for board exams and competitive tests.', 16000, 21000, '10 months', 20, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', 2),
('padma', '10th-cbse', '10th Maths CBSE', 'Board Exam Preparation', 'Intensive preparation for CBSE 10th board exams with focus on scoring maximum marks. Includes mock tests and previous year paper solutions.', 18000, 24000, '10 months', 20, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800', 3),
('padma', '10th-icse', '10th Maths ICSE', 'Board Exam Preparation', 'Complete ICSE 10th Mathematics preparation with expert guidance. Achieve excellence in board exams with our proven methodology.', 19000, 25000, '10 months', 20, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800', 4),
('padma', '11th-cbse', '11th Maths CBSE', 'Advanced Mathematics', 'Bridge the gap between school and competitive exam mathematics. Covers complete CBSE syllabus with JEE/NEET relevant topics.', 22000, 28000, '10 months', 15, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800', 5),
('padma', '11th-icse', '11th Maths ICSE', 'Advanced Mathematics', 'Master ISC Mathematics with comprehensive coverage of all topics. Strong foundation for higher studies and competitive exams.', 23000, 29000, '10 months', 15, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=800', 6),
('padma', '12th-cbse', '12th Maths CBSE', 'Board + Competitive', 'Complete 12th CBSE Mathematics with focus on both board exams and competitive entrance tests. Calculus, Algebra, and more.', 25000, 32000, '10 months', 15, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=800', 7),
('padma', '12th-icse', '12th Maths ISC', 'Board + Competitive', 'ISC Mathematics mastery with comprehensive exam preparation. Excel in board exams and crack competitive entrance tests.', 26000, 33000, '10 months', 15, 'Col. Ramu Ranganathan', 'Founder & Chief Mentor', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', 8);

-- Insert R Academy defence courses
INSERT INTO public.courses (institute, slug, title, subtitle, description, price, original_price, duration, batch_size, mentor_name, mentor_title, thumbnail_url, display_order, is_featured) VALUES
('racademy', 'nda', 'NDA & NA Entrance Exam', 'Defence Forces Entry', 'Comprehensive preparation for National Defence Academy and Naval Academy entrance examination. Covers Mathematics, GAT, and physical fitness training.', 45000, 55000, '6 months', 25, 'Col. Ramu Ranganathan', 'Ex-Army Officer & Mentor', 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800', 1, true),
('racademy', 'cds', 'CDS/AFCAT/INET Exam', 'Officer Entry Scheme', 'Combined preparation for CDS, AFCAT, and INET examinations. Complete syllabus coverage with mock tests and interview preparation.', 40000, 50000, '6 months', 25, 'Col. Ramu Ranganathan', 'Ex-Army Officer & Mentor', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 2, true),
('racademy', 'ssb', 'SSB Interview Training', 'Selection Board Prep', 'Intensive Services Selection Board interview preparation. Covers psychological tests, group tasks, and personal interview techniques.', 35000, 42000, '3 months', 15, 'Col. Ramu Ranganathan', 'Ex-Army Officer & Mentor', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800', 3, true);

-- Insert course features for some courses
INSERT INTO public.course_features (course_id, feature, display_order) 
SELECT id, 'Live interactive classes', 1 FROM public.courses WHERE slug = '9th-cbse'
UNION ALL SELECT id, 'Doubt clearing sessions', 2 FROM public.courses WHERE slug = '9th-cbse'
UNION ALL SELECT id, 'Practice worksheets', 3 FROM public.courses WHERE slug = '9th-cbse'
UNION ALL SELECT id, 'Monthly assessments', 4 FROM public.courses WHERE slug = '9th-cbse'
UNION ALL SELECT id, 'Parent-teacher meetings', 5 FROM public.courses WHERE slug = '9th-cbse';

INSERT INTO public.course_features (course_id, feature, display_order) 
SELECT id, 'Written exam preparation', 1 FROM public.courses WHERE slug = 'nda'
UNION ALL SELECT id, 'Physical fitness training', 2 FROM public.courses WHERE slug = 'nda'
UNION ALL SELECT id, 'SSB screening guidance', 3 FROM public.courses WHERE slug = 'nda'
UNION ALL SELECT id, 'Mock tests every week', 4 FROM public.courses WHERE slug = 'nda'
UNION ALL SELECT id, 'Personal mentoring', 5 FROM public.courses WHERE slug = 'nda';

-- Insert some FAQs
INSERT INTO public.course_faqs (course_id, question, answer, display_order)
SELECT id, 'What is the batch timing?', 'We offer flexible batch timings - morning (6 AM - 8 AM) and evening (5 PM - 7 PM) batches. Weekend batches are also available.', 1 FROM public.courses WHERE slug = '9th-cbse'
UNION ALL SELECT id, 'Is there a demo class available?', 'Yes, we offer a free demo class for all new students. Contact us to schedule your demo session.', 2 FROM public.courses WHERE slug = '9th-cbse'
UNION ALL SELECT id, 'What is the fee payment structure?', 'Fees can be paid in installments - 50% at enrollment and 50% after 3 months. EMI options are also available.', 3 FROM public.courses WHERE slug = '9th-cbse';