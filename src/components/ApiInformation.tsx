
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ApiInformationProps {
  apiInfo?: Record<string, any>;
}

const ApiInformation: React.FC<ApiInformationProps> = ({ apiInfo = {} }) => {
  return (
    <div className="card-container p-6">
      <h2 className="text-xl font-display font-semibold mb-5 text-docket-highlight">API Information</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-blue-200 mb-2 font-medium">Title</label>
          <Input 
            placeholder="My API" 
            className="form-input text-white"
            defaultValue={apiInfo.title || ""}
          />
        </div>
        
        <div>
          <label className="block text-blue-200 mb-2 font-medium">Description</label>
          <Textarea 
            placeholder="API Description" 
            className="form-input text-white min-h-[120px]"
            defaultValue={apiInfo.description || ""}
          />
        </div>
        
        <div>
          <label className="block text-blue-200 mb-2 font-medium">Version</label>
          <Input 
            placeholder="1.0.0" 
            className="form-input text-white"
            defaultValue={apiInfo.version || ""}
          />
        </div>
        
        <Accordion type="single" collapsible className="border-none">
          <AccordionItem value="additional-info" className="border-t border-docket-blue/20 pt-2">
            <AccordionTrigger className="text-blue-300 py-2 hover:no-underline hover:text-docket-highlight font-medium">
              Additional Information
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-5">
              <div>
                <label className="block text-blue-200 mb-2 font-medium">Terms of Service URL</label>
                <Input 
                  placeholder="https://example.com/terms" 
                  className="form-input text-white"
                  defaultValue={apiInfo.termsOfService || ""}
                />
              </div>
              
              <div>
                <h4 className="text-blue-200 mb-3 font-medium">Contact Information</h4>
                <div className="space-y-4 ml-1">
                  <div>
                    <label className="block text-blue-300 mb-1.5 text-sm">Name</label>
                    <Input 
                      placeholder="API Team" 
                      className="form-input text-white"
                      defaultValue={apiInfo.contact?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-300 mb-1.5 text-sm">Email</label>
                    <Input 
                      placeholder="api@example.com" 
                      className="form-input text-white"
                      defaultValue={apiInfo.contact?.email || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-300 mb-1.5 text-sm">URL</label>
                    <Input 
                      placeholder="https://example.com/support" 
                      className="form-input text-white"
                      defaultValue={apiInfo.contact?.url || ""}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-blue-200 mb-3 font-medium">License</h4>
                <div className="space-y-4 ml-1">
                  <div>
                    <label className="block text-blue-300 mb-1.5 text-sm">Name</label>
                    <Input 
                      placeholder="Apache 2.0" 
                      className="form-input text-white"
                      defaultValue={apiInfo.license?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-300 mb-1.5 text-sm">URL</label>
                    <Input 
                      placeholder="https://www.apache.org/licenses/LICENSE-2.0.html" 
                      className="form-input text-white"
                      defaultValue={apiInfo.license?.url || ""}
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
