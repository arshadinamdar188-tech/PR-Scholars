-- Update Padma course prices to match PDF specifications
UPDATE public.courses SET price = 30000 WHERE institute = 'padma' AND slug LIKE '%9th%';
UPDATE public.courses SET price = 40000 WHERE institute = 'padma' AND slug LIKE '%10th%';
UPDATE public.courses SET price = 45000 WHERE institute = 'padma' AND slug LIKE '%11th%';
UPDATE public.courses SET price = 50000 WHERE institute = 'padma' AND slug LIKE '%12th%';

-- Update R's Academy course prices based on PDF
-- NDA Junior Foundation: Rs 30,000/year
-- NDA Senior Foundation: Rs 50,000/year  
-- NDA Short Course: Rs 30,000
-- NDA Crash Course: Rs 20,000
-- CDS/AFCAT/INET Course: Rs 30,000
-- CDS/AFCAT/INET Crash: Rs 20,000
-- SSB Interview: Rs 14,000
UPDATE public.courses SET price = 30000 WHERE institute = 'racademy' AND slug = 'nda';
UPDATE public.courses SET price = 30000 WHERE institute = 'racademy' AND slug = 'cds';
UPDATE public.courses SET price = 14000 WHERE institute = 'racademy' AND slug = 'ssb';