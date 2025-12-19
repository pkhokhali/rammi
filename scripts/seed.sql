-- Seed data for Health, Diet & Fitness App

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@healthfitness.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Super Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Weight Loss', 'weight-loss', 'Healthy weight loss strategies and meal plans'),
('Weight Gain', 'weight-gain', 'Safe and healthy weight gain approaches'),
('Diabetes', 'diabetes', 'Diet and nutrition for diabetes management'),
('Heart Health', 'heart-health', 'Heart-healthy eating and lifestyle tips'),
('Muscle Building', 'muscle-building', 'Nutrition for muscle growth and strength')
ON CONFLICT (slug) DO NOTHING;

-- Insert default home page sections
INSERT INTO pages (slug, title, content, meta_title, meta_description, order_index) VALUES
('hero', 'Hero Section', 'Transform Your Health Journey', 'Health & Fitness - Your Path to Wellness', 'Discover personalized health, diet, and fitness solutions', 1),
('healthy-living', 'Healthy Living Overview', 'Living a healthy lifestyle is about making choices that benefit your physical, mental, and emotional well-being. Our comprehensive approach combines nutrition, exercise, and wellness practices to help you achieve your health goals.', 'Healthy Living Guide', 'Learn about healthy living practices and wellness tips', 2),
('diet-nutrition-tips', 'Diet & Nutrition Tips', 'Proper nutrition is the foundation of good health. We provide evidence-based dietary guidance tailored to your specific needs, whether you''re looking to lose weight, gain muscle, or manage a health condition.', 'Diet & Nutrition Tips', 'Expert nutrition advice and dietary recommendations', 3),
('fitness-guidance', 'Fitness & Exercise Guidance', 'Regular physical activity is essential for maintaining good health. Our fitness programs are designed for all fitness levels, from beginners to advanced athletes, with both home and gym workout options.', 'Fitness & Exercise Programs', 'Comprehensive fitness guidance and workout plans', 4),
('ai-assistant', 'AI Health Assistant', 'Get instant, personalized health, diet, and fitness advice from our AI-powered assistant. Ask questions about nutrition, exercise, weight management, and healthy lifestyle habits.', 'AI Health Assistant', 'Get personalized health and fitness advice from AI', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample workouts
INSERT INTO workouts (title, slug, description, content, duration, difficulty, workout_type) VALUES
('Beginner Home Workout', 'beginner-home-workout', 'Perfect for those just starting their fitness journey', 'This beginner-friendly home workout requires no equipment. Start with a 5-minute warm-up, then perform 3 sets of 10-15 reps for each exercise: jumping jacks, bodyweight squats, push-ups (knee push-ups if needed), planks (20-30 seconds), and lunges. Finish with a 5-minute cool-down and stretching.', '20-30 minutes', 'beginner', 'home'),
('Intermediate Gym Workout', 'intermediate-gym-workout', 'A balanced full-body workout for intermediate fitness enthusiasts', 'This intermediate gym workout targets all major muscle groups. Warm up for 10 minutes, then perform 3-4 sets of 8-12 reps: bench press, barbell squats, deadlifts, pull-ups or lat pulldowns, overhead press, and rows. Include 2-3 minutes rest between sets. Cool down with stretching.', '45-60 minutes', 'intermediate', 'gym'),
('Advanced Home HIIT', 'advanced-home-hiit', 'High-intensity interval training for advanced fitness levels', 'This advanced HIIT workout will challenge even experienced athletes. After a 10-minute warm-up, perform 4 rounds of: burpees (30 seconds), mountain climbers (30 seconds), jump squats (30 seconds), plank to push-up (30 seconds), and high knees (30 seconds). Rest 1 minute between rounds. Cool down for 10 minutes.', '30-40 minutes', 'advanced', 'home')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blogs (title, slug, content, excerpt, category, tags, is_published, published_at) VALUES
('10 Essential Nutrition Tips for a Healthy Lifestyle', '10-essential-nutrition-tips', 'Good nutrition is the cornerstone of a healthy lifestyle. Here are 10 essential tips to help you make better food choices and improve your overall well-being...', 'Discover 10 essential nutrition tips that can transform your health and wellness journey.', 'Nutrition', ARRAY['nutrition', 'health', 'wellness'], true, NOW()),
('The Ultimate Guide to Home Workouts', 'ultimate-guide-home-workouts', 'Working out at home has never been easier or more effective. This comprehensive guide covers everything you need to know about creating an effective home workout routine...', 'Learn how to build an effective home workout routine with no equipment needed.', 'Fitness', ARRAY['fitness', 'home workout', 'exercise'], true, NOW()),
('Understanding Macronutrients: Protein, Carbs, and Fats', 'understanding-macronutrients', 'Macronutrients are the building blocks of your diet. Understanding how protein, carbohydrates, and fats work in your body is crucial for achieving your health goals...', 'A comprehensive guide to understanding macronutrients and their role in your diet.', 'Nutrition', ARRAY['nutrition', 'macronutrients', 'diet'], true, NOW())
ON CONFLICT (slug) DO NOTHING;

