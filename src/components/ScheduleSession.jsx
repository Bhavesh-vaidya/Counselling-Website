import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ScheduleSession = ({ serviceName, price, duration }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const timeSlots = ["06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"];

  const handleBookNow = () => {
    sessionStorage.setItem('bookingData', JSON.stringify({ 
      serviceName, price, duration, 
      date: date.toDateString(), 
      time 
    }));
    navigate('/booking'); 
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-xl max-w-4xl mx-auto my-12">
      <h2 className="text-3xl font-serif text-gray-900 mb-8">Schedule your session</h2>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Styled Calendar Container */}
{/* Styled Calendar Container - add these classes */}
<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
  <Calendar onChange={setDate} value={date} />
</div>

        {/* Evening Slots */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-6 tracking-widest">
            Available Evening Slots
          </label>
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button 
                key={slot} 
                onClick={() => setTime(slot)}
                className={`py-4 rounded-2xl border-2 transition-all font-semibold ${
                  time === slot 
                    ? 'bg-[#3a5a40] text-white border-[#3a5a40]' 
                    : 'bg-white border-gray-200 hover:border-[#3a5a40] text-gray-800'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-sm">Selected Date: <span className="font-bold text-gray-900">{date.toDateString()}</span></p>
            <p className="text-gray-500 text-sm mt-1">Selected Time: <span className="font-bold text-gray-900">{time || "None"}</span></p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{serviceName}</p>
          <p className="text-2xl font-bold text-gray-900">{price}</p>
        </div>
        <button 
          onClick={handleBookNow} 
          disabled={!time}
          className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-medium hover:bg-gray-800 transition-all disabled:opacity-40"
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default ScheduleSession;