# AI Physio - AI-Powered Physiotherapy Platform

## Overview

AI Physio is a SvelteKit-based application that provides AI-powered physiotherapy guidance and personalized workout recommendations. The platform helps users with their fitness and rehabilitation journey through intelligent exercise programs and real-time guidance.

## 1. External API Endpoints (CONSEN_API_ENDPOINT)

The application makes calls to external translation and processing APIs through the `CONSEN_API_ENDPOINT`. Here are all the endpoints being called:

### Translation Services
- **`/translate_v2`** - Main translation endpoint for document translations
- **`/api/v2/instant_translation`** - Instant translation service for quick document processing

### Document Processing
- **`/parse_pdf`** - PDF document parsing and text extraction
- **`/parse_docx`** - DOCX document parsing and text extraction  
- **`/parse_pptx`** - PPTX presentation parsing and text extraction
- **`/documents/parse_pdf`** - Alternative PDF parsing endpoint for document uploads

### Export Services
- **`/export_pdf`** - Export translated documents as PDF
- **`/export_docx`** - Export translated documents as DOCX
- **`/export_pptx`** - Export translated documents as PPTX

### Glossary & Keywords
- **`/kw_extraction_v2`** - Keyword extraction from documents
- **`/kw_extraction_v2/status/{taskId}`** - Check status of keyword extraction tasks

### Fallback Configuration
All endpoints have fallback support:
- **Production**: Uses `CONSEN_API_ENDPOINT` when available
- **Development**: Falls back to `PUBLIC_API_DEVELOPMENT_ENDPOINT` (default: `http://0.0.0.0:8000`)

## 2. Authentication & Login Flow

### OAuth-Based Authentication
The application uses Supabase for authentication with OAuth providers:

#### Supported Providers
- **Google OAuth** (`provider: 'google'`)
- **Microsoft Azure OAuth** (`provider: 'azure'`)

#### Login Process Flow
1. **Login Initiation** (`/sign-in`)
   - User clicks login button
   - Application redirects to OAuth provider
   - Redirect URL: `{domain}/sign-in/confirm`

2. **OAuth Confirmation** (`/sign-in/confirm`)
   - Handle OAuth callback
   - Process state parameters for redirect logic
   - Create user profile if first-time user

3. **User Profile Creation** (Automatic)
   - New users get 10 free credits
   - Profile includes: name, avatar, email, credits balance
   - Automatic organization creation for each user

4. **Session Management**
   - JWT-based session validation
   - Safe session retrieval with user validation
   - Automatic redirects for protected routes

#### Protected Routes
- Routes containing `/payment` or `/project` require authentication
- Exception: routes containing `/instant` (for anonymous access)
- Unauthenticated users redirected to `/sign-in`

#### State Parameter Handling
The login system supports complex redirect scenarios:
- **Pricing redirects**: Return to pricing page after login
- **Insta-mode with purchases**: Preserve purchase intent during login
- **Project continuation**: Resume project work after authentication

## 3. Insta-Mode Flow

Insta-mode provides instant document translation with a streamlined 3-step process.

### Step 1: File Upload
1. **File Selection**
   - Supports PDF and PPTX files
   - Drag & drop or file picker interface
   - File validation and size checks

2. **Language Detection**
   - Automatic source language detection using `franc` library
   - Language mapping for common language codes
   - Manual language selection override available

3. **Anonymous User Limits**
   - Upload limit: 5 files per day
   - Translation limit: 1 translation per day
   - Tracked via localStorage with daily reset

### Step 2: Processing & Translation
1. **Project Creation**
   - Creates instant project with unique URL key
   - Stores file metadata and language settings
   - Links to user account if authenticated

2. **Translation Processing**
   - Calls `/api/v2/instant_translation` endpoint
   - Page-based credit system for authenticated users
   - Limited to 1 page for anonymous users

3. **Progress Tracking**
   - Real-time progress indicator (simulated)
   - Error handling and user feedback
   - Credit deduction for authenticated users

### Step 3: Preview & Download
1. **File Preview**
   - PDF.js-powered document viewer
   - Full translated document display
   - Mobile-responsive preview interface

2. **Download Options**
   - Direct file download
   - Multiple download methods for CORS compatibility
   - Filename preservation

3. **Authentication Prompts**
   - Anonymous users prompted to login for additional features
   - Preserved state for post-login continuation

### Anonymous User System
The application includes a sophisticated anonymous user tracking system:

#### Features
- **Browser-based tracking** using localStorage
- **Daily limits** with automatic reset at midnight
- **Session persistence** across browser sessions
- **Abuse prevention** without requiring registration

#### Implementation
```typescript
interface AnonymousSession {
    id: string;               // Unique anonymous ID
    createdAt: string;        // Session creation timestamp
    lastActiveAt: string;     // Last activity timestamp
    translations: number;     // Daily translation count
    uploadsToday: number;     // Daily upload count
    dailyResetDate: string;   // Date for daily limit reset
}
```

#### Limits
- **Translations**: 1 per day
- **Uploads**: 5 per day
- **Automatic reset**: Daily at midnight
- **Error recovery**: Automatic session recreation if corrupted

## 4. Project Configuration Requirements

### Environment Variables

#### Required Variables
```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

# Storage Configuration  
PUBLIC_SUPABASE_DOC_BUCKET_URL="https://<project-id>.supabase.co/storage/v1/object/public/docs"

# API Endpoints
CONSEN_API_ENDPOINT="<production-api-domain>"
PUBLIC_API_DEVELOPMENT_ENDPOINT="http://0.0.0.0:8000"

# PayOS Configuration
PAYOS_CLIENT_ID="<payos-client-id>"
PAYOS_API_KEY="<payos-api-key>"
PAYOS_CHECKSUM_KEY="<payos-checksum-key>"
```

#### Environment Setup
1. Create `.env` file in project root
2. Copy variables from example above
3. Replace placeholder values with actual credentials
4. Ensure `.env` is in `.gitignore` (already configured)

### Development Setup

#### Prerequisites
- **Node.js** (v18 or higher)
- **npm/pnpm/yarn** package manager
- **Supabase project** with appropriate tables and storage buckets

#### Installation & Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Development Configuration
- **Port**: 3000 (configurable in `vite.config.ts`)
- **Allowed hosts**: Configured for ngrok development
- **Hot reload**: Enabled for Svelte components

### Database Requirements (Supabase)

#### Required Tables
- **`user_profiles`** - User account information and credits
- **`projects`** - Document translation projects
- **`organizations`** - User organization management

#### Required Storage Buckets
- **`docs`** - Document file storage

#### Authentication Setup
- Enable Google OAuth provider
- Enable Microsoft Azure OAuth provider
- Configure redirect URLs for authentication flow

### Production Considerations

#### Performance Optimizations
- **PDF.js**: Dynamically loaded to avoid SSR issues
- **Code splitting**: Automatic with SvelteKit
- **Static asset optimization**: Tailwind CSS with purging

#### Security
- **Environment variable isolation**: Private keys server-side only
- **CORS configuration**: Proper headers for API calls
- **Session validation**: JWT verification with Supabase

#### Deployment
- **Adapter**: Uses `@sveltejs/adapter-auto` for platform detection
- **Build output**: Optimized for serverless deployment
- **Environment variables**: Configure in deployment platform

### Key Dependencies

#### Core Framework
- **SvelteKit** - Full-stack framework
- **Svelte 5** - Component framework with runes
- **TypeScript** - Type safety

#### Authentication & Database
- **Supabase** - Backend as a Service
- **@supabase/ssr** - Server-side rendering support

#### Document Processing
- **PDF.js** - PDF rendering and text extraction
- **JSZip** - PPTX file processing
- **franc** - Language detection

#### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/forms** - Form styling
- **Sass** - CSS preprocessing

#### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Troubleshooting Common Issues

#### Environment Variable Issues
- Ensure all required variables are set
- Check variable naming (PUBLIC_ prefix for client-side)
- Verify Supabase project configuration

#### Authentication Problems
- Verify OAuth provider configuration
- Check redirect URL whitelist in Supabase
- Ensure service role key has proper permissions

#### API Connection Issues
- Test both CONSEN_API_ENDPOINT and fallback endpoint
- Verify network connectivity and CORS configuration
- Check API endpoint availability and authentication

#### File Upload Problems
- Verify Supabase storage bucket permissions
- Check file size limits and supported formats
- Ensure proper CORS configuration for storage bucket

This documentation provides a comprehensive overview of the Omniglot project's architecture, flows, and configuration requirements. The system is designed to be scalable, secure, and user-friendly while providing both anonymous and authenticated experiences.
