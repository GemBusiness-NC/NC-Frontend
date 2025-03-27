import React, { useContext, useState } from 'react';
import { ArrowRight, ShoppingCart, Menu, X, User, LogOut, Mail } from 'lucide-react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const { userData, setIsLoggedin, setUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      toast.error(`Logout failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/sendVerifyOtp`);
      if (data.success) {
        toast.success(data.message);
        navigate('/emailVerify');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred');
    }
  };

  const cartCount = userData?.cart?.length || 0; // Dynamically get cart count

  const NavLinks = () => (
    <>
      <button 
        onClick={() => {
          navigate('/shop');
          setIsMobileMenuOpen(false);
        }}
        className="group relative px-3 py-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        Shop
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </button>
      <button 
        onClick={() => {
          navigate('/about');
          setIsMobileMenuOpen(false);
        }}
        className="group relative px-3 py-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        About Us
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </button>
      <button 
        onClick={() => {
          navigate('/contact');
          setIsMobileMenuOpen(false);
        }}
        className="group relative px-3 py-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        Contact
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </button>
    </>
  );

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-28 sm:w-32 h-auto object-contain"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Cart Icon */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/cart')}
            className="relative flex items-center px-3 py-2 text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Actions */}
          {userData ? (
            <div className="relative group">
              <div 
                className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium cursor-pointer hover:scale-110 transition-transform"
              >
                {userData.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute hidden group-hover:block top-full right-0 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-1 z-10">
                <ul>
                  <li onClick={() => navigate('/profile')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer rounded-md">
                    <User className="w-4 h-4 text-blue-500" />
                    View Profile
                  </li>
                  {!userData.isAccountVerified && (
                    <li onClick={sendVerificationOtp} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 cursor-pointer rounded-md">
                      <Mail className="w-4 h-4 text-yellow-500" />
                      Verify Email
                    </li>
                  )}
                  <li onClick={logout} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 cursor-pointer rounded-md">
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden md:flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-blue-600"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-blue-600"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
};

export default Navbar;
