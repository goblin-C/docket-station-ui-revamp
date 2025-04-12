
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { Sun, Import, Download, ChevronDown, FilePlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface HeaderProps {
  onImportSpec: (spec: string) => void;
  onGenerateDoc: () => void;
}

const Header: React.FC<HeaderProps> = ({ onImportSpec, onGenerateDoc }) => {
  const [importedSpec, setImportedSpec] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleImport = () => {
    if (!importedSpec.trim()) {
      toast.error("Please paste an OpenAPI specification");
      return;
    }

    try {
      // If JSON, validate it's valid JSON
      if (importedSpec.trim().startsWith('{')) {
        JSON.parse(importedSpec);
      }
      
      onImportSpec(importedSpec);
      setImportDialogOpen(false);
      toast.success("OpenAPI specification imported successfully");
    } catch (error) {
      toast.error("Invalid specification format. Please check your input.");
    }
  };

  return (
    <div className="flex justify-between items-center py-6">
      <h1 className="text-2xl font-bold text-white font-display">API Documentation Builder</h1>
      <div className="flex gap-3">
        <Button variant="ghost" size="icon" className="text-blue-300 hover:text-white hover:bg-docket-blue/20">
          <Sun className="h-5 w-5" />
        </Button>
        
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-blue-100 border-blue-500/30 hover:border-blue-400 hover:bg-docket-blue/20">
              <Import className="h-4 w-4" />
              Import
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-docket-darker text-white border-docket-blue/30 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import OpenAPI Specification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Paste your OpenAPI specification in YAML or JSON format below
              </p>
              <Textarea 
                className="min-h-[300px] bg-docket-blue/5 border-docket-blue/30 font-mono text-sm"
                placeholder="Paste your OpenAPI specification here..."
                value={importedSpec}
                onChange={(e) => setImportedSpec(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="border-docket-blue/30">
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleImport} className="bg-docket-accent hover:bg-docket-blue">
                  Import
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          className="bg-docket-accent text-white hover:bg-docket-blue shadow-md"
          onClick={onGenerateDoc}
        >
          Generate Documentation
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-blue-100 border-blue-500/30 hover:border-blue-400 hover:bg-docket-blue/20">
              <Download className="h-4 w-4" />
              Download
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-docket-surface border-docket-blue/30">
            <DropdownMenuItem className="hover:bg-docket-blue/20 focus:bg-docket-blue/20">OpenAPI JSON</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-docket-blue/20 focus:bg-docket-blue/20">OpenAPI YAML</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-docket-blue/20 focus:bg-docket-blue/20">Swagger UI HTML</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" className="flex items-center gap-2 text-blue-100 border-blue-500/30 hover:border-blue-400 hover:bg-docket-blue/20">
          <FilePlus className="h-4 w-4" />
          New
        </Button>
      </div>
    </div>
  );
};

export default Header;
