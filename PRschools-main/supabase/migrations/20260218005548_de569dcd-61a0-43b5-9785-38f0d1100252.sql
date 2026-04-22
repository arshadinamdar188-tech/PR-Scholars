
-- Boards table
CREATE TABLE public.padma_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.padma_boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active boards" ON public.padma_boards FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage boards" ON public.padma_boards FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Grades per board
CREATE TABLE public.padma_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES public.padma_boards(id) ON DELETE CASCADE NOT NULL,
  grade_number integer NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(board_id, grade_number)
);
ALTER TABLE public.padma_grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active grades" ON public.padma_grades FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage grades" ON public.padma_grades FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Subjects per grade
CREATE TABLE public.padma_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id uuid REFERENCES public.padma_grades(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.padma_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active subjects" ON public.padma_subjects FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage subjects" ON public.padma_subjects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Pricing plans per grade+mode
CREATE TABLE public.padma_pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id uuid REFERENCES public.padma_grades(id) ON DELETE CASCADE NOT NULL,
  mode text NOT NULL DEFAULT 'online',
  plan_type text NOT NULL DEFAULT 'regular',
  plan_label text NOT NULL DEFAULT 'Regular',
  fee_amount numeric NOT NULL DEFAULT 0,
  savings_percent text,
  payment_frequency text DEFAULT 'monthly',
  days text,
  timing text,
  duration_period text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.padma_pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active plans" ON public.padma_pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.padma_pricing_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Mock test packages
CREATE TABLE public.padma_mock_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  num_tests integer NOT NULL DEFAULT 4,
  fee_amount numeric NOT NULL DEFAULT 0,
  test_days text,
  test_timing text,
  test_duration text,
  solution_days text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.padma_mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active mock tests" ON public.padma_mock_tests FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage mock tests" ON public.padma_mock_tests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Offline location config
CREATE TABLE public.padma_offline_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  google_maps_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.padma_offline_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active locations" ON public.padma_offline_locations FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage locations" ON public.padma_offline_locations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed boards
INSERT INTO public.padma_boards (name, code, display_order) VALUES
  ('Central Board of Secondary Education (CBSE)', 'cbse', 1),
  ('Indian Certificate of Secondary Education (ICSE)', 'icse', 2);

-- Seed CBSE grades (6-12)
INSERT INTO public.padma_grades (board_id, grade_number, display_order)
SELECT b.id, g.num, g.num
FROM public.padma_boards b
CROSS JOIN (VALUES (6),(7),(8),(9),(10),(11),(12)) AS g(num)
WHERE b.code = 'cbse';

-- Seed ICSE grades (6-12)
INSERT INTO public.padma_grades (board_id, grade_number, display_order)
SELECT b.id, g.num, g.num
FROM public.padma_boards b
CROSS JOIN (VALUES (6),(7),(8),(9),(10),(11),(12)) AS g(num)
WHERE b.code = 'icse';

-- Seed CBSE subjects for grade 9
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Science',2),('English',3),('Social Science',4)) AS s(name, ord)
WHERE b.code = 'cbse' AND g.grade_number = 9;

-- CBSE grade 10
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics Standard',1),('Mathematics Basic',2),('Science',3),('English',4),('Social Science',5)) AS s(name, ord)
WHERE b.code = 'cbse' AND g.grade_number = 10;

-- CBSE grade 11
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Physics',2),('Chemistry',3),('Biology',4),('English',5)) AS s(name, ord)
WHERE b.code = 'cbse' AND g.grade_number = 11;

-- CBSE grade 12
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Physics',2),('Chemistry',3),('Biology',4),('English',5)) AS s(name, ord)
WHERE b.code = 'cbse' AND g.grade_number = 12;

-- ICSE grade 9
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Science',2),('English',3),('History',4),('Civics',5),('Geography',6),('Hindi',7),('Kannada',8),('Economics',9)) AS s(name, ord)
WHERE b.code = 'icse' AND g.grade_number = 9;

-- ICSE grade 10
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Science',2),('English',3),('History',4),('Civics',5),('Geography',6),('Hindi',7),('Kannada',8),('Economics',9)) AS s(name, ord)
WHERE b.code = 'icse' AND g.grade_number = 10;

-- ICSE grade 11
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Physics',2),('Chemistry',3),('Biology',4),('Economics',5),('Accounts',6),('Commerce',7),('History',8),('Political Science',9),('Geography',10),('English',11)) AS s(name, ord)
WHERE b.code = 'icse' AND g.grade_number = 11;

-- ICSE grade 12
INSERT INTO public.padma_subjects (grade_id, name, display_order)
SELECT g.id, s.name, s.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES ('Mathematics',1),('Physics',2),('Chemistry',3),('Biology',4),('Economics',5),('Accounts',6),('Commerce',7),('History',8),('Political Science',9),('English',10)) AS s(name, ord)
WHERE b.code = 'icse' AND g.grade_number = 12;

-- Seed ONLINE pricing plans from PDF (CBSE grades 9-12)
-- Grade 9 Online
INSERT INTO public.padma_pricing_plans (grade_id, mode, plan_type, plan_label, fee_amount, savings_percent, payment_frequency, days, timing, duration_period, display_order)
SELECT g.id, 'online', p.plan_type, p.plan_label, p.fee, p.savings, p.freq, 'MWF', '4pm – 5pm', '01 Mar – 31 Dec', p.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES 
  ('platinum','Platinum (One Time)',5300,'21.5%','one_time',1),
  ('gold','Gold (Quarterly)',2100,'6.7%','quarterly',2),
  ('regular','Regular (Monthly)',750,NULL,'monthly',3)
) AS p(plan_type, plan_label, fee, savings, freq, ord)
WHERE b.code = 'cbse' AND g.grade_number = 9;

-- Grade 10 Online
INSERT INTO public.padma_pricing_plans (grade_id, mode, plan_type, plan_label, fee_amount, savings_percent, payment_frequency, days, timing, duration_period, display_order)
SELECT g.id, 'online', p.plan_type, p.plan_label, p.fee, p.savings, p.freq, 'MWF', '5:30pm – 7pm', '01 Mar – 31 Dec', p.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES 
  ('platinum','Platinum (One Time)',5800,'28.4%','one_time',1),
  ('gold','Gold (Quarterly)',2500,'7.4%','quarterly',2),
  ('regular','Regular (Monthly)',900,NULL,'monthly',3)
) AS p(plan_type, plan_label, fee, savings, freq, ord)
WHERE b.code = 'cbse' AND g.grade_number = 10;

-- Grade 11 Online
INSERT INTO public.padma_pricing_plans (grade_id, mode, plan_type, plan_label, fee_amount, savings_percent, payment_frequency, days, timing, duration_period, display_order)
SELECT g.id, 'online', p.plan_type, p.plan_label, p.fee, p.savings, p.freq, 'TTS', '8pm – 9:30pm', '01 Apr – 31 Jan', p.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES 
  ('platinum','Platinum (One Time)',7400,'17.8%','one_time',1),
  ('gold','Gold (Quarterly)',2800,'6.7%','quarterly',2),
  ('regular','Regular (Monthly)',1000,NULL,'monthly',3)
) AS p(plan_type, plan_label, fee, savings, freq, ord)
WHERE b.code = 'cbse' AND g.grade_number = 11;

-- Grade 12 Online
INSERT INTO public.padma_pricing_plans (grade_id, mode, plan_type, plan_label, fee_amount, savings_percent, payment_frequency, days, timing, duration_period, display_order)
SELECT g.id, 'online', p.plan_type, p.plan_label, p.fee, p.savings, p.freq, 'MWF', '7:30pm – 9:30pm', '01 Mar – 31 Dec', p.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES 
  ('platinum','Platinum (One Time)',8500,'14%','one_time',1),
  ('gold','Gold (Quarterly)',3200,'3%','quarterly',2),
  ('regular','Regular (Monthly)',1100,NULL,'monthly',3)
) AS p(plan_type, plan_label, fee, savings, freq, ord)
WHERE b.code = 'cbse' AND g.grade_number = 12;

-- Seed OFFLINE pricing plans from PDF (CBSE grades 9-10 only)
-- Grade 9 Offline
INSERT INTO public.padma_pricing_plans (grade_id, mode, plan_type, plan_label, fee_amount, savings_percent, payment_frequency, days, timing, duration_period, display_order)
SELECT g.id, 'offline', p.plan_type, p.plan_label, p.fee, p.savings, p.freq, 'TTS', '4:30pm – 5:30pm', '01 Mar – 31 Dec', p.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES 
  ('platinum','Platinum (One Time)',47800,'10%','one_time',1),
  ('gold','Gold (Quarterly)',17000,'4%','quarterly',2),
  ('regular','Regular (Monthly)',5900,NULL,'monthly',3)
) AS p(plan_type, plan_label, fee, savings, freq, ord)
WHERE b.code = 'cbse' AND g.grade_number = 9;

-- Grade 10 Offline
INSERT INTO public.padma_pricing_plans (grade_id, mode, plan_type, plan_label, fee_amount, savings_percent, payment_frequency, days, timing, duration_period, display_order)
SELECT g.id, 'offline', p.plan_type, p.plan_label, p.fee, p.savings, p.freq, 'TTS', '6pm – 7:30pm', '01 Mar – 31 Dec', p.ord
FROM public.padma_grades g
JOIN public.padma_boards b ON g.board_id = b.id
CROSS JOIN (VALUES 
  ('platinum','Platinum (One Time)',58400,'8.6%','one_time',1),
  ('gold','Gold (Quarterly)',20500,'3.8%','quarterly',2),
  ('regular','Regular (Monthly)',7100,NULL,'monthly',3)
) AS p(plan_type, plan_label, fee, savings, freq, ord)
WHERE b.code = 'cbse' AND g.grade_number = 10;

-- Seed mock test packages from PDF
INSERT INTO public.padma_mock_tests (num_tests, fee_amount, test_days, test_timing, test_duration, solution_days, display_order) VALUES
  (4, 1400, 'Mondays', '4:30pm – 7:30pm', '01 Jan – 31 Jan', 'Tuesdays', 1),
  (4, 1900, 'Mondays', '4:30pm – 7:30pm', '01 Jan – 31 Jan', 'Thursdays', 2),
  (4, 2350, 'Mondays', '4:30pm – 7:30pm', '01 Jan – 31 Jan', 'Wednesdays', 3),
  (4, 2850, 'Mondays', '4:30pm – 7:30pm', '01 Jan – 31 Jan', 'Fridays', 4);

-- Seed offline location
INSERT INTO public.padma_offline_locations (name, address, google_maps_url) VALUES
  ('Whitefield Center', 'No 2, G Ground, SRS Prashanthi Fields, Adjacent to HDFC Bank ATM, Opposite Whitefield Railway Station, Post Office Road, Kadugodi, Bengaluru, Karnataka-560067', 'https://maps.google.com/?q=12.9971667,77.7607500');
