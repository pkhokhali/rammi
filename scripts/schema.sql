-- Health, Diet & Fitness Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'content_manager' CHECK (role IN ('super_admin', 'content_manager')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages table (for home page sections)
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (for diet categories)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diet & Nutrition content
CREATE TABLE IF NOT EXISTS diet_content (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    duration VARCHAR(100),
    difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    workout_type VARCHAR(50) CHECK (workout_type IN ('home', 'gym')),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog articles
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat logs (optional)
CREATE TABLE IF NOT EXISTS chat_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_message TEXT,
    ai_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_diet_content_slug ON diet_content(slug);
CREATE INDEX IF NOT EXISTS idx_workouts_slug ON workouts(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published, published_at);

