# Nexus CRM - Full Stack Application

A modern CRM dashboard built with Next.js 14, Prisma, PostgreSQL (Neon.tech), and Auth.js.

## Features

- **Authentication**: Email/password login with role-based access (Admin, Sales Rep)
- **Dashboard**: KPI cards, revenue charts, deal pipeline, recent activities, tasks
- **Customers**: Full CRUD contact management
- **Deals**: Kanban board pipeline with 6 stages
- **Analytics**: Revenue trends, team performance, lead source conversion
- **Campaigns**: Marketing campaign management with metrics
- **Calendar**: Event scheduling with monthly view
- **Settings**: Profile, company, notifications, integrations, security

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (Neon.tech) |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5) |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Copy `.env` and update with your values:

```env
DATABASE_URL="postgresql://username:password@your-neon-host/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
```

Get your Neon database URL from [neon.tech](https://neon.tech).

### 3. Set up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with:
- **Admin**: `admin@nexuscrm.com` / `admin123`
- **Sales**: `sarah@nexuscrm.com` / `sales123`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data

## Project Structure

```
crm-app/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth routes (login, register)
│   ├── (dashboard)/      # Dashboard routes
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard widgets
│   └── ...
├── lib/                 # Utilities
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # Auth.js config
│   └── actions/         # Server Actions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── types/               # TypeScript types
```

## Database Schema

The application uses the following models:
- **User** - Authentication and user profiles
- **Contact** - Customer/lead contacts
- **Deal** - Sales deals with pipeline stages
- **Activity** - Activity feed items
- **Task** - User tasks
- **Campaign** - Marketing campaigns
- **CalendarEvent** - Calendar events
- **RevenueMetric** - Monthly revenue data
- **TeamMember** - Team performance data
- **LeadSource** - Lead source analytics
- **Integration** - Third-party integrations
- **NotificationPreference** - User notification settings
- **CompanySettings** - Company information
