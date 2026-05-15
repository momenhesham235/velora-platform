import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerDefinition } from './swagger.config';
import { swaggerSchemas } from './swagger.schemas';
import { swaggerJsDocOptions } from './swagger.options';

/**
 * Swagger Documentation Generator
 * 
 * Combines the base configuration, reusable schemas, and JSDoc comments
 * to generate the complete OpenAPI specification
 */

/**
 * Generate OpenAPI Specification
 * 
 * This function merges:
 * 1. Base OpenAPI config (servers, info, security)
 * 2. Reusable component schemas
 * 3. JSDoc comments from route/controller files
 */
export const generateSwaggerSpec = () => {
  const options: swaggerJsdoc.Options = {
    definition: {
      ...swaggerDefinition,
      // Merge reusable schemas into components
      components: {
        ...(swaggerDefinition?.components || {}),
        ...swaggerSchemas.components,
      },
    } as swaggerJsdoc.SwaggerDefinition,
    apis: swaggerJsDocOptions.apis,
  };

  return swaggerJsdoc(options);
};

/**
 * Get Swagger Specification
 * 
 * Returns the generated OpenAPI spec
 * This is what gets served to Swagger UI
 */
export const swaggerSpec = generateSwaggerSpec();
