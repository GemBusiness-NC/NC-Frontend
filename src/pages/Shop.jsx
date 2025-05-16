import React from 'react';
import Shop from '../components/User/Shop';
import Navbar from '../components/Navbar';

const ShopPage = ({ addToCart, cart, setCart }) => {
  return (
    <div>
      <Navbar />
      <Shop addToCart={addToCart} cart={cart} setCart={setCart} />
    </div>
  );
};

export default ShopPage;