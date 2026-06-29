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
        <Link 
          to="/services" 
          className={`pb-1 transition-colors ${isActive('/services') ? 'text-[#3a5a40] border-b-2 border-[#3a5a40]' : 'hover:text-[#3a5a40]'}`}
        >
          Services
        </Link>
        <Link 
          to="/contact" 
          className={`pb-1 transition-colors ${isActive('/contact') ? 'text-[#3a5a40] border-b-2 border-[#3a5a40]' : 'hover:text-[#3a5a40]'}`}
        >
          Contact
        </Link>
      </div>

      {/* Empty div to maintain flexbox spacing (justify-between) if needed, 
          or you can leave it out completely. I've removed the button. */}
      <div className="hidden md:block w-24"></div> 
    </nav>
  );
};

export default Navbar;