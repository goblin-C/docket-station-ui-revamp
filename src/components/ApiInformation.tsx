
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ApiInformation = () => {
  return (
    <div className="bg-docket-darkblue rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">API Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Title</label>
          <Input 
            placeholder="My API" 
            className="bg-docket-darker border-gray-700 text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">Description</label>
          <Textarea 
            placeholder="API Description" 
            className="bg-docket-darker border-gray-700 text-white min-h-[100px]"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">Version</label>
          <Input 
            placeholder="1.0.0" 
            className="bg-docket-darker border-gray-700 text-white"
          />
        </div>
        
        <Accordion type="single" collapsible className="border-none">
          <AccordionItem value="additional-info" className="border-none">
            <AccordionTrigger className="text-gray-300 py-1 hover:no-underline hover:text-white">
              Additional Information
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Terms of Service URL</label>
                <Input 
                  placeholder="https://example.com/terms" 
                  className="bg-docket-darker border-gray-700 text-white"
                />
              </div>
              
              <div>
                <h4 className="text-gray-300 mb-2">Contact Information</h4>
                <div className="space-y-3 ml-1">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Name</label>
                    <Input 
                      placeholder="API Team" 
                      className="bg-docket-darker border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Email</label>
                    <Input 
                      placeholder="api@example.com" 
                      className="bg-docket-darker border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">URL</label>
                    <Input 
                      placeholder="https://example.com/support" 
                      className="bg-docket-darker border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-gray-300 mb-2">License</h4>
                <div className="space-y-3 ml-1">
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Name</label>
                    <Input 
                      placeholder="Apache 2.0" 
                      className="bg-docket-darker border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">URL</label>
                    <Input 
                      placeholder="https://www.apache.org/licenses/LICENSE-2.0.html" 
                      className="bg-docket-darker border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ApiInformation;
