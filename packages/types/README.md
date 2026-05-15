# @velora/types

Shared TypeScript types for the Velora platform.

## Purpose

This package contains type definitions that are shared between the frontend and backend to ensure consistency across the entire platform.

## Usage

### In Backend (apps/server)

```typescript
import { RegisterDTO, LoginDTO, AuthResponse } from '@velora/types';
```

### In Frontend (apps/client)

```typescript
import { RegisterDTO, LoginDTO, AuthResponse } from '@velora/types';
```

## Development

```bash
# Build types
npm run build

# Watch mode
npm run dev
```

## Important

**All DTOs and shared interfaces MUST be defined here to maintain consistency between frontend and backend.**
