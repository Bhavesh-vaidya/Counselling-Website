import React from 'react';

const Home = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <span className="inline-block bg-[#e8f0e4] text-[#4a5f46] text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full">
            Counseling & Wellness
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight">
            Your Journey to Emotional Strength Begins Here
          </h1>
          <p className="text-lg text-[#555555] leading-relaxed max-w-lg">
            Hi, I'm Archi. I believe mental wellness is a collaborative journey. As your dedicated counselor, I provide a safe, tranquil space to help you navigate life's complexities and cultivate lasting emotional resilience.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="bg-[#3a5a40] hover:bg-[#2c4430] text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors">
              Book Session
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </button>
            <button className="border border-[#3a5a40] text-[#3a5a40] hover:bg-[#f0f4ef] px-6 py-3 rounded-full flex items-center gap-2 transition-colors">
              About Me
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative">
          {/* Decorative shapes behind image */}
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#e8f0e4] rounded-full opacity-70 z-0"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#faebd7] rounded-full opacity-70 z-0"></div>
          
          <img 
            src="/assets/hero-armchair.jpg" 
            alt="Calming therapy space with green armchair" 
            className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* MISSION STATEMENT SECTION */}
      <section className="bg-[#f4f3ef] w-full py-16 md:py-24 relative">

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-serif text-[#1a1a1a]">Cultivating Tranquility</h2>
            <div className="w-16 h-1 bg-[#a68a64] mt-4"></div>
          </div>
          <div className="md:w-2/3">
            <p className="text-xl md:text-2xl italic font-serif text-[#444444] leading-relaxed">
              "Our mission is to bridge the gap between emotional distress and inner peace through evidence-based practices and compassionate guidance. We don't just treat symptoms; we empower individuals to rediscover their innate strength and build a life of authentic fulfillment."
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] mb-4">Specialized Support</h2>
            <p className="text-[#555555]">
              Tailored sessions designed to meet you exactly where you are in your healing journey.
            </p>
          </div>
          <button className="text-[#555555] hover:text-[#1a1a1a] flex items-center gap-2 mt-4 md:mt-0 pb-1">
            View All Services 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#fcfaf8] border border-[#f0eee9] p-8 rounded-2xl hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#dcedd6] rounded-xl flex items-center justify-center mb-6 text-[#3a5a40]">
                {/* Lotus/Leaf Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Emotional Clarity</h3>
              <p className="text-[#555555] mb-8 text-sm leading-relaxed">
                Identify the core patterns holding you back and develop a roadmap for emotional regulation and self-awareness.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-xs font-semibold px-3 py-1 rounded-full">Mindfulness</span>
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-xs font-semibold px-3 py-1 rounded-full">Insight</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fcfaf8] border border-[#f0eee9] p-8 rounded-2xl hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#faebd7] rounded-xl flex items-center justify-center mb-6 text-[#a68a64]">
                 {/* Head/Mind Icon */}
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Guided Counseling</h3>
              <p className="text-[#555555] mb-8 text-sm leading-relaxed">
                One-on-one sessions focused on processing trauma, managing anxiety, and navigating life transitions with expert support.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-[#e8ece4] text-[#4a5f46] text-xs font-semibold px-3 py-1 rounded-full">CBT</span>
              <span className="bg-[#e8ece4] text-[#4a5f46] text-xs font-semibold px-3 py-1 rounded-full">Trauma</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fcfaf8] border border-[#f0eee9] p-8 rounded-2xl hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#4a5f46] rounded-xl flex items-center justify-center mb-6 text-white">
                {/* Growth/Tree Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Deep Insight</h3>
              <p className="text-[#555555] mb-8 text-sm leading-relaxed">
                Intensive sessions for long-term growth, exploring sub-conscious drivers and building a robust internal support system.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-xs font-semibold px-3 py-1 rounded-full">Growth</span>
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-xs font-semibold px-3 py-1 rounded-full">Psychotherapy</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;