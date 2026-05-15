import { SwaggerUiOptions } from 'swagger-ui-express';

/**
 * Swagger UI Configuration Options
 * 
 * Customizes the appearance and behavior of the Swagger UI interface
 * These options enhance the developer experience when exploring the API
 */

export const swaggerUiOptions: SwaggerUiOptions = {
  // ============================================
  // EXPLORER OPTIONS
  // ============================================
  explorer: true, // Enable API explorer
  swaggerOptions: {
    persistAuthorization: true, // Persist authorization data on browser refresh
    displayRequestDuration: true, // Show request duration in responses
    filter: true, // Enable filtering of operations by tags
    tryItOutEnabled: true, // Enable "Try it out" by default
    docExpansion: 'list', // 'list' | 'full' | 'none' - Controls default expansion
    defaultModelsExpandDepth: 3, // How deep to expand models
    defaultModelExpandDepth: 3, // How deep to expand model properties
    displayOperationId: false, // Hide operation IDs
    showExtensions: false, // Hide vendor extensions
    showCommonExtensions: false, // Hide common extensions
    
    // ============================================
    // SECURITY
    // ============================================
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'], // Allowed HTTP methods
  },

  // ============================================
  // CUSTOM CSS
  // ============================================
  customCss: `
    .swagger-ui .topbar { 
      display: none; 
    }
    .swagger-ui .info { 
      margin: 30px 0; 
    }
    .swagger-ui .info .title {
      font-size: 36px;
      color: #3b4151;
    }
    .swagger-ui .scheme-container {
      background: #f7f7f7;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .swagger-ui .btn.authorize {
      background-color: #4990e2;
      border-color: #4990e2;
    }
    .swagger-ui .btn.authorize:hover {
      background-color: #357abd;
      border-color: #357abd;
    }
  `,

  // ============================================
  // CUSTOM SITE TITLE
  // ============================================
  customSiteTitle: 'Velora API Documentation',

  // ============================================
  // CUSTOM FAVICON
  // ============================================
  customfavIcon: '/favicon.ico',
};

/**
 * Swagger JSDoc Options
 * 
 * Configuration for swagger-jsdoc to scan and parse API documentation
 */
export const swaggerJsDocOptions = {
  // Files to scan for JSDoc comments
  apis: [
    './src/modules/**/*.routes.ts', // All route files
    './src/modules/**/*.controller.ts', // All controller files
    './src/app.ts', // Main app file for health check
  ],
};
