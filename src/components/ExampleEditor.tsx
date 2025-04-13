
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Type definitions
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'TRACE';
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
  location: string;
  description: string;
  required: boolean;
  type: DataType;
  format: DataFormat;
  schema?: SchemaObject;
}

interface ResponseObject {
  id: string;
  statusCode: string;
  description: string;
  schema?: SchemaObject;
  examples?: Record<string, any>;
}

interface RequestBodyObject {
  description: string;
  required: boolean;
  content: Record<string, {
    schema?: SchemaObject;
    examples?: Record<string, any>;
  }>;
}

interface SecurityScheme {
  id: string;
  name: string;
  type: string;
}

interface Operation {
  id: string;
  method: HttpMethod;
  summary: string;
  description: string;
  operationId: string;
  operationIdRequired: boolean;
  tags: string[];
  parameters: Parameter[];
  requestBody?: RequestBodyObject;
  responses: ResponseObject[];
  security: SecurityScheme[];
}

interface ExampleEditorProps {
  operation: Operation;
  onUpdate: (operation: Operation) => void;
}

interface Example {
  id: string;
  name: string;
  value: string;
  description?: string;
}

const ExampleEditor: React.FC<ExampleEditorProps> = ({ operation, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [requestExamples, setRequestExamples] = useState<Example[]>([]);
  const [responseExamples, setResponseExamples] = useState<Example[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<string>(
    operation.responses.length > 0 ? operation.responses[0].id : ''
  );
  const [selectedContentType, setSelectedContentType] = useState<string>(
    operation.requestBody && Object.keys(operation.requestBody.content).length > 0 
      ? Object.keys(operation.requestBody.content)[0] 
      : 'application/json'
  );

  // Initialize examples from operation data
  useEffect(() => {
    // Set up request examples
    if (operation.requestBody?.content[selectedContentType]?.examples) {
      const examples = Object.entries(operation.requestBody.content[selectedContentType].examples || {})
        .map(([name, example]: [string, any]) => ({
          id: uuidv4(),
          name,
          value: typeof example === 'object' ? JSON.stringify(example, null, 2) : String(example),
          description: example.description || ''
        }));
      setRequestExamples(examples);
    }

    // Set up response examples
    const selectedResp = operation.responses.find(r => r.id === selectedResponse);
    if (selectedResp?.examples) {
      const examples = Object.entries(selectedResp.examples || {})
        .map(([name, example]: [string, any]) => ({
          id: uuidv4(),
          name,
          value: typeof example === 'object' ? JSON.stringify(example, null, 2) : String(example),
          description: example.description || ''
        }));
      setResponseExamples(examples);
    }
  }, [operation, selectedResponse, selectedContentType]);

  const addRequestExample = () => {
    const newExample: Example = {
      id: uuidv4(),
      name: `Example ${requestExamples.length + 1}`,
      value: '{\n  "property": "value"\n}',
      description: 'Example description'
    };
    setRequestExamples([...requestExamples, newExample]);
    
    // Update operation
    if (operation.requestBody) {
      const updatedRequestBody = {
        ...operation.requestBody,
        content: {
          ...operation.requestBody.content,
          [selectedContentType]: {
            ...operation.requestBody.content[selectedContentType],
            examples: {
              ...operation.requestBody.content[selectedContentType].examples,
              [newExample.name]: {
                value: tryParseJson(newExample.value),
                description: newExample.description
              }
            }
          }
        }
      };
      
      onUpdate({
        ...operation,
        requestBody: updatedRequestBody
      });
    }
  };

  const addResponseExample = () => {
    const newExample: Example = {
      id: uuidv4(),
      name: `Example ${responseExamples.length + 1}`,
      value: '{\n  "property": "value"\n}',
      description: 'Example description'
    };
    setResponseExamples([...responseExamples, newExample]);
    
    // Update operation
    const updatedResponses = operation.responses.map(response => {
      if (response.id === selectedResponse) {
        return {
          ...response,
          examples: {
            ...response.examples,
            [newExample.name]: {
              value: tryParseJson(newExample.value),
              description: newExample.description
            }
          }
        };
      }
      return response;
    });
    
    onUpdate({
      ...operation,
      responses: updatedResponses
    });
  };

  const updateRequestExample = (exampleId: string, field: keyof Example, value: string) => {
    const updatedExamples = requestExamples.map(example => 
      example.id === exampleId ? { ...example, [field]: value } : example
    );
    setRequestExamples(updatedExamples);
    
    // Update operation
    if (operation.requestBody) {
      const updatedExample = updatedExamples.find(ex => ex.id === exampleId)!;
      const updatedRequestBody = {
        ...operation.requestBody,
        content: {
          ...operation.requestBody.content,
          [selectedContentType]: {
            ...operation.requestBody.content[selectedContentType],
            examples: {
              ...operation.requestBody.content[selectedContentType].examples,
              [updatedExample.name]: {
                value: tryParseJson(updatedExample.value),
                description: updatedExample.description
              }
            }
          }
        }
      };
      
      onUpdate({
        ...operation,
        requestBody: updatedRequestBody
      });
    }
  };

  const updateResponseExample = (exampleId: string, field: keyof Example, value: string) => {
    const updatedExamples = responseExamples.map(example => 
      example.id === exampleId ? { ...example, [field]: value } : example
    );
    setResponseExamples(updatedExamples);
    
    // Update operation
    const updatedExample = updatedExamples.find(ex => ex.id === exampleId)!;
    const updatedResponses = operation.responses.map(response => {
      if (response.id === selectedResponse) {
        return {
          ...response,
          examples: {
            ...response.examples,
            [updatedExample.name]: {
              value: tryParseJson(updatedExample.value),
              description: updatedExample.description
            }
          }
        };
      }
      return response;
    });
    
    onUpdate({
      ...operation,
      responses: updatedResponses
    });
  };

  const deleteRequestExample = (exampleId: string) => {
    const exampleToDelete = requestExamples.find(ex => ex.id === exampleId);
    if (!exampleToDelete) return;
    
    setRequestExamples(requestExamples.filter(ex => ex.id !== exampleId));
    
    // Update operation
    if (operation.requestBody && operation.requestBody.content[selectedContentType].examples) {
      const exampleName = exampleToDelete.name;
      const updatedExamples = { ...operation.requestBody.content[selectedContentType].examples };
      delete updatedExamples[exampleName];
      
      const updatedRequestBody = {
        ...operation.requestBody,
        content: {
          ...operation.requestBody.content,
          [selectedContentType]: {
            ...operation.requestBody.content[selectedContentType],
            examples: updatedExamples
          }
        }
      };
      
      onUpdate({
        ...operation,
        requestBody: updatedRequestBody
      });
    }
  };

  const deleteResponseExample = (exampleId: string) => {
    const exampleToDelete = responseExamples.find(ex => ex.id === exampleId);
    if (!exampleToDelete) return;
    
    setResponseExamples(responseExamples.filter(ex => ex.id !== exampleId));
    
    // Update operation
    const updatedResponses = operation.responses.map(response => {
      if (response.id === selectedResponse && response.examples) {
        const exampleName = exampleToDelete.name;
        const updatedExamples = { ...response.examples };
        delete updatedExamples[exampleName];
        
        return {
          ...response,
          examples: updatedExamples
        };
      }
      return response;
    });
    
    onUpdate({
      ...operation,
      responses: updatedResponses
    });
  };

  const tryParseJson = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'request' | 'response')}>
        <TabsList className="bg-docket-blue/10 h-9 p-1 w-full">
          <TabsTrigger 
            value="request" 
            className="flex-1 data-[state=active]:bg-docket-blue data-[state=active]:text-white"
            disabled={!operation.requestBody}
          >
            Request Examples
          </TabsTrigger>
          <TabsTrigger 
            value="response" 
            className="flex-1 data-[state=active]:bg-docket-blue data-[state=active]:text-white"
          >
            Response Examples
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="request" className="mt-4">
          {!operation.requestBody ? (
            <div className="text-center py-6">
              <p className="text-gray-400">Request body must be defined to add examples</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                  <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="bg-docket-darker border-gray-700">
                    {Object.keys(operation.requestBody.content).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {requestExamples.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-3">No examples defined yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addRequestExample}
                    className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Example
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {requestExamples.map(example => (
                    <div key={example.id} className="bg-docket-blue/5 border border-gray-700 rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <Input
                            value={example.name}
                            onChange={(e) => updateRequestExample(example.id, 'name', e.target.value)}
                            placeholder="Example name"
                            className="bg-docket-blue/10 border-gray-700 text-sm font-medium"
                          />
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              navigator.clipboard.writeText(example.value);
                              toast.success("Example copied to clipboard");
                            }}
                            className="h-8 w-8 text-gray-400 hover:text-white"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteRequestExample(example.id)} 
                            className="h-8 w-8 text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Input
                          value={example.description || ''}
                          onChange={(e) => updateRequestExample(example.id, 'description', e.target.value)}
                          placeholder="Example description"
                          className="bg-docket-blue/10 border-gray-700 text-sm"
                        />
                      </div>
                      
                      <Textarea
                        value={example.value}
                        onChange={(e) => updateRequestExample(example.id, 'value', e.target.value)}
                        placeholder="Example value (JSON)"
                        className="bg-docket-blue/10 border-gray-700 text-sm font-mono min-h-[150px]"
                      />
                    </div>
                  ))}
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addRequestExample}
                      className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Example
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="response" className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Response</label>
            <Select 
              value={selectedResponse} 
              onValueChange={setSelectedResponse}
              disabled={operation.responses.length === 0}
            >
              <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-sm">
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent className="bg-docket-darker border-gray-700">
                {operation.responses.map(response => (
                  <SelectItem key={response.id} value={response.id}>
                    {response.statusCode} - {response.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {operation.responses.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400">No responses defined yet</p>
            </div>
          ) : responseExamples.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-3">No examples defined yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addResponseExample}
                className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Example
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {responseExamples.map(example => (
                <div key={example.id} className="bg-docket-blue/5 border border-gray-700 rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Input
                        value={example.name}
                        onChange={(e) => updateResponseExample(example.id, 'name', e.target.value)}
                        placeholder="Example name"
                        className="bg-docket-blue/10 border-gray-700 text-sm font-medium"
                      />
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          navigator.clipboard.writeText(example.value);
                          toast.success("Example copied to clipboard");
                        }}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteResponseExample(example.id)} 
                        className="h-8 w-8 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Input
                      value={example.description || ''}
                      onChange={(e) => updateResponseExample(example.id, 'description', e.target.value)}
                      placeholder="Example description"
                      className="bg-docket-blue/10 border-gray-700 text-sm"
                    />
                  </div>
                  
                  <Textarea
                    value={example.value}
                    onChange={(e) => updateResponseExample(example.id, 'value', e.target.value)}
                    placeholder="Example value (JSON)"
                    className="bg-docket-blue/10 border-gray-700 text-sm font-mono min-h-[150px]"
                  />
                </div>
              ))}
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addResponseExample}
                  className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Example
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExampleEditor;
