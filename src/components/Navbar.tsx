import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', href: 'home' },
  { name: 'About', href: 'about' },
  { name: 'Projects', href: 'projects' },
  { name: 'Skills', href: 'skills' },
  { name: 'Contact', href: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Navbar height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setIsOpen(false);
      }
    } catch (e) {
      console.error('Scroll error:', e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection(href);
    } else {
      navigate(`/#${href}`);
      // After navigation, we need to wait for the home page to load before scrolling
      setTimeout(() => {
        scrollToSection(href);
      }, 100);
    }
  };

  // Handle hash navigation when coming from another page
  useEffect(() => {
    if (isHomePage && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    }
  }, [isHomePage, location.hash]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled || isOpen ? "bg-white/90 backdrop-blur-md border-b border-slate-100 py-4" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-bold tracking-tighter serif" 
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          M.C.Y
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.href}`}
              onClick={(e) => handleClick(e, item.href)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <Link 
            to="/admin" 
            className={cn(
              "p-2 transition-colors",
              location.pathname === '/admin' ? "text-slate-900" : "text-slate-400 hover:text-slate-900"
            )}
            title="Admin Panel"
          >
            <Shield size={18} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col space-y-4 shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.href}`}
              onClick={(e) => handleClick(e, item.href)}
              className="text-lg font-medium text-slate-600"
            >
              {item.name}
            </a>
          ))}
          <Link 
            to="/admin" 
            className={cn(
              "text-lg font-medium",
              location.pathname === '/admin' ? "text-slate-900" : "text-slate-400"
            )} 
            onClick={() => setIsOpen(false)}
          >
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
}
