
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

const DocketStation = () => {
  const [openApiData, setOpenApiData] = useState<string | undefined>(undefined);
  const [isDocGenerated, setIsDocGenerated] = useState<boolean>(false);
  const [apiInfo, setApiInfo] = useState<Record<string, any>>({});
  const [servers, setServers] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [securitySchemes, setSecuritySchemes] = useState<Record<string, any>>({});

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
      setSecuritySchemes(security);
      
      toast.success("API specification imported successfully");
    } catch (error) {
      console.error("Error processing OpenAPI spec:", error);
      toast.error("Error processing OpenAPI specification");
    }
  };

  const handleGenerateDoc = () => {
    if (!openApiData) {
      toast.warning("Please import or create an API specification first");
      return;
    }
    
    setIsDocGenerated(true);
    toast.success("Documentation generated successfully");
  };

  // Example of pre-loading the PetStore API 
  useEffect(() => {
    // You could auto-load the PetStore API here if needed
    // This is commented out to avoid loading automatically without user consent
    /*
    fetch('https://petstore3.swagger.io/api/v3/openapi.json')
      .then(response => response.text())
      .then(data => {
        handleImportSpec(data);
      })
      .catch(error => {
        console.error('Error fetching PetStore API:', error);
      });
    */
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-docket-darker to-docket-darker/95 text-white font-sans">
      <div className="bg-gradient-to-r from-docket-blue to-docket-blue/80 p-5 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-display tracking-tight">DocketStation</h1>
          <p className="text-blue-100 mt-1 text-lg">API documentation builder for modern APIs</p>
        </div>
      </div>
      
      <div className="container mx-auto p-6 max-w-7xl">
        <Header onImportSpec={handleImportSpec} onGenerateDoc={handleGenerateDoc} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <ApiInformation apiInfo={apiInfo} />
          <Servers serverList={servers} />
        </div>
        
        <div className="mt-8">
          <Tags tagList={tags} />
        </div>
        
        <div className="mt-8">
          <Paths securitySchemes={securitySchemes} />
        </div>
        
        <div className="mt-8">
          <Preview openApiData={isDocGenerated ? openApiData : undefined} />
        </div>
        
        <footer className="mt-16 pb-4 text-center text-blue-300/60 text-sm font-medium">
          © 2025 DocketStation - Build beautiful API docs with ease
        </footer>
      </div>
    </div>
  );
};

export default DocketStation;
