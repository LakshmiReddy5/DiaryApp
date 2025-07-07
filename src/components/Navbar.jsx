import React, { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';

const Navbar = ({ user, currentView, onViewChange, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
      <nav className="bg-white shadow-lg border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => onViewChange(user ? 'calendar' : 'home')}
            >
              <BookOpen className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
              <span className="text-xl font-bold text-gray-800 group-hover:text-primary-700 transition-colors">
              MyDiary
            </span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              {!user ? (
                  <>
                    <button
                        onClick={() => onViewChange('home')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentView === 'home'
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-gray-700 hover:text-primary-700 hover:bg-blue-50'
                        }`}
                    >
                      Home
                    </button>
                    <button
                        onClick={() => onViewChange('auth')}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      Get Started
                    </button>
                  </>
              ) : (
                  <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                    >
                      <span>{user.fullName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <button
                              onClick={() => {
                                onLogout();
                                setDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                          >
                            Logout
                          </button>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;