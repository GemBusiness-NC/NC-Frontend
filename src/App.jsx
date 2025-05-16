import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Shop component
import Shop from './components/User/Shop';

// Admin Components
import Sidebar from './components/Admin/Sidebar';
import Dashboard from './components/Admin/Dashboard';
import AddGems from './components/Admin/AddGems';
import CusGems from './components/Admin/CusGems';
import Orders from './components/Admin/Orders';
import Users from './components/Admin/Users';
import Reports from './components/Admin/Reports';
import Settings from './components/Admin/Settings';

// Common Components
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';

// User Components
import ProfilePage from './pages/Profile';
import ShopPage from './pages/Shop';
import AboutPage from './pages/aboutUs';
import GemDetail from './components/User/GemDetail';
import Checkout from './components/User/Checkout';
import Order from './pages/Order'; // You'll need to create this component

// Protected route wrapper for user routes
const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protected route wrapper for admin routes
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Assuming you store user role in localStorage
  
  if (!token || userRole !== 'admin') {
    toast.error('You need admin privileges to access this page');
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [currentAdminPage, setCurrentAdminPage] = useState('Dashboard');
  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Cart state with localStorage persistence
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (gem, quantity = 1) => {
    setCart(prevCart => {
      // Check if item is already in cart
      const existingItemIndex = prevCart.findIndex(item => item._id === gem._id);
      
      if (existingItemIndex !== -1) {
        // Item exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Item doesn't exist in cart, add it
        return [...prevCart, { ...gem, quantity }];
      }
    });
    
    toast.success(`${gem.name || 'Item'} added to cart`);
  };

  const renderAdminPage = () => {
    switch (currentAdminPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Add Gems':
        return <AddGems />;
      case 'Customize Gems':
        return <CusGems />;
      case 'Orders':
        return <Orders />;
      case 'Users':
        return <Users />;
      case 'Reports':
        return <Reports />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex">
      <ToastContainer />
      
      {location.pathname.startsWith('/admin') && (
        <Sidebar
          setPage={setCurrentAdminPage}
          setIsLoggedin={setIsLoggedin}
          setUserData={setUserData}
          navigate={navigate}
          toast={toast}
          currentPage={currentAdminPage}
        />
      )}
      
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/emailVerify" element={<EmailVerify />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage addToCart={addToCart} cart={cart} setCart={setCart} />} />
          <Route path="/shop/:id" element={<GemDetail addToCart={addToCart} />} />
          
          {/* Protected User Routes */}
          <Route path="/profile" element={
            <UserProtectedRoute>
              <ProfilePage />
            </UserProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <UserProtectedRoute>
              <Checkout cart={cart} setCart={setCart} />
            </UserProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <UserProtectedRoute>
              <Order />
            </UserProtectedRoute>
          } />
          
          {/* Admin Routes - All protected */}
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              {renderAdminPage()}
            </AdminProtectedRoute>
          } />
          
          {/* Catch-all route for 404 - you may want to create a NotFound component */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;