// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Navbar from './components/Navbar';
import Home from './pages/Home'; // We'll create this next
import Register from './pages/Register';
import Login from './pages/Login';
import ComplaintForm from './components/ComplaintForm'; // Move form into its own component
import './index.css';

// We'll create a dedicated Home page component for the complaint form
// For now, let's keep it simple. Create client/src/pages/Home.jsx
// and move the complaint form logic into client/src/components/ComplaintForm.jsx
// This improves modularity.

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar stays global */}

      <Routes> {/* Define routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* We'll add more routes later, e.g., for viewing complaints */}
      </Routes>
    </div>
  );
}

export default App;