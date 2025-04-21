import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Admin
import Sidebar from './components/Admin/Sidebar';
import Dashboard from './components/Admin/Dashboard';
import AddGems from './components/Admin/AddGems';
import CusGems from './components/Admin/CusGems';
import Orders from './components/Admin/Orders';
import Users from './components/Admin/Users';
import Reports from './components/Admin/Reports';
import Settings from './components/Admin/Settings';

//Common
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';

//User
import ProfilePage from './pages/Profile';
import ShopPage from './pages/Shop';
import AboutPage from './pages/aboutUs';

const App = () => {
  const [page, setPage] = useState('Dashboard');
  const [isLoggedin, setIsLoggedin] = useState(true); 
  const [userData, setUserData] = useState(null);     
  const location = useLocation();                     
  const navigate = useNavigate();                     

  const renderPage = () => {
    switch (page) {
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
          setPage={setPage}
          setIsLoggedin={setIsLoggedin}
          setUserData={setUserData}
          navigate={navigate}
          toast={toast}
        />
      )}
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/emailVerify" element={<EmailVerify />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Admin Panel */}
          <Route path="/admin" element={renderPage()} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
