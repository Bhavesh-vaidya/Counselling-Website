import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans pb-24">
      
      {/* 1. HEADER SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center">
        <span className="text-[#a68a64] text-xs font-bold tracking-widest uppercase mb-4 block">
          Our Expertise
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6">
          Explore What We Are Offering
        </h1>
        <p className="text-[#555555] text-lg leading-relaxed max-w-2xl mx-auto">
          Find the right path for your mental wellbeing. Our sessions are designed to provide a safe space for growth, healing, and personal discovery.
        </p>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Service Card 1: Clarity */}
          <div className="bg-white border border-[#f0eee9] p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#f4f3ef] rounded-full flex items-center justify-center mb-6 text-[#4a5f46]">
              {/* Head/Mind Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <div className="mb-4">
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                Clarity
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Emotional Clarity Session</h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-8 flex-grow">
              Tailored for individuals feeling overwhelmed, confused, or mentally exhausted. We work together to untangle thoughts and restore a sense of calm perspective.
            </p>
            <img 
              src="/assets/service-clarity.jpg" 
              alt="Calm water ripples" 
              className="w-full h-48 object-cover rounded-2xl mb-6"
            />
            <Link to="/service-clarity" className="block w-full text-center border border-[#4a5f46] text-[#4a5f46] hover:bg-[#f0f4ef] py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 mt-auto">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          {/* Service Card 2: Support */}
          <div className="bg-white border border-[#f0eee9] p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#fff5eb] rounded-full flex items-center justify-center mb-6 text-[#a68a64]">
              {/* Lotus/Support Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <div className="mb-4">
              <span className="bg-[#fdf3e7] text-[#a68a64] text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                Support
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Guided Counseling Session</h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-8 flex-grow">
              A supportive space addressing anxiety, stress, overthinking, and self-esteem. Focused on building practical tools and emotional resilience for daily life.
            </p>
            <img 
              src="/assets/service-guided.jpg" 
              alt="Hands holding a warm mug" 
              className="w-full h-48 object-cover rounded-2xl mb-6"
            />
            <Link to="/service-guided" className="block w-full text-center border border-[#4a5f46] text-[#4a5f46] hover:bg-[#f0f4ef] py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 mt-auto">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          {/* Service Card 3: Analysis */}
          <div className="bg-white border border-[#f0eee9] p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#e8ece4] rounded-full flex items-center justify-center mb-6 text-[#3a5a40]">
              {/* Eye/Insight Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <div className="mb-4">
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                Analysis
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Deep Insight Session</h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-8 flex-grow">
              For those seeking to understand deep emotional patterns, past experiences, and core triggers. A profound journey into the self to foster lasting change.
            </p>
            <img 
              src="/assets/service-insight.jpg" 
              alt="Plant in vase on desk" 
              className="w-full h-48 object-cover rounded-2xl mb-6"
            />
            <Link to="/service-insight" className="block w-full text-center border border-[#4a5f46] text-[#4a5f46] hover:bg-[#f0f4ef] py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 mt-auto">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

        </div>
      </section>

      {/* 3. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#eef3ea] rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-serif text-[#3a5a40] mb-4 leading-tight">
              Not sure which session is right for you?
            </h2>
            <p className="text-[#555555] leading-relaxed">
              Schedule a brief 15-minute introductory call to discuss your needs and find the most supportive path forward.
            </p>
          </div>
          <div className="shrink-0">
            <button className="bg-[#4a5f46] hover:bg-[#3a5a40] text-white font-medium px-8 py-4 rounded-full transition-colors w-full md:w-auto">
              Book Intro Call
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;