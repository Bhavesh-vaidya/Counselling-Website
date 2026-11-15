import React from 'react';
import { Link } from 'react-router-dom';
import { HandHeart, MessagesSquare, Brain, Clock, CalendarCheck, ShieldCheck, UserCheck, Flower2, HeartHandshake } from 'lucide-react';
import { SERVICE_LIST, IMPORTANT_NOTES, TRUST_POINTS, formatPrice } from '../data/services';

const ICONS = { clarity: HandHeart, guided: MessagesSquare, insight: Brain };
const TRUST_ICONS = [ShieldCheck, UserCheck, Flower2, HeartHandshake];

const Services = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans pb-24">

      {/* 1. HEADER SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center">
        <span className="text-[#a68a64] text-xs font-bold tracking-widest uppercase mb-4 block">
          Our Expertise
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6">
          Our Services &amp; Pricing
        </h1>
        <p className="text-[#555555] text-lg leading-relaxed max-w-2xl mx-auto">
          Choose the session that feels right for you.<br className="hidden md:block" />{' '}
          Each space is designed to support you gently and meaningfully.
        </p>
      </section>

      {/* 2. SERVICES LIST */}
      <section id="services-list" className="max-w-5xl mx-auto px-6 mb-12 flex flex-col gap-6 scroll-mt-24">
        {SERVICE_LIST.map((s) => {
          const Icon = ICONS[s.id];
          return (
            <div
              key={s.id}
              className="bg-white border border-[#f0eee9] p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6 md:gap-8"
            >
              <div className="w-20 h-20 shrink-0 bg-[#f4f3ef] rounded-full flex items-center justify-center text-[#4a5f46]">
                <Icon className="w-9 h-9" strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-3">
                  {s.number}. {s.name}
                </h3>
                <p className="text-[#555555] text-sm leading-relaxed mb-4">{s.description}</p>
                <div className="inline-block bg-[#eef3ea] rounded-xl px-4 py-3 text-sm text-[#555555]">
                  <span className="font-semibold text-[#3a5a40]">Best for:</span> {s.bestFor}
                </div>
              </div>

              <div className="md:w-56 shrink-0 md:border-l md:border-[#f0eee9] md:pl-8 flex flex-col items-start md:items-center gap-2">
                <span className="flex items-center gap-2 text-[#4a5f46] font-medium">
                  <Clock className="w-5 h-5" /> {s.minutes} Min
                </span>
                <span className="text-4xl font-serif font-bold text-[#3a5a40]">{formatPrice(s.price)}</span>
                <Link
                  to={s.route}
                  className="mt-2 inline-block text-center border border-[#4a5f46] text-[#4a5f46] hover:bg-[#f0f4ef] px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  Learn More &amp; Book
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. IMPORTANT NOTE */}
      <section className="max-w-5xl mx-auto px-6 mb-10">
        <div className="bg-[#f4f3ef] border border-[#f0eee9] rounded-[2rem] p-6 md:p-8 flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 bg-white rounded-full flex items-center justify-center text-[#4a5f46]">
            <CalendarCheck className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-bold text-[#1a1a1a] mb-2">Important Note</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#555555]">
              {IMPORTANT_NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. TRUST POINTS */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_POINTS.map((t, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <div key={t} className="flex items-center gap-3 text-sm text-[#555555]">
                <Icon className="w-9 h-9 shrink-0 text-[#4a5f46]" strokeWidth={1.5} />
                <span>{t}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. BOOK CTA */}
      <section className="max-w-5xl mx-auto px-6 mb-20 text-center">
        <button
          type="button"
          onClick={() => document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-2 bg-[#4a5f46] hover:bg-[#3a5a40] text-white font-medium px-10 py-4 rounded-full transition-colors"
        >
          <CalendarCheck className="w-5 h-5" /> Book Your Session
        </button>
        <p className="text-[#777777] text-sm mt-4">Take the first step towards feeling better.</p>
      </section>

      {/* 6. INTRO CALL BANNER */}
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
            <Link to="/contact" className="inline-block text-center bg-[#4a5f46] hover:bg-[#3a5a40] text-white font-medium px-8 py-4 rounded-full transition-colors w-full md:w-auto">
              Book Intro Call
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
