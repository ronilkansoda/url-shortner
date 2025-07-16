# URL Shortener

A modern URL shortener application built with Next.js 15, PostgreSQL, and Drizzle ORM.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
npm run generateKey  # Generate session key

# Start development server
npm run dev
```

## Documentation

For detailed information about the code structure and architecture:

- **[CODE_STRUCTURE.md](./CODE_STRUCTURE.md)** - Comprehensive code structure documentation
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual system architecture diagrams

## Technology Stack

- **Frontend**: Next.js 15 + React + Tailwind CSS
- **Backend**: Next.js API Routes + Drizzle ORM
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: JWT with Jose library

## Features

- URL shortening with custom short codes
- User authentication and session management
- Visit tracking and analytics
- Responsive design with Tailwind CSS
- Serverless-ready architecture

## Environment Variables

```bash
DATABASE_URL=postgresql://...
JOSE_SESSION_KEY=base64url_encoded_key
NEXT_PUBLIC_VERCEL_URL=your_domain
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrations   # Generate database migrations
npm run generateKey  # Generate session encryption key
npm run lint         # Run ESLint
```

## Contributing

Please refer to the code structure documentation for understanding the architecture before contributing.