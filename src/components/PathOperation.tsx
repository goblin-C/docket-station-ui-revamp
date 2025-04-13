
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Lock, Tag, User, Key, AlignJustify, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ResponseEditor from "./ResponseEditor";
import ParameterEditor from "./ParameterEditor";
import SecuritySelector from "./SecuritySelector";
import RequestBodyEditor from "./RequestBodyEditor";
import ExampleEditor from "./ExampleEditor";
import { v4 as uuidv4 } from 'uuid';

// Type definitions (matching those in Paths.tsx)
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'TRACE';
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
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  location?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: Record<string, any>;
  openIdConnectUrl?: string;
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

interface Path {
  id: string;
  path: string;
  operations: Operation[];
}

interface PathOperationProps {
  path: Path;
  operation: Operation;
  securitySchemes: SecurityScheme[];
  onUpdate: (operation: Operation) => void;
  onCancel: () => void;
  open: boolean;
}

const PathOperation: React.FC<PathOperationProps> = ({ 
  path,
  operation, 
  securitySchemes,
  onUpdate, 
  onCancel,
  open
}) => {
  const [activeTab, setActiveTab] = useState<string>("parameters");
  const [editedOperation, setEditedOperation] = useState<Operation>(operation);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedOperation({ ...editedOperation, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditedOperation({ ...editedOperation, operationIdRequired: checked });
  };

  const handleSave = () => {
    onUpdate(editedOperation);
  };

  const handleAddParameter = () => {
    const newParameter: Parameter = {
      id: `param-${uuidv4()}`,
      name: '',
      location: 'query',
      description: '',
      required: false,
      type: 'string',
      format: 'none',
    };

    setEditedOperation({
      ...editedOperation,
      parameters: [...editedOperation.parameters, newParameter]
    });
  };

  const handleUpdateParameter = (updatedParam: Parameter) => {
    setEditedOperation({
      ...editedOperation,
      parameters: editedOperation.parameters.map(param => 
        param.id === updatedParam.id ? updatedParam : param
      )
    });
  };

  const handleDeleteParameter = (paramId: string) => {
    setEditedOperation({
      ...editedOperation,
      parameters: editedOperation.parameters.filter(param => param.id !== paramId)
    });
  };

  const handleAddResponse = () => {
    const newResponse: ResponseObject = {
      id: `resp-${uuidv4()}`,
      statusCode: '200',
      description: 'Successful operation',
    };

    setEditedOperation({
      ...editedOperation,
      responses: [...editedOperation.responses, newResponse]
    });
  };

  const handleUpdateResponse = (updatedResponse: ResponseObject) => {
    setEditedOperation({
      ...editedOperation,
      responses: editedOperation.responses.map(resp => 
        resp.id === updatedResponse.id ? updatedResponse : resp
      )
    });
  };

  const handleDeleteResponse = (responseId: string) => {
    setEditedOperation({
      ...editedOperation,
      responses: editedOperation.responses.filter(resp => resp.id !== responseId)
    });
  };

  const handleAddTag = (tagName: string) => {
    if (!editedOperation.tags.includes(tagName)) {
      setEditedOperation({
        ...editedOperation,
        tags: [...editedOperation.tags, tagName]
      });
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setEditedOperation({
      ...editedOperation,
      tags: editedOperation.tags.filter(tag => tag !== tagName)
    });
  };

  const updateSecurity = (selectedSchemes: SecurityScheme[]) => {
    setEditedOperation({
      ...editedOperation,
      security: selectedSchemes
    });
    setShowSecurityDialog(false);
  };

  const initRequestBody = () => {
    if (!editedOperation.requestBody) {
      setEditedOperation({
        ...editedOperation,
        requestBody: {
          description: '',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: []
              },
              examples: {}
            }
          }
        }
      });
    }
  };

  const handleUpdateRequestBody = (updatedRequestBody: RequestBodyObject) => {
    setEditedOperation({
      ...editedOperation,
      requestBody: updatedRequestBody
    });
  };
  
  const getMethodBadgeColor = (method: HttpMethod) => {
    const colorMap: Record<HttpMethod, string> = {
      GET: 'bg-green-700 hover:bg-green-600',
      POST: 'bg-blue-700 hover:bg-blue-600',
      PUT: 'bg-yellow-700 hover:bg-yellow-600',
      DELETE: 'bg-red-700 hover:bg-red-600',
      PATCH: 'bg-purple-700 hover:bg-purple-600',
      OPTIONS: 'bg-gray-700 hover:bg-gray-600',
      HEAD: 'bg-pink-700 hover:bg-pink-600',
      TRACE: 'bg-indigo-700 hover:bg-indigo-600'
    };
    return colorMap[method] || 'bg-gray-700';
  };

  const hasRequestBody = ['POST', 'PUT', 'PATCH'].includes(editedOperation.method);
  
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-4xl bg-docket-darker text-white border-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge className={`${getMethodBadgeColor(operation.method)} uppercase font-mono text-xs`}>
                {operation.method}
              </Badge>
              <span className="font-bold text-xl">{path.path}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSecurityDialog(true)} className="h-8 w-8 text-gray-400 hover:text-white">
                <Lock className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Summary</label>
              <Input
                name="summary"
                value={editedOperation.summary}
                onChange={handleInputChange}
                className="bg-docket-blue/5 border-gray-700 text-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Operation ID</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Required</span>
                  <Switch
                    checked={editedOperation.operationIdRequired}
                    onCheckedChange={handleSwitchChange}
                    className="data-[state=checked]:bg-docket-blue"
                  />
                </div>
              </div>
              <Input
                name="operationId"
                value={editedOperation.operationId}
                onChange={handleInputChange}
                className="bg-docket-blue/5 border-gray-700 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={editedOperation.description}
              onChange={handleInputChange}
              className="bg-docket-blue/5 border-gray-700 text-sm min-h-[80px]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  className="bg-docket-blue/5 border-gray-700 text-sm h-8 w-40"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleAddTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add tag..."]') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddTag(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedOperation.tags.length === 0 ? (
                <span className="text-xs text-gray-400">No tags assigned</span>
              ) : (
                editedOperation.tags.map(tag => (
                  <Badge key={tag} className="bg-docket-blue/30 hover:bg-docket-blue/40 px-2 py-1 flex items-center gap-1">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-docket-blue/50"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-docket-blue/20 border border-gray-700">
              <TabsTrigger 
                value="parameters" 
                className="data-[state=active]:bg-docket-blue data-[state=active]:text-white"
              >
                Parameters
              </TabsTrigger>
              {hasRequestBody && (
                <TabsTrigger 
                  value="requestBody" 
                  className="data-[state=active]:bg-docket-blue data-[state=active]:text-white"
                >
                  Request Body
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="responses" 
                className="data-[state=active]:bg-docket-blue data-[state=active]:text-white"
              >
                Responses
              </TabsTrigger>
              <TabsTrigger 
                value="examples" 
                className="data-[state=active]:bg-docket-blue data-[state=active]:text-white"
              >
                Examples
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="border border-gray-700 rounded-md mt-4 p-4">
              {editedOperation.parameters.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-3">No parameters defined yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddParameter}
                    className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Parameter
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {editedOperation.parameters.map((param) => (
                    <ParameterEditor 
                      key={param.id} 
                      parameter={param} 
                      onUpdate={handleUpdateParameter}
                      onDelete={() => handleDeleteParameter(param.id)}
                    />
                  ))}
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddParameter}
                      className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Parameter
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {hasRequestBody && (
              <TabsContent value="requestBody" className="border border-gray-700 rounded-md mt-4 p-4">
                {!editedOperation.requestBody ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-3">No request body defined yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={initRequestBody}
                      className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Request Body
                    </Button>
                  </div>
                ) : (
                  <RequestBodyEditor 
                    requestBody={editedOperation.requestBody}
                    onUpdate={handleUpdateRequestBody}
                  />
                )}
              </TabsContent>
            )}
            
            <TabsContent value="responses" className="border border-gray-700 rounded-md mt-4 p-4">
              {editedOperation.responses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-3">No responses defined yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddResponse}
                    className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Response
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {editedOperation.responses.map((response) => (
                    <ResponseEditor 
                      key={response.id} 
                      response={response} 
                      onUpdate={handleUpdateResponse}
                      onDelete={() => handleDeleteResponse(response.id)}
                    />
                  ))}
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddResponse}
                      className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Response
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="examples" className="border border-gray-700 rounded-md mt-4 p-4">
              <ExampleEditor 
                operation={editedOperation}
                onUpdate={(updated) => setEditedOperation(updated)}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel} className="border-gray-700">
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button onClick={handleSave} className="bg-docket-blue hover:bg-docket-blue/80">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </DialogContent>
      
      {/* Security Schemes Dialog */}
      <Dialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
        <DialogContent className="bg-docket-darker text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Security Schemes</DialogTitle>
          </DialogHeader>
          <SecuritySelector 
            securitySchemes={securitySchemes}
            selectedSchemes={editedOperation.security}
            onChange={updateSecurity}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PathOperation;
