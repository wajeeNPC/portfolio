import React from 'react';
import { Briefcase } from 'lucide-react';

const experiences = [
  {
    company: 'Atomic Finance',
    title: 'Bitcoin Protocol Engineer',
    period: 'May 2021 - Oct 2022',
    logo: '/logos/atomic.png',
    description: 'Developed innovative blockchain solutions and optimized Bitcoin protocol implementations.'
  },
  {
    company: 'Shopify',
    title: 'Software Engineer',
    period: 'January 2021 - April 2021',
    logo: '/logos/shopify.png',
    description: 'Contributed to core e-commerce platform development and merchant experience improvements.'
  },
  {
    company: 'Nvidia',
    title: 'Software Engineer',
    period: 'January 2020 - April 2020',
    logo: '/logos/nvidia.png',
    description: 'Worked on graphics and AI computing solutions, enhancing performance and scalability.'
  }
];

const Experience = () => {
  return (
    <section 
      id="experience" 
      className="py-16 bg-white/95 backdrop-blur-lg px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 flex items-center justify-center gap-4 tracking-tight">
          <Briefcase className="w-10 h-10 text-blue-600" /> Work Experience
        </h2>
      </div>
      
      <div className="space-y-8 max-w-3xl mx-auto">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden 
              transition-all duration-300 ease-in-out transform hover:-translate-y-2 
              hover:shadow-xl group"
          >
            <div className="flex items-center p-6">
              <div className="w-20 h-20 mr-6 flex items-center justify-center bg-gray-100 rounded-xl">
                <img
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {exp.company}
                </h3>
                <p className="text-gray-600 mb-1">{exp.title}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-gray-600 text-sm">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;