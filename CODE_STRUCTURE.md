# URL Shortener - Code Structure Documentation

## Overview
This is a modern URL shortener application built with **Next.js 15** using the App Router architecture, PostgreSQL database with Drizzle ORM, and custom JWT-based authentication.

## Technology Stack

### Frontend
- **Next.js 15.0.2** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Flowbite 2.5.2** - Component library built on Tailwind
- **SWR 2.2.5** - Data fetching and caching

### Backend & Database
- **PostgreSQL** - Primary database
- **Neon Serverless** - Cloud PostgreSQL hosting
- **Drizzle ORM 0.36.1** - TypeScript ORM
- **Drizzle Kit 0.28.1** - Migration and schema management

### Authentication & Security
- **Jose 5.9.6** - JWT handling for authentication
- **Custom PBKDF2** - Password hashing implementation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TSX 4.19.2** - TypeScript execution

## Project Architecture

### Directory Structure

```
url-shortner/
├── src/
│   ├── app/                    # Next.js App Router directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── links/         # Link management endpoints
│   │   │   ├── post/          # Link creation endpoints
│   │   │   ├── session/       # Session management
│   │   │   └── visits/        # Visit tracking endpoints
│   │   ├── lib/               # Shared utilities and database
│   │   │   ├── db.js          # Database connection and queries
│   │   │   ├── schema.js      # Drizzle schema definitions
│   │   │   ├── session.js     # Session management utilities
│   │   │   ├── passwordUtils.js # Password hashing utilities
│   │   │   ├── randomShortString.js # URL shortening logic
│   │   │   ├── isValidUrl.js  # URL validation
│   │   │   ├── getDomain.js   # Domain extraction utility
│   │   │   └── pbkdf2.js      # Custom password hashing
│   │   ├── [short]/           # Dynamic route for shortened URLs
│   │   ├── links/             # Links management page
│   │   ├── login/             # Authentication pages
│   │   ├── logout/            # Logout functionality
│   │   ├── register/          # User registration
│   │   ├── blog/              # Blog section
│   │   ├── cli/               # Command-line utilities
│   │   ├── Navbar.js          # Navigation component
│   │   ├── layout.js          # Root layout component
│   │   ├── page.js            # Home page
│   │   ├── globals.css        # Global styles
│   │   └── error.js           # Error boundary
│   └── migration/             # Database migrations
│       ├── meta/              # Migration metadata
│       └── *.sql              # SQL migration files
├── public/                    # Static assets
├── drizzle.config.json        # Drizzle ORM configuration
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies and scripts
```

## Architecture Patterns

### 1. **Next.js App Router Pattern**
- **File-based routing** in `src/app/` directory
- **Server and Client Components** separation
- **Layout components** for consistent UI structure
- **API routes** co-located with pages

### 2. **Repository Pattern**
- Database operations centralized in `src/app/lib/db.js`
- Clean separation between data access and business logic
- Reusable database functions with consistent error handling

### 3. **Layered Architecture**
```
Presentation Layer (React Components)
    ↓
API Layer (Next.js API Routes)
    ↓
Business Logic Layer (lib/ utilities)
    ↓
Data Access Layer (Drizzle ORM)
    ↓
Database Layer (PostgreSQL)
```

### 4. **Utility Pattern**
- Shared utilities in `lib/` directory
- Single responsibility principle for each utility
- Consistent error handling across utilities

## Database Schema

### Entity Relationship Diagram
```
Users (1) ←→ (many) Links (1) ←→ (many) Visits
```

### Tables Structure

#### Users Table
```javascript
{
  id: serial (Primary Key)
  username: varchar(50) (Unique)
  password: text (Hashed)
  email: text (Optional)
  createdAt: timestamp
}
```

#### Links Table
```javascript
{
  id: serial (Primary Key)
  url: text (Original URL)
  short: varchar(50) (Short code)
  userId: integer (Foreign Key → Users.id)
  createdAt: timestamp
}
```

#### Visits Table
```javascript
{
  id: serial (Primary Key)
  linkId: integer (Foreign Key → Links.id)
  createdAt: timestamp
}
```

### Relationships
- **Users** can have many **Links** (One-to-Many)
- **Links** can have many **Visits** (One-to-Many)
- **Drizzle Relations** defined for type-safe queries

## API Structure

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/session` - Check session status

### Link Management Endpoints
- `POST /api/post` - Create shortened URL
- `GET /api/links` - Retrieve user links
- `GET /api/links/[id]` - Get specific link details

### Visit Tracking
- `POST /api/visits` - Record URL visit
- `GET /api/visits/[linkId]` - Get visit statistics

## Authentication Flow

### Session Management
1. **Login Process**:
   - User submits credentials
   - Server validates against database
   - JWT token created with user information
   - Token stored in HTTP-only cookie

2. **Session Validation**:
   - Middleware checks JWT token on protected routes
   - Token verified using Jose library
   - User information extracted for authorization

3. **Password Security**:
   - Passwords hashed using PBKDF2 with salt
   - Custom implementation in `passwordUtils.js`
   - Secure comparison for login validation

## Key Components

### Database Layer (`lib/db.js`)
```javascript
// Key Functions:
- configureDatabase()      // Database initialization
- addLink(url)            // Create shortened URL
- getLinks()              // Retrieve links with pagination
- registerUser()          // User registration
- getShortLinksRecord()   // Find link by short code
- saveLinkVisit()         // Track URL visits
```

### Session Management (`lib/session.js`)
```javascript
// Key Functions:
- createSession()         // Generate JWT token
- verifySession()         // Validate existing session
- getSessionUser()        // Extract user from session
```

### URL Utilities
```javascript
// randomShortString.js - Generate unique short codes
// isValidUrl.js - Validate URL format
// getDomain.js - Extract domain from URL
```

## Development Workflow

### Database Operations
```bash
# Generate migrations
npm run migrations

# Apply migrations (handled automatically)
# Migrations run on server startup
```

### Development Commands
```bash
# Start development server
npm run dev

# Build production version
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate encryption key
npm run generateKey
```

### Environment Setup
```bash
# Required Environment Variables:
- DATABASE_URL          # Neon PostgreSQL connection string
- JOSE_SESSION_KEY      # JWT encryption key (base64url encoded)
- NEXT_PUBLIC_VERCEL_URL # Public URL for the application
```

### Environment Variable Generation
```bash
# Generate a secure session key
npm run generateKey
```

## Design Decisions

### 1. **Next.js App Router Choice**
- **Benefit**: Server components for better performance
- **Benefit**: File-based routing simplifies navigation
- **Benefit**: Built-in API routes reduce complexity

### 2. **Drizzle ORM Selection**
- **Benefit**: Type-safe database operations
- **Benefit**: Lightweight compared to Prisma
- **Benefit**: Better control over SQL generation

### 3. **Custom Authentication**
- **Benefit**: Full control over session management
- **Benefit**: No dependency on external auth services
- **Benefit**: Simplified JWT implementation

### 4. **Neon Serverless Database**
- **Benefit**: Serverless scaling
- **Benefit**: PostgreSQL compatibility
- **Benefit**: Simplified deployment

## Security Features

### 1. **Password Security**
- PBKDF2 hashing with salt
- Configurable iteration count
- Secure comparison functions

### 2. **Session Security**
- HTTP-only cookies
- JWT token expiration
- Server-side session validation

### 3. **Input Validation**
- URL format validation
- SQL injection prevention (Drizzle ORM)
- XSS prevention (React built-in)

## Performance Optimizations

### 1. **Database**
- Indexed username for fast lookups
- Pagination for large datasets
- Connection pooling with Neon

### 2. **Frontend**
- SWR for client-side caching
- Next.js automatic code splitting
- Optimized images with Next.js Image

### 3. **API**
- Efficient database queries
- Minimal data transfer
- Error handling and status codes

## Scalability Considerations

### Current Architecture Supports:
- **Horizontal scaling** via serverless functions
- **Database scaling** through Neon's serverless PostgreSQL
- **CDN integration** for static assets
- **Caching strategies** with SWR

### Future Enhancements:
- Redis for session storage
- Rate limiting middleware
- Analytics dashboard
- Bulk operations API
- Admin panel interface

## Troubleshooting

### Common Build Issues

1. **JOSE_SESSION_KEY Error**
   ```bash
   # Generate a new session key
   npm run generateKey
   
   # Add to .env.local
   JOSE_SESSION_KEY=your_generated_key_here
   ```

2. **Database Connection Issues**
   ```bash
   # Verify DATABASE_URL format
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

3. **Environment Variables**
   ```bash
   # Required for production build
   JOSE_SESSION_KEY=base64url_encoded_key
   DATABASE_URL=postgresql_connection_string
   NEXT_PUBLIC_VERCEL_URL=your_domain_here
   ```

### Development Troubleshooting

1. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Database Schema Issues**
   ```bash
   npm run migrations
   # Check migration files in src/migration/
   ```

3. **Session Issues**
   ```bash
   # Clear browser cookies
   # Check JOSE_SESSION_KEY environment variable
   # Verify JWT token expiration settings
   ```

## Maintenance Guidelines

### Code Quality
- Follow ESLint configuration
- Maintain consistent error handling
- Document complex business logic
- Write descriptive commit messages

### Database Maintenance
- Regular backup verification
- Monitor query performance
- Update indexes as needed
- Archive old visit data

### Security Updates
- Regular dependency updates
- Security audit with `npm audit`
- Monitor for vulnerabilities
- Update JWT secret periodically

### Build Verification
```bash
# Always test build before deployment
npm run build
npm run start

# Verify all environment variables are set
npm run generateKey  # Generate missing keys
```

## Additional Resources

### Related Documentation
- [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - Visual system architecture
- [README.md](./README.md) - Project setup and basic information
- [drizzle.config.json](./drizzle.config.json) - Database configuration

### External Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/)
- [JOSE Library](https://github.com/panva/jose)
- [Neon Database](https://neon.tech/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

This documentation provides a comprehensive overview of the URL shortener's code structure, architecture patterns, and design decisions implemented in the application.