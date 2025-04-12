
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
    <div className="card-container overflow-hidden">
      <div className="flex border-b border-docket-blue/20">
        <Button 
          variant="ghost" 
          className={`rounded-none px-6 text-base font-medium ${generated ? "text-blue-300 hover:text-white" : "bg-docket-blue/10 text-white"}`}
          onClick={() => setGenerated(false)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          className={`rounded-none px-6 text-base font-medium ${!generated ? "text-blue-300 hover:text-white" : "bg-docket-blue/10 text-white"}`}
          onClick={() => setGenerated(true)}
        >
          Preview
        </Button>
      </div>
      
      {generated ? (
        <div className="p-6">
          <Tabs defaultValue="yaml" value={format} onValueChange={(value) => setFormat(value as "yaml" | "json")} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-docket-blue/10 h-9 p-1">
                <TabsTrigger value="yaml" className="px-4 data-[state=active]:bg-docket-blue data-[state=active]:text-white">YAML</TabsTrigger>
                <TabsTrigger value="json" className="px-4 data-[state=active]:bg-docket-blue data-[state=active]:text-white">JSON</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 text-sm flex items-center gap-2 text-blue-200 border-blue-500/30 hover:border-blue-400 hover:bg-docket-blue/20"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
            
            <TabsContent value="yaml" className="mt-0">
              <div className="bg-docket-darker rounded-xl p-5 text-left border border-docket-blue/20">
                <pre className="text-blue-100 text-sm font-mono whitespace-pre overflow-x-auto">
                  {generated ? sampleYaml : "Click \"Generate Documentation\" to see the output here."}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-0">
              <div className="bg-docket-darker rounded-xl p-5 text-left border border-docket-blue/20">
                <pre className="text-blue-100 text-sm font-mono whitespace-pre overflow-x-auto">
                  {generated ? sampleJson : "Click \"Generate Documentation\" to see the output here."}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-blue-300 text-lg">
            Edit your API specification and click "Generate Documentation" to preview the output.
          </p>
          <Button 
            className="mt-6 bg-docket-accent text-white hover:bg-docket-blue shadow-md px-6 py-2.5 text-base"
            onClick={() => setGenerated(true)}
          >
            Generate Documentation
          </Button>
        </div>
      )}
    </div>
  );
};

export default Preview;
