import React from 'react';
import ScheduleSession from '../components/ScheduleSession';
import ContactSection from '../components/ContactSection';

const ServiceInsight = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="text-[#888888] text-xs font-bold tracking-widest uppercase block">Core Therapeutic Service</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Deep Insight Session</h1>
          <p className="text-[#555555] leading-relaxed max-w-md">
            For those seeking to understand deep emotional patterns, past experiences, and core triggers. A profound journey into the self to foster lasting change.
          </p>
          <div className="flex items-end gap-2 pt-2">
            <span className="text-3xl font-bold text-[#1a1a1a]">₹2,500</span>
            <span className="text-[#555555] text-sm pb-1">/ per session (90 mins)</span>
          </div>
        </div>
        <div className="flex-1 w-full">
          <img src="/assets/service-insight-hero.jpg" alt="Therapy room dark armchair" className="w-full h-[450px] object-cover rounded-3xl shadow-lg" />
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] mb-10 border-l-4 border-[#8c7355] pl-4">What to expect from your journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-[#f0eee9] shadow-sm">
            <div className="w-10 h-10 bg-[#eef3ea] rounded-full flex items-center justify-center text-[#3a5a40] mb-4">🗣️</div>
            <h3 className="text-xl font-bold mb-3">Explorative Dialogue</h3>
            <p className="text-[#555555] text-sm leading-relaxed">A safe, non-judgmental space where we peel back the layers of your narrative through guided conversation and empathetic listening.</p>
          </div>
          <div className="bg-[#fdf3e7] p-8 rounded-2xl border border-[#f0eee9]">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#a68a64] mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-3 text-[#1a1a1a]">Pattern Recognition</h3>
            <p className="text-[#555555] text-sm leading-relaxed">Identifying the invisible threads that connect your past experiences to your current behaviors and emotional responses.</p>
          </div>
          <div className="bg-[#eef3ea] p-8 rounded-2xl border border-[#f0eee9]">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3a5a40] mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Core Trigger Analysis</h3>
            <p className="text-[#555555] text-sm leading-relaxed">Uncovering the primary emotional catalysts that lead to distress, allowing for proactive emotional management and understanding.</p>
          </div>
          <div className="bg-[#1a2f33] text-white p-8 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-[#2c444a] rounded-full flex items-center justify-center text-white mb-4">✨</div>
            <h3 className="text-xl font-bold mb-3">Integrative Healing</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Synthesizing insights into actionable personal growth, fostering a sense of wholeness and renewed purpose in your daily life.</p>
          </div>
        </div>
      </section>

      {/* Shared Components */}
      <section className="px-6">
        <ScheduleSession serviceName="Deep Insight Session" price="₹2,500" duration="90 Minutes" />
      </section>
      <ContactSection />
    </div>
  );
};

export default ServiceInsight;