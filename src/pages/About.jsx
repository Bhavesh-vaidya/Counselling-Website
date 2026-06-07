import React from 'react';

const About = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans">
      
      {/* 1. MEET YOUR COUNSELOR SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Left Image */}
        <div className="flex-1 w-full">
          <img 
            src="/assets/counselor.jpg" 
            alt="Archi - Counselor and Psychologist" 
            className="w-full h-[600px] object-cover rounded-[2rem] shadow-lg"
          />
        </div>
        
        {/* Right Content */}
        <div className="flex-1 space-y-6">
          <span className="text-[#a68a64] text-xs font-bold tracking-widest uppercase">
            Counselor & Psychologist
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">
            Meet Your Counselor
          </h1>
          
          <div className="space-y-4 text-[15px] text-[#555555] leading-relaxed">
            <p className="font-medium text-[#333333]">
              "I believe that every individual possesses the inner wisdom needed to heal; my role is simply to provide the safe harbor where that wisdom can surface."
            </p>
            <p>
              With over 12 years of clinical experience, I have dedicated my career to understanding the intricate dance of the human psyche. My background in Clinical Psychology from leading research institutions has provided me with a rigorous foundation, while my years in private practice have taught me the invaluable power of human connection.
            </p>
            <p>
              I specialize in trauma-informed care and anxiety management, helping individuals navigate life's most challenging transitions with grace and resilience. My journey into counseling began with a fascination for the stories we tell ourselves, and today, I help my clients rewrite those stories into narratives of strength and possibility.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MY APPROACH SECTION */}
      <section className="bg-[#f4f3ef] w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#3a5a40] mb-4">My Approach</h2>
              <p className="text-[#555555] leading-relaxed">
                Counseling at Archi isn't just about managing symptoms—it's about cultivating a deeper understanding of the self. My style is a blend of clinical precision and intuitive empathy.
              </p>
            </div>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#e8ece4] rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-[#4a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Mental Health Education</h3>
                  <p className="text-[#555555] text-sm leading-relaxed">I empower clients by demystifying the biological and psychological processes behind their experiences. Knowledge is a tool for liberation.</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#e8ece4] rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-[#4a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Holistic Integration</h3>
                  <p className="text-[#555555] text-sm leading-relaxed">We look at the whole person—environment, lifestyle, and history—to create sustainable pathways toward tranquility and balance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image with Floating Quote */}
          <div className="flex-1 relative w-full mt-10 md:mt-0">
            <img 
              src="/assets/approach-hands.jpg" 
              alt="Therapist holding hands with client" 
              className="w-full h-[400px] object-cover rounded-3xl shadow-md"
            />
            {/* Floating Quote Box */}
            <div className="absolute -bottom-8 -left-8 md:-left-12 bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-[280px]">
              <p className="font-serif italic text-[#3a5a40] text-lg leading-snug">
                "The therapeutic relationship is the most powerful catalyst for change."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE ARCHI SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <span className="text-[#a68a64] text-xs font-bold tracking-widest uppercase mb-3 block">
          Your Safety Is Paramount
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] mb-16">Why Choose Archi</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Card 1 */}
          <div className="bg-white border border-[#f0eee9] p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#f4f3ef] rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#4a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Safe & Supportive Environment</h3>
            <p className="text-[#555555] text-sm leading-relaxed">
              Our space is designed to be a physical and emotional sanctuary, far removed from the coldness of traditional clinical settings.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#f0eee9] p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#fff5eb] rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#a68a64]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Non-judgmental & Empathetic</h3>
            <p className="text-[#555555] text-sm leading-relaxed">
              We approach every story with radical empathy, ensuring you feel heard and validated without the fear of being judged.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#f0eee9] p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#e8f0e4] rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#3a5a40]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Evidence-based Approach</h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-6">
              We utilize proven methodologies including CBT and Mindfulness to ensure your journey is grounded in clinical excellence.
            </p>
            <div className="flex gap-2">
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-[10px] font-bold uppercase px-3 py-1 rounded-full">CBT</span>
              <span className="bg-[#e8f0e4] text-[#4a5f46] text-[10px] font-bold uppercase px-3 py-1 rounded-full">Mindfulness</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-[#4a5f46] rounded-[2.5rem] py-16 px-6 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Ready to begin your journey?</h2>
          <p className="text-[#dcedd6] mb-10 max-w-lg mx-auto">
            Sessions are available both in-person and via secure online video consultations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto bg-white text-[#4a5f46] font-medium px-8 py-3.5 rounded-full hover:bg-[#f0f4ef] transition-colors">
              Book a Session
            </button>
            <button className="w-full sm:w-auto border border-white text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#3a5a40] transition-colors">
              View Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;