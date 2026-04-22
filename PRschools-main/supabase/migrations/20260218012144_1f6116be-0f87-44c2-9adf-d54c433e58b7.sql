
-- Remove non-math subjects for grades 9, 11, 12
-- Grade 9: keep only Mathematics
DELETE FROM padma_subjects WHERE grade_id = '5aa5d9d1-1c1d-4542-a81a-7d4bb061e849' AND name != 'Mathematics';

-- Grade 10: keep only Mathematics Standard and Mathematics Basic
DELETE FROM padma_subjects WHERE grade_id = '4e6b30aa-8a6a-48f8-8a4b-0d72944f61e2' AND name NOT IN ('Mathematics Standard', 'Mathematics Basic');

-- Grade 11: keep only Mathematics
DELETE FROM padma_subjects WHERE grade_id = '75d21f12-4f66-4ec5-ae1d-f60d642299e7' AND name != 'Mathematics';

-- Grade 12: keep only Mathematics
DELETE FROM padma_subjects WHERE grade_id = 'a4c2f805-65e4-4b7a-a343-65cfbc02034f' AND name != 'Mathematics';

-- Remove grades 6, 7, 8 (deactivate them)
UPDATE padma_grades SET is_active = false WHERE grade_number IN (6, 7, 8);

-- Remove pricing plans for grades 6, 7, 8
DELETE FROM padma_pricing_plans WHERE grade_id IN (
  SELECT id FROM padma_grades WHERE grade_number IN (6, 7, 8)
);
