
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SchemaEditor from "./SchemaEditor";

// Types
type DataType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
type DataFormat = 'none' | 'date' | 'date-time' | 'password' | 'byte' | 'binary' | 'email' | 'uuid' | 'uri' | 'hostname' | 'ipv4' | 'ipv6';

interface SchemaProperty {
  name: string;
  type: DataType;
  format?: DataFormat;
  description?: string;
  required?: boolean;
  items?: SchemaObject; // For array type
  properties?: SchemaProperty[]; // For object type
}

interface SchemaObject {
  type: DataType;
  format?: DataFormat;
  description?: string;
  properties?: SchemaProperty[];
  items?: SchemaObject; // For array type
}

interface RequestBodyObject {
  description: string;
  required: boolean;
  content: Record<string, {
    schema?: SchemaObject;
    examples?: Record<string, any>;
  }>;
}

interface RequestBodyEditorProps {
  requestBody: RequestBodyObject;
  onUpdate: (requestBody: RequestBodyObject) => void;
}

const contentTypes = [
  'application/json',
  'application/xml',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
  'application/octet-stream'
];

const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({ 
  requestBody, 
  onUpdate 
}) => {
  const [activeContentType, setActiveContentType] = useState<string>(
    Object.keys(requestBody.content)[0] || 'application/json'
  );

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...requestBody,
      description: e.target.value
    });
  };

  const handleRequiredChange = (required: boolean) => {
    onUpdate({
      ...requestBody,
      required
    });
  };

  const handleAddContentType = (contentType: string) => {
    if (!requestBody.content[contentType]) {
      const updatedContent = {
        ...requestBody.content,
        [contentType]: {
          schema: {
            type: 'object',
            properties: []
          },
          examples: {}
        }
      };
      
      onUpdate({
        ...requestBody,
        content: updatedContent
      });
      
      setActiveContentType(contentType);
    }
  };

  const handleSchemaChange = (schema: SchemaObject) => {
    const updatedContent = {
      ...requestBody.content,
      [activeContentType]: {
        ...requestBody.content[activeContentType],
        schema
      }
    };
    
    onUpdate({
      ...requestBody,
      content: updatedContent
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Required</label>
          <Switch
            checked={requestBody.required}
            onCheckedChange={handleRequiredChange}
            className="data-[state=checked]:bg-docket-blue"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={requestBody.description}
          onChange={handleDescriptionChange}
          placeholder="Request body description"
          className="bg-docket-blue/5 border-gray-700 text-sm min-h-[80px]"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Content Type</label>
          <Select 
            value={activeContentType}
            onValueChange={setActiveContentType}
          >
            <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm w-60">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent className="bg-docket-darker border-gray-700">
              {Object.keys(requestBody.content).map(contentType => (
                <SelectItem key={contentType} value={contentType}>{contentType}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end mb-4">
          <Select
            onValueChange={handleAddContentType}
          >
            <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm w-60">
              <SelectValue placeholder="Add content type" />
            </SelectTrigger>
            <SelectContent className="bg-docket-darker border-gray-700">
              {contentTypes
                .filter(type => !requestBody.content[type])
                .map(contentType => (
                  <SelectItem key={contentType} value={contentType}>{contentType}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        
        {requestBody.content[activeContentType] && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="schema" className="border-gray-700">
              <AccordionTrigger className="py-2 text-sm hover:no-underline">
                Schema Definition
              </AccordionTrigger>
              <AccordionContent>
                {requestBody.content[activeContentType].schema ? (
                  <SchemaEditor 
                    schema={requestBody.content[activeContentType].schema!} 
                    onChange={handleSchemaChange}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400">No schema defined</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSchemaChange({ type: 'object', properties: [] })}
                      className="mt-2 bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                    >
                      Add Schema
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default RequestBodyEditor;
