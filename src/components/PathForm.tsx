
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// Types
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
  responses: ResponseObject[];
  security: SecurityScheme[];
}

interface Path {
  id: string;
  path: string;
  operations: Operation[];
}

interface PathFormProps {
  path?: Path | null;
  securitySchemes: SecurityScheme[];
  onSave: (path: Path) => void;
  onCancel: () => void;
}

const PathForm: React.FC<PathFormProps> = ({ 
  path, 
  securitySchemes,
  onSave, 
  onCancel 
}) => {
  const [formPath, setFormPath] = useState<Path>(
    path || {
      id: uuidv4(),
      path: '/new-path',
      operations: [{
        id: uuidv4(),
        method: 'GET',
        summary: 'Get resource',
        description: 'Get a resource',
        operationId: 'getResource',
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
      }]
    }
  );

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPath({ ...formPath, path: e.target.value });
  };

  const handleAddOperation = () => {
    const newOperation: Operation = {
      id: uuidv4(),
      method: 'GET',
      summary: 'New operation',
      description: '',
      operationId: `operation${formPath.operations.length + 1}`,
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
    };

    setFormPath({
      ...formPath,
      operations: [...formPath.operations, newOperation]
    });
  };

  const handleDeleteOperation = (operationId: string) => {
    setFormPath({
      ...formPath,
      operations: formPath.operations.filter(op => op.id !== operationId)
    });
  };

  const handleOperationMethodChange = (operationId: string, method: HttpMethod) => {
    setFormPath({
      ...formPath,
      operations: formPath.operations.map(op => {
        if (op.id === operationId) {
          return { ...op, method };
        }
        return op;
      })
    });
  };

  const handleOperationSummaryChange = (operationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPath({
      ...formPath,
      operations: formPath.operations.map(op => {
        if (op.id === operationId) {
          return { ...op, summary: e.target.value };
        }
        return op;
      })
    });
  };

  const handleSaveForm = () => {
    onSave(formPath);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Path</label>
        <Input
          value={formPath.path}
          onChange={handlePathChange}
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
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Add Operation
          </Button>
        </div>

        <div className="space-y-3">
          {formPath.operations.map(operation => (
            <div 
              key={operation.id} 
              className="bg-docket-blue/5 border border-gray-700 rounded-md p-3"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Select 
                    value={operation.method} 
                    onValueChange={(value) => handleOperationMethodChange(operation.id, value as HttpMethod)}
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
                    onChange={(e) => handleOperationSummaryChange(operation.id, e)}
                    placeholder="Operation summary"
                    className="bg-docket-blue/10 border-gray-700 text-sm"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteOperation(operation.id)} 
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
        <Button variant="outline" onClick={onCancel} className="border-gray-700">
          Cancel
        </Button>
        <Button onClick={handleSaveForm} className="bg-docket-blue hover:bg-docket-blue/80">
          Save Path
        </Button>
      </div>
    </div>
  );
};

export default PathForm;
