
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Lock, Key, User, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Types
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

interface SecuritySelectorProps {
  securitySchemes: SecurityScheme[];
  selectedSchemes: SecurityScheme[];
  onChange: (schemes: SecurityScheme[]) => void;
}

const SecuritySelector: React.FC<SecuritySelectorProps> = ({
  securitySchemes,
  selectedSchemes,
  onChange
}) => {
  // Convert selected schemes to a Set of IDs for easy checking
  const selectedIds = new Set(selectedSchemes.map(scheme => scheme.id));

  const handleToggleScheme = (scheme: SecurityScheme) => {
    if (selectedIds.has(scheme.id)) {
      // Remove the scheme
      onChange(selectedSchemes.filter(s => s.id !== scheme.id));
    } else {
      // Add the scheme
      onChange([...selectedSchemes, scheme]);
    }
  };

  const getSchemeIcon = (scheme: SecurityScheme) => {
    switch (scheme.type) {
      case 'http':
        return <Lock className="h-4 w-4" />;
      case 'apiKey':
        return <Key className="h-4 w-4" />;
      case 'oauth2':
        return <User className="h-4 w-4" />;
      case 'openIdConnect':
        return <Globe className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const getSchemeTypeName = (scheme: SecurityScheme) => {
    const typeNames = {
      'http': 'HTTP Auth',
      'apiKey': 'API Key',
      'oauth2': 'OAuth 2.0',
      'openIdConnect': 'OpenID Connect'
    };
    return typeNames[scheme.type] || scheme.type;
  };

  const getSchemeDescription = (scheme: SecurityScheme) => {
    if (scheme.type === 'http' && scheme.scheme === 'bearer') {
      return `Bearer ${scheme.bearerFormat || ''}`;
    }
    if (scheme.type === 'apiKey' && scheme.location) {
      return `${scheme.location} parameter`;
    }
    return getSchemeTypeName(scheme);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSchemes.length === 0 ? (
          <span className="text-xs text-gray-400">No security schemes selected</span>
        ) : (
          selectedSchemes.map(scheme => (
            <Badge 
              key={scheme.id} 
              className="bg-docket-blue/30 hover:bg-docket-blue/40 px-2 py-1 flex items-center gap-1"
            >
              {getSchemeIcon(scheme)}
              {scheme.name}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full hover:bg-docket-blue/50"
                onClick={() => handleToggleScheme(scheme)}
              >
                <Trash2 className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          ))
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-docket-blue/10 border-gray-700 hover:bg-docket-blue/20"
          >
            <Lock className="h-3 w-3 mr-1" /> Select Security Schemes
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-docket-darker text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Security Schemes</DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto pr-2">
            {securitySchemes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">No security schemes defined</p>
              </div>
            ) : (
              <div className="space-y-2">
                {securitySchemes.map(scheme => (
                  <div 
                    key={scheme.id} 
                    className="flex items-center gap-3 p-3 bg-docket-blue/5 rounded border border-gray-700 hover:bg-docket-blue/10"
                  >
                    <Checkbox 
                      id={`scheme-${scheme.id}`}
                      checked={selectedIds.has(scheme.id)}
                      onCheckedChange={() => handleToggleScheme(scheme)}
                      className="data-[state=checked]:bg-docket-blue"
                    />
                    <div className="flex items-center gap-2">
                      {getSchemeIcon(scheme)}
                      <label 
                        htmlFor={`scheme-${scheme.id}`} 
                        className="text-sm font-medium cursor-pointer"
                      >
                        {scheme.name}
                      </label>
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">
                      {getSchemeDescription(scheme)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="bg-docket-blue text-white hover:bg-docket-blue/80 border-none">
                Done
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySelector;
