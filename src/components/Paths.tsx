
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Edit, Copy, Key, Lock, Tag, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PathOperation from "./PathOperation";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Type definitions
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'TRACE';
type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';
type DataType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
type DataFormat = 'none' | 'date' | 'date-time' | 'password' | 'byte' | 'binary' | 'email' | 'uuid' | 'uri' | 'hostname' | 'ipv4' | 'ipv6';

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

interface PathsProps {
  securitySchemes?: Record<string, any>;
}

const Paths: React.FC<PathsProps> = ({ securitySchemes = {} }) => {
  const [paths, setPaths] = useState<Path[]>([]);
  const [showPathForm, setShowPathForm] = useState(false);
  const [editPath, setEditPath] = useState<{ pathId: string; operationId?: string } | null>(null);
  const [newPathInput, setNewPathInput] = useState('/new-path');
  const [operations, setOperations] = useState<{ method: HttpMethod; summary: string }[]>([
    { method: 'GET', summary: 'Get resource' }
  ]);

  // Convert security schemes from OpenAPI format to component format
  const [availableSecuritySchemes, setAvailableSecuritySchemes] = useState<SecurityScheme[]>(
    Object.entries(securitySchemes).map(([name, scheme]: [string, any]) => ({
      id: name,
      name,
      type: scheme.type,
      location: scheme.in,
      scheme: scheme.scheme,
      bearerFormat: scheme.bearerFormat,
      flows: scheme.flows,
      openIdConnectUrl: scheme.openIdConnectUrl
    }))
  );

  const handleAddPath = () => {
    setShowPathForm(true);
    setNewPathInput('/new-path');
    setOperations([{ method: 'GET', summary: 'Get resource' }]);
  };

  const handleAddOperation = () => {
    setOperations([...operations, { method: 'GET', summary: 'New operation' }]);
  };

  const handleOperationMethodChange = (index: number, method: HttpMethod) => {
    const newOperations = [...operations];
    newOperations[index].method = method;
    setOperations(newOperations);
  };

  const handleOperationSummaryChange = (index: number, summary: string) => {
    const newOperations = [...operations];
    newOperations[index].summary = summary;
    setOperations(newOperations);
  };

  const handleDeleteOperation = (index: number) => {
    setOperations(operations.filter((_, i) => i !== index));
  };

  const handleSavePath = () => {
    const newPath: Path = {
      id: uuidv4(),
      path: newPathInput,
      operations: operations.map(op => ({
        id: uuidv4(),
        method: op.method,
        summary: op.summary,
        description: '',
        operationId: generateOperationId(op.method, newPathInput),
        operationIdRequired: true,
        tags: [],
        parameters: [],
        responses: [{
          id: uuidv4(),
          statusCode: '200',
          description: 'Successful operation',
          schema: undefined
        }],
        security: []
      }))
    };

    setPaths([...paths, newPath]);
    setShowPathForm(false);
    toast.success("Path added successfully");
  };

  const generateOperationId = (method: string, path: string): string => {
    // Transform '/pets/{petId}' to 'getPetsByPetId' or similar
    const cleanPath = path.replace(/^\//, '').replace(/\/$/, '');
    const parts = cleanPath.split('/').map(part => {
      if (part.startsWith('{') && part.endsWith('}')) {
        // Parameter part - convert {petId} to ByPetId
        return 'By' + part.substring(1, part.length - 1).charAt(0).toUpperCase() + 
               part.substring(1, part.length - 1).slice(1);
      } else {
        // Regular path part - capitalize
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
    });

    // Join and create camelCase
    const resource = parts.join('');
    return method.toLowerCase() + (resource.charAt(0).toUpperCase() + resource.slice(1));
  };

  const handleDeletePath = (pathId: string) => {
    setPaths(paths.filter(p => p.id !== pathId));
    toast.success("Path deleted successfully");
  };

  const handleEditOperation = (pathId: string, operationId: string) => {
    setEditPath({ pathId, operationId });
  };

  const getMethodBadgeColor = (method: HttpMethod) => {
    const colorMap: Record<HttpMethod, string> = {
      GET: 'bg-green-700',
      POST: 'bg-blue-700',
      PUT: 'bg-yellow-700',
      DELETE: 'bg-red-700',
      PATCH: 'bg-purple-700',
      OPTIONS: 'bg-gray-700',
      HEAD: 'bg-pink-700',
      TRACE: 'bg-indigo-700'
    };
    return colorMap[method] || 'bg-gray-700';
  };

  const handleOperationUpdate = (pathId: string, updatedOperation: Operation) => {
    setPaths(paths.map(path => {
      if (path.id === pathId) {
        return {
          ...path,
          operations: path.operations.map(op => 
            op.id === updatedOperation.id ? updatedOperation : op
          )
        };
      }
      return path;
    }));
    setEditPath(null);
    toast.success("Operation updated");
  };

  return (
    <div className="bg-docket-darker rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Paths</h2>
        <Button onClick={handleAddPath} className="flex items-center gap-1.5 bg-docket-blue border-docket-blue hover:bg-docket-blue/80">
          <PlusCircle className="h-4 w-4" />
          Add Path
        </Button>
      </div>

      {paths.length === 0 ? (
        <div className="text-center py-10 bg-docket-darker/70 rounded-lg border border-gray-800">
          <p className="text-gray-400">No paths defined yet. Click 'Add Path' to create your first API path.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paths.map(path => (
            <div key={path.id} className="bg-docket-blue/10 rounded-lg border border-gray-800 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-docket-blue/20">
                <h3 className="font-mono text-md font-semibold">{path.path}</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePath(path.id)} className="h-8 w-8 text-gray-400 hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="px-1 py-1 bg-docket-blue/5">
                {path.operations.map(operation => (
                  <div 
                    key={operation.id} 
                    className="flex justify-between items-center px-3 py-2 hover:bg-docket-blue/20 rounded-md cursor-pointer"
                    onClick={() => handleEditOperation(path.id, operation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${getMethodBadgeColor(operation.method)} uppercase font-mono text-xs px-2 py-1 rounded text-white`}>
                        {operation.method}
                      </span>
                      <span className="font-semibold">{operation.summary || 'Operation'}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Path Dialog */}
      <Dialog open={showPathForm} onOpenChange={setShowPathForm}>
        <DialogContent className="sm:max-w-2xl bg-docket-darker text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Path</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Path</label>
              <Input
                value={newPathInput}
                onChange={(e) => setNewPathInput(e.target.value)}
                placeholder="/api/resource"
                className="bg-docket-blue/5 border-gray-700"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Operations</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddOperation}
                  className="bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Method
                </Button>
              </div>

              <div className="space-y-3">
                {operations.map((operation, index) => (
                  <div 
                    key={index} 
                    className="bg-docket-blue/5 border border-gray-700 rounded-md p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Select 
                          value={operation.method} 
                          onValueChange={(value) => handleOperationMethodChange(index, value as HttpMethod)}
                        >
                          <SelectTrigger className="bg-docket-blue/10 border-gray-700 text-sm w-24">
                            <SelectValue placeholder="Method" />
                          </SelectTrigger>
                          <SelectContent className="bg-docket-darker border-gray-700">
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                            <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                            <SelectItem value="HEAD">HEAD</SelectItem>
                            <SelectItem value="TRACE">TRACE</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={operation.summary}
                          onChange={(e) => handleOperationSummaryChange(index, e.target.value)}
                          placeholder="Operation summary"
                          className="bg-docket-blue/10 border-gray-700 text-sm"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteOperation(index)} 
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPathForm(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button onClick={handleSavePath} className="bg-docket-blue hover:bg-docket-blue/80">
                Save Path
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Operation Dialog */}
      {editPath && paths.map(path => 
        path.id === editPath.pathId && path.operations.map(operation => 
          operation.id === editPath.operationId && (
            <PathOperation 
              key={operation.id}
              path={path}
              operation={operation}
              securitySchemes={availableSecuritySchemes}
              onUpdate={(updatedOperation) => handleOperationUpdate(path.id, updatedOperation)}
              onCancel={() => setEditPath(null)}
              open={true}
            />
          )
        )
      )}
    </div>
  );
};

export default Paths;
