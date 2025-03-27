import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/sendVerifyOtp`);
      if (data.success) {
        toast.success('Verification OTP sent!');
        navigate('/emailVerify');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred');
    }
  };

  // If user data doesn't exist, show a message
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">No User Data Available</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white shadow-2xl rounded-2xl p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {userData.name ? userData.name.charAt(0).toUpperCase() : ''}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
            <p className="text-gray-600">{userData.email || 'No email provided'}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">Account Status</span>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                userData.isAccountVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {userData.isAccountVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
              <p className="text-gray-900 font-semibold">{userData.name}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
              <p className="text-gray-900 font-semibold">{userData.email || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {!userData.isAccountVerified && (
            <button
              onClick={sendVerificationOtp}
              className="w-full sm:w-auto flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold 
              hover:bg-yellow-600 transition-colors duration-300 ease-in-out 
              transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Verify Account
            </button>
          )}
          
          <button
            onClick={() => navigate('/resetPass')}
            className="w-full sm:w-auto flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold 
            hover:bg-blue-600 transition-colors duration-300 ease-in-out 
            transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
