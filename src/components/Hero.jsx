import React from 'react';
import { Download } from 'lucide-react';
import myphoto from '../assets/myphoto.jpg'

const Hero = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center text-center  backdrop-blur-lg px-4"
    >
      <div className="max-w-xl w-full space-y-8">
        <div className="relative inline-block group">
          <div className="relative w-48 h-48 mx-auto">
            <img
              src={myphoto}
              alt="Profile"
              className="rounded-full w-full h-full object-cover border-2 border-gray-200 shadow-xl transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-0 right-0 text-4xl transform translate-x-2 translate-y-2 opacity-90">👋</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold text-gray-900 tracking-tight">
            Hi, I'm <span className="text-blue-600">Shayeed Wajee</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Software Engineer turned Entrepreneur. Building innovative products and helping people grow.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <a
            href="#contact"
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Get in Touch
          </a>
          
          <a
            href="/resume.pdf"
            download
            className="bg-white text-gray-800 px-6 py-3 rounded-full border border-gray-200 shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Download className="mr-2 w-5 h-5 text-gray-600" /> 
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;