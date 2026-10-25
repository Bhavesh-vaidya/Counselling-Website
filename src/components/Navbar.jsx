import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Me' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Highlight the active tab (service detail pages count as "Services")
  const isActive = (path) =>
    path === '/services'
      ? location.pathname === '/services' || location.pathname.startsWith('/service-')
      : location.pathname === path;

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="w-full bg-[#fcfbf9] border-b border-[#f0eee9] sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif text-[#3a5a40] font-bold cursor-pointer">
          Archi
        </Link>

        {/* Center Links (desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555555]">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`pb-1 transition-colors ${
                isActive(to)
                  ? 'text-[#3a5a40] border-b-2 border-[#3a5a40]'
                  : 'hover:text-[#3a5a40]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Spacer keeps links centred on desktop */}
        <div className="hidden md:block w-24"></div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 text-[#3a5a40]"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#f0eee9] bg-[#fcfbf9] px-6 py-4 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`py-3 text-base font-medium border-b border-[#f0eee9] last:border-0 ${
                isActive(to) ? 'text-[#3a5a40]' : 'text-[#555555]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
