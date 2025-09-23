import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full px-6 py-4 bg-gradient-to-r from-[#F5FFF5] to-[#E8F5E8]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {/* Speech bubble logo */}
            <div className="relative">
              <div className="w-8 h-8 bg-[#2D5A2D] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D5A2D] rounded-full opacity-80"></div>
            </div>
            <span className="text-[#2D5A2D] font-bold text-xl">Gasless Gossip</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-[#2D5A2D] hover:text-[#1e3d1e] transition-colors font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-[#2D5A2D] hover:text-[#1e3d1e] transition-colors font-medium">
            How it works
          </a>
          <a href="#about" className="text-[#2D5A2D] hover:text-[#1e3d1e] transition-colors font-medium">
            About
          </a>
        </div>

        {/* Connect Button */}
        <button className="bg-[#2D5A2D] text-white px-6 py-2 rounded-lg hover:bg-[#1e3d1e] transition-colors font-medium shadow-md">
          Connect
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
