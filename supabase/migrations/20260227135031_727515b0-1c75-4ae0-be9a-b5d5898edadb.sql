-- Update CDS individual subjects with actual days and timings
-- Mathematics Only
UPDATE racademy_subjects SET days = 'Mon, Wed, Fri', timing = '8:30 AM - 10:00 AM' WHERE id = '4775acf0-bb3c-41f6-a030-59586fd63b9b';

-- General Knowledge (GK) Only
UPDATE racademy_subjects SET days = 'Sat, Sun', timing = 'Sat: 4:00 PM - 7:00 PM, Sun: 9:00 AM - 12:00 PM' WHERE id = 'f2ad4532-99b4-484d-840d-2ae54c8efd49';

-- English Only
UPDATE racademy_subjects SET days = 'Tue, Thu', timing = '4:00 PM - 6:00 PM' WHERE id = 'de1cbbe3-a4c0-4c15-b3db-4ed1bb18435c';

-- Combo subjects - mark as "Same as individual subjects"
UPDATE racademy_subjects SET days = 'Same as individual subjects', timing = 'Same as individual subjects' WHERE id IN (
  '5c9287d6-8b26-4320-b257-52bc6256cf10',  -- Maths & GK
  '689bd5e6-86e6-47b6-a8ae-a3661ae261d9',  -- Maths & English
  'd9d3c3c1-384a-4cac-b440-f4cd26454cea'   -- GK & English
);

-- All Three Subjects
UPDATE racademy_subjects SET days = 'Same as individual subjects', timing = 'Same as individual subjects' WHERE id = '100d4d9a-52e7-466b-9395-60e2ea8cec3a';

-- Crash Course (All Three)
UPDATE racademy_subjects SET days = 'Mon - Fri', timing = '10:30 AM - 12:30 PM' WHERE id = '312bbd1c-4733-4626-9a20-0454d6d4031b';

-- Mock Test Series
UPDATE racademy_subjects SET days = 'Saturdays', timing = '10:30 AM - 1:00 PM' WHERE id = 'e6f30cc0-d019-4ebc-a7dc-45c0e7d274f0';