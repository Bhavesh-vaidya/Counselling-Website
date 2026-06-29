import React, { useRef, useState } from 'react'; // 1. Added useRef, useState
import { MapPin, Mail, Globe, AtSign, Send } from 'lucide-react';

const Contact = () => {
  const form = useRef(); // 2. Reference the form
  const [status, setStatus] = useState(''); // 3. Feedback status

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:5000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.current.name.value,
          email: form.current.email.value,
          message: form.current.message.value,
        }),
      });

      if (response.ok) {
        setStatus('success');
        form.current.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#eae8e4] pt-32 pb-20 flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Brand & Info (Same as before) */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-serif text-[#3a5a40] mb-6">Archi</h1>
            <p className="text-gray-600 mb-12 text-lg leading-relaxed max-w-md">
              Cultivating tranquility through professional care.
            </p>
            {/* ... rest of your info section ... */}
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-3xl font-medium text-gray-900 mb-8">Have a question?</h2>

              {/* 4. Added ref and handleSubmit */}
              <form ref={form} className="flex flex-col gap-6" onSubmit={handleSubmit}>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Name</label>
                  <input type="text" name="name" required placeholder="Your full name" className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-5 py-4 text-gray-800 transition-colors outline-none" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input type="email" name="email" required placeholder="your@email.com" className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-5 py-4 text-gray-800 transition-colors outline-none" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Message</label>
                  <textarea name="message" required placeholder="How can we help you?" className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-5 py-4 text-gray-800 h-32 resize-none outline-none"></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[#4a5f46] hover:bg-[#3a5a40] text-white font-medium rounded-full py-4 mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </button>

                {status === 'success' && <p className="text-center text-green-700">Message sent successfully!</p>}
                {status === 'error' && <p className="text-center text-red-600">Failed to send.</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;