import React from 'react';
import { Home, User, Briefcase, Code, Mail, FileDown } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'About', href: '#about' },
    { icon: Briefcase, label: 'Experience', href: '#experience' },
    { icon: Code, label: 'Projects', href: '#projects' },
    { icon: Mail, label: 'Contact', href: '#contact' }
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-full border border-gray-200 shadow-2xl px-4 py-3 flex justify-between items-center">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group relative p-2 rounded-full transition-all duration-300 hover:bg-blue-50"
            aria-label={item.label}
          >
            <item.icon
              className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110"
            />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 transform 
              bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 
              group-hover:opacity-100 transition-opacity duration-300 
              pointer-events-none mb-2"
            >
              {item.label}
            </span>
          </a>
        ))}
        <a
          href="/resume.pdf"
          download
          className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 
            transition-all duration-300 ease-in-out transform hover:scale-105 
            shadow-md hover:shadow-lg flex items-center"
          aria-label="Download Resume"
        >
          <FileDown className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;