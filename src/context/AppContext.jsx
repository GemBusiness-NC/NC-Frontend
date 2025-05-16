import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Uncommented this import
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true; // This ensures cookies are sent with the request
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const getAuthState = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/auth/isAuth`);
  
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
      console.error("Auth check failed:", error);
      toast.error(error?.response?.data?.message || "Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error(error?.response?.data?.message || "An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    getAuthState(); // Uncommented this line to check auth state on page load
  }, []);

  const logout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    logout, // Added logout function to context
    isLoading, // Added loading state to context
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};