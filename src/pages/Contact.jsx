import React from 'react';
import { MapPin, Mail, Globe, AtSign, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#eae8e4] pt-32 pb-20 flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Brand & Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-serif text-[#3a5a40] mb-6">
              Archi
            </h1>
            <p className="text-gray-600 mb-12 text-lg leading-relaxed max-w-md">
              Cultivating tranquility through professional care.<br />
              We are here to support your journey toward mental wellness and emotional balance.
            </p>

            <div className="flex flex-col gap-6 mb-12">
              <div className="flex items-center gap-4 text-gray-700">
                <MapPin className="w-6 h-6 text-[#8c7355] shrink-0" strokeWidth={1.5} />
                <span className="text-base font-medium">123 Serenity Path, Wellness District, CA 90210</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <Mail className="w-6 h-6 text-[#8c7355] shrink-0" strokeWidth={1.5} />
                <span className="text-base font-medium">hello@archicounseling.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <Globe className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
              </div>
              <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <AtSign className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-3xl font-medium text-gray-900 mb-8">Have a question?</h2>

              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Your full name"
                    className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="your@email.com"
                    className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Message</label>
                  <textarea 
                    required
                    placeholder="How can we help you?"
                    className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 h-32 resize-none transition-colors outline-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#4a5f46] hover:bg-[#3a5a40] text-white font-medium rounded-full py-4 mt-4 transition-colors duration-200 flex items-center justify-center gap-3"
                >
                  Send Message
                  <Send className="w-4 h-4" />
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;