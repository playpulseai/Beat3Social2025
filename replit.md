# Beat3 Social Platform

## Overview

Beat3 Social is an educational social media platform designed for teachers, parents, and educators. It combines React with Express.js to create a full-stack social networking application with features like post creation, user authentication, NFT minting capabilities, and administrative tools.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state, React Context for auth and theme
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Firebase Auth integration
- **File Storage**: Firebase Storage for media uploads
- **Session Management**: Memory-based storage with planned database persistence

### Database Design
The system uses a PostgreSQL database with the following core entities:
- **Users**: Profiles with roles (teacher, parent, educator, admin)
- **Posts**: Content with media support, tags, and engagement metrics
- **Comments**: Threaded discussion system
- **Moderation**: Flagging and content review system

## Key Components

### Authentication System
- Firebase Authentication for user management
- Role-based access control (teacher, parent, educator, admin)
- Profile verification system for teachers
- Protected routes with loading states

### Content Management
- Rich post creation with media upload support
- Tag-based content organization
- Like, share, and comment functionality
- Content moderation and flagging system

### Media Handling
- Firebase Storage integration for file uploads
- Support for images and videos
- Profile pictures and banner images
- Post media attachments

### Admin Features
- User management dashboard
- Content moderation tools
- Analytics and statistics
- Trending tags monitoring

### NFT Integration
- Educational achievement tokenization
- Certificate and milestone minting
- Test score validation system

## Data Flow

1. **Authentication Flow**: Firebase Auth → Context Provider → Protected Routes
2. **Content Flow**: User Input → Form Validation → API Layer → Database → UI Update
3. **Media Flow**: File Selection → Firebase Storage → URL Storage → Database Reference
4. **Real-time Updates**: TanStack Query for optimistic updates and cache management

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, shadcn/ui, Tailwind CSS
- **Firebase**: Authentication, Firestore, Storage
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date formatting
- **Development**: Vite, TypeScript, ESBuild

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **Type Checking**: TypeScript with strict configuration
- **Styling**: PostCSS with Tailwind and Autoprefixer
- **Database**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Production Build
- Vite builds the frontend to `dist/public`
- ESBuild bundles the server to `dist/index.js`
- Static assets served by Express in production

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Firebase configuration through environment variables
- Development and production environment separation

### Hosting Platform
- Configured for Replit deployment with autoscale target
- PostgreSQL 16 and Node.js 20 runtime modules
- Port 5000 for development, port 80 for production

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
- June 20, 2025. Firebase credentials configured successfully with server-side mapping
- June 20, 2025. Authentication system working with fallback mock data support
- June 20, 2025. All core features operational: Feed, Login, Register, Profile, Admin Dashboard
- June 20, 2025. Profile photo upload system implemented with persistent storage
- June 20, 2025. Bio editing functionality fixed with proper form synchronization
- June 20, 2025. Platform branding updated to "Beat3 Social" throughout application
- June 20, 2025. HomePage and AboutPage created with comprehensive landing experience
- June 20, 2025. Navigation restructured: public landing (/) and dashboard (/dashboard) for authenticated users
- June 20, 2025. Fixed authentication redirect flow to properly route to /dashboard after login
- June 20, 2025. Updated Navigation component branding from "Deep3 Social" to "Beat3 Social"
- June 20, 2025. Fixed profile bio editing interface with proper edit/save/cancel functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```