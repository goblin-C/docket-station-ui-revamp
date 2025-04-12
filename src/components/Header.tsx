
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Import, Download, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <h1 className="text-2xl font-bold text-white">API Documentation Builder</h1>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Sun className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="flex items-center gap-2 text-gray-300">
          <Import className="h-4 w-4" />
          Import
        </Button>
        <Button className="bg-white text-docket-darkblue hover:bg-gray-200">Generate Documentation</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-gray-300">
              <Download className="h-4 w-4" />
              Download
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>OpenAPI JSON</DropdownMenuItem>
            <DropdownMenuItem>OpenAPI YAML</DropdownMenuItem>
            <DropdownMenuItem>Swagger UI HTML</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
