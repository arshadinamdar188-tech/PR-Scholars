
-- R's Academy Modules (NDA, CDS, SSB, Seminars)
CREATE TABLE public.racademy_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  mode TEXT NOT NULL DEFAULT 'online', -- online, offline, onsite
  description TEXT,
  target_audience TEXT,
  duration TEXT,
  fee_summary TEXT,
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- R's Academy Subjects/Plans per module
CREATE TABLE public.racademy_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.racademy_modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fee_amount NUMERIC NOT NULL DEFAULT 0,
  fee_label TEXT DEFAULT 'Monthly',
  days TEXT,
  timing TEXT,
  duration TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.racademy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.racademy_subjects ENABLE ROW LEVEL SECURITY;

-- Policies for modules
CREATE POLICY "Anyone can view active modules" ON public.racademy_modules
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage modules" ON public.racademy_modules
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policies for subjects
CREATE POLICY "Anyone can view active subjects" ON public.racademy_subjects
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage subjects" ON public.racademy_subjects
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_racademy_modules_updated_at
  BEFORE UPDATE ON public.racademy_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_racademy_subjects_updated_at
  BEFORE UPDATE ON public.racademy_subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
