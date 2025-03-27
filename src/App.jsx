import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import About from './components/About';

//import Footer from './components/Footer';

const App = () => {
  return (
    <div className="bg-apple-white text-apple-black min-h-screen font-manrope">
      <Navbar />
      <div className="container mx-auto px-4 space-y-16">
        <Hero />
        <About/>
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </div>
  
    </div>
  );
};

export default App;