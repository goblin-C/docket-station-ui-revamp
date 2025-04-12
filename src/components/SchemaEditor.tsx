import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

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

interface SchemaEditorProps {
  schema: SchemaObject;
  onChange: (schema: SchemaObject) => void;
  depth?: number;
  isArrayItem?: boolean;
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({ 
  schema, 
  onChange, 
  depth = 0,
  isArrayItem = false
}) => {
  const maxDepth = 5; // Prevent excessive nesting
  
  const handleTypeChange = (type: DataType) => {
    // Reset properties when changing types
    const updatedSchema: SchemaObject = { 
      ...schema, 
      type,
      properties: type === 'object' ? (schema.properties || []) : undefined,
      items: type === 'array' ? (schema.items || { type: 'string', format: 'none' }) : undefined
    };
    onChange(updatedSchema);
  };

  const handleFormatChange = (format: DataFormat) => {
    onChange({ ...schema, format });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...schema, description: e.target.value });
  };

  const handleAddProperty = () => {
    if (schema.type !== 'object' || !schema.properties) return;
    
    const newProp: SchemaProperty = {
      name: `property${schema.properties.length + 1}`,
      type: 'string',
      format: 'none',
      description: '',
      required: false
    };
    
    onChange({
      ...schema,
      properties: [...schema.properties, newProp]
    });
  };

  const handleUpdateProperty = (index: number, updatedProp: SchemaProperty) => {
    if (schema.type !== 'object' || !schema.properties) return;
    
    const updatedProperties = [...schema.properties];
    updatedProperties[index] = updatedProp;
    
    onChange({
      ...schema,
      properties: updatedProperties
    });
  };

  const handleDeleteProperty = (index: number) => {
    if (schema.type !== 'object' || !schema.properties) return;
    
    onChange({
      ...schema,
      properties: schema.properties.filter((_, i) => i !== index)
    });
  };

  const handleUpdateArrayItems = (updatedItems: SchemaObject) => {
    if (schema.type !== 'array') return;
    
    onChange({
      ...schema,
      items: updatedItems
    });
  };

  return (
    <div className={`p-3 ${depth > 0 ? 'bg-docket-blue/10 rounded border border-gray-700/50' : ''}`}>
      {!isArrayItem && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <Select value={schema.type} onValueChange={(value) => handleTypeChange(value as DataType)}>
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
          {schema.type !== 'object' && schema.type !== 'array' && (
            <div>
              <label className="block text-xs font-medium mb-1">Format</label>
              <Select 
                value={schema.format || 'none'} 
                onValueChange={(value) => handleFormatChange(value as DataFormat)}
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
          )}
        </div>
      )}

      <div className="mb-3">
        <label className="block text-xs font-medium mb-1">Description</label>
        <Textarea
          value={schema.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Schema description"
          className="bg-docket-blue/5 border-gray-700 text-sm min-h-[60px]"
        />
      </div>

      {schema.type === 'array' && schema.items && depth < maxDepth && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <ChevronRight className="h-4 w-4 mr-1 text-docket-blue" />
            <h5 className="text-sm font-medium">Array Items</h5>
          </div>
          <div className="pl-4 border-l-2 border-docket-blue/30">
            <SchemaEditor 
              schema={schema.items} 
              onChange={handleUpdateArrayItems} 
              depth={depth + 1}
              isArrayItem={true}
            />
          </div>
        </div>
      )}

      {schema.type === 'object' && depth < maxDepth && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="text-sm font-medium">Properties</h5>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddProperty}
              className="h-7 bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Property
            </Button>
          </div>
          
          {schema.properties && schema.properties.length > 0 ? (
            <div className="space-y-4">
              {schema.properties.map((prop, index) => (
                <PropertyEditor 
                  key={`${prop.name}-${index}`}
                  property={prop}
                  onChange={(updatedProp) => handleUpdateProperty(index, updatedProp)}
                  onDelete={() => handleDeleteProperty(index)}
                  depth={depth + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-3 bg-docket-blue/5 rounded border border-gray-700/50">
              <p className="text-xs text-gray-400">No properties defined</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PropertyEditorProps {
  property: SchemaProperty;
  onChange: (property: SchemaProperty) => void;
  onDelete: () => void;
  depth: number;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({ 
  property, 
  onChange, 
  onDelete,
  depth
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...property, name: e.target.value });
  };

  const handleTypeChange = (type: DataType) => {
    // Reset nested properties when changing types
    const updatedProperty: SchemaProperty = { 
      ...property, 
      type,
      properties: type === 'object' ? (property.properties || []) : undefined,
      items: type === 'array' ? (property.items || { type: 'string', format: 'none' }) : undefined
    };
    onChange(updatedProperty);
  };

  const handleFormatChange = (format: DataFormat) => {
    onChange({ ...property, format });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...property, description: e.target.value });
  };

  const handleRequiredChange = (required: boolean) => {
    onChange({ ...property, required });
  };

  const handleItemsChange = (items: SchemaObject) => {
    if (property.type !== 'array') return;
    onChange({ ...property, items });
  };

  const handlePropertiesChange = (schema: SchemaObject) => {
    if (property.type !== 'object' || !schema.properties) return;
    onChange({ ...property, properties: schema.properties });
  };

  return (
    <div className="bg-docket-blue/5 border border-gray-700/70 rounded p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-grow">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 hover:bg-docket-blue/20"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <Input
            value={property.name}
            onChange={handleNameChange}
            placeholder="Property name"
            className="h-7 text-xs bg-docket-blue/10 border-gray-700/50 flex-grow"
          />
          <Select 
            value={property.type} 
            onValueChange={(value) => handleTypeChange(value as DataType)}
          >
            <SelectTrigger className="h-7 text-xs bg-docket-blue/10 border-gray-700/50 w-24">
              <SelectValue placeholder="Type" />
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
          <div className="flex items-center gap-1">
            <Switch
              checked={property.required || false}
              onCheckedChange={handleRequiredChange}
              className="data-[state=checked]:bg-docket-blue h-4 w-8"
            />
            <span className="text-xs">Req</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete} 
          className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-transparent ml-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-3 pl-6">
          {property.type !== 'array' && property.type !== 'object' && (
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Format</label>
              <Select 
                value={property.format || 'none'} 
                onValueChange={(value) => handleFormatChange(value as DataFormat)}
              >
                <SelectTrigger className="bg-docket-blue/5 border-gray-700 text-xs h-7">
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
          )}

          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Description</label>
            <Textarea
              value={property.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Property description"
              className="bg-docket-blue/5 border-gray-700 text-xs min-h-[50px]"
            />
          </div>

          {property.type === 'array' && property.items && (
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <h6 className="text-xs font-medium">Array Items</h6>
              </div>
              <SchemaEditor 
                schema={property.items} 
                onChange={handleItemsChange} 
                depth={depth + 1}
                isArrayItem={true}
              />
            </div>
          )}

          {property.type === 'object' && (
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <h6 className="text-xs font-medium">Object Properties</h6>
              </div>
              <SchemaEditor 
                schema={{
                  type: 'object',
                  properties: property.properties || [],
                }} 
                onChange={handlePropertiesChange} 
                depth={depth + 1}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemaEditor;
