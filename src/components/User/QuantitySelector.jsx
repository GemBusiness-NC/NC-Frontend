import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const QuantitySelector = ({ onAddToCart, gem }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(gem, quantity);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <button 
          onClick={decreaseQuantity}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-l p-1"
          disabled={quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="bg-white px-3 py-1 border-t border-b border-blue-200 text-center min-w-8">
          {quantity}
        </span>
        <button 
          onClick={increaseQuantity}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-r p-1"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
      >
        <ShoppingCart size={16} className="mr-2" />
        Add to Cart
      </button>
    </div>
  );
};

export default QuantitySelector;