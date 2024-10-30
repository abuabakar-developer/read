import React, { useState } from 'react';

const AccountSettings: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can replace the URL with your actual API endpoint
    const response = await fetch('/api/updateAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      alert('Account updated successfully!');
    } else {
      alert('Error updating account.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
          />
        </div>
        <button className="bg-green-600 text-white p-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default AccountSettings;







