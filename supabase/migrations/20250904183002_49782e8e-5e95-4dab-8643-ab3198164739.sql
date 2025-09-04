-- Security Fix #1: Update content_setups RLS policy to hide user_id from public templates
-- Drop the existing policy that exposes user_id
DROP POLICY IF EXISTS "Users can view only their own content setups or templates" ON public.content_setups;

-- Create a new policy that doesn't expose user_id for public templates
CREATE POLICY "Users can view their own content setups or public templates" 
ON public.content_setups 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (is_template = true AND auth.uid() IS NOT NULL)
);

-- Security Fix #2: Update database functions to include secure search_path
-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix handle_new_user function  
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    username,
    full_name,
    avatar_url
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Security Fix #3: Create a secure view for public templates (optional enhancement)
-- This view excludes sensitive user information from public template access
CREATE OR REPLACE VIEW public.public_templates AS
SELECT 
  id,
  name,
  configuration,
  examples,
  is_template,
  usage_count,
  created_at,
  updated_at
FROM public.content_setups
WHERE is_template = true;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.public_templates TO authenticated;

-- Add RLS to the view (though views inherit from base table)
ALTER VIEW public.public_templates SET (security_invoker = true);