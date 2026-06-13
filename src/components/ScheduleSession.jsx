import React, { useState } from 'react';

const ScheduleSession = ({ serviceName, price, duration }) => {
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  return (
    <div className="bg-[#eef3ea] rounded-3xl p-8 md:p-12 w-full max-w-6xl mx-auto my-16">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-serif text-[#1a1a1a] mb-3">Schedule your session</h2>
        <p className="text-[#555555]">Select a date and time that works best for you to begin your journey.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Mock Calendar Column */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-[#f0eee9]">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-[#1a1a1a]">October 2026</span>
            <div className="flex gap-2 text-[#555555]">
              <button className="hover:text-[#1a1a1a]">&lt;</button>
              <button className="hover:text-[#1a1a1a]">&gt;</button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-sm mb-2 text-[#888888]">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 text-center gap-y-4 text-sm text-[#333333]">
            <span className="text-gray-300">29</span><span className="text-gray-300">30</span>
            <span>1</span><span>2</span><span>3</span>
            <span className="bg-[#1a1a1a] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer shadow-md">4</span>
            <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
          </div>
        </div>

        {/* Time Slots & Summary Column */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#888888] tracking-widest uppercase mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {timeSlots.map((time) => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                    selectedTime === time 
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                      : 'bg-white border-[#dcdcdc] text-[#555555] hover:border-[#1a1a1a]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0eee9]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#555555] text-sm">Service</span>
              <span className="font-medium text-[#1a1a1a]">{serviceName}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#555555] text-sm">Total Amount</span>
              <span className="font-bold text-[#1a1a1a]">{price}</span>
            </div>
            <button className="w-full bg-[#1a1a1a] hover:bg-[#333333] text-white py-4 rounded-xl font-medium transition-colors">
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSession;