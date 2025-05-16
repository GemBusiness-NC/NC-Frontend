import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AlertCircle, Package, Clock, CheckCircle, TruckIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  const fetchOrders = async (page = 1, limit = 10) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('You must be logged in to view your orders');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/orders/customer?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update state with response data - note the structure matches the backend response
      setOrders(response.data.orders || []);
      setPagination(response.data.pagination || { total: 0, page: 1, pages: 1 });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  // Navigate to different pages
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchOrders(newPage);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Package size={12} className="mr-1" />
            Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <TruckIcon size={12} className="mr-1" />
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Pagination controls
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`p-2 rounded-md ${
            pagination.page === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="text-sm">
          Page {pagination.page} of {pagination.pages}
        </div>
        
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className={`p-2 rounded-md ${
            pagination.page === pagination.pages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-24 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold text-blue-600">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-24 p-4">
        <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <p className="mt-3">
                <Link to="/login" className="text-red-700 underline hover:text-red-900">
                  Login to view your orders
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-24 p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-800 mb-2">No orders yet</h2>
          <p className="text-blue-600 mb-4">
            You haven't placed any orders yet. Start shopping to place your first order!
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-700">
                    Order placed on {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Order ID: {order._id}
                  </p>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-blue-100 rounded flex items-center justify-center text-blue-500 mr-3">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                    <div className="text-gray-500">Subtotal:</div>
                    <div className="text-right font-medium">${order.orderTotal.toFixed(2)}</div>
                    
                    <div className="text-gray-500">Tax:</div>
                    <div className="text-right font-medium">${order.tax.toFixed(2)}</div>
                    
                    <div className="text-gray-500">Shipping:</div>
                    <div className="text-right font-medium">${order.shippingCost.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <div>
                      <h3 className="text-lg font-semibold">Total</h3>
                    </div>
                    <p className="text-xl font-bold text-blue-700">
                      ${order.totalWithTaxAndShipping.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.street || 'N/A'}<br />
                      {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.zipCode || 'N/A'}<br />
                      {order.shippingAddress?.country || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      {order.paymentMethod === 'credit_card' ? 'Credit Card' : order.paymentMethod || 'N/A'}
                    </p>
                    {order.status === 'shipped' && order.trackingNumber && (
                      <div className="mt-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Tracking Number</h3>
                        <p className="text-sm text-blue-600">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;