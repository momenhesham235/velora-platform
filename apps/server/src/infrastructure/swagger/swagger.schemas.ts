/**
 * Swagger Reusable Schemas
 * 
 * Defines OpenAPI component schemas that can be referenced across all endpoints
 * These schemas ensure consistency and reduce duplication in API documentation
 */

export const swaggerSchemas = {
  components: {
    schemas: {
      // ============================================
      // COMMON RESPONSE SCHEMAS
      // ============================================

      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully',
            description: 'Human-readable success message',
          },
          data: {
            type: 'object',
            description: 'Response payload (varies by endpoint)',
          },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
            description: 'Always false for error responses',
          },
          message: {
            type: 'string',
            example: 'An error occurred',
            description: 'Human-readable error message',
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR',
                description: 'Machine-readable error code',
              },
              details: {
                type: 'object',
                description: 'Additional error details',
              },
            },
          },
        },
      },

      ValidationError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR',
              },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: {
                      type: 'string',
                      example: 'email',
                    },
                    message: {
                      type: 'string',
                      example: 'Invalid email format',
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ============================================
      // USER SCHEMAS
      // ============================================

      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
            description: 'Unique user identifier',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'User email address',
          },
          firstName: {
            type: 'string',
            example: 'John',
            description: 'User first name',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
            description: 'User last name',
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
            example: 'USER',
            description: 'User role',
          },
          isEmailVerified: {
            type: 'boolean',
            example: true,
            description: 'Whether the user email is verified',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
            description: 'Account creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
            description: 'Last update timestamp',
          },
        },
      },

      UserProfile: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
            example: 'USER',
          },
          isEmailVerified: {
            type: 'boolean',
            example: true,
          },
        },
      },

      // ============================================
      // AUTH SCHEMAS
      // ============================================

      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT access token (expires in 15 minutes)',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT refresh token (expires in 7 days)',
          },
        },
      },

      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/UserProfile',
          },
          tokens: {
            $ref: '#/components/schemas/AuthTokens',
          },
        },
      },

      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'confirmPassword', 'firstName', 'lastName'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'User email address',
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            example: 'SecurePass123!',
            description: 'Password (min 8 characters, must include uppercase, lowercase, number, and special character)',
          },
          confirmPassword: {
            type: 'string',
            format: 'password',
            example: 'SecurePass123!',
            description: 'Password confirmation (must match password)',
          },
          firstName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'John',
            description: 'User first name',
          },
          lastName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'Doe',
            description: 'User last name',
          },
        },
      },

      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'User email address',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SecurePass123!',
            description: 'User password',
          },
        },
      },

      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'Refresh token (can also be sent via cookie)',
          },
        },
      },

      VerifyEmailRequest: {
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string',
            example: 'abc123def456',
            description: 'Email verification token',
          },
        },
      },

      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'Email address to send password reset link',
          },
        },
      },

      ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'newPassword'],
        properties: {
          token: {
            type: 'string',
            example: 'abc123def456',
            description: 'Password reset token',
          },
          newPassword: {
            type: 'string',
            format: 'password',
            minLength: 8,
            example: 'NewSecurePass123!',
            description: 'New password',
          },
        },
      },

      // ============================================
      // HEALTH CHECK SCHEMA
      // ============================================

      HealthCheck: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Velora API is running',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
          environment: {
            type: 'string',
            enum: ['development', 'staging', 'production'],
            example: 'development',
          },
        },
      },
    },
  },
};
