import React from 'react';
import { Link } from 'react-router-dom';
import { POLICIES_UPDATED, contactLines } from '../config/business';

// Renders a policy: sections = [{ heading, body: [ 'paragraph', ['bullet', 'bullet'] ] }]
const PolicyPage = ({ title, intro, sections }) => (
  <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans pb-24">
    <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24">
      <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-3">{title}</h1>
      <p className="text-sm text-[#888888] mb-8">Last updated: {POLICIES_UPDATED}</p>
      {intro && <p className="text-[#555555] leading-relaxed mb-10">{intro}</p>}

      {sections.map((s, i) => (
        <section key={s.heading} className="mb-8">
          <h2 className="text-xl font-serif font-bold text-[#3a5a40] mb-3">
            {i + 1}. {s.heading}
          </h2>
          {s.body.map((b, j) =>
            Array.isArray(b) ? (
              <ul key={j} className="list-disc pl-6 space-y-1.5 text-[#555555] leading-relaxed mb-3">
                {b.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p key={j} className="text-[#555555] leading-relaxed mb-3">
                {b}
              </p>
            )
          )}
        </section>
      ))}

      <section className="mt-12 pt-8 border-t border-[#f0eee9]">
        <h2 className="text-xl font-serif font-bold text-[#3a5a40] mb-3">Contact us</h2>
        {contactLines().map((l) => (
          <p key={l} className="text-[#555555] leading-relaxed">
            {l}
          </p>
        ))}
        <p className="text-sm text-[#888888] mt-6">
          See also:{' '}
          <Link className="underline hover:text-[#3a5a40]" to="/terms">Terms of Service</Link>{' · '}
          <Link className="underline hover:text-[#3a5a40]" to="/privacy">Privacy Policy</Link>{' · '}
          <Link className="underline hover:text-[#3a5a40]" to="/refund-policy">Refund &amp; Cancellation Policy</Link>
        </p>
      </section>
    </div>
  </div>
);

export default PolicyPage;
