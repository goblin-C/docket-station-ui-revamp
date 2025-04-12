
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, ExternalLink, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Tag = {
  name: string;
  description: string;
  externalDocs?: {
    url: string;
    description?: string;
  };
};

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag>({
    name: "",
    description: "",
    externalDocs: {
      url: "",
      description: ""
    }
  });
  const [showExternalDocs, setShowExternalDocs] = useState(false);
  
  const addTag = () => {
    if (currentTag.name && currentTag.description) {
      setTags([...tags, { 
        ...currentTag,
        externalDocs: showExternalDocs && currentTag.externalDocs?.url 
          ? currentTag.externalDocs 
          : undefined
      }]);
      setCurrentTag({
        name: "",
        description: "",
        externalDocs: {
          url: "",
          description: ""
        }
      });
      setShowExternalDocs(false);
      setIsAddingTag(false);
    }
  };
  
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  return (
    <div className="bg-docket-darkblue rounded-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Tags</h2>
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5 text-gray-300 border-gray-700"
            >
              <PlusCircle className="h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-docket-darkblue border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Tag</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <Input 
                  value={currentTag.name}
                  onChange={(e) => setCurrentTag({...currentTag, name: e.target.value})}
                  placeholder="e.g. pets" 
                  className="bg-docket-darker border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <Textarea 
                  value={currentTag.description}
                  onChange={(e) => setCurrentTag({...currentTag, description: e.target.value})}
                  placeholder="Tag description" 
                  className="bg-docket-darker border-gray-700 text-white"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <button 
                    type="button"
                    onClick={() => setShowExternalDocs(!showExternalDocs)}
                    className="text-gray-300 hover:text-white text-sm flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-4 w-4" />
                    External Documentation
                  </button>
                </div>
                
                {showExternalDocs && (
                  <div className="space-y-3 pl-5 border-l border-gray-700">
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm">URL</label>
                      <Input 
                        value={currentTag.externalDocs?.url || ""}
                        onChange={(e) => setCurrentTag({
                          ...currentTag, 
                          externalDocs: { 
                            ...currentTag.externalDocs as any, 
                            url: e.target.value 
                          }
                        })}
                        placeholder="https://example.com/docs/pets" 
                        className="bg-docket-darker border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm">Description</label>
                      <Input 
                        value={currentTag.externalDocs?.description || ""}
                        onChange={(e) => setCurrentTag({
                          ...currentTag, 
                          externalDocs: { 
                            ...currentTag.externalDocs as any, 
                            description: e.target.value 
                          }
                        })}
                        placeholder="Find more info here" 
                        className="bg-docket-darker border-gray-700 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={addTag}
                disabled={!currentTag.name || !currentTag.description}
                className="w-full"
              >
                Add Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {tags.length > 0 ? (
        <div className="space-y-3">
          {tags.map((tag, index) => (
            <div key={index} className="bg-docket-darker rounded-md p-4 border border-gray-800">
              <div className="flex justify-between items-start">
                <h3 className="text-white font-medium">{tag.name}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 h-8 w-8 p-0 -mt-1 -mr-1"
                  onClick={() => removeTag(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 mt-1 text-sm">{tag.description}</p>
              
              {tag.externalDocs && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    External Documentation
                  </div>
                  <a 
                    href={tag.externalDocs.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline break-all"
                  >
                    {tag.externalDocs.url}
                  </a>
                  {tag.externalDocs.description && (
                    <p className="text-gray-400 mt-1 text-sm">{tag.externalDocs.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No tags defined yet. Tags help organize and document your API endpoints.
        </div>
      )}
    </div>
  );
};

export default Tags;
