import React from 'react';
import Navbar from '../components/Navbar';
import OrderPage from '../components/User/OrdersPage'; // Assuming you have an OrderPage component

const Order = () => {
  return (
    <div>
      <Navbar/>
      <OrderPage />  
    </div>
  );
};

export default Order;
