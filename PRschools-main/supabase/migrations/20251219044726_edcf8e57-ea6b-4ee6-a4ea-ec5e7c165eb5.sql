-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount NUMERIC DEFAULT NULL,
  usage_limit INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  institute TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  final_amount NUMERIC NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id),
  coupon_code TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  user_id UUID REFERENCES auth.users(id),
  user_type TEXT NOT NULL DEFAULT 'student' CHECK (user_type IN ('student', 'teacher', 'admin')),
  institute TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Coupons policies
CREATE POLICY "Anyone can view active coupons"
ON public.coupons
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
ON public.coupons
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Orders policies
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (user_id = auth.uid() OR customer_email = auth.email());

CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update orders"
ON public.orders
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage orders"
ON public.orders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_coupons_code ON public.coupons(code);

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  order_num TEXT;
BEGIN
  order_num := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
  RETURN order_num;
END;
$$;