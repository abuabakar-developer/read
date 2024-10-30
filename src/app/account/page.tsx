'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountPage: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string }>({ name: '', email: '' });

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable scrolling on the body

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({ name: data.name, email: data.email });
      } else {
        console.error('Failed to fetch user data');
        router.push('/');
      }
      setLoading(false);
    };

    fetchUserData();

    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when component unmounts
    };
  }, [router]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/api/user/update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setUserData(updatedData);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } else {
      console.error('Failed to update user data');
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-200">
        <div className="loader"></div>
      </div>
    );
  }

  return (  
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Account Settings</h1>
        <div className="space-y-4">
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition duration-200">
            <FaUser className="text-blue-600 mr-3" />
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="text-lg font-medium text-gray-800 w-full bg-gray-100 outline-none"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{userData.name}</p>
            )}
          </div>

          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition duration-200">
            <FaEnvelope className="text-blue-600 mr-3" />
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="text-lg font-medium text-gray-800 w-full bg-gray-100 outline-none"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{userData.email}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing ? (
            <>
              <button
                className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition duration-200"
                onClick={handleSave}
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
              <button
                className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition duration-200"
                onClick={handleEditToggle}
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button
              className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition duration-200"
              onClick={handleEditToggle}
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AccountPage;





