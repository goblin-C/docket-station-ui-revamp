
import React, { useEffect, useRef } from 'react';

interface SwaggerPreviewProps {
  openApiData?: string;
}

// This component renders a Swagger UI style preview
const SwaggerPreview: React.FC<SwaggerPreviewProps> = ({ openApiData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openApiData || !containerRef.current) return;

    // In a real implementation, this would use Swagger UI or a similar library
    // For now, we'll just create a basic representation
    try {
      const data = typeof openApiData === 'string' 
        ? JSON.parse(openApiData.startsWith('{') ? openApiData : '{}') 
        : {};
      
      renderBasicSwaggerUI(containerRef.current, data);
    } catch (error) {
      console.error("Error parsing OpenAPI data for visual preview:", error);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div class="p-4 text-red-500">Error rendering preview: Invalid OpenAPI format</div>';
      }
    }
  }, [openApiData]);

  const renderBasicSwaggerUI = (container: HTMLDivElement, data: any) => {
    // This is a simplified representation of how Swagger UI looks
    // A complete implementation would use the Swagger UI library
    
    const info = data.info || { title: 'API Documentation', version: '1.0.0' };
    const paths = data.paths || {};
    const servers = data.servers || [{ url: 'https://api.example.com' }];
    
    let html = `
      <div class="swagger-ui p-6 text-gray-900">
        <div class="info mb-8">
          <h2 class="text-3xl font-bold">${info.title || 'API Documentation'} <span class="text-sm bg-gray-200 rounded p-1">${info.version || '1.0.0'}</span></h2>
          <p class="my-4">${info.description || 'No description provided'}</p>
          
          ${info.termsOfService ? `<p><a href="${info.termsOfService}" class="text-blue-600 hover:underline">Terms of service</a></p>` : ''}
          ${info.contact ? `<p>Contact: ${info.contact.email || info.contact.name || ''}</p>` : ''}
          ${info.license ? `<p>License: <a href="${info.license.url || '#'}" class="text-blue-600 hover:underline">${info.license.name || 'License'}</a></p>` : ''}
        </div>
        
        <div class="servers mb-6">
          <h3 class="text-xl font-semibold mb-2">Servers</h3>
          <select class="border rounded p-2 w-1/2 text-sm">
            ${servers.map((server: any) => `<option value="${server.url}">${server.url} ${server.description ? ` - ${server.description}` : ''}</option>`).join('')}
          </select>
        </div>
    `;
    
    // Create sections for each tag/path group
    const tags = data.tags || [];
    const tagNames = tags.map((tag: any) => tag.name);
    const pathsByTag: Record<string, any[]> = {};
    
    // Group paths by tags
    Object.entries(paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, operation]: [string, any]) => {
        const opTags = operation.tags || ['default'];
        
        opTags.forEach((tag: string) => {
          if (!pathsByTag[tag]) {
            pathsByTag[tag] = [];
          }
          
          pathsByTag[tag].push({
            path,
            method,
            operation
          });
        });
      });
    });
    
    // Add tag sections
    tagNames.forEach(tag => {
      const tagInfo = tags.find((t: any) => t.name === tag);
      
      html += `
        <div class="tag-section mb-8">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold">${tag} ${tagInfo?.description ? `<span class="text-sm text-gray-600 font-normal">${tagInfo.description}</span>` : ''}</h3>
            <button class="text-blue-600 hover:underline text-sm">Find out more</button>
          </div>
          
          <div class="operations mt-4 space-y-2">
      `;
      
      // Add operations for this tag
      const operations = pathsByTag[tag] || [];
      operations.forEach(op => {
        const methodColors: Record<string, string> = {
          get: 'bg-blue-500',
          post: 'bg-green-500',
          put: 'bg-orange-500',
          delete: 'bg-red-500',
          patch: 'bg-purple-500',
          options: 'bg-gray-500',
          head: 'bg-pink-500',
          trace: 'bg-indigo-500'
        };
        
        const methodColor = methodColors[op.method.toLowerCase()] || 'bg-gray-500';
        
        html += `
          <div class="operation border rounded overflow-hidden">
            <div class="flex items-center">
              <div class="${methodColor} text-white px-4 py-2 w-24 text-center">
                ${op.method.toUpperCase()}
              </div>
              <div class="flex-1 px-4 py-2">
                <span class="font-mono">${op.path}</span>
                <span class="ml-3 text-sm text-gray-600">${op.operation.summary || ''}</span>
              </div>
              <div class="px-4">
                ${op.operation.security ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' : ''}
              </div>
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
  };

  if (!openApiData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No API specification loaded yet. Import or create one to see the preview.
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full overflow-auto bg-white text-gray-900" />;
};

export default SwaggerPreview;
