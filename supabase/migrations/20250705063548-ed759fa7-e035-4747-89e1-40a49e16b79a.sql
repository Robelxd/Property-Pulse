
-- Insert sample properties with standard property types
INSERT INTO public.properties (
  title,
  description,
  price,
  property_type,
  address,
  city,
  state,
  zip_code,
  bedrooms,
  bathrooms,
  square_feet,
  featured,
  status,
  user_id
) VALUES
(
  'Modern Downtown Condo',
  'Beautiful modern condo in the heart of downtown San Francisco with stunning city views and premium amenities.',
  850000,
  'condo',
  '123 Market Street',
  'San Francisco',
  'CA',
  '94105',
  2,
  2,
  1200,
  true,
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Luxury Family Home',
  'Spacious luxury family home with a large backyard, perfect for families looking for comfort and elegance.',
  1250000,
  'house',
  '456 Oak Avenue',
  'Palo Alto',
  'CA',
  '94301',
  4,
  3,
  2800,
  true,
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Waterfront Villa',
  'Stunning waterfront villa with panoramic ocean views and private beach access.',
  2100000,
  'villa',
  '789 Ocean Drive',
  'Malibu',
  'CA',
  '90265',
  5,
  4,
  3500,
  true,
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Cozy Starter Home',
  'Perfect starter home in a quiet neighborhood with great schools and community amenities.',
  650000,
  'house',
  '321 Pine Street',
  'San Jose',
  'CA',
  '95110',
  3,
  2,
  1600,
  false,
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Urban Loft Apartment',
  'Industrial-style loft in trendy SOMA district with exposed brick and high ceilings.',
  750000,
  'loft',
  '555 Howard Street',
  'San Francisco',
  'CA',
  '94105',
  1,
  1,
  950,
  false,
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Suburban Ranch House',
  'Single-story ranch home with spacious yard and updated kitchen.',
  895000,
  'house',
  '888 Elm Drive',
  'Fremont',
  'CA',
  '94536',
  3,
  2,
  1800,
  false,
  'active',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Insert sample property images
INSERT INTO public.property_images (property_id, image_url, is_primary, caption)
SELECT 
  p.id,
  CASE 
    WHEN p.title = 'Modern Downtown Condo' THEN 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    WHEN p.title = 'Luxury Family Home' THEN 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    WHEN p.title = 'Waterfront Villa' THEN 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    WHEN p.title = 'Cozy Starter Home' THEN 'https://images.unsplash.com/photo-1502005229762-cf1b2da27a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    WHEN p.title = 'Urban Loft Apartment' THEN 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    WHEN p.title = 'Suburban Ranch House' THEN 'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  END,
  true,
  'Primary image'
FROM public.properties p
WHERE p.title IN ('Modern Downtown Condo', 'Luxury Family Home', 'Waterfront Villa', 'Cozy Starter Home', 'Urban Loft Apartment', 'Suburban Ranch House');
