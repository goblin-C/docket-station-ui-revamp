import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Edit, Copy, Key, Lock, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PathOperation from "./PathOperation";
import PathForm from "./PathForm";
import { toast } from "sonner";

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
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
    setCurrentPath(null);
    setIsEditMode(false);
    setShowPathForm(true);
  };

  const handleEditPath = (path: Path) => {
    setCurrentPath(path);
    setIsEditMode(true);
    setShowPathForm(true);
  };

  const handleDeletePath = (pathId: string) => {
    setPaths(paths.filter(p => p.id !== pathId));
    toast.success("Path deleted successfully");
  };

  const handleSavePath = (path: Path) => {
    if (isEditMode) {
      setPaths(paths.map(p => p.id === path.id ? path : p));
      toast.success("Path updated successfully");
    } else {
      setPaths([...paths, path]);
      toast.success("Path added successfully");
    }
    setShowPathForm(false);
  };

  return (
    <div className="bg-docket-darker rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Paths</h2>
        <Button variant="outline" onClick={handleAddPath} className="flex items-center gap-1.5 bg-docket-blue border-docket-blue hover:bg-docket-blue/80">
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
                  <Button variant="ghost" size="icon" onClick={() => handleEditPath(path)} className="h-8 w-8 text-gray-400 hover:text-white">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePath(path.id)} className="h-8 w-8 text-gray-400 hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="px-1 py-1 bg-docket-blue/5">
                {path.operations.map(operation => (
                  <PathOperation 
                    key={operation.id} 
                    operation={operation} 
                    securitySchemes={availableSecuritySchemes}
                    onUpdate={(updatedOperation) => {
                      const updatedPath = {
                        ...path,
                        operations: path.operations.map(op => 
                          op.id === updatedOperation.id ? updatedOperation : op
                        )
                      };
                      setPaths(paths.map(p => p.id === path.id ? updatedPath : p));
                    }}
                    onDelete={() => {
                      const updatedOperations = path.operations.filter(op => op.id !== operation.id);
                      const updatedPath = { ...path, operations: updatedOperations };
                      setPaths(paths.map(p => p.id === path.id ? updatedPath : p));
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPathForm && (
        <Dialog open={showPathForm} onOpenChange={setShowPathForm}>
          <DialogContent className="sm:max-w-4xl bg-docket-darker text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Path' : 'Add New Path'}</DialogTitle>
            </DialogHeader>
            <PathForm 
              path={currentPath} 
              securitySchemes={availableSecuritySchemes}
              onSave={handleSavePath} 
              onCancel={() => setShowPathForm(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Paths;
