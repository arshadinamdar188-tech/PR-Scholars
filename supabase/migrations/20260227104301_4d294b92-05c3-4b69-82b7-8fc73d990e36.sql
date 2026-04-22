
-- Seed R's Academy Modules
INSERT INTO public.racademy_modules (name, code, mode, description, target_audience, duration, fee_summary, highlights, display_order)
VALUES 
  ('NDA Entrance Exam Preparation', 'nda', 'online', 'Comprehensive preparation for NDA & NA Entrance Examination. Covers Mathematics and GAT with structured online classes ensuring flexibility and accessibility.', 'Class 12 pass / appearing (age 16.5-19.5)', '6 months', 'Starting ₹7,000/month', ARRAY['Batches starting 01 Feb 26', 'Maths & GAT coverage', 'Structured online classes', 'Proven success track record', 'Mock test series included'], 1),
  ('CDS Entrance Exam Preparation', 'cds', 'online', 'Complete preparation for Combined Defence Services, AFCAT & INET Entrance Exams covering Mathematics, General Knowledge, and English.', 'Graduate (age 19-25)', '6 months', 'Starting ₹7,000/month', ARRAY['All three subjects covered', 'Flexible subject combinations', 'Crash course available', 'Mock test series', 'Expert faculty guidance'], 2),
  ('SSB Interview Guidance', 'ssb', 'offline', 'Intensive SSB Interview preparation covering Psychological Tests, Group Tasks, and Personal Interview. Mentored by seasoned IOs, GTOs and Psychologists.', 'NDA/CDS/AFCAT qualified candidates', '2 weeks', '₹15,000 (all inclusive)', ARRAY['Psychological tests preparation', 'Group task training', 'Personal interview coaching', 'Seasoned IO & GTO mentors', 'Confidence building program'], 3),
  ('Leadership Seminar', 'leadership-seminar', 'onsite', 'Premium leadership development seminar for corporate professionals. Building leadership qualities, team management, and strategic thinking inspired by military principles.', 'Corporate professionals', '1 day', '₹50,000 (one time)', ARRAY['Military leadership principles', 'Team building exercises', 'Strategic thinking workshop', 'Certificate of completion'], 4),
  ('Awareness Campaign', 'awareness-campaign', 'onsite', 'Career awareness campaign for schools and colleges about opportunities in the Indian Armed Forces.', 'Schools & Colleges', '3 hours', '₹25,000 (one time)', ARRAY['Armed forces career overview', 'Entry scheme details', 'Interactive Q&A session', 'Inspiring real stories'], 5),
  ('SSB Workshop', 'ssb-workshop', 'onsite', 'Intensive SSB preparation workshop for schools and colleges. Hands-on experience with SSB testing procedures.', 'Schools & Colleges', '5 hours', '₹40,000 (one time)', ARRAY['SSB process overview', 'Mock psychological tests', 'Group discussion practice', 'Interview preparation tips'], 6);

-- Seed NDA subjects
INSERT INTO public.racademy_subjects (module_id, name, fee_amount, fee_label, days, timing, duration, display_order)
SELECT m.id, s.name, s.fee, s.fee_label, s.days, s.timing, s.duration, s.ord
FROM public.racademy_modules m,
(VALUES
  ('Mathematics Only', 7000, 'Monthly', 'MWF', '8:30am - 10am', '6 months', 1),
  ('GAT Only', 7000, 'Monthly', 'Sat & Sun', 'Sat 4pm-7pm / Sun 9am-12pm', '6 months', 2),
  ('Both (Mathematics & GAT)', 13000, 'Monthly', 'MWF + Sat/Sun', 'Combined schedule', '6 months', 3),
  ('Crash Course (Both Subjects)', 15000, 'One Time', 'MWF', '10:30am - 12:30pm', '2 months', 4),
  ('Mock Test Series', 5000, 'One Time', 'Saturdays', '10:30am - 1pm', '1 month', 5)
) AS s(name, fee, fee_label, days, timing, duration, ord)
WHERE m.code = 'nda';

-- Seed CDS subjects
INSERT INTO public.racademy_subjects (module_id, name, fee_amount, fee_label, days, timing, duration, display_order)
SELECT m.id, s.name, s.fee, s.fee_label, s.days, s.timing, s.duration, s.ord
FROM public.racademy_modules m,
(VALUES
  ('Mathematics Only', 7000, 'Monthly', 'TBD', 'TBD', '6 months', 1),
  ('General Knowledge (GK) Only', 7000, 'Monthly', 'TBD', 'TBD', '6 months', 2),
  ('English Only', 7000, 'Monthly', 'TBD', 'TBD', '6 months', 3),
  ('Mathematics & GK Only', 13000, 'Monthly', 'TBD', 'TBD', '6 months', 4),
  ('Mathematics & English Only', 13000, 'Monthly', 'TBD', 'TBD', '6 months', 5),
  ('GK & English Only', 13000, 'Monthly', 'TBD', 'TBD', '6 months', 6),
  ('All Three Subjects', 18000, 'Monthly', 'TBD', 'TBD', '6 months', 7),
  ('Crash Course (All Three)', 20000, 'One Time', 'TBD', 'TBD', '2 months', 8),
  ('Mock Test Series', 5000, 'One Time', 'TBD', 'TBD', '1 month', 9)
) AS s(name, fee, fee_label, days, timing, duration, ord)
WHERE m.code = 'cds';

-- Seed SSB subject
INSERT INTO public.racademy_subjects (module_id, name, fee_amount, fee_label, days, timing, duration, display_order)
SELECT m.id, 'Complete SSB Guidance', 15000, 'One Time', 'All days', '8:30am - 1pm', '2 weeks', 1
FROM public.racademy_modules m WHERE m.code = 'ssb';

-- Seed Seminar/Workshop subjects
INSERT INTO public.racademy_subjects (module_id, name, fee_amount, fee_label, days, timing, duration, display_order)
SELECT m.id, 'Leadership Seminar', 50000, 'One Time', 'Scheduled', 'Full day', '1 day', 1
FROM public.racademy_modules m WHERE m.code = 'leadership-seminar';

INSERT INTO public.racademy_subjects (module_id, name, fee_amount, fee_label, days, timing, duration, display_order)
SELECT m.id, 'Awareness Campaign', 25000, 'One Time', 'Scheduled', '3 hours', '3 hours', 1
FROM public.racademy_modules m WHERE m.code = 'awareness-campaign';

INSERT INTO public.racademy_subjects (module_id, name, fee_amount, fee_label, days, timing, duration, display_order)
SELECT m.id, 'SSB Workshop', 40000, 'One Time', 'Scheduled', '5 hours', '5 hours', 1
FROM public.racademy_modules m WHERE m.code = 'ssb-workshop';
