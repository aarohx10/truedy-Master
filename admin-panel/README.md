# Trudy Admin Panel

Standalone admin panel for managing the Trudy Voice Platform.

## Features

- **Secure JWT Authentication**: Custom authentication system with rate limiting
- **Dashboard**: Global platform statistics and monitoring
- **Pricing Manager**: Edit subscription tiers, pricing, and allowances
- **Client Management**: View and manage all clients, override minutes balance

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Generate Admin Password Hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password', 10).then(hash => console.log(hash))"
```

### 4. Generate JWT Secret

```bash
openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

## Deployment

### Build for Production

```bash
npm run build
```

### Standalone Output

The build creates a standalone output optimized for deployment on Hetzner VPS.

## Security Features

- HTTP-only cookies for JWT tokens
- Rate limiting on login attempts (5 attempts per 15 minutes)
- CSRF protection via SameSite cookies
- Secure cookie flags in production
- Middleware protection for all routes

## Architecture

- **Next.js App Router**: Modern React framework
- **Shadcn UI**: Beautiful, accessible components
- **Supabase Admin Client**: Direct database access with service role key
- **Custom JWT Auth**: Standalone authentication (no Clerk/Supabase Auth)

## Routes

- `/login` - Admin login page
- `/admin/dashboard` - Global statistics
- `/admin/pricing` - Subscription tier management
- `/admin/clients` - Client management
