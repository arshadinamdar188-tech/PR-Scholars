-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update existing course policies to use admin role check
DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;

CREATE POLICY "Admins can insert courses"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
ON public.courses
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
ON public.courses
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update course_features policies
DROP POLICY IF EXISTS "Admins can manage course features" ON public.course_features;

CREATE POLICY "Admins can manage course features"
ON public.course_features
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update course_units policies
DROP POLICY IF EXISTS "Admins can manage course units" ON public.course_units;

CREATE POLICY "Admins can manage course units"
ON public.course_units
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update course_chapters policies
DROP POLICY IF EXISTS "Admins can manage course chapters" ON public.course_chapters;

CREATE POLICY "Admins can manage course chapters"
ON public.course_chapters
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update course_faqs policies
DROP POLICY IF EXISTS "Admins can manage course faqs" ON public.course_faqs;

CREATE POLICY "Admins can manage course faqs"
ON public.course_faqs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));