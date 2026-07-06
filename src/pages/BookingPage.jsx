// src/pages/BookingPage.jsx
import React, { useEffect, useState } from 'react';

const BookingPage = () => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('bookingData'));
    setBooking(data);
  }, []);

  if (!booking) return <div className="p-20 text-center">Loading your booking details...</div>;

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-[#f0eee9]">
        <h1 className="text-3xl font-serif mb-2">Complete Your Booking</h1>
        <p className="text-[#555555] mb-8">Service: <strong>{booking.serviceName}</strong> | Date: {booking.date} at {booking.time}</p>

        <div className="space-y-6">
          <input type="text" placeholder="Full Name" className="w-full p-4 border rounded-xl" />
          <input type="email" placeholder="Email Address" className="w-full p-4 border rounded-xl" />
          
          <div className="border-t pt-8 mt-8 text-center">
            <h3 className="text-xl font-bold mb-4">Scan QR to Pay {booking.price}</h3>
            {/* REPLACE THIS WITH YOUR ACTUAL QR IMAGE PATH */}
            <img src="/assets/my-qr.png" alt="UPI QR" className="w-48 h-48 mx-auto mb-4" />
            <p className="font-mono bg-gray-100 p-2 rounded">UPI ID: yourname@upi</p>
            
            <input type="text" placeholder="Enter Transaction ID" className="w-full p-4 border rounded-xl mt-6" />
            <button className="w-full mt-6 bg-[#3a5a40] text-white py-4 rounded-xl">CONFIRM BOOKING</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;