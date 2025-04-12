
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Import, Download, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-6">
      <h1 className="text-2xl font-bold text-white font-display">API Documentation Builder</h1>
      <div className="flex gap-3">
        <Button variant="ghost" size="icon" className="text-blue-300 hover:text-white hover:bg-docket-blue/20">
          <Sun className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="flex items-center gap-2 text-blue-100 border-blue-500/30 hover:border-blue-400 hover:bg-docket-blue/20">
          <Import className="h-4 w-4" />
          Import
        </Button>
        <Button className="bg-docket-accent text-white hover:bg-docket-blue shadow-md">Generate Documentation</Button>
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
      </div>
    </div>
  );
};

export default Header;
