import React, { useState, useRef } from 'react';
import { ShieldCheck, Smartphone, CreditCard, Circle, CheckCircle2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Imported useNavigate

const Booking = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPayment, setShowPayment] = useState(false);
  const paymentRef = useRef(null);
  
  const navigate = useNavigate(); // 2. Initialized navigate

  // Updated to handle the form submission event
  const handleProceedToPayment = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setShowPayment(true);
    
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Information & Progress */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif text-[#3a5a40] leading-tight mb-4">
              Your Journey<br />Begins Here
            </h1>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Please provide a few details to help me understand your needs better. This information is kept strictly confidential and used only for our consultation.
            </p>

            {/* Progress Tracker */}
            <div className="flex flex-col gap-6 mb-10 relative">
              <div className="absolute left-[1.15rem] top-10 bottom-10 w-[2px] bg-gray-200"></div>

              {/* Step 1 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium shrink-0 transition-colors ${showPayment ? 'bg-[#3a5a40] text-white' : 'bg-[#3a5a40] text-white'}`}>
                  {showPayment ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <div className="pt-2">
                  <h3 className="font-medium text-gray-900 leading-none mb-1">Personal Intake</h3>
                  <p className="text-sm text-gray-500">Tell me about yourself</p>
                </div>
              </div>

              {/* Step 2 */}
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

            {/* Security Badge */}
            <div className="bg-[#f8f5f0] border border-gray-100 rounded-2xl p-5 flex items-center gap-4 mb-8">
              <ShieldCheck className="w-8 h-8 text-[#3a5a40] shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Secure Payment</h4>
                <p className="text-xs text-gray-500">SSL Encrypted & HIPAA Compliant</p>
              </div>
            </div>

            {/* Aesthetic Image */}
            <div className="w-full h-64 rounded-3xl overflow-hidden shadow-sm hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Calm consultation room" 
                className="w-full h-full object-cover"
              />
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
                      onClick={() => setShowPayment(false)} 
                      className="text-sm text-[#3a5a40] font-medium hover:underline"
                    >
                      Edit Details
                    </button>
                 )}
              </div>
              
              {/* Added onSubmit handler here */}
              <form onSubmit={handleProceedToPayment} className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required // Added required
                      placeholder="John Doe"
                      disabled={showPayment}
                      className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-colors outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm text-gray-600 mb-2">Age <span className="text-red-500">*</span></label>
                    <input 
                      type="number" // Changed to number for better mobile keyboard
                      required // Added required
                      min="18"
                      placeholder="28"
                      disabled={showPayment}
                      className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-colors outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required // Added required
                    placeholder="john@example.com"
                    disabled={showPayment}
                    className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-colors outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Primary Concerns <span className="text-red-500">*</span></label>
                  <textarea 
                    required // Added required
                    placeholder="What brings you to therapy today?"
                    disabled={showPayment}
                    className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 h-32 resize-none transition-colors outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Brief History</label>
                  <textarea 
                    placeholder="Any relevant past experiences or treatments... (Optional)"
                    disabled={showPayment}
                    className="w-full bg-[#f8f5f0] border-transparent focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 h-32 resize-none transition-colors outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

                {!showPayment && (
                  <button 
                    type="submit" // Changed to submit
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
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    Powered by <span className="font-semibold text-[#3381ff]">Razorpay</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  {/* UPI Option */}
                  <div 
                    onClick={() => setPaymentMethod('upi')}
                    className={`border rounded-2xl p-4 flex items-center cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-[#3a5a40] bg-[#f8f5f0]/50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-gray-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">UPI (GPay, PhonePe, etc.)</p>
                    </div>
                    {paymentMethod === 'upi' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3a5a40]" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* Card Option */}
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`border rounded-2xl p-4 flex items-center cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#3a5a40] bg-[#f8f5f0]/50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Credit / Debit Card</p>
                      <p className="text-xs text-gray-400">Visa, Mastercard, RuPay</p>
                    </div>
                    {paymentMethod === 'card' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3a5a40]" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>

                {/* Conditionally Rendered Card Details */}
                {paymentMethod === 'card' && (
                  <div className="flex flex-col gap-4 mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 ml-1">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full bg-[#fcfbf9] border border-gray-100 focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 transition-colors outline-none tracking-widest"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1.5 ml-1">Expiry</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full bg-[#fcfbf9] border border-gray-100 focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 transition-colors outline-none tracking-widest"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1.5 ml-1">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          className="w-full bg-[#fcfbf9] border border-gray-100 focus:border-[#3a5a40] focus:ring-0 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 transition-colors outline-none tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <hr className="border-gray-100 mb-6" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl font-serif text-gray-900">₹2,500.00</p>
                  </div>
                  {/* 3. Added onClick with navigate here */}
                  <button 
                    onClick={() => navigate('/confirmation')}
                    className="bg-[#4a5f46] hover:bg-[#3a5a40] text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
                  >
                    Pay Securely
                  </button>
                </div>
                
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;