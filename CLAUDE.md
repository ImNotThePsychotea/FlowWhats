# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsFlow is a SaaS platform for WhatsApp Business automation. It consists of:
- **Backend**: Node.js/Express/TypeScript with Prisma ORM and PostgreSQL (Supabase)
- **Frontend**: React/Vite/TypeScript with Tailwind CSS
- **Infrastructure**: Docker-compose for local development, targeting Vercel (frontend) and Render (backend) for production
- **Documentation**: In `docs/` directory

## Development Commands

### Backend (`/backend`)
```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run migrations in development
npx prisma studio            # Open Prisma GUI
npx prisma migrate deploy    # Apply migrations to production

# Linting
npm run lint

# Testing (Jest)
npm test
```

### Frontend (`/frontend`)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting (ESLint + Oxlint)
npm run lint

# Testing (Vitest)
npm test
```

### Database
```bash
# Reset database (development only)
npx migrate reset

# Seed database (if seed scripts exist)
npx prisma db seed
```

### Docker
```bash
# Start all services (backend + PostgreSQL)
docker-compose up

# Build and start in detached mode
docker-compose up -d --build

# Stop and remove containers
docker-compose down
```

## Code Architecture

### Backend Structure
```
backend/
├── src/
│   ├── controllers/   # Request handlers (auth, users, whatsapp, flows, payments)
│   ├── middleware/    # Custom middleware (auth, validation, error handling)
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic (authService, userService, whatsappService)
│   ├── utils/         # Utilities (logger, etc.)
│   ├── validators/    # Zod validation schemas
│   └── server.ts      # Express app entrypoint
├── prisma/            # Prisma schema and migrations
├── .env.example       # Environment variables template
├── Dockerfile         # Container definition
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/    # Reusable UI components (layout, navbar, etc.)
│   │   └── layout/    # Layout components (Navbar, PrivateRoute)
│   ├── context/       # React context providers (AuthContext)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # External service wrappers (API clients)
│   ├── pages/         # Page components (routes)
│   ├── styles/        # Global styles and Tailwind configuration
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Root component with routing
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
└── package.json
```

### Key Architectural Decisions
1. **Authentication**: JWT access tokens (15-min expiry) + HTTP-only refresh tokens (7-day expiry)
2. **Validation**: Zod for request validation at route level
3. **Error Handling**: Centralized error middleware with detailed logs in development
4. **State Management**: React Query for server state, Context API for auth state
5. **Styling**: Tailwind CSS with custom configuration
6. **API Layer**: Axios instance with automatic auth token injection
7. **Database**: Prisma ORM with PostgreSQL (Supabase) - schema in `prisma/schema.prisma`
8. **Security**: Helmet, CORS, rate limiting, bcrypt password hashing
9. **Logging**: Winston with daily file rotation and console output

## Common Development Tasks

### Adding a new API endpoint (backend)
1. Create controller method in `src/controllers/[resource]Controller.ts`
2. Add route in `src/routes/[resource].ts`
3. Implement business logic in relevant service (`src/services/`)
4. Add validation schema in `src/validators/` if needed
5. Protect route with `authenticateToken` middleware (if required)
6. Update Prisma schema if needed and run migrations

### Adding a new page (frontend)
1. Create component in `src/pages/[PageName].tsx`
2. Add route to `src/App.tsx` within `<Routes>` (protected or public)
3. Implement data fetching with React Query hooks
4. Add any necessary components to `src/components/`
5. Update navigation in `src/components/layout/Navbar.tsx` if needed

### Environment Variables
- Backend: Copy `.env.example` to `.env` and fill values
- Frontend: Create `.env` with `VITE_API_URL` pointing to backend URL
- Never commit actual `.env` files

### Testing Conventions
- Backend: Jest tests in `__tests__` folders or alongside files
- Frontend: Vitest co-located with components/files (`*.test.tsx`)
- Run specific test: `npm test -- --testNamePattern="pattern"` (Jest) or `vitest run -t "pattern"` (Vitest)

## Important Notes
1. Always run linting before committing: `npm run lint` in both packages
2. TypeScript strict mode is enabled - ensure proper typings
3. Prisma client must be regenerated after schema changes: `npx prisma generate`
4. Frontend proxy is configured in `vite.config.js` for development API calls
5. Production builds require environment variables set in hosting platforms
6. When modifying Prisma schema, generate migration: `npx prisma migrate dev --name <name>`
7. The API follows REST conventions with JSON responses
8. Error responses follow format: `{ success: false, message: string, errors?: array }`
9. Success responses: `{ success: true, message?: string, data?: object }`
10. Mobile-responsive design is expected - test at various breakpoints

## Getting Started
1. Clone repository
2. Backend: `cd backend && npm install && cp .env.example .env && edit .env`
3. Frontend: `cd ../frontend && npm install && cp .env.example .env && edit .env`
4. Start database: `docker-compose up -d` (or ensure PostgreSQL running)
5. Run migrations: `cd ../backend && npx prisma migrate dev`
6. Start both: `npm run dev` in both terminals (or use concurrent script if added)