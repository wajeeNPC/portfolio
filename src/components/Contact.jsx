import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Implement form submission logic
      console.log('Submitting', { email, message });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Reset form
      setEmail('');
      setMessage('');
      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-16 bg-white/95 backdrop-blur-lg px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 flex items-center justify-center gap-4 tracking-tight">
          <Mail className="w-10 h-10 text-blue-600" /> Contact Me
        </h2>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl"
      >
        <div className="mb-6">
          <label 
            htmlFor="email" 
            className="block text-gray-900 mb-2 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent transition-all duration-300"
            placeholder="your.email@example.com"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-8">
          <label 
            htmlFor="message" 
            className="block text-gray-900 mb-2 font-medium"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent transition-all duration-300 resize-none"
            rows={4}
            placeholder="Your message..."
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-3.5 rounded-full text-white font-medium 
            transition-all duration-300 flex items-center justify-center
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg 
                className="animate-spin h-5 w-5 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </div>
          ) : (
            <>
              <Send className="mr-2 w-5 h-5" /> Send Message
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default Contact;