import React from 'react';
import { GitHub, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: GitHub, href: 'https://github.com/yourusername' },
    { icon: Linkedin, href: 'https://linkedin.com/in/yourusername' },
    { icon: Twitter, href: 'https://twitter.com/yourusername' }
  ];

  return (
    <footer className="bg-apple-black text-white py-8 text-center">
      <div className="flex justify-center space-x-6 mb-4">
        {socialLinks.map((link, index) => (
          <a 
            key={index} 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
          >
            <link.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
      <p className="text-apple-gray-medium">
        © {new Date().getFullYear()} Dillion. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;