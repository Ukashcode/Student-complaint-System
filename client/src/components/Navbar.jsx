// client/src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-2xl font-bold">
          FUD Complaint System
        </a>
        <div>
          {/* Navigation links will go here */}
          <a href="#" className="text-white mx-2 hover:text-blue-200">Home</a>
          <a href="#" className="text-white mx-2 hover:text-blue-200">Submit Complaint</a>
          <a href="#" className="text-white mx-2 hover:text-blue-200">Login</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;