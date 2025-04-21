import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, Filter, ChevronDown, Star } from 'lucide-react';

const Shop = () => {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fetchGems = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:4000/api/gems');
        setGems(res.data.gems);
        setError(null);
      } catch (err) {
        console.error('Error fetching gems:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGems();
  }, []);

  const addToCart = (gem) => {
    setCart([...cart, { ...gem, quantity: 1 }]);
    // Show cart briefly when item is added
    setCartOpen(true);
    setTimeout(() => setCartOpen(false), 3000);
  };

  const removeFromCart = (gemId) => {
    setCart(cart.filter(item => item._id !== gemId));
  };

  const filteredGems = gems
    .filter(gem => gem.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name); // default sort by name
    });

  const cartTotal = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-blue-600">Loading treasures...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-blue-600">{error}</p>
        <button 
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with search and filters */}
      <div className="sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4 mt-20">
          
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search gems..."
              className="w-full px-4 py-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-blue-400" size={20} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200"
              >
                <Filter size={18} className="mr-2" />
                Sort By
                <ChevronDown size={18} className="ml-2" />
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <button 
                      className={`block px-4 py-2 text-left w-full hover:bg-blue-100 ${sortBy === 'name' ? 'font-bold text-blue-600' : ''}`}
                      onClick={() => {setSortBy('name'); setFilterOpen(false);}}
                    >
                      Name (A-Z)
                    </button>
                    <button 
                      className={`block px-4 py-2 text-left w-full hover:bg-blue-100 ${sortBy === 'price-low' ? 'font-bold text-blue-600' : ''}`}
                      onClick={() => {setSortBy('price-low'); setFilterOpen(false);}}
                    >
                      Price (Low to High)
                    </button>
                    <button 
                      className={`block px-4 py-2 text-left w-full hover:bg-blue-100 ${sortBy === 'price-high' ? 'font-bold text-blue-600' : ''}`}
                      onClick={() => {setSortBy('price-high'); setFilterOpen(false);}}
                    >
                      Price (High to Low)
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <ShoppingCart size={18} className="mr-2" />
                <span>{cart.length}</span>
              </button>
              
              {cartOpen && cart.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20">
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">Your Cart</h3>
                    <div className="max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item._id} className="flex justify-between items-center py-2 border-b">
                          <div className="flex items-center">
                            {item.image && (
                              <img 
                                src={`data:${item.image.contentType};base64,${item.image.data}`}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded mr-2"
                              />
                            )}
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">${item.price}</span>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-2 border-t">
                      <div className="flex justify-between font-bold mb-4">
                        <span>Total:</span>
                        <span>${cartTotal}</span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="p-4 text-blue-600">
        Showing {filteredGems.length} {filteredGems.length === 1 ? 'item' : 'items'}
      </div>
      
      {/* Main product grid */}
      {filteredGems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-blue-500">No gems found matching your search</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {filteredGems.map((gem) => (
            <div key={gem._id} className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100">
              <div className="relative">
                {gem.image ? (
                  <img
                    src={`data:${gem.image.contentType};base64,${gem.image.data}`}
                    alt={gem.name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-black-800">{gem.name}</h2>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-l font-semibold text-black-700">Price :${gem.price}</p>
                  <button 
                    onClick={() => addToCart(gem)}
                    className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;