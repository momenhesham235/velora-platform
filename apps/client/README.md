# Velora Platform - Client

React + TypeScript + Vite client application for the Velora Platform.

## Project Structure

```
src/
├── app/                    # Application core
│   ├── providers/         # Context providers (Auth, Query, Theme)
│   ├── router/            # Routing configuration
│   └── store/             # Global state management (if needed)
│
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   ├── dashboard/        # Dashboard feature
│   ├── workspaces/       # Workspaces feature
│   ├── projects/         # Projects feature
│   └── tasks/            # Tasks feature
│
├── shared/               # Shared resources
│   ├── components/       # Reusable components
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # Constants
│   └── types/           # Shared types
│
├── services/            # External services
│   ├── api/            # API client configuration
│   └── storage/        # Local storage services
│
├── lib/                # Third-party library configurations
│   ├── validators/     # Validation schemas
│   ├── helpers/        # Helper functions
│   └── formatters/     # Data formatters
│
├── styles/             # Global styles
├── assets/             # Static assets
└── types/              # Global type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client

## Features

- ✅ Authentication (Login, Register, Forgot Password)
- ✅ Protected routes
- ✅ Token-based authentication
- ✅ Theme support (Light/Dark)
- ✅ API client with interceptors
- ✅ Form validation
- ✅ Type-safe routing

## Environment Variables

See `.env.example` for required environment variables.

## Contributing

Please follow the established project structure and coding conventions.
