import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, CreditCard, Truck, User, Lock } from 'lucide-react';

const Checkout = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [orderData, setOrderData] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    shippingCost: 15, // Default shipping cost, matching backend default
    notes: '' // Add notes field
  });

  // Calculate totals
  const subtotal = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    : 0;
  const shippingCost = subtotal > 100 ? 0 : 15; // Match backend default of $15
  const taxRate = 0.08; // 8% tax rate to match backend
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    // Redirect if cart is empty
    if (!Array.isArray(cart) || cart.length === 0) {
      navigate('/shop');
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
    } else {
      // Pre-fill user data if available
      const getUserData = async () => {
        try {
          const res = await axios.get('http://localhost:4000/api/user/data', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.data) {
            setFormData(prev => ({
              ...prev,
              customerName: res.data.name || '',
              customerEmail: res.data.email || '',
              shippingCost: shippingCost // Set shipping cost based on cart total
            }));
          }
        } catch (err) {
          console.error('Error getting user data:', err);
        }
      };
      
      getUserData();
    }
  }, [cart, navigate, shippingCost]);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderProcessing(true);
    setOrderError(null);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required to create an order');
      }
      
      // Format items for the API - match structure expected by backend
      // Using productId instead of id to match backend expectation
      const items = cart.map(item => ({
        productId: item._id, // Use _id as productId
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Create order data structure exactly matching the backend expectations
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        items,
        notes: formData.notes || '' // Include notes field
      };
      
      console.log('Sending order payload:', orderPayload);
      console.log('Using authorization token:', token);
      
      // Check if token includes 'Bearer' prefix already
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.post(
        'http://localhost:4000/api/orders',
        orderPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken
          }
        }
      );
      
      if (response.status === 201) {
        setOrderSuccess(true);
        setOrderData(response.data.order); // Store order data from response
        showToast('Order placed successfully!', 'success');
        
        // Clear the cart after successful order
        setCart([]);
        
        // Redirect to orders page after a short delay
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setOrderError(err.response?.data?.message || 'Failed to process your order. Please try again.');
      showToast(err.response?.data?.message || 'Failed to process your order', 'error');
    } finally {
      setOrderProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-green-700">Order Placed Successfully!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been confirmed with order ID:
          </p>
          <p className="mt-2 text-sm font-mono bg-gray-100 py-2 px-4 rounded-md inline-block">
            {orderData?._id || 'N/A'}
          </p>
          <p className="mt-2 text-gray-600">
            You will receive a confirmation email shortly.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Your Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-24 p-4">
      {/* Toast notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className={`flex items-center p-4 rounded-md shadow-lg max-w-xs md:max-w-md bg-white ${
            toast.type === 'error' 
              ? 'text-red-800 border-l-4 border-red-500' 
              : toast.type === 'success'
                ? 'text-green-800 border-l-4 border-green-500'
                : 'text-blue-800 border-l-4 border-blue-500'
          }`}>
            <div className="flex-shrink-0 mr-3">
              {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
              {toast.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
            </div>
            <div className="flex-1 ml-1 mr-2">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Order Summary</h2>
          
          <div className="max-h-80 overflow-y-auto mb-4">
            {Array.isArray(cart) && cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center">
                  {item.image && (
                    <img 
                      src={`data:${item.image.contentType};base64,${item.image.data}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 py-4 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="mt-6 text-sm text-blue-600">
            <div className="flex items-center mb-2">
              <Lock size={16} className="mr-1" />
              <span>Secure Checkout</span>
            </div>
            <p>Your payment information is processed securely.</p>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {orderError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{orderError}</span>
                </div>
              </div>
            )}
            
            {/* Customer Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="customerName">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="customerEmail">
                    Email
                  </label>
                  <div className="flex items-center">
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck size={20} className="mr-2 text-blue-600" />
                Shipping Address
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="street">
                    Street Address
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="street"
                      name="shippingAddress.street"
                      value={formData.shippingAddress.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="city">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="state">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="shippingAddress.state"
                      value={formData.shippingAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="zipCode">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="shippingAddress.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="country">
                      Country
                    </label>
                    <select
                      id="country"
                      name="shippingAddress.country"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2 text-blue-600" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit_card"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="credit_card" className="ml-2 block text-gray-800">
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="paypal" className="ml-2 block text-gray-800">
                    PayPal
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank_transfer"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="bank_transfer" className="ml-2 block text-gray-800">
                    Bank Transfer
                  </label>
                </div>
                
                {/* Note: In a real application, you would include credit card form fields or PayPal integration here */}
                <div className="p-4 bg-blue-50 text-sm text-blue-700 rounded mt-2">
                  <p>
                    This is a demo checkout. In a real application, secure payment processing would be integrated here.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Notes */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Order Notes
              </h2>
              
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="notes">
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  rows="3"
                  placeholder="Add any special instructions for your order here"
                ></textarea>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={orderProcessing}
                className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium ${
                  orderProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {orderProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;