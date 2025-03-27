import React from 'react';
import { Layers, Link2, GitBranch } from 'lucide-react';

const projects = [
  {
    name: 'Chat Collect',
    description: 'SaaS to collect emails from OpenAI GPT Store users',
    period: 'Jan 2024 - Feb 2024',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    links: {
      website: '#',
      source: '#'
    }
  },
  {
    name: 'Automatic AI Chatbot',
    description: 'AI Support Chatbot for websites using latest AI models',
    period: 'Apr 2023 - Mar 2024',
    technologies: ['Next.js', 'TailwindCSS', 'Cloudflare', 'Magic UI'],
    links: {
      website: '#',
      source: '#'
    }
  }
];

const Projects = () => {
  return (
    <section 
      id="projects" 
      className="py-16 bg-white/95 backdrop-blur-lg px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 flex items-center justify-center gap-4 tracking-tight">
          <Layers className="w-10 h-10 text-blue-600" /> Projects
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg 
              overflow-hidden transition-all duration-300 ease-in-out 
              transform hover:-translate-y-2 hover:shadow-xl group"
          >
            <div className="p-6 pb-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {project.period}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-50 text-blue-600 px-3 py-1 
                      rounded-full text-sm font-medium 
                      transition-all duration-300 
                      hover:bg-blue-100 hover:scale-105"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-4 border-t border-gray-100 pt-4">
                <a
                  href={project.links.website}
                  className="flex items-center text-gray-700 hover:text-blue-600 
                    transition-all duration-300 group"
                >
                  <Link2 className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  Website
                </a>
                <a
                  href={project.links.source}
                  className="flex items-center text-gray-700 hover:text-blue-600 
                    transition-all duration-300 group"
                >
                  <GitBranch  className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  Source
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;