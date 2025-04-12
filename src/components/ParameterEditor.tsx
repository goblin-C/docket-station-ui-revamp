
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SchemaEditor from "./SchemaEditor";

// Types
type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';
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

interface Parameter {
  id: string;
  name: string;
  location: ParameterLocation;
  description: string;
  required: boolean;
  type: DataType;
  format: DataFormat;
  schema?: SchemaObject;
}

interface ParameterEditorProps {
  parameter: Parameter;
  onUpdate: (parameter: Parameter) => void;
  onDelete: () => void;
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({ 
  parameter, 
  onUpdate, 
  onDelete 
}) => {
  const [isSchemaExpanded, setIsSchemaExpanded] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ ...parameter, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    onUpdate({ ...parameter, required: checked });
  };

  const handleSelectChange = (name: string, value: string) => {
    onUpdate({ ...parameter, [name]: value });
  };

  const handleSchemaChange = (schema: SchemaObject) => {
    onUpdate({ ...parameter, schema });
  };

  const initSchema = () => {
    if (!parameter.schema) {
      onUpdate({
        ...parameter,
        schema: {
          type: parameter.type,
          format: parameter.format,
          description: parameter.description,
          properties: parameter.type === 'object' ? [] : undefined,
          items: parameter.type === 'array' ? { 
            type: 'string', 
            format: 'none' 
          } : undefined
        }
      });
    }
    setIsSchemaExpanded(true);
  };

  return (
    <div className="bg-docket-blue/5 border border-gray-700 rounded-md p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-semibold">Parameter</h4>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete} 
          className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium mb-1">Name</label>
          <Input
            name="name"
            value={parameter.name}
            onChange={handleInputChange}
            placeholder="Parameter name"
            className="bg-docket-blue/5 border-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Location</label>
          <Select 
            value={parameter.location} 
            onValueChange={(value) => handleSelectChange('location', value)}
          >
            <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-docket-darker border-gray-700">
              <SelectItem value="path">Path</SelectItem>
              <SelectItem value="query">Query</SelectItem>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="cookie">Cookie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={parameter.description}
          onChange={handleInputChange}
          placeholder="Parameter description"
          className="bg-docket-blue/5 border-gray-700 text-sm min-h-[80px]"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={parameter.required}
            onCheckedChange={handleSwitchChange}
            className="data-[state=checked]:bg-docket-blue"
          />
          <span className="text-sm">Required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <Select 
            value={parameter.type} 
            onValueChange={(value) => handleSelectChange('type', value as DataType)}
          >
            <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-docket-darker border-gray-700">
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="integer">Integer</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Format</label>
          <Select 
            value={parameter.format} 
            onValueChange={(value) => handleSelectChange('format', value as DataFormat)}
          >
            <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-docket-darker border-gray-700">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="date-time">Date-Time</SelectItem>
              <SelectItem value="password">Password</SelectItem>
              <SelectItem value="byte">Byte</SelectItem>
              <SelectItem value="binary">Binary</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="uuid">UUID</SelectItem>
              <SelectItem value="uri">URI</SelectItem>
              <SelectItem value="hostname">Hostname</SelectItem>
              <SelectItem value="ipv4">IPv4</SelectItem>
              <SelectItem value="ipv6">IPv6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(parameter.type === 'array' || parameter.type === 'object') && (
        <div className="mt-4">
          {!parameter.schema || !isSchemaExpanded ? (
            <Button 
              variant="outline"
              size="sm"
              onClick={initSchema} 
              className="w-full bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
            >
              <Plus className="h-3 w-3 mr-1" /> 
              Define {parameter.type === 'array' ? 'Array Items' : 'Object Properties'}
            </Button>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="schema" className="border-gray-700">
                <AccordionTrigger className="py-2 text-sm hover:no-underline">
                  {parameter.type === 'array' ? 'Array Items' : 'Object Properties'}
                </AccordionTrigger>
                <AccordionContent>
                  {parameter.schema && (
                    <SchemaEditor 
                      schema={parameter.schema} 
                      onChange={handleSchemaChange}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
    </div>
  );
};

export default ParameterEditor;
