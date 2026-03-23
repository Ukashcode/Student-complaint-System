// client/src/components/ComplaintForm.jsx
import React, { useState } from 'react';
// import { useContext } from 'react'; // Will be used later for AuthContext

const ComplaintForm = () => {
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Will add this when auth context is ready
        },
        body: JSON.stringify(complaint),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Complaint submitted successfully!');
        setComplaint({ title: '', description: '', category: '' });
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {message && (
        <div className = {`p-3 mb-4 rounded-md text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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
  );
};

export default ComplaintForm;