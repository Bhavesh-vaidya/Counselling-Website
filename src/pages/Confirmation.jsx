import React from 'react';
import { 
  CheckCircle2, 
  Video, 
  ExternalLink, 
  CalendarPlus, 
  Copy, 
  Check, 
  CalendarClock 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Confirmation = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Success Icon & Header */}
        <div className="w-24 h-24 bg-[#f0f4f1] rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(58,90,64,0.1)] relative">
          <div className="absolute inset-0 bg-[#e3ece5] rounded-full scale-[0.8] animate-pulse"></div>
          <CheckCircle2 className="w-10 h-10 text-[#3a5a40] relative z-10" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 text-center">
          Your Session is Confirmed
        </h1>
        <p className="text-gray-600 text-center max-w-xl mb-12 leading-relaxed">
          Confirmation details have been sent to your email and WhatsApp. We look forward to seeing you at our scheduled time.
        </p>

        {/* Meeting Details Card */}
        <div className="w-full max-w-3xl bg-[#f8f5f0] border border-gray-100 rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Video className="w-6 h-6 text-[#3a5a40]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Meeting Destination</p>
              <p className="text-xl font-medium text-gray-900">Google Meet Session</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-[#4a5f46] hover:bg-[#3a5a40] text-white px-6 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shrink-0">
            Join Google Meet Session
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-6 mb-16">
          <button className="flex items-center gap-2 text-sm font-medium text-[#8c7355] hover:text-[#7a6449] transition-colors">
            <CalendarPlus className="w-4 h-4" />
            Add to Calendar
          </button>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <button className="flex items-center gap-2 text-sm font-medium text-[#8c7355] hover:text-[#7a6449] transition-colors">
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
        </div>

        {/* Bottom Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Preparation Card */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Preparing for your session</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Find a quiet, private space where you feel comfortable speaking openly. Ensure your internet connection is stable for the best experience.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-[#3a5a40]" />
                  Grab a glass of water
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-[#3a5a40]" />
                  Have a notebook nearby
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-2/5 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Comfortable chair" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Reschedule Card */}
          <div className="bg-[#7c866b] rounded-[2rem] p-8 text-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3">Need to Reschedule?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                Life happens. If you need to change your appointment, please let us know at least 24 hours in advance.
              </p>
            </div>
            <button className="w-full border border-white/30 hover:bg-white/10 text-white rounded-xl py-3.5 text-sm font-medium transition-colors">
              Manage Appointment
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Confirmation;