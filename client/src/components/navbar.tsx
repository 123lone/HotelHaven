import { useState } from 'react';
import { useMobileMenu } from '@/hooks/use-mobile-menu';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary dark:text-primary">
                <i className="fas fa-bed mr-2"></i>StayFinder
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Hotels</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Contact</a>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-4 py-2 text-sm font-medium transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onSignupClick}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggle}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              aria-label="Open mobile menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              <a href="#" className="text-gray-900 dark:text-white block px-3 py-2 text-base font-medium">Home</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary block px-3 py-2 text-base font-medium">Hotels</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary block px-3 py-2 text-base font-medium">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary block px-3 py-2 text-base font-medium">Contact</a>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                <button 
                  onClick={() => { onLoginClick(); close(); }}
                  className="text-gray-600 dark:text-gray-300 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Login
                </button>
                <button 
                  onClick={() => { onSignupClick(); close(); }}
                  className="bg-primary hover:bg-primary/90 text-white block px-3 py-2 text-base font-medium w-full text-left rounded-lg mt-2"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
