# VALIDEXIO Setup Guide

Welcome to Validexio - "From Concept to Customer in 60 Seconds"

## 1. Prerequisites
- Node.js 18.17+
- PostgreSQL database
- Stripe Account (for billing)
- Google Gemini API Key (for AI analysis)
- GitHub / Google OAuth (for social logins)

## 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/validexio?schema=public"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
# Generate secret: `openssl rand -base64 32`
NEXTAUTH_SECRET="your_nextauth_secret_here"

# Google AI (Gemini)
GEMINI_API_KEY="your_gemini_api_key_here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_TEAM_PRICE_ID="price_..."

# Social Logins (Optional)
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
GOOGLE_ID="your_google_client_id"
GOOGLE_SECRET="your_google_client_secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 3. Database Setup

```bash
# Install dependencies
npm install

# Push schema to database
npx prisma db push

# (Optional) Generate Prisma client if needed
npx prisma generate
```

## 4. Run Development Server

```bash
npm run dev
```
Visit http://localhost:3000.
