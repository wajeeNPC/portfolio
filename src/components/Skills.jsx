import React from 'react';
import { Code } from 'lucide-react';

const skillCategories = [
  {
    name: 'Programming Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'Go', 'Rust']
  },
  {
    name: 'Web Technologies',
    skills: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'GraphQL']
  },
  {
    name: 'Tools & Platforms',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Git', 'Cloudflare']
  }
];

const Skills = () => {
  return (
    <section 
      id="skills" 
      className="py-16 bg-white/95 backdrop-blur-lg px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 flex items-center justify-center gap-4 tracking-tight">
          <Code className="w-10 h-10 text-blue-600" /> Skills
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg 
              overflow-hidden transition-all duration-300 ease-in-out 
              transform hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="p-6 pb-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b border-gray-100 pb-3">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3 pt-4">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-blue-600 px-4 py-1.5 
                      rounded-full text-sm font-medium 
                      transition-all duration-300 
                      hover:bg-blue-100 hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;