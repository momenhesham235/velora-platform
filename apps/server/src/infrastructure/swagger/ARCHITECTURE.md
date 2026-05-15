# 🏗️ Swagger Architecture Documentation

## System Overview

This document explains how the Swagger/OpenAPI documentation system is architected and integrated into the Velora backend.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                    http://localhost:5000/api/docs               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS APPLICATION                        │
│                         (app.ts)                                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Middleware Stack                                         │ │
│  │  • CORS                                                   │ │
│  │  • Body Parser                                            │ │
│  │  • Cookie Parser                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│                             ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Routes                                                   │ │
│  │  • GET /health                                            │ │
│  │  • GET /api/docs          ◄─── Swagger UI                │ │
│  │  • GET /api/docs.json     ◄─── OpenAPI Spec              │ │
│  │  • /api/auth/*            ◄─── Auth Routes               │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              SWAGGER INFRASTRUCTURE MODULE                      │
│              (src/infrastructure/swagger/)                      │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ swagger.config.ts│  │ swagger.schemas  │                   │
│  │                  │  │      .ts         │                   │
│  │ • API Info       │  │ • User schemas   │                   │
│  │ • Servers        │  │ • Auth schemas   │                   │
│  │ • Tags           │  │ • Error schemas  │                   │
│  │ • Security       │  │ • Common schemas │                   │
│  └────────┬─────────┘  └────────┬─────────┘                   │
│           │                     │                              │
│           └──────────┬──────────┘                              │
│                      │                                         │
│                      ▼                                         │
│           ┌──────────────────────┐                            │
│           │  swagger.docs.ts     │                            │
│           │                      │                            │
│           │  • Combines config   │                            │
│           │  • Merges schemas    │                            │
│           │  • Scans JSDoc       │                            │
│           │  • Generates spec    │                            │
│           └──────────┬───────────┘                            │
│                      │                                         │
│                      ▼                                         │
│           ┌──────────────────────┐                            │
│           │ swagger.options.ts   │                            │
│           │                      │                            │
│           │ • UI customization   │                            │
│           │ • File paths         │                            │
│           │ • Custom CSS         │                            │
│           └──────────────────────┘                            │
│                                                                │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         │ Scans for JSDoc
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MODULE ROUTE FILES                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  auth.routes.ts                                          │  │
│  │                                                          │  │
│  │  /**                                                     │  │
│  │   * @openapi                                            │  │
│  │   * /api/auth/login:                                    │  │
│  │   *   post:                                             │  │
│  │   *     tags: [Auth]                                    │  │
│  │   *     summary: Login user                             │  │
│  │   *     requestBody: ...                                │  │
│  │   *     responses: ...                                  │  │
│  │   */                                                     │  │
│  │  router.post('/login', ...)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Future: users.routes.ts                                 │  │
│  │  Future: projects.routes.ts                              │  │
│  │  Future: tasks.routes.ts                                 │  │
│  │  Future: workspaces.routes.ts                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Initialization (Server Startup)

```
server.ts
    │
    ├─► app.ts (createApp)
    │       │
    │       ├─► Import swagger infrastructure
    │       │       │
    │       │       └─► swagger/index.ts
    │       │               │
    │       │               ├─► swagger.docs.ts
    │       │               │       │
    │       │               │       ├─► swagger.config.ts (base config)
    │       │               │       ├─► swagger.schemas.ts (schemas)
    │       │               │       └─► swagger-jsdoc (scan files)
    │       │               │               │
    │       │               │               └─► Parse JSDoc from routes
    │       │               │
    │       │               └─► swagger.options.ts (UI config)
    │       │
    │       └─► Register Swagger routes
    │               │
    │               ├─► /api/docs (Swagger UI)
    │               └─► /api/docs.json (OpenAPI JSON)
    │
    └─► Server starts listening
```

### 2. Request Flow (User Accesses Docs)

```
User Browser
    │
    │ GET http://localhost:5000/api/docs
    │
    ▼
Express App
    │
    ├─► Swagger UI Middleware
    │       │
    │       ├─► Serve Swagger UI HTML/CSS/JS
    │       └─► Inject OpenAPI spec
    │               │
    │               └─► swaggerSpec (generated)
    │
    └─► Response: Interactive Swagger UI
```

### 3. API Testing Flow

```
User in Swagger UI
    │
    │ Click "Try it out" on /api/auth/login
    │
    ▼
Swagger UI sends request
    │
    │ POST http://localhost:5000/api/auth/login
    │ Body: { email, password }
    │
    ▼
Express App
    │
    ├─► Route: /api/auth/login
    │       │
    │       ├─► Validation Middleware
    │       ├─► Auth Controller
    │       └─► Auth Service
    │
    └─► Response: { success, data: { user, tokens } }
            │
            ▼
        Swagger UI displays response
```

---

## 🧩 Component Responsibilities

### `swagger.config.ts`
**Role**: Base OpenAPI Configuration
**Responsibilities**:
- Define API metadata (title, version, description)
- Configure server URLs (dev, staging, prod)
- Define security schemes (JWT, Cookie)
- Define API tags
- Set global security requirements

**When Modified**: 
- Adding new environments
- Updating API version
- Adding new module tags
- Changing security schemes

---

### `swagger.schemas.ts`
**Role**: Reusable Schema Definitions
**Responsibilities**:
- Define common response schemas
- Define entity schemas (User, Project, etc.)
- Define request/response DTOs
- Provide examples for all schemas

**When Modified**:
- Adding new entities
- Updating existing models
- Adding new modules
- Changing response formats

---

### `swagger.options.ts`
**Role**: UI Customization & File Scanning
**Responsibilities**:
- Configure Swagger UI behavior
- Define custom CSS styling
- Specify which files to scan for JSDoc
- Set UI preferences (expansion, filters, etc.)

**When Modified**:
- Customizing UI appearance
- Adding new route files
- Changing UI behavior
- Adding custom branding

---

### `swagger.docs.ts`
**Role**: Spec Generation
**Responsibilities**:
- Combine base config with schemas
- Invoke swagger-jsdoc to scan files
- Generate final OpenAPI specification
- Export spec for use in app

**When Modified**: 
- Rarely (only if changing generation logic)

---

### `index.ts`
**Role**: Public API
**Responsibilities**:
- Export all public interfaces
- Provide clean import path
- Hide internal implementation

**When Modified**:
- Adding new public exports

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Swagger UI                                                 │
│                                                             │
│  1. User clicks "Authorize" 🔒                              │
│  2. Enters: Bearer <access_token>                           │
│  3. Swagger stores token in memory                          │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ For each protected request
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  HTTP Request                                               │
│                                                             │
│  Headers:                                                   │
│    Authorization: Bearer <access_token>                     │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Express Middleware                                         │
│                                                             │
│  authenticate() middleware                                  │
│    │                                                        │
│    ├─► Extract token from header                           │
│    ├─► Verify JWT signature                                │
│    ├─► Check expiration                                    │
│    └─► Attach user to req.user                             │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Controller                                                 │
│                                                             │
│  Access req.user (authenticated user)                       │
│  Execute business logic                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Security Schemes Defined

1. **BearerAuth** (JWT)
   - Type: HTTP Bearer
   - Format: JWT
   - Used for: Most protected endpoints

2. **CookieAuth** (Refresh Token)
   - Type: API Key
   - Location: Cookie
   - Name: refreshToken
   - Used for: Token refresh

---

## 📦 Module Integration Pattern

### Adding a New Module (Example: Projects)

```
Step 1: Define Tag
─────────────────────────────────────────
swagger.config.ts
    │
    └─► tags: [
            { name: 'Projects', description: '...' }
        ]


Step 2: Define Schemas
─────────────────────────────────────────
swagger.schemas.ts
    │
    └─► Project: { ... }
        CreateProjectRequest: { ... }
        UpdateProjectRequest: { ... }


Step 3: Create Module
─────────────────────────────────────────
src/modules/projects/
    │
    ├─► projects.model.ts
    ├─► projects.service.ts
    ├─► projects.controller.ts
    ├─► projects.validation.ts
    └─► projects.routes.ts
            │
            └─► Add JSDoc comments:
                /**
                 * @openapi
                 * /api/projects:
                 *   get:
                 *     tags: [Projects]
                 *     ...
                 */


Step 4: Register Routes
─────────────────────────────────────────
app.ts
    │
    └─► import projectRoutes from '@modules/projects/projects.routes';
        app.use('/api/projects', projectRoutes);


Step 5: Restart & Test
─────────────────────────────────────────
1. Restart server
2. Visit /api/docs
3. See new "Projects" section
4. Test endpoints
```

---

## 🎯 Design Patterns Used

### 1. **Separation of Concerns**
- Documentation ≠ Business Logic
- Each file has single responsibility
- Clean boundaries between layers

### 2. **DRY (Don't Repeat Yourself)**
- Schemas defined once, referenced everywhere
- Common responses reused
- No duplication

### 3. **Open/Closed Principle**
- Open for extension (add new modules)
- Closed for modification (no need to change existing code)

### 4. **Dependency Injection**
- Swagger spec injected into Express
- Loose coupling between components

### 5. **Configuration as Code**
- All config in TypeScript
- Type-safe configuration
- Version controlled

---

## 🔄 Scalability Considerations

### Current State
```
Auth Module (8 endpoints)
    ├─► Register
    ├─► Login
    ├─► Refresh
    ├─► Logout
    ├─► Get Profile
    ├─► Verify Email
    ├─► Forgot Password
    └─► Reset Password
```

### Future State (Easy to Add)
```
Auth Module (8 endpoints)
Users Module (5+ endpoints)
    ├─► Get All Users
    ├─► Get User by ID
    ├─► Update User
    ├─► Delete User
    └─► ...

Projects Module (7+ endpoints)
    ├─► Create Project
    ├─► Get All Projects
    ├─► Get Project by ID
    ├─► Update Project
    ├─► Delete Project
    ├─► Add Member
    └─► ...

Tasks Module (10+ endpoints)
Workspaces Module (8+ endpoints)
```

**No restructuring needed!** Just:
1. Add tag
2. Add schemas
3. Add JSDoc comments
4. Done ✅

---

## 🧪 Testing Strategy

### Manual Testing
```
1. Start server
2. Open /api/docs
3. Test each endpoint
4. Verify responses match schemas
```

### Automated Testing (Future)
```typescript
// Example: Test OpenAPI spec validity
import { swaggerSpec } from '@infrastructure/swagger';
import SwaggerParser from '@apidevtools/swagger-parser';

describe('OpenAPI Spec', () => {
  it('should be valid', async () => {
    await SwaggerParser.validate(swaggerSpec);
  });
});
```

---

## 📊 Performance Considerations

### Spec Generation
- **When**: Server startup (once)
- **Cost**: ~50-100ms
- **Impact**: Negligible

### Serving Swagger UI
- **Static assets**: Cached by browser
- **Spec**: Generated once, served many times
- **Impact**: Minimal

### Production Optimization
```typescript
// Option 1: Pre-generate spec
// Build step: Generate spec to JSON file
// Runtime: Serve static JSON

// Option 2: Conditional loading
if (env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, ...);
}
```

---

## 🎨 Customization Points

### 1. Branding
- Custom CSS in `swagger.options.ts`
- Custom logo
- Custom colors

### 2. Behavior
- Default expansion level
- Filter options
- Try-it-out defaults

### 3. Security
- Protect docs endpoint
- Add authentication
- Rate limiting

### 4. Content
- API description
- Server URLs
- Contact information

---

## ✅ Architecture Benefits

1. **Maintainable**
   - Clear structure
   - Single responsibility
   - Easy to understand

2. **Scalable**
   - Add modules without restructuring
   - No code duplication
   - Reusable components

3. **Type-Safe**
   - Full TypeScript support
   - Compile-time checks
   - IDE autocomplete

4. **Production-Ready**
   - Environment-aware
   - Security configured
   - Error handling

5. **Developer-Friendly**
   - Interactive testing
   - Clear documentation
   - Easy to use

---

## 🚀 Future Enhancements

### Potential Improvements

1. **Auto-generate from Zod**
   ```typescript
   // Convert Zod schemas to OpenAPI schemas
   import { zodToJsonSchema } from 'zod-to-json-schema';
   ```

2. **API Versioning**
   ```typescript
   // Support multiple API versions
   /api/v1/docs
   /api/v2/docs
   ```

3. **Generate Client SDKs**
   ```bash
   # Generate TypeScript client
   openapi-generator-cli generate -i spec.json -g typescript-axios
   ```

4. **Integration Testing**
   ```typescript
   // Test actual API against spec
   import { validateResponse } from 'openapi-validator';
   ```

---

**This architecture ensures the Swagger documentation system is production-ready, maintainable, and scalable! 🎉**
