
import React from 'react';
import Header from "./Header";
import ApiInformation from "./ApiInformation";
import Servers from "./Servers";
import Tags from "./Tags";
import Preview from "./Preview";
import Paths from "./Paths";

const DocketStation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-docket-darker to-docket-darker/95 text-white font-sans">
      <div className="bg-gradient-to-r from-docket-blue to-docket-blue/80 p-5 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-display tracking-tight">DocketStation</h1>
          <p className="text-blue-100 mt-1 text-lg">API documentation builder for modern APIs</p>
        </div>
      </div>
      
      <div className="container mx-auto p-6 max-w-7xl">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <ApiInformation />
          <Servers />
        </div>
        
        <div className="mt-8">
          <Tags />
        </div>
        
        <div className="mt-8">
          <Paths />
        </div>
        
        <div className="mt-8">
          <Preview />
        </div>
        
        <footer className="mt-16 pb-4 text-center text-blue-300/60 text-sm font-medium">
          © 2025 DocketStation - Build beautiful API docs with ease
        </footer>
      </div>
    </div>
  );
};

export default DocketStation;
