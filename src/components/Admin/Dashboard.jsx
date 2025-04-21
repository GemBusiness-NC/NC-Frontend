import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, ResponsiveContainer, Legend, Cell } from 'recharts';
import { DollarSign, Package, Users, ShoppingBag, ArrowDown, ArrowUp, ChevronDown, Search, Bell } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 12400, profit: 4000 },
    { name: 'Feb', sales: 8500, profit: 3000 },
    { name: 'Mar', sales: 13800, profit: 5000 },
    { name: 'Apr', sales: 16200, profit: 6100 },
    { name: 'May', sales: 14900, profit: 5200 },
    { name: 'Jun', sales: 19000, profit: 7800 },
    { name: 'Jul', sales: 22800, profit: 8900 },
  ];

  const categoryData = [
    { name: 'Diamonds', value: 45 },
    { name: 'Sapphires', value: 25 },
    { name: 'Rubies', value: 15 },
    { name: 'Emeralds', value: 10 },
    { name: 'Others', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const topSellingGems = [
    { id: 1, name: 'Blue Sapphire', price: '$2,400', sales: 42, image: '/api/placeholder/60/60' },
    { id: 2, name: 'Diamond Solitaire', price: '$5,600', sales: 38, image: '/api/placeholder/60/60' },
    { id: 3, name: 'Ruby Pendant', price: '$1,890', sales: 29, image: '/api/placeholder/60/60' },
    { id: 4, name: 'Emerald Cut', price: '$3,200', sales: 27, image: '/api/placeholder/60/60' },
  ];

  const recentTransactions = [
    { id: '#TR-0123', date: '12 Apr 2025', customer: 'Michael Chen', amount: '$4,500', status: 'Completed' },
    { id: '#TR-0122', date: '11 Apr 2025', customer: 'Sarah Johnson', amount: '$2,800', status: 'Processing' },
    { id: '#TR-0121', date: '10 Apr 2025', customer: 'James Wilson', amount: '$1,250', status: 'Completed' },
    { id: '#TR-0120', date: '09 Apr 2025', customer: 'Emma Thompson', amount: '$6,700', status: 'Completed' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 ml-8">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            </div>
            <div className="relative">
              <button className="bg-gray-100 p-2 rounded-full relative">
                <Bell size={20} />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Filter controls */}
          <div className="flex justify-between mb-6">
            <div className="text-gray-700 text-lg">Welcome back, <span className="font-semibold">Admin</span></div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg shadow-sm px-3 py-2 flex items-center gap-2 text-sm cursor-pointer">
                <span>{timeRange}</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">$124,563</h3>
                </div>
                <div className="bg-blue-100 h-12 w-12 rounded-lg flex items-center justify-center text-blue-600">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center mr-2">
                  <ArrowUp size={14} />
                  12.5%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sales This Month</p>
                  <h3 className="text-2xl font-bold mt-1">235</h3>
                </div>
                <div className="bg-green-100 h-12 w-12 rounded-lg flex items-center justify-center text-green-600">
                  <ShoppingBag size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center mr-2">
                  <ArrowUp size={14} />
                  8.2%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inventory</p>
                  <h3 className="text-2xl font-bold mt-1">756</h3>
                </div>
                <div className="bg-orange-100 h-12 w-12 rounded-lg flex items-center justify-center text-orange-600">
                  <Package size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center mr-2">
                  <ArrowUp size={14} />
                  3.1%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Customers</p>
                  <h3 className="text-2xl font-bold mt-1">42</h3>
                </div>
                <div className="bg-purple-100 h-12 w-12 rounded-lg flex items-center justify-center text-purple-600">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600 flex items-center mr-2">
                  <ArrowDown size={14} />
                  5.8%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Revenue & Profit</h3>
                <div className="flex gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-xs text-gray-600">Sales</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs text-gray-600">Profit</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
