import React from 'react';
import { User, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-16 bg-white/95 backdrop-blur-lg px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 flex items-center justify-center gap-4 tracking-tight">
          <User className="w-10 h-10 text-blue-600" /> About Me
        </h2>
      </div>
      
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          {
            Icon: Award,
            title: "Background",
            description: "Software engineer with a double degree in computer science and business. Passionate about building innovative tech solutions.",
          },
          {
            Icon: Globe,
            title: "Experience",
            description: "Worked at top tech companies like Nvidia, Shopify, and Atomic Finance. Competed in over 21 hackathons and participated in buildspace.",
          },
          {
            Icon: User,
            title: "Entrepreneurship",
            description: "Transitioned from software engineering to full-time entrepreneurship. Building SaaS businesses and helping people grow through technology.",
          }
        ].map(({ Icon, title, description }, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center">
              <Icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="max-w-3xl mx-auto mt-16 text-center">
        <p className="text-xl text-gray-700 leading-relaxed tracking-tight">
          As a software engineer turned entrepreneur, I'm passionate about creating innovative solutions that make a real difference. My journey has been driven by a love for building things and helping people. From working at top tech companies to launching my own SaaS businesses, I've always been motivated by the potential of technology to solve real-world problems.
        </p>
      </div>
    </section>
  );
};

export default About;