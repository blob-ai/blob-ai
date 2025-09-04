-- Create a secure payment_profiles table accessible only by edge functions
CREATE TABLE public.payment_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS but with restrictive policies
ALTER TABLE public.payment_profiles ENABLE ROW LEVEL SECURITY;

-- Only allow edge functions (service role) to access this table
CREATE POLICY "service_role_only_access" ON public.payment_profiles
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Create a security definer function for secure Stripe customer lookup
CREATE OR REPLACE FUNCTION public.get_stripe_customer_id(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_id TEXT;
BEGIN
  -- Only allow if the requesting user is the same as p_user_id
  IF auth.uid() != p_user_id THEN
    RETURN NULL;
  END IF;
  
  SELECT stripe_customer_id INTO customer_id
  FROM payment_profiles
  WHERE user_id = p_user_id;
  
  RETURN customer_id;
END;
$$;

-- Create a security definer function for updating Stripe customer ID
CREATE OR REPLACE FUNCTION public.upsert_stripe_customer_id(p_user_id UUID, p_customer_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function should only be called by edge functions with service role
  -- Additional validation can be added here if needed
  
  INSERT INTO payment_profiles (user_id, stripe_customer_id, updated_at)
  VALUES (p_user_id, p_customer_id, now())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    stripe_customer_id = EXCLUDED.stripe_customer_id,
    updated_at = now();
END;
$$;

-- Migrate existing data from profiles to payment_profiles
INSERT INTO public.payment_profiles (user_id, stripe_customer_id, created_at, updated_at)
SELECT id, stripe_customer_id, created_at, updated_at
FROM public.profiles
WHERE stripe_customer_id IS NOT NULL;

-- Remove stripe_customer_id from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;

-- Add trigger for updated_at on payment_profiles
CREATE TRIGGER update_payment_profiles_updated_at
  BEFORE UPDATE ON public.payment_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();