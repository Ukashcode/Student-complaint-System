// client/src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [message, setMessage] = useState(''); // State for success/error messages

  const categories = [
    'Academic',
    'Administrative',
    'Facilities',
    'IT Support',
    'Welfare',
    'Security',
    'Other'
  ];

  const handleChange = (e) => {
    setComplaint({
      ...complaint,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => { // Make handleSubmit async
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaint), // Send complaint object as JSON string
      });

      const data = await res.json();

      if (res.ok) { // Check if response status is 2xx
        setMessage('Complaint submitted successfully!');
        setComplaint({ title: '', description: '', category: '' }); // Clear form
        console.log('Complaint created:', data.data);
      } else {
        setMessage(`Error: ${data.message || 'Something went wrong.'}`);
        console.error('Error submitting complaint:', data.message);
      }
    } catch (error) {
      console.error('Network error or failed to fetch:', error);
      setMessage('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-4 mt-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Submit Your Complaint
        </h2>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          {message && ( // Display messages here
            <div className={`p-3 mb-4 rounded-md text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Complaint Title"
                value={complaint.title}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <select
                name="category"
                value={complaint.category}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Describe your complaint..."
                rows="5"
                value={complaint.description}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>

              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;