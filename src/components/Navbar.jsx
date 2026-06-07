import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // A quick helper to highlight the active tab
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-[#fcfbf9] px-6 py-4 flex items-center justify-between border-b border-[#f0eee9] sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-serif text-[#3a5a40] font-bold cursor-pointer">
        Archi
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555555]">
        <Link 
          to="/" 
          className={`pb-1 transition-colors ${isActive('/') ? 'text-[#3a5a40] border-b-2 border-[#3a5a40]' : 'hover:text-[#3a5a40]'}`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`pb-1 transition-colors ${isActive('/about') ? 'text-[#3a5a40] border-b-2 border-[#3a5a40]' : 'hover:text-[#3a5a40]'}`}
        >
          About Me
        </Link>
        <a href="#" className="hover:text-[#3a5a40] transition-colors pb-1">Services</a>
        <a href="#" className="hover:text-[#3a5a40] transition-colors pb-1">Contact</a>
      </div>

      {/* Right Button */}
      <div>
        <button className="bg-[#4a5f46] hover:bg-[#3a5a40] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
          Book Session
        </button>
      </div>
    </nav>
  );
};

export default Navbar;