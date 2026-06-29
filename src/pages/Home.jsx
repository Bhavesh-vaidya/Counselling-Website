import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Imported Link here

const Home = () => {
  // 1. Set up the state for the carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // 2. Create the array of 3 testimonial records
  const testimonials = [
    {
      quote: "Archi provided a space where I felt truly heard for the first time. The sessions helped me navigate a major life transition with a sense of calm I didn't know I possessed.",
      author: "Sarah M.",
      service: "Guided Counseling"
    },
    {
      quote: "I was skeptical about online therapy, but this platform felt incredibly safe. The Deep Insight sessions helped me understand patterns I've been stuck in for years.",
      author: "David L.",
      service: "Deep Insight"
    },
    {
      quote: "The Emotional Clarity session was exactly what I needed when I felt completely overwhelmed. Archi's approach is warm, professional, and genuinely transformative.",
      author: "Elena R.",
      service: "Emotional Clarity"
    }
  ];

  // 3. Navigation handler functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

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
            
            {/* 2. Changed from <button> to <Link> */}
            <Link 
              to="/services" 
              className="bg-[#3a5a40] hover:bg-[#2c4430] text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
            >
              View our services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </Link>

          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative">
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

      {/* TESTIMONIALS CAROUSEL SECTION */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          {/* Section Header */}
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">Kind Words from Clients</h2>
          <div className="w-16 h-1 bg-[#8c7355] mx-auto mt-4 mb-12"></div>

          {/* Testimonial Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-[#f0eee9] relative min-h-[350px] flex flex-col justify-center">
            
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <svg className="w-12 h-12 text-[#8c7355]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Dynamic Testimonial Content based on State */}
            <div className="transition-opacity duration-300 ease-in-out">
              <p className="text-lg md:text-xl italic font-serif text-[#555555] leading-relaxed max-w-2xl mx-auto mb-8">
                "{testimonials[currentSlide].quote}"
              </p>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-3">
                {testimonials[currentSlide].author}
              </h3>
              <span className="inline-block bg-[#dcedd6] text-[#3a5a40] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                {testimonials[currentSlide].service}
              </span>
            </div>

            {/* Navigation Arrows (Visible on md and up) */}
            <button 
              onClick={prevSlide}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md border border-[#f0eee9] items-center justify-center text-[#555555] hover:text-[#1a1a1a] hover:bg-[#fcfbf9] hover:scale-105 transition-all"
              aria-label="Previous Testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={nextSlide}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md border border-[#f0eee9] items-center justify-center text-[#555555] hover:text-[#1a1a1a] hover:bg-[#fcfbf9] hover:scale-105 transition-all"
              aria-label="Next Testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

          </div>

          {/* Pagination Dots (Moved Outside the Box) */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index 
                    ? 'bg-[#8c7355]' 
                    : 'bg-[#e8ece4] hover:bg-[#dcdcdc]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;