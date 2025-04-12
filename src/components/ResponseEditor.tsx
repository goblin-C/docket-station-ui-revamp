
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
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

interface ResponseObject {
  id: string;
  statusCode: string;
  description: string;
  schema?: SchemaObject;
}

interface ResponseEditorProps {
  response: ResponseObject;
  onUpdate: (response: ResponseObject) => void;
  onDelete: () => void;
}

const statusCodes = [
  { code: '200', desc: 'OK - Successful response' },
  { code: '201', desc: 'Created - Resource created' },
  { code: '204', desc: 'No Content - Successful but no content' },
  { code: '400', desc: 'Bad Request - Invalid request' },
  { code: '401', desc: 'Unauthorized - Authentication required' },
  { code: '403', desc: 'Forbidden - Not authorized' },
  { code: '404', desc: 'Not Found - Resource not found' },
  { code: '409', desc: 'Conflict - Resource conflict' },
  { code: '422', desc: 'Unprocessable Entity - Validation failed' },
  { code: '500', desc: 'Internal Server Error - Server error' },
];

const ResponseEditor: React.FC<ResponseEditorProps> = ({ 
  response, 
  onUpdate, 
  onDelete 
}) => {
  const [isSchemaExpanded, setIsSchemaExpanded] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ ...response, [name]: value });
  };

  const handleStatusCodeChange = (statusCode: string) => {
    const selectedStatus = statusCodes.find(s => s.code === statusCode);
    onUpdate({ 
      ...response, 
      statusCode,
      description: selectedStatus ? selectedStatus.desc.split(' - ')[1] : response.description
    });
  };

  const handleSchemaChange = (schema: SchemaObject) => {
    onUpdate({ ...response, schema });
  };

  const initSchema = () => {
    if (!response.schema) {
      onUpdate({
        ...response,
        schema: {
          type: 'object',
          description: 'Response schema',
          properties: []
        }
      });
    }
    setIsSchemaExpanded(true);
  };

  return (
    <div className="bg-docket-blue/5 border border-gray-700 rounded-md p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-semibold">Response {response.statusCode}</h4>
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
          <label className="block text-xs font-medium mb-1">Status Code</label>
          <Select 
            value={response.statusCode} 
            onValueChange={handleStatusCodeChange}
          >
            <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm">
              <SelectValue placeholder="Select status code" />
            </SelectTrigger>
            <SelectContent className="bg-docket-darker border-gray-700 max-h-[200px]">
              {statusCodes.map(status => (
                <SelectItem key={status.code} value={status.code}>
                  {status.code} - {status.desc.split(' - ')[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Custom Status Code</label>
          <Input
            name="statusCode"
            value={response.statusCode}
            onChange={handleInputChange}
            placeholder="e.g., 200, 404"
            className="bg-docket-blue/5 border-gray-700 text-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={response.description}
          onChange={handleInputChange}
          placeholder="Response description"
          className="bg-docket-blue/5 border-gray-700 text-sm min-h-[80px]"
        />
      </div>

      <div className="mt-4">
        {!response.schema || !isSchemaExpanded ? (
          <Button 
            variant="outline"
            size="sm"
            onClick={initSchema} 
            className="w-full bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
          >
            <Plus className="h-3 w-3 mr-1" /> 
            Define Response Schema
          </Button>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="schema" className="border-gray-700">
              <AccordionTrigger className="py-2 text-sm hover:no-underline">
                Response Schema
              </AccordionTrigger>
              <AccordionContent>
                {response.schema && (
                  <SchemaEditor 
                    schema={response.schema} 
                    onChange={handleSchemaChange}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default ResponseEditor;
