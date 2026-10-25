import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchTakenSlots } from '../utils/slots';

const ScheduleSession = ({ serviceName, price, duration }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const timeSlots = ["06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"];

  // Slots already booked/being paid for by other people on the selected day
  const [taken, setTaken] = useState(new Set());
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setTime(''); // a previously chosen time may not exist on the new day
    fetchTakenSlots(date)
      .then((set) => { if (!cancelled) setTaken(set); })
      .catch((err) => {
        console.error('Could not load booked slots:', err);
        if (!cancelled) setTaken(new Set());
      })
      .finally(() => { if (!cancelled) setLoadingSlots(false); });
    return () => { cancelled = true; };
  }, [date]);

  // Today's slots whose time has already passed
  const isPast = (slot) => {
    const start = new Date(`${date.toDateString()} ${slot}`);
    return start.getTime() < Date.now();
  };

  const handleBookNow = () => {
    // Save to session storage so Booking page can access it
    sessionStorage.setItem('bookingData', JSON.stringify({ 
      serviceName, 
      price, 
      duration, 
      date: date.toDateString(), 
      time 
    }));
    navigate('/booking'); 
  };

  return (
    <div id="schedule-session" className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-xl max-w-4xl mx-auto my-12 scroll-mt-24">
      <h2 className="text-3xl font-serif text-gray-900 mb-8">Schedule your session</h2>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Styled Calendar Container */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <Calendar onChange={setDate} value={date} minDate={new Date()} />
        </div>

        {/* Evening Slots */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-6 tracking-widest">
            Available Evening Slots
          </label>
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => {
              const booked = taken.has(slot);
              const unavailable = booked || isPast(slot) || loadingSlots;
              return (
                <button 
                  key={slot} 
                  onClick={() => setTime(slot)}
                  disabled={unavailable}
                  className={`py-4 rounded-2xl border-2 transition-all font-semibold ${
                    unavailable
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                      : time === slot 
                        ? 'bg-[#3a5a40] text-white border-[#3a5a40]' 
                        : 'bg-white border-gray-200 hover:border-[#3a5a40] text-gray-800'
                  }`}
                >
                  <span className={booked ? 'line-through' : ''}>{slot}</span>
                  {booked && <span className="block text-[10px] font-medium uppercase tracking-wider no-underline">Booked</span>}
                </button>
              );
            })}
          </div>

          {!loadingSlots && timeSlots.every((t) => taken.has(t) || isPast(t)) && (
            <p className="mt-4 text-sm text-amber-700">No slots left on this day. Please pick another date.</p>
          )}

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