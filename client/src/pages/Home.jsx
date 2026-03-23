// client/src/pages/Home.jsx
import React from 'react';
import ComplaintForm from '../components/ComplaintForm'; // Import the ComplaintForm component

const Home = () => {
  return (
    <main className="container mx-auto p-4 mt-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Submit Your Complaint
      </h2>
      <ComplaintForm /> {/* Render the ComplaintForm */}
    </main>
  );
};

export default Home;