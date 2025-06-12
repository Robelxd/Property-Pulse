
-- Fix the saved_properties table structure and policies
-- First, ensure the saved_properties table exists with proper foreign key
DROP TABLE IF EXISTS public.saved_properties CASCADE;

CREATE TABLE public.saved_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS on saved_properties table
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_properties table
CREATE POLICY "Users can view their own saved properties" 
  ON public.saved_properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties" 
  ON public.saved_properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved properties" 
  ON public.saved_properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Fix the profiles table policies by dropping and recreating them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
