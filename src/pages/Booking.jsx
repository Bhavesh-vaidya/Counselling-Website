import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Check, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { holdSlot, confirmBookingWithSlot } from '../utils/slots';
import { sendBookingEmail } from '../utils/email';
import { IS_DEMO, BUSINESS_EMAIL } from '../config/razorpay';
import { payWithRazorpay, simulateDemoPayment } from '../utils/razorpay';

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
    } else {
      // Nothing selected (direct visit / refresh after payment) -> pick a service first
      navigate('/services', { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    concerns: '',
    history: ''
  });

  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [slotLost, setSlotLost] = useState(false);

  const numericAmount = sessionData.price.replace(/[^0-9.]/g, '') || "0";

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
    setPaymentError('');
    setSlotLost(false);
    setIsSubmitting(true);
    let payment = null; // set once money has actually been taken

    try {
      // 0. Reserve the date/time so nobody else can book it while we pay
      await holdSlot(sessionData.date, sessionData.time);

      // 1. Take payment (Razorpay checkout, or a simulated payment in demo mode)
      payment = IS_DEMO
        ? await simulateDemoPayment()
        : await payWithRazorpay({
            serviceName: sessionData.serviceName,
            amount: numericAmount,
            customer: { name: formData.fullName, email: formData.email },
          });

      // 2. Mark slot as booked + save booking to Firestore (atomic)
      await confirmBookingWithSlot(sessionData.date, sessionData.time, {
        ...formData,
        serviceName: sessionData.serviceName,
        amount: numericAmount,
        currency: "INR",
        bookingDate: sessionData.date,
        bookingTime: sessionData.time,
        paymentMethod: "razorpay",
        razorpayOrderId: payment.orderId,
        razorpayPaymentId: payment.paymentId,
        paymentStatus: IS_DEMO ? "Demo - Not Paid" : "Payment Completed"
      });

      // 3. Emails (client + business inbox). Runs in background; a mail problem
      //    must never undo a successful booking.
      sendBookingEmail({
        ...formData,
        serviceName: sessionData.serviceName,
        date: sessionData.date,
        time: sessionData.time,
        paymentId: payment.paymentId,
        orderId: payment.orderId
      });

      // 4. Hand the details to the confirmation page and clear the cart
      sessionStorage.setItem('confirmedBooking', JSON.stringify({
        serviceName: sessionData.serviceName,
        date: sessionData.date,
        time: sessionData.time,
        price: sessionData.price,
        paymentId: payment.paymentId,
        email: formData.email,
        demo: IS_DEMO
      }));
      sessionStorage.removeItem('bookingData');

      navigate('/confirmation', { replace: true });
    } catch (error) {
      setIsSubmitting(false);
      if (error.message === 'SLOT_TAKEN') {
        if (payment) {
          // Extremely rare: paid, but the slot was taken in the meantime
          setPaymentError(`Your payment was received (ID: ${payment.paymentId}) but this time was just taken by someone else. Please email ${BUSINESS_EMAIL} with this ID and we will arrange a new time or a refund.`);
        } else {
          setSlotLost(true);
          setPaymentError('Sorry, this date and time was just booked by someone else. Please choose another slot.');
        }
        return;
      }
      if (error.message === 'PAYMENT_CANCELLED') {
        setPaymentError('Payment was cancelled. You can try again whenever you are ready.');
        return;
      }
      console.error("Booking/payment error: ", error);
      setPaymentError(error.message || 'There was an error processing your booking. Please try again.');
    }
  };

  return (
    <>
      {/* FULL SCREEN PROCESSING OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-[#3a5a40] animate-spin mb-6" />
          <h2 className="text-3xl font-serif text-gray-900 mb-2">{IS_DEMO ? 'Processing demo payment...' : 'Processing payment...'}</h2>
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

                  {IS_DEMO && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      <strong>Demo mode:</strong> Razorpay keys are not configured yet, so no real payment will be taken.
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-5 bg-[#fcfbf9] border border-gray-100 rounded-2xl mb-8">
                    <Lock className="w-5 h-5 text-[#3a5a40] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 mb-1">Pay securely with Razorpay</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        UPI (GPay, PhonePe, Paytm), Credit / Debit Cards, Net Banking and Wallets are all available
                        in the secure Razorpay window. Your card details never touch our website.
                      </p>
                    </div>
                  </div>

                  {paymentError && (
                    <p role="alert" className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      {paymentError}
                      {slotLost && (
                        <button type="button" onClick={() => navigate('/services')} className="block mt-2 font-medium underline">
                          Choose another time
                        </button>
                      )}
                    </p>
                  )}

                  <hr className="border-gray-100 mb-6" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Amount</p>
                      <p className="text-2xl font-serif text-gray-900">{sessionData.price}</p>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={handleFinalPayment}
                      disabled={isSubmitting}
                      className="bg-[#4a5f46] hover:bg-[#3a5a40] disabled:opacity-60 text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
                    >
                      {IS_DEMO ? 'Complete Booking (Demo)' : `Pay ${sessionData.price}`}
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