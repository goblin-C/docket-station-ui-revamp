
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const Preview = () => {
  const [format, setFormat] = useState<"yaml" | "json">("yaml");
  const [generated, setGenerated] = useState<boolean>(false);
  
  const sampleYaml = `
openapi: 3.0.0
info:
  title: My API
  description: API Description
  version: 1.0.0
servers:
  - url: https://{environment}.example.com/v2
    description: Production server
    variables:
      environment:
        default: api
        enum:
          - api
          - api.dev
          - api.staging
tags:
  - name: pets
    description: Everything about your Pets
    externalDocs:
      url: https://example.com/docs/pets
      description: Find more info here
  `.trim();
  
  const sampleJson = `
{
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "description": "API Description",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://{environment}.example.com/v2",
      "description": "Production server",
      "variables": {
        "environment": {
          "default": "api",
          "enum": ["api", "api.dev", "api.staging"]
        }
      }
    }
  ],
  "tags": [
    {
      "name": "pets",
      "description": "Everything about your Pets",
      "externalDocs": {
        "url": "https://example.com/docs/pets",
        "description": "Find more info here"
      }
    }
  ]
}
  `.trim();
  
  const copyToClipboard = () => {
    const content = format === "yaml" ? sampleYaml : sampleJson;
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };
  
  return (
    <div>
      <div className="flex mb-4 bg-docket-darkblue rounded-t-md overflow-hidden">
        <Button 
          variant="ghost" 
          className={`rounded-none px-6 text-sm ${!generated ? "text-gray-300" : "bg-docket-darkblue text-white"}`}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          className={`rounded-none px-6 text-sm ${generated ? "text-gray-300" : "bg-docket-darkblue text-white"}`}
          onClick={() => setGenerated(true)}
        >
          Preview
        </Button>
      </div>
      
      {generated ? (
        <div className="bg-docket-darkblue rounded-b-md p-4">
          <Tabs defaultValue="yaml" value={format} onValueChange={(value) => setFormat(value as "yaml" | "json")}>
            <div className="flex justify-between items-center mb-3">
              <TabsList className="bg-docket-darker h-8">
                <TabsTrigger value="yaml" className="text-xs px-3 h-6">YAML</TabsTrigger>
                <TabsTrigger value="json" className="text-xs px-3 h-6">JSON</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs flex items-center gap-1.5 text-gray-300 border-gray-700"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </div>
            
            <TabsContent value="yaml" className="mt-0">
              <div className="bg-docket-darker rounded-md p-4 text-left">
                <pre className="text-gray-300 text-sm font-mono whitespace-pre overflow-x-auto">
                  {generated ? sampleYaml : "Click \"Generate Documentation\" to see the output here."}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-0">
              <div className="bg-docket-darker rounded-md p-4 text-left">
                <pre className="text-gray-300 text-sm font-mono whitespace-pre overflow-x-auto">
                  {generated ? sampleJson : "Click \"Generate Documentation\" to see the output here."}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="bg-docket-darkblue rounded-b-md p-6 text-center text-gray-400">
          Edit your API specification and click "Generate Documentation" to preview the output.
        </div>
      )}
    </div>
  );
};

export default Preview;
