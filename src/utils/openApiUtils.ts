
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

/**
 * Utility functions for handling OpenAPI specifications
 */

/**
 * Converts YAML to JSON object
 */
export const yamlToJson = (yaml: string): object => {
  try {
    // Check if it's already JSON
    if (yaml.trim().startsWith('{')) {
      return JSON.parse(yaml);
    }
    
    // Parse YAML to JS object
    return yamlLoad(yaml) as object;
  } catch (error) {
    console.error("Error converting YAML to JSON:", error);
    throw new Error("Failed to parse YAML content");
  }
};

/**
 * Converts JSON object to YAML string
 */
export const jsonToYaml = (json: object): string => {
  try {
    return yamlDump(json);
  } catch (error) {
    console.error("Error converting JSON to YAML:", error);
    throw new Error("Failed to convert to YAML");
  }
};

/**
 * Extracts API info from an OpenAPI spec
 */
export const extractApiInfo = (spec: string): {
  title?: string;
  version?: string;
  description?: string;
  termsOfService?: string;
  contact?: { name?: string; url?: string; email?: string };
  license?: { name?: string; url?: string };
} => {
  try {
    let parsed: any;
    
    // Try to parse based on format
    if (spec.trim().startsWith('{')) {
      parsed = JSON.parse(spec);
    } else {
      parsed = yamlLoad(spec);
    }
    
    if (!parsed || !parsed.info) {
      return {};
    }
    
    return {
      title: parsed.info.title,
      version: parsed.info.version,
      description: parsed.info.description,
      termsOfService: parsed.info.termsOfService,
      contact: parsed.info.contact,
      license: parsed.info.license
    };
  } catch (error) {
    console.error("Error parsing OpenAPI spec:", error);
    return {};
  }
};

/**
 * Extracts servers from an OpenAPI spec
 */
export const extractServers = (spec: string): Array<{
  url: string;
  description?: string;
  variables?: Record<string, any>;
}> => {
  try {
    let parsed: any;
    
    // Try to parse based on format
    if (spec.trim().startsWith('{')) {
      parsed = JSON.parse(spec);
    } else {
      parsed = yamlLoad(spec);
    }
    
    if (!parsed || !parsed.servers || !Array.isArray(parsed.servers)) {
      return [];
    }
    
    return parsed.servers;
  } catch (error) {
    console.error("Error extracting servers:", error);
    return [];
  }
};

/**
 * Extracts tags from an OpenAPI spec
 */
export const extractTags = (spec: string): Array<{
  name: string;
  description?: string;
  externalDocs?: { description?: string; url: string };
}> => {
  try {
    let parsed: any;
    
    // Try to parse based on format
    if (spec.trim().startsWith('{')) {
      parsed = JSON.parse(spec);
    } else {
      parsed = yamlLoad(spec);
    }
    
    if (!parsed || !parsed.tags || !Array.isArray(parsed.tags)) {
      return [];
    }
    
    return parsed.tags;
  } catch (error) {
    console.error("Error extracting tags:", error);
    return [];
  }
};

/**
 * Validates an OpenAPI specification
 */
export const validateOpenApiSpec = (spec: string): boolean => {
  try {
    let parsed: any;
    
    // Try to parse based on format
    if (spec.trim().startsWith('{')) {
      parsed = JSON.parse(spec);
    } else {
      parsed = yamlLoad(spec);
    }
    
    // Basic validation - check for required OpenAPI fields
    return !!(parsed && 
              parsed.openapi && 
              parsed.info && 
              parsed.paths);
  } catch (error) {
    console.error("Error validating OpenAPI spec:", error);
    return false;
  }
};

/**
 * Formats an OpenAPI specification for display
 */
export const formatOpenApiSpec = (spec: string, format: "json" | "yaml"): string => {
  try {
    let parsed: any;
    
    // Parse input to object regardless of format
    if (spec.trim().startsWith('{')) {
      parsed = JSON.parse(spec);
    } else {
      parsed = yamlLoad(spec);
    }
    
    // Format according to desired output
    if (format === "json") {
      return JSON.stringify(parsed, null, 2);
    } else {
      return yamlDump(parsed);
    }
  } catch (error) {
    console.error("Error formatting OpenAPI spec:", error);
    return spec; // Return original on error
  }
};

/**
 * Extracts security schemes from an OpenAPI spec
 */
export const extractSecuritySchemes = (spec: string): Record<string, any> => {
  try {
    let parsed: any;
    
    // Try to parse based on format
    if (spec.trim().startsWith('{')) {
      parsed = JSON.parse(spec);
    } else {
      parsed = yamlLoad(spec);
    }
    
    if (!parsed || 
        !parsed.components || 
        !parsed.components.securitySchemes) {
      return {};
    }
    
    return parsed.components.securitySchemes;
  } catch (error) {
    console.error("Error extracting security schemes:", error);
    return {};
  }
};
