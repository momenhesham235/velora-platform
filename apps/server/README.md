# Velora Backend Server

Production-ready backend server for the Velora SaaS platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── env.config.ts       # Environment variables with validation
│   └── db.config.ts        # Database connection
├── modules/             # Feature modules
│   └── auth/               # Authentication module
│       ├── auth.model.ts      # User schema & model
│       ├── auth.service.ts    # Business logic
│       ├── auth.controller.ts # Request handlers
│       ├── auth.routes.ts     # Route definitions
│       ├── auth.validation.ts # Request validation
│       └── auth.types.ts      # TypeScript types
├── middlewares/         # Global middlewares
│   ├── error.middleware.ts    # Error handling
│   ├── auth.middleware.ts     # JWT verification & RBAC
│   ├── validate.middleware.ts # Request validation
│   ├── asyncHandler.ts        # Async error wrapper
│   └── index.ts
├── utils/               # Utility functions
│   ├── logger.ts           # Logging utility
│   ├── ApiError.ts         # Custom error class
│   ├── jwt.util.ts         # JWT generation/verification
│   ├── password.util.ts    # Password hashing
│   ├── email.util.ts       # Email sending
│   └── response.util.ts    # Standardized responses
├── types/               # TypeScript type definitions
│   └── express.d.ts        # Express extensions
├── app.ts               # Express app initialization
└── server.ts            # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or remote)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
```

### Development

```bash
# Start development server with hot reload
pnpm dev

# Type checking
pnpm type-check

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

### Health Check
- `GET /health` - Server health status

### API Base
- `GET /api` - API information

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user (protected)
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user profile (protected)

**See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs.**
**See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing instructions.**

## Architecture Decisions

### Separation of Concerns
- `app.ts`: Pure Express setup (testable)
- `server.ts`: Server lifecycle (DB, port binding)

### Error Handling
- Custom `ApiError` class for operational errors
- Global error middleware for consistent responses
- Proper logging based on error severity

### Database
- Singleton pattern for connection management
- Graceful connection/disconnection
- Connection pooling configured

### Type Safety
- Zod validation for environment variables
- Strict TypeScript configuration
- Runtime type checking where needed

## Features Implemented

### ✅ Authentication Module
- User registration with email/password
- Email validation & password hashing (bcrypt)
- Login with JWT tokens (access + refresh)
- Token refresh mechanism
- Logout with token invalidation
- Email verification flow
- Password reset flow
- Protected routes with JWT middleware
- Role-based access control (RBAC)
- User profile endpoint

### ✅ Security Features
- Password hashing with bcrypt (12 salt rounds)
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 day expiry)
- HTTP-only cookies for refresh tokens
- Environment variable validation
- Input validation with Zod
- Custom error handling
- CORS configuration

## Next Steps

Future enhancements:
1. ✅ Authentication module (COMPLETED)
2. ⏳ User management module
3. ⏳ Projects module
4. ⏳ Tasks module
5. ⏳ API documentation (Swagger/OpenAPI)
6. ⏳ Automated testing (Jest/Supertest)
7. ⏳ Rate limiting & security headers
8. ⏳ Email service integration (SendGrid/AWS SES)
9. ⏳ File upload (AWS S3)
10. ⏳ Real-time features (Socket.io)
