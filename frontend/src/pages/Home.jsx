// frontend/src/pages/Home.jsx
import React from 'react';
import UploadForm from '../components/UploadForm';

const Home = ({ onJobCreated }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">CarbonLens Analysis</h1>
          <p className="mt-4 text-xl text-gray-600">Disaggregate your factory data into per-product CBAM estimates.</p>
        </div>
        <UploadForm onUploadSuccess={(jobId) => onJobCreated(jobId)} />
      </div>
    </div>
  );
};

export default Home;