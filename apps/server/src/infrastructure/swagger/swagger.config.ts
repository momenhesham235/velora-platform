import { Options } from 'swagger-jsdoc';
import { env } from '@config/env.config';

/**
 * Swagger/OpenAPI Base Configuration
 * 
 * Defines the core OpenAPI 3.0 specification for the Velora API
 * This configuration is environment-aware and supports both dev and production
 */

export const swaggerDefinition: Options['definition'] = {
  openapi: '3.0.0',
  
  info: {
    title: 'Velora API',
    version: '1.0.0',
    description: `
# Velora Platform API Documentation

Welcome to the Velora API documentation. This is a production-grade SaaS platform backend built with Node.js, Express, and TypeScript.

## Features
- 🔐 Complete authentication system with JWT
- 👥 User management
- 📊 Project management
- ✅ Task management
- 🏢 Workspace management

## Authentication
Most endpoints require authentication. Use the \`/api/auth/login\` endpoint to obtain an access token, then include it in the Authorization header:

\`\`\`
Authorization: Bearer <your_access_token>
\`\`\`

## Response Format
All API responses follow a consistent format:

**Success Response:**
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
\`\`\`
    `.trim(),
    contact: {
      name: 'Velora API Support',
      email: 'support@velora.com',
      url: 'https://velora.com/support',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Development Server',
    },
    {
      url: 'https://api.velora.com',
      description: 'Production Server',
    },
    {
      url: 'https://staging-api.velora.com',
      description: 'Staging Server',
    },
  ],

  tags: [
    {
      name: 'Health',
      description: 'Health check and system status endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints (Coming Soon)',
    },
    {
      name: 'Workspaces',
      description: 'Workspace management endpoints (Coming Soon)',
    },
    {
      name: 'Projects',
      description: 'Project management endpoints (Coming Soon)',
    },
    {
      name: 'Tasks',
      description: 'Task management endpoints (Coming Soon)',
    },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: 'Refresh token stored in HTTP-only cookie',
      },
    },
  },

  security: [
    {
      BearerAuth: [],
    },
  ],
};
