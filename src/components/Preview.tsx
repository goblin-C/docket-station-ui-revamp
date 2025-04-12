
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { formatOpenApiSpec } from "../utils/openApiUtils";

interface PreviewProps {
  openApiData?: string;
}

const Preview: React.FC<PreviewProps> = ({ openApiData }) => {
  const [format, setFormat] = useState<"yaml" | "json">("yaml");
  const [generated, setGenerated] = useState<boolean>(false);
  const [formattedYaml, setFormattedYaml] = useState<string>("");
  const [formattedJson, setFormattedJson] = useState<string>("");
  
  useEffect(() => {
    if (openApiData && generated) {
      try {
        setFormattedYaml(formatOpenApiSpec(openApiData, "yaml"));
        setFormattedJson(formatOpenApiSpec(openApiData, "json"));
      } catch (error) {
        console.error("Error formatting OpenAPI data:", error);
        // Fallback to raw data
        setFormattedYaml(openApiData);
        setFormattedJson(openApiData);
      }
    }
  }, [openApiData, generated]);
  
  const getDisplayContent = () => {
    if (!generated) {
      return "Click \"Generate Documentation\" to see the output here.";
    }
    
    if (!openApiData) {
      return format === "yaml" 
        ? `openapi: 3.0.0\ninfo:\n  title: Sample API\n  version: 1.0.0`
        : `{\n  "openapi": "3.0.0",\n  "info": {\n    "title": "Sample API",\n    "version": "1.0.0"\n  }\n}`;
    }
    
    return format === "yaml" ? formattedYaml : formattedJson;
  };
  
  const copyToClipboard = () => {
    const content = getDisplayContent();
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const downloadFile = () => {
    const content = getDisplayContent();
    const fileType = format === "yaml" ? "yaml" : "json";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-specification.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${fileType.toUpperCase()}`);
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 text-sm flex items-center gap-2 text-blue-200 border-blue-500/30 hover:border-blue-400 hover:bg-docket-blue/20"
                  onClick={downloadFile}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            <TabsContent value="yaml" className="mt-0">
              <div className="bg-docket-darker rounded-xl p-5 text-left border border-docket-blue/20">
                <pre className="text-blue-100 text-sm font-mono whitespace-pre overflow-x-auto max-h-[600px] overflow-y-auto">
                  {getDisplayContent()}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-0">
              <div className="bg-docket-darker rounded-xl p-5 text-left border border-docket-blue/20">
                <pre className="text-blue-100 text-sm font-mono whitespace-pre overflow-x-auto max-h-[600px] overflow-y-auto">
                  {getDisplayContent()}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-blue-300 text-lg">
            {openApiData 
              ? "Your API specification is ready! Click 'Generate Documentation' to see the output."
              : "Import or create an API specification, then click 'Generate Documentation' to preview the output."}
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
