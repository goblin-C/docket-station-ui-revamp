
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Variable, X, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ServerVariable = {
  name: string;
  default: string;
  enum: string[];
  description?: string;
};

type Server = {
  url: string;
  description: string;
  variables: ServerVariable[];
};

interface ServersProps {
  serverList?: any[];
}

const Servers: React.FC<ServersProps> = ({ serverList = [] }) => {
  const [servers, setServers] = useState<Server[]>(
    serverList.length > 0 
      ? serverList.map(server => ({
          url: server.url || "",
          description: server.description || "",
          variables: server.variables ? Object.entries(server.variables).map(([name, value]: [string, any]) => ({
            name,
            default: value.default || "",
            enum: value.enum || [],
            description: value.description || ""
          })) : []
        }))
      : [
        {
          url: "https://{environment}.example.com",
          description: "Production server",
          variables: [
            {
              name: "environment",
              default: "api",
              enum: ["api", "api.dev", "api.staging"],
              description: "Server environment"
            }
          ]
        }
      ]
  );
  
  const [selectedServer, setSelectedServer] = useState<number>(0);
  const [showVariablesDialog, setShowVariablesDialog] = useState(false);
  const [currentVariable, setCurrentVariable] = useState<ServerVariable>({
    name: "",
    default: "",
    enum: [],
    description: ""
  });
  const [tempEnum, setTempEnum] = useState<string>("");
  
  const addServer = () => {
    setServers([
      ...servers,
      {
        url: "",
        description: "",
        variables: []
      }
    ]);
    setSelectedServer(servers.length);
  };
  
  const removeServer = (index: number) => {
    const newServers = [...servers];
    newServers.splice(index, 1);
    setServers(newServers);
    if (selectedServer >= newServers.length) {
      setSelectedServer(Math.max(0, newServers.length - 1));
    }
  };
  
  const updateServer = (field: keyof Server, value: string) => {
    const newServers = [...servers];
    newServers[selectedServer] = {
      ...newServers[selectedServer],
      [field]: value
    };
    setServers(newServers);
  };
  
  const addVariableEnum = () => {
    if (tempEnum.trim()) {
      setCurrentVariable({
        ...currentVariable,
        enum: [...currentVariable.enum, tempEnum.trim()]
      });
      setTempEnum("");
    }
  };
  
  const removeVariableEnum = (index: number) => {
    const newEnum = [...currentVariable.enum];
    newEnum.splice(index, 1);
    setCurrentVariable({
      ...currentVariable,
      enum: newEnum
    });
  };
  
  const saveVariable = () => {
    if (currentVariable.name && currentVariable.default) {
      const newServers = [...servers];
      newServers[selectedServer].variables.push(currentVariable);
      setServers(newServers);
      setShowVariablesDialog(false);
      setCurrentVariable({
        name: "",
        default: "",
        enum: [],
        description: ""
      });
    }
  };
  
  return (
    <div className="bg-docket-darkblue rounded-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Servers</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 text-gray-300 border-gray-700"
          onClick={addServer}
        >
          <PlusCircle className="h-4 w-4" />
          Add Server
        </Button>
      </div>
      
      {servers.length > 0 && (
        <div className="bg-docket-darker rounded-md p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Server {selectedServer + 1}</h3>
            <div className="flex gap-2">
              <Dialog open={showVariablesDialog} onOpenChange={setShowVariablesDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1.5 text-gray-300 border-gray-700"
                  >
                    <Variable className="h-4 w-4" />
                    Variables ({servers[selectedServer].variables.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-docket-darkblue border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Server Variables</DialogTitle>
                  </DialogHeader>
                  
                  <div className="mt-4 space-y-4">
                    {servers[selectedServer].variables.map((variable, index) => (
                      <div key={index} className="bg-docket-darker p-3 rounded border border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{variable.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-gray-400 text-sm">
                          Default: {variable.default}
                        </div>
                        {variable.enum.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {variable.enum.map((val, i) => (
                              <span key={i} className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">
                                {val}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-800 pt-4">
                      <h4 className="text-white font-medium mb-3">Add New Variable</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-300 mb-1 text-sm">Name</label>
                          <Input 
                            value={currentVariable.name}
                            onChange={(e) => setCurrentVariable({...currentVariable, name: e.target.value})}
                            placeholder="e.g. environment" 
                            className="bg-docket-darker border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 text-sm">Default Value</label>
                          <Input 
                            value={currentVariable.default}
                            onChange={(e) => setCurrentVariable({...currentVariable, default: e.target.value})}
                            placeholder="e.g. api" 
                            className="bg-docket-darker border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 text-sm">Enum Values</label>
                          <div className="flex gap-2">
                            <Input 
                              value={tempEnum}
                              onChange={(e) => setTempEnum(e.target.value)}
                              placeholder="e.g. api.dev" 
                              className="bg-docket-darker border-gray-700 text-white"
                            />
                            <Button 
                              type="button"
                              onClick={addVariableEnum}
                              variant="outline"
                              className="border-gray-700"
                            >
                              Add
                            </Button>
                          </div>
                          
                          {currentVariable.enum.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {currentVariable.enum.map((val, i) => (
                                <span key={i} className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded flex items-center">
                                  {val}
                                  <button 
                                    type="button"
                                    onClick={() => removeVariableEnum(i)}
                                    className="ml-1 text-gray-400 hover:text-gray-200"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 text-sm">Description (optional)</label>
                          <Input 
                            value={currentVariable.description || ""}
                            onChange={(e) => setCurrentVariable({...currentVariable, description: e.target.value})}
                            placeholder="Description" 
                            className="bg-docket-darker border-gray-700 text-white"
                          />
                        </div>
                        
                        <Button 
                          type="button"
                          onClick={saveVariable}
                          className="w-full mt-2"
                          disabled={!currentVariable.name || !currentVariable.default}
                        >
                          Save Variable
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 h-8 w-8 p-0"
                onClick={() => removeServer(selectedServer)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">URL</label>
              <Input 
                value={servers[selectedServer].url}
                onChange={(e) => updateServer('url', e.target.value)}
                placeholder="https://{environment}.example.com" 
                className="bg-docket-darker border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <Textarea 
                value={servers[selectedServer].description}
                onChange={(e) => updateServer('description', e.target.value)}
                placeholder="Production server" 
                className="bg-docket-darker border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servers;
