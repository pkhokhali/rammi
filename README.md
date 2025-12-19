# Health, Diet & Fitness Web Application

A professional, modern, and production-ready Health, Diet & Fitness web application built with Next.js, React, Node.js, PostgreSQL, and Tailwind CSS.

## Features

### Frontend (Public Website)
- **Home Page**: Hero section, healthy living overview, diet tips, fitness guidance, AI assistant introduction
- **Diet & Nutrition Page**: Categories (Weight Loss, Weight Gain, Diabetes, Heart Health, Muscle Building) with rich content
- **Fitness & Workout Page**: Workout plans for all levels (Beginner, Intermediate, Advanced) - Home & Gym workouts
- **Health Blog**: SEO-friendly blog with articles, categories, and tags
- **AI Health Chatbot**: Gemini AI-powered assistant for health, diet, and fitness questions only

### Admin Panel (CMS)
- **Authentication**: Secure login/logout with JWT
- **Dashboard**: Overview with statistics
- **Content Management**: Full CRUD for:
  - Blog articles (with rich text editor)
  - Workouts
  - Diet & nutrition content
  - Media files (upload, manage)
- **SEO Management**: Meta titles, descriptions for all content
- **Role-based Access**: Super Admin and Content Manager roles

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Authentication**: JWT with bcrypt
- **Rich Text Editor**: React Quill

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rammi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `ADMIN_EMAIL`: Admin email (default: admin@healthfitness.com)
   - `ADMIN_PASSWORD`: Admin password (default: admin123)

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

- **Email**: admin@healthfitness.com
- **Password**: admin123

⚠️ **Change these credentials in production!**

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── blog/              # Blog pages
│   ├── diet/              # Diet pages
│   ├── fitness/           # Fitness pages
│   └── chat/              # AI chat page
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication
│   └── gemini.ts         # Gemini AI integration
├── scripts/               # Database scripts
│   ├── schema.sql        # Database schema
│   ├── seed.sql          # Seed data
│   ├── migrate.js        # Migration script
│   └── seed.js           # Seeding script
└── public/               # Static files
```

## API Routes

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/chat` - AI chatbot (with rate limiting)

## Database Schema

- `users` - Admin users
- `pages` - Home page sections
- `categories` - Diet categories
- `diet_content` - Diet & nutrition content
- `workouts` - Workout plans
- `blogs` - Blog articles
- `media` - Uploaded media files
- `chat_logs` - Chat conversation logs

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Ensure all environment variables are set
   - Use a secure `JWT_SECRET`
   - Configure production database URL

3. **Start the production server**
   ```bash
   npm start
   ```

## AI Chatbot

The AI chatbot uses Google Gemini API with strict system prompts to ensure it only answers health, diet, and fitness-related questions. It includes:
- Rate limiting (20 requests per minute per IP)
- Medical disclaimers
- Domain-specific restrictions
- Chat logging (optional)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API routes
- Input validation
- SQL injection protection (parameterized queries)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository.

---

**Disclaimer**: This application provides general health information only. It should not replace professional medical advice. Always consult with a healthcare provider for personalized guidance.

