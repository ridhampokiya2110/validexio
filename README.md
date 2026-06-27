# Validexio
**From Concept to Customer in 60 Seconds**

Validexio is a premium SaaS platform designed for founders and entrepreneurs to validate their startup ideas instantly. Using AI, Validexio generates brutally honest market feedback, competitor analysis, customer personas, business insights, and growth strategies before you invest in development.

## 🌟 Features

- **Instant Validation:** Submit an idea and get a comprehensive score.
- **Competitor Intelligence:** AI identifies direct competitors, their strengths, and weaknesses.
- **Customer Personas:** Automatically generated demographic and psychographic profiles of your target audience.
- **AI Mockups:** Instantly generated landing page structures and UI concepts.
- **Analytics & Tracking:** Monitor how your ideas score over time in a premium dashboard.
- **Enterprise Security:** Built with best-in-class security (CSRF protection, Argon2 hashing, strict CSP).

## 🛠 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Frontend:** React 19, Tailwind CSS, ShadCN UI
- **Backend:** Node.js, Next.js API Routes, Server Actions
- **Database:** PostgreSQL (via Prisma ORM / Supabase)
- **Authentication:** Auth.js (NextAuth v5)
- **AI Engine:** Google Gemini 1.5 Pro
- **Payments:** Stripe

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:** `npm install`
3. **Configure Environment:** See `SETUP.md` for `.env.local` instructions.
4. **Database Migration:** `npx prisma db push`
5. **Run Development Server:** `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔐 Security

Validexio implements enterprise-grade security by default:
- **Authentication:** Secure session cookies, OAuth integrations, strict password policies.
- **Data Protection:** Prisma parameterized queries prevent SQL injection.
- **Infrastructure:** CSRF and XSS protection via secure Next.js Headers. GDPR-compliant user deletion.

## 🎨 Design System

Validexio uses a custom Dark-Mode First glassmorphic design system to communicate Trust, Intelligence, and Premium Value.

- **Noir Black** (`#1B1716`)
- **Maroon** (`#630102`)
- **Cherry Red** (`#810100`)
- **Cotton** (`#EDEBDE`)
- **Butter** (`#FFEDAB`)

## 📄 License
Commercial License. All rights reserved.
