// client/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import AuthContext from '../context/AuthContext'; // Import AuthContext

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Access auth state and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-blue-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          FUD Complaint System
        </Link>
        <div>
          {isAuthenticated ? (
            // If logged in, show user's name and logout button
            <>
              <span className="text-white mx-2">Welcome, {user?.name || 'User'}!</span>
              <Link to="/" className="text-white mx-2 hover:text-blue-200">Home</Link>
              {/* Additional links for logged-in users, e.g., My Complaints */}
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-2">
                Logout
              </button>
            </>
          ) : (
            // If not logged in, show login and register links
            <>
              <Link to="/" className="text-white mx-2 hover:text-blue-200">Home</Link>
              <Link to="/login" className="text-white mx-2 hover:text-blue-200">Login</Link>
              <Link to="/register" className="text-white mx-2 hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;