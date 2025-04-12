
import React from 'react';
import Header from "./Header";
import ApiInformation from "./ApiInformation";
import Servers from "./Servers";
import Tags from "./Tags";
import Preview from "./Preview";

const DocketStation = () => {
  return (
    <div className="min-h-screen bg-docket-darker text-white">
      <div className="bg-docket-blue p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">DocketStation</h1>
          <p className="text-blue-100">API documentation builder for modern APIs</p>
        </div>
      </div>
      
      <div className="container mx-auto p-4 max-w-7xl">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ApiInformation />
          <Servers />
        </div>
        
        <div className="mt-6">
          <Tags />
        </div>
        
        <div className="mt-6">
          <Preview />
        </div>
        
        <footer className="mt-16 pb-4 text-center text-gray-500 text-sm">
          © 2025 DocketStation - Build beautiful API docs with ease
        </footer>
      </div>
    </div>
  );
};

export default DocketStation;
