-- Insert sample coupon codes for testing
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, max_discount, is_active) VALUES
('WELCOME10', 'percentage', 10, 0, 5000, true),
('FLAT500', 'fixed', 500, 5000, NULL, true),
('SAVE20', 'percentage', 20, 10000, 8000, true),
('FIRST1000', 'fixed', 1000, 15000, NULL, true),
('PADMA15', 'percentage', 15, 0, 6000, true),
('DEFENCE10', 'percentage', 10, 0, 5000, true);