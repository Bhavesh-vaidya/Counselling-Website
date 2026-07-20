import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react'; // Import the QR library

const BookingPage = () => {
  const [booking, setBooking] = useState(null);
  
  // Accessing the UPI ID from .env
  const upiId = import.meta.env.VITE_UPI_ID;

  useEffect(() => {
    const savedData = sessionStorage.getItem('bookingData');
    if (savedData) {
      setBooking(JSON.parse(savedData));
    }
  }, []);

  if (!booking) return <div className="p-20 text-center">Loading...</div>;

  // Generate the UPI deep link
  // Format: upi://pay?pa=PAYEE_ADDRESS&pn=PAYEE_NAME&am=AMOUNT&cu=INR
  const cleanPrice = booking.price.replace('₹', '').replace(',', '');
  const upiLink = `upi://pay?pa=${upiId}&pn=Archi&am=${cleanPrice}&cu=INR`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white p-12 rounded-[2rem] shadow-xl text-center">
        <h1 className="text-2xl font-serif mb-8">Confirm Your Payment</h1>
        
        {/* Dynamic QR Code */}
        <div className="flex justify-center mb-8">
          <QRCode 
            value={upiLink} 
            size={200} 
            level="H" // High error correction
          />
        </div>

        <p className="text-gray-600 mb-2">Scan with any UPI app</p>
        <p className="text-2xl font-bold text-[#3a5a40] mb-8">{booking.price}</p>
        
        <button 
          onClick={() => alert("Redirecting to payment gateway...")}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl"
        >
          I HAVE PAID
        </button>
      </div>
    </div>
  );
};

export default BookingPage;