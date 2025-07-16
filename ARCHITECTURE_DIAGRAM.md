# URL Shortener - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                              │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js App Router + React Components                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Home      │ │   Links     │ │   Login     │ │  Register   │   │
│  │   page.js   │ │   page.js   │ │   page.js   │ │   page.js   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 Navbar.js (Shared Layout)                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API Layer                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (/api/*)                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │    Auth     │ │   Links     │ │  Session    │ │   Visits    │   │
│  │   /auth/*   │ │ /links/*    │ │ /session    │ │ /visits/*   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Function Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                             │
├─────────────────────────────────────────────────────────────────────┤
│  Utility Functions (/lib/*)                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Session   │ │ Password    │ │ URL Utils   │ │   Validation│   │
│  │ session.js  │ │Utils.js     │ │isValidUrl.js│ │   etc.      │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Database Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Data Access Layer                                │
├─────────────────────────────────────────────────────────────────────┤
│  Database Operations (db.js + Drizzle ORM)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   addLink   │ │  getLinks   │ │registerUser │ │getUserBy... │   │
│  │   ()        │ │   ()        │ │    ()       │ │   Username  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Database Layer                                 │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Neon Serverless)                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                   │
│  │   Users     │ │   Links     │ │   Visits    │                   │
│  │   Table     │ │   Table     │ │   Table     │                   │
│  └─────────────┘ └─────────────┘ └─────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Request Flow Example

### URL Shortening Process
```
1. User enters URL in Frontend
           │
           ▼
2. POST /api/links (API Layer)
           │
           ▼
3. isValidURL() validation (Business Logic)
           │
           ▼
4. randomShortString() generation (Business Logic)
           │
           ▼
5. addLink() database operation (Data Access)
           │
           ▼
6. INSERT into Links table (Database)
           │
           ▼
7. Return shortened URL to user
```

### URL Redirect Process
```
1. User visits /{short} URL
           │
           ▼
2. Dynamic Route [short]/page.js
           │
           ▼
3. getShortLinksRecord() lookup (Data Access)
           │
           ▼
4. saveLinkVisit() tracking (Data Access)
           │
           ▼
5. redirect() to original URL
```

## Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Form    │───▶│  POST /api/auth │───▶│   Verify User   │
│   (Frontend)    │    │    /login       │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                             │
         │              ┌─────────────────┐            │
         │              │  JWT Token      │◀───────────┘
         │              │  Generation     │
         │              │  (Jose Library) │
         │              └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  HTTP Cookie    │    │  Session Store  │
│  Storage        │    │  (Encrypted)    │
└─────────────────┘    └─────────────────┘
```

## Component Interaction

### Data Flow
```
React Components ←→ SWR Cache ←→ API Routes ←→ Database Operations ←→ PostgreSQL
      │                              │                    │
      │                              ▼                    │
      ▼                        Session Management          ▼
  Client State                 (JWT + Cookies)        Schema Relations
```

### Security Boundaries
```
┌─────────────────┐
│   Client Side   │ ← Input Validation, XSS Protection
├─────────────────┤
│   API Routes    │ ← Authentication, Authorization
├─────────────────┤
│  Database ORM   │ ← SQL Injection Prevention
├─────────────────┤
│   Database      │ ← Data Encryption, Access Control
└─────────────────┘
```

## Technology Stack Integration

```
Frontend:           Backend:           Database:          Security:
┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
│Next.js  │───────▶│Next.js  │───────▶│PostgreSQL│       │  JOSE   │
│React    │        │API      │        │ (Neon)   │       │  JWT    │
│Tailwind │        │Routes   │        └─────────┘       └─────────┘
│SWR      │        └─────────┘               │                 │
└─────────┘              │                  │                 │
     │                   ▼                  ▼                 ▼
     │            ┌─────────┐        ┌─────────┐        ┌─────────┐
     │            │Drizzle  │        │Schema   │        │PBKDF2   │
     │            │ORM      │        │Relations│        │Hashing  │
     │            └─────────┘        └─────────┘        └─────────┘
     │                   │                  │                 │
     └───────────────────┼──────────────────┼─────────────────┘
                         │                  │
                         ▼                  ▼
                  ┌─────────────────────────────┐
                  │      Application Logic      │
                  │     (/app/lib utilities)    │
                  └─────────────────────────────┘
```

This architecture follows modern best practices with:
- **Separation of Concerns**: Clear layers for presentation, business logic, and data
- **Security**: Multiple layers of validation and protection
- **Scalability**: Serverless-ready components
- **Maintainability**: Modular structure with single responsibilities