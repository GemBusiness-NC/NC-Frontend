import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Menu,
  X,
  ShoppingCart,
  PlusCircle,
  LogOut,
  Gem
} from 'lucide-react';
import axios from 'axios';

axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

const Sidebar = ({ setPage, setIsLoggedin, setUserData, navigate, toast }) => {
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    try {
      const { data } = await axios.post(`http://localhost:4000/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        console.log('Logged out successfully');
        navigate('/');
        window.location.reload(); // ✅ This forces a page refresh
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error(`Logout failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'Add Gems', icon: PlusCircle, color: 'text-pink-500' },
    { name: 'Customize Gems', icon: Gem, color: 'text-indigo-500' },
    { name: 'Orders', icon: ShoppingCart, color: 'text-yellow-500' },
    { name: 'Users', icon: Users, color: 'text-green-500' },
    { name: 'Reports', icon: FileText, color: 'text-orange-500' },
    { name: 'Settings', icon: Settings, color: 'text-purple-500' },
    { name: 'Logout', icon: LogOut, color: 'text-red-500' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const handleClick = () => {
                if (item.name === 'Logout') {
                  logout();
                } else {
                  setPage(item.name);
                }
                setIsOpen(false);
              };

              return (
                <li
                  key={item.name}
                  onClick={handleClick}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group ${item.color}`}
                >
                  <IconComponent
                    className={`mr-3 ${item.color} group-hover:scale-110 transition-transform`}
                    size={20}
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
