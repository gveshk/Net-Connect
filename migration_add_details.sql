-- Run this in your Supabase SQL Editor to add the new columns

ALTER TABLE public.connections 
ADD COLUMN scanned_name text,
ADD COLUMN scanned_company text;
