
import React, { useState, useEffect } from 'react';
import Header from "./Header";
import ApiInformation from "./ApiInformation";
import Servers from "./Servers";
import Tags from "./Tags";
import Preview from "./Preview";
import Paths from "./Paths";
import { toast } from "sonner";
import { 
  validateOpenApiSpec, 
  extractApiInfo, 
  extractServers, 
  extractTags, 
  extractSecuritySchemes 
} from "../utils/openApiUtils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Default security schemes based on the provided schema
const DEFAULT_SECURITY_SCHEMES = {
  BasicAuth: {
    type: 'http',
    scheme: 'basic'
  },
  BearerAuth: {
    type: 'http',
    scheme: 'bearer'
  },
  ApiKeyAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'X-API-Key'
  },
  OpenID: {
    type: 'openIdConnect',
    openIdConnectUrl: 'https://example.com/.well-known/openid-configuration'
  },
  OAuth2: {
    type: 'oauth2',
    flows: {
      authorizationCode: {
        authorizationUrl: 'https://example.com/oauth/authorize',
        tokenUrl: 'https://example.com/oauth/token',
        scopes: {
          read: 'Grants read access',
          write: 'Grants write access',
          admin: 'Grants access to admin operations'
        }
      }
    }
  }
};

const DocketStation = () => {
  const [openApiData, setOpenApiData] = useState<string | undefined>(undefined);
  const [apiInfo, setApiInfo] = useState<Record<string, any>>({});
  const [servers, setServers] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [securitySchemes, setSecuritySchemes] = useState<Record<string, any>>(DEFAULT_SECURITY_SCHEMES);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleImportSpec = (spec: string) => {
    if (!validateOpenApiSpec(spec)) {
      toast.error("Invalid OpenAPI specification format");
      return;
    }

    setOpenApiData(spec);
    
    try {
      // Extract data from the spec to update UI components
      const info = extractApiInfo(spec);
      const serverList = extractServers(spec);
      const tagList = extractTags(spec);
      const security = extractSecuritySchemes(spec);
      
      // Update state with extracted data
      setApiInfo(info);
      setServers(serverList);
      setTags(tagList);
      
      // Merge default security schemes with extracted ones
      setSecuritySchemes({
        ...DEFAULT_SECURITY_SCHEMES,
        ...security
      });
      
      toast.success("API specification imported successfully");
    } catch (error) {
      console.error("Error processing OpenAPI spec:", error);
      toast.error("Error processing OpenAPI specification");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Auto-generate the documentation whenever relevant state changes
  useEffect(() => {
    // This effect ensures the preview is always up-to-date
    // without requiring a separate "Generate Documentation" action
  }, [apiInfo, servers, tags, securitySchemes]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-docket-darker to-docket-darker/95 text-white' : 'bg-gradient-to-b from-gray-100 to-white text-gray-900'} font-sans`}>
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-docket-blue to-docket-blue/80' : 'bg-gradient-to-r from-blue-600 to-blue-500'} p-5 shadow-md`}>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-display tracking-tight text-white">DocketStation</h1>
          <p className="text-blue-100 mt-1 text-lg">API documentation builder for modern APIs</p>
        </div>
      </div>
      
      <div className="container mx-auto p-6 max-w-full">
        <Header 
          onImportSpec={handleImportSpec} 
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)] mt-8">
          {/* Left Panel - API Editing Components */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="pr-4 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ApiInformation apiInfo={apiInfo} />
                <Servers serverList={servers} />
              </div>
              
              <Tags tagList={tags} />
              
              <Paths securitySchemes={securitySchemes} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Preview */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="pl-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <Preview openApiData={openApiData} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        
        <footer className="mt-16 pb-4 text-center text-blue-300/60 text-sm font-medium">
          © 2025 DocketStation - Build beautiful API docs with ease
        </footer>
      </div>
    </div>
  );
};

export default DocketStation;
