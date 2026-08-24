import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Smartphone, CreditCard, Circle, CheckCircle2, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; 

const Booking = () => {
  const navigate = useNavigate();
  const paymentRef = useRef(null);

  const [sessionData, setSessionData] = useState({
    serviceName: "Counseling Session",
    price: "₹0",
    date: "Not Selected",
    time: "Not Selected"
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setSessionData(JSON.parse(storedData));
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    concerns: '',
    history: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const numericAmount = sessionData.price.replace(/[^0-9.]/g, '') || "0";
  const upiId = "bhaveshvaidya2004@okhdfcbank";
  const payeeName = "Anora Counseling";
  const transactionNote = `Booking for ${sessionData.serviceName}`;
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFinalPayment = async () => {
    // 1. Trigger the full-screen overlay immediately
    setIsSubmitting(true);
    
    try {
      // 2. Save data to Firestore
      await addDoc(collection(db, "bookings"), {
        ...formData,
        serviceName: sessionData.serviceName,
        amount: numericAmount,
        currency: "INR",
        bookingDate: sessionData.date,
        bookingTime: sessionData.time,
        paymentMethod: paymentMethod,
        paymentStatus: "Payment Completed", 
        createdAt: serverTimestamp()
      });

      // 3. Clear session storage and navigate to confirmation
      sessionStorage.removeItem('bookingData');
      
      // Added a slight delay so the user actually sees the "Processing" screen 
      // before it jumps to the next page instantly.
      setTimeout(() => {
        navigate('/confirmation');
      }, 1500);
      
    } catch (error) {
      console.error("Error saving booking to Firebase: ", error);
      alert("There was an error processing your booking. Please try again.");
      setIsSubmitting(false); // Remove overlay if it fails so they can try again
    }
  };

  return (
    <>
      {/* FULL SCREEN PROCESSING OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-[#3a5a40] animate-spin mb-6" />
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Processing payment...</h2>
          <p className="text-gray-500">Please do not close or refresh this window.</p>
        </div>
      )}

      <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left Column: Information & Progress */}
            <div className="w-full lg:w-1/3 flex flex-col">
              <h1 className="text-4xl md:text-5xl font-serif text-[#3a5a40] leading-tight mb-4">
                Your Journey<br />Begins Here
              </h1>
              
              <div className="bg-[#f0f4f1] border border-[#d2e0d5] rounded-2xl p-5 mb-8">
                <span className="text-[10px] font-bold text-[#3a5a40] uppercase tracking-wider">Selected Session</span>
                <h4 className="text-lg font-medium text-gray-900 mt-1">{sessionData.serviceName}</h4>
                <p className="text-sm text-gray-600 mt-1">{sessionData.date} at {sessionData.time}</p>
              </div>

              <div className="flex flex-col gap-6 mb-10 relative">
                <div className="absolute left-[1.15rem] top-10 bottom-10 w-[2px] bg-gray-200"></div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium shrink-0 transition-colors ${showPayment ? 'bg-[#3a5a40] text-white' : 'bg-[#3a5a40] text-white'}`}>
                    {showPayment ? <Check className="w-5 h-5" /> : '1'}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-medium text-gray-900 leading-none mb-1">Personal Intake</h3>
                    <p className="text-sm text-gray-500">Tell me about yourself</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium shrink-0 transition-colors ${showPayment ? 'bg-[#3a5a40] text-white' : 'bg-[#e8e6e1] text-gray-500'}`}>
                    2
                  </div>
                  <div className="pt-2">
                    <h3 className={`font-medium leading-none mb-1 transition-colors ${showPayment ? 'text-gray-900' : 'text-gray-500'}`}>Secure Payment</h3>
                    <p className={`text-sm transition-colors ${showPayment ? 'text-gray-500' : 'text-gray-400'}`}>Confirm your booking</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f5f0] border border-gray-100 rounded-2xl p-5 flex items-center gap-4 mb-8">
                <ShieldCheck className="w-8 h-8 text-[#3a5a40] shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Secure Payment</h4>
                  <p className="text-xs text-gray-500">SSL Encrypted & HIPAA Compliant</p>
                </div>
              </div>
            </div>

            {/* Right Column: Forms */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
              
              {/* Personal Intake Card */}
              <div className={`bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 ${showPayment ? 'opacity-50 grayscale-[20%]' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-medium text-gray-900">Personal Intake</h2>
                   {showPayment && (
                      <button 
                        type="button"
                        onClick={() => setShowPayment(false)} 
                        className="text-sm text-[#3a5a40] font-medium hover:underline"
                      >
                        Edit Details
                      </button>
                   )}
                </div>
                
                <form onSubmit={handleProceedToPayment} className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        disabled={showPayment}
                        className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-colors outline-none disabled:opacity-70"
                      />
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm text-gray-600 mb-2">Age <span className="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required 
                        min="18"
                        placeholder="28"
                        disabled={showPayment}
                        className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-colors outline-none disabled:opacity-70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="john@example.com"
                      disabled={showPayment}
                      className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-colors outline-none disabled:opacity-70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Primary Concerns <span className="text-red-500">*</span></label>
                    <textarea 
                      name="concerns"
                      value={formData.concerns}
                      onChange={handleInputChange}
                      required 
                      placeholder="What brings you to therapy today?"
                      disabled={showPayment}
                      className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 h-32 resize-none transition-colors outline-none disabled:opacity-70"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Brief History</label>
                    <textarea 
                      name="history"
                      value={formData.history}
                      onChange={handleInputChange}
                      placeholder="Any relevant past experiences or treatments... (Optional)"
                      disabled={showPayment}
                      className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 h-32 resize-none transition-colors outline-none disabled:opacity-70"
                    ></textarea>
                  </div>

                  {!showPayment && (
                    <button 
                      type="submit" 
                      className="w-full bg-[#4a5f46] hover:bg-[#3a5a40] text-white font-medium rounded-xl py-4 mt-2 transition-colors duration-200"
                    >
                      Proceed to Payment
                    </button>
                  )}
                </form>
              </div>

              {/* Payment Method Card */}
              {showPayment && (
                <div 
                  ref={paymentRef}
                  className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-medium text-gray-900">Payment Method</h2>
                  </div>

                  <div className="flex flex-col gap-4 mb-8">
                    <div 
                      onClick={() => setPaymentMethod('upi')}
                      className={`border rounded-2xl p-4 flex items-center cursor-pointer transition-all ${
                        paymentMethod === 'upi' ? 'border-[#3a5a40] bg-[#f8f5f0]/50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-gray-500 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">UPI (GPay, PhonePe, Paytm)</p>
                      </div>
                      {paymentMethod === 'upi' ? <CheckCircle2 className="w-5 h-5 text-[#3a5a40]" /> : <Circle className="w-5 h-5 text-gray-300" />}
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`border rounded-2xl p-4 flex items-center cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'border-[#3a5a40] bg-[#f8f5f0]/50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Credit / Debit Card</p>
                      </div>
                      {paymentMethod === 'card' ? <CheckCircle2 className="w-5 h-5 text-[#3a5a40]" /> : <Circle className="w-5 h-5 text-gray-300" />}
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="flex flex-col items-center justify-center p-8 bg-[#fcfbf9] border border-gray-100 rounded-2xl mb-10">
                      <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                        Scan with any UPI app to pay <br/><span className="text-2xl font-bold text-[#3a5a40]">{sessionData.price}</span>
                      </p>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <QRCode value={upiUri} size={180} />
                      </div>
                      <p className="text-xs text-gray-500 mt-4 text-center">
                        UPI ID: <span className="font-mono font-medium text-gray-700">{upiId}</span>
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="flex flex-col gap-4 mb-10">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5 ml-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="w-full bg-[#fcfbf9] border border-gray-100 focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 outline-none tracking-widest"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1.5 ml-1">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-[#fcfbf9] border border-gray-100 focus:border-[#3a5a40] rounded-xl px-4 py-3 outline-none tracking-widest" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1.5 ml-1">CVV</label>
                          <input type="password" placeholder="•••" className="w-full bg-[#fcfbf9] border border-gray-100 focus:border-[#3a5a40] rounded-xl px-4 py-3 outline-none tracking-widest" />
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="border-gray-100 mb-6" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Amount</p>
                      <p className="text-2xl font-serif text-gray-900">{sessionData.price}</p>
                    </div>
                    
                    {/* The new "I have completed payment" button */}
                    <button 
                      onClick={handleFinalPayment}
                      className="bg-[#4a5f46] hover:bg-[#3a5a40] text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
                    >
                      Complete Booking
                    </button>
                  </div>
                  
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;