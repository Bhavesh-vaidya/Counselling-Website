import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import WhatsAppButton from './components/WhatsAppButton';
import Services from './pages/Services';
import Contact from './pages/Contact'
import ServiceClarity from './pages/ServiceClarity';
import ServiceGuided from './pages/ServiceGuided';
import ServiceInsight from './pages/ServiceInsight';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <Router basename="/Counselling-Website">
      <ScrollToTop />
      <div className="min-h-screen bg-[#fcfbf9] flex flex-col font-sans relative">
        <Navbar />
        
        {/* Main Content Area: The Router handles swapping the pages here */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/service-clarity" element={<ServiceClarity />} />
            <Route path="/service-guided" element={<ServiceGuided />} />
            <Route path="/service-insight" element={<ServiceInsight />} />
          </Routes>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
