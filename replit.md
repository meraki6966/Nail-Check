# NailMuse - Nail Art Tutorial Platform

## Overview

NailMuse is a full-stack web application for discovering, saving, and sharing nail art tutorials. Users can browse a gallery of tutorials filtered by style and difficulty, save favorites locally, and authenticated users can upload new tutorials. The platform features a modern, aesthetic UI with cream and rose gold theming.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with custom theme configuration, shadcn/ui component library
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC) with Passport.js
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Managed via `drizzle-kit push` command

### Key Data Models
- **tutorials**: Stores nail art tutorials with title, image, style category, difficulty level, tools required, and content
- **users**: User profiles for Replit Auth (id, email, name, profile image)
- **sessions**: Session storage for authentication persistence

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    hooks/        # Custom React hooks (auth, favorites, tutorials)
    pages/        # Route components (Home, TutorialDetail, Upload, Saved)
    lib/          # Utilities and query client
server/           # Express backend
  replit_integrations/auth/  # Replit Auth implementation
shared/           # Shared types, schemas, and route definitions
  models/         # Database model definitions
  routes.ts       # API route contracts with Zod validation
  schema.ts       # Drizzle table definitions
```

### Authentication Flow
- Replit Auth via OIDC handles user authentication
- Protected routes use `isAuthenticated` middleware
- User sessions stored in PostgreSQL sessions table
- Frontend checks auth status via `/api/auth/user` endpoint

### API Pattern
Routes are defined declaratively in `shared/routes.ts` with:
- HTTP method and path
- Input schema (Zod validation)
- Response schemas for different status codes

This enables type-safe API consumption on both client and server.

## External Dependencies

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for session storage

### Authentication
- Replit Auth (OpenID Connect)
- Required environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### UI Components
- shadcn/ui component library (Radix UI primitives)
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations

### Data Fetching
- TanStack React Query for client-side data management
- Native fetch API for HTTP requests

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling (production)
- tsx for TypeScript execution in development