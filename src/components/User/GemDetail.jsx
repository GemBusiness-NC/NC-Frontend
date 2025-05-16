import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Info, Award, Clock } from 'lucide-react';
import QuantitySelector from './QuantitySelector';

const GemDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gem, setGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedGems, setRelatedGems] = useState([]);

  useEffect(() => {
    const fetchGemDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/gems/${id}`);
        setGem(res.data.gem);
        setError(null);
        
        // Fetch related gems (same category)
        if (res.data.gem.category) {
          const relatedRes = await axios.get(`http://localhost:4000/api/gems?category=${res.data.gem.category}&limit=4`);
          // Filter out the current gem
          setRelatedGems(relatedRes.data.gems.filter(g => g._id !== id));
        }
      } catch (err) {
        console.error('Error fetching gem details:', err);
        setError('Failed to load gem details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGemDetails();
    }
  }, [id]);

  const handleAddToCart = (gem, quantity) => {
    addToCart({ ...gem, quantity });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-blue-600">Loading gem details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-blue-600">{error}</p>
        <button 
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!gem) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-blue-600">Gem not found</p>
        <button 
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Shop
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {gem.image ? (
            <img
              src={`data:${gem.image.contentType};base64,${gem.image.data}`}
              alt={gem.name}
              className="w-full h-auto object-contain aspect-square"
            />
          ) : (
            <div className="w-full h-96 bg-blue-100 flex items-center justify-center">
              <span className="text-blue-400">No image available</span>
            </div>
          )}
        </div>
        
        {/* Right Column - Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{gem.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < (gem.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-gray-600 ml-2">
              {gem.reviewCount || 0} reviews
            </span>
          </div>
          
          <div className="text-2xl font-bold text-blue-600 mb-4">
            ${gem.price}
          </div>
          
          {gem.shortdes && (
            <p className="text-gray-700 mb-6">{gem.shortdes}</p>
          )}
          
          <div className="mb-6">
            <QuantitySelector onAddToCart={handleAddToCart} gem={gem} />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center text-blue-800 mb-2">
              <Info size={18} className="mr-2" />
              <span className="font-semibold">Gem Information</span>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li><span className="font-medium">Category:</span> {gem.category}</li>
              <li><span className="font-medium">Color:</span> {gem.color}</li>
              <li><span className="font-medium">Weight:</span> {gem.carat} carats</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'care'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('care')}
            >
              Care Instructions
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              {gem.des ? (
                <div dangerouslySetInnerHTML={{ __html: gem.des }} />
              ) : (
                <p>
                  No detailed description available for this {gem.name}.
                </p>
              )}
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="prose max-w-none">
              <table className="min-w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Name</td>
                    <td>{gem.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Category</td>
                    <td>{gem.category}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Color</td>
                    <td>{gem.color}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Weight</td>
                    <td>{gem.carat} carats</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Price</td>
                    <td>${gem.price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'care' && (
            <div className="prose max-w-none">
              <h3 className="flex items-center text-lg font-semibold">
                <Award className="mr-2 text-blue-600" size={20} />
                Care and Maintenance
              </h3>
              <p>
                To maintain the brilliance and beauty of your {gem.name}, we recommend the following care instructions:
              </p>
              <ul className="mt-4 space-y-2">
                <li>Clean with a soft, lint-free cloth to remove fingerprints and maintain shine</li>
                <li>Avoid exposure to chemicals, including household cleaners and perfumes</li>
                <li>Remove gemstone jewelry before physical activities or sports</li>
                <li>Store separately from other jewelry to prevent scratching</li>
                <li>Periodic professional cleaning is recommended to maintain optimal appearance</li>
              </ul>
              
              <h3 className="flex items-center text-lg font-semibold mt-6">
                <Clock className="mr-2 text-blue-600" size={20} />
                Long-term Preservation
              </h3>
              <p>
                For long-term care, store your gemstone in a fabric-lined box or pouch in a cool, dry place.
                Avoid prolonged exposure to direct sunlight or extreme temperature changes, which can affect
                the color and structure of some gemstones over time.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products */}
      {relatedGems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedGems.map((relatedGem) => (
              <div 
                key={relatedGem._id} 
                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate(`/shop/${relatedGem._id}`)}
              >
                <div className="relative">
                  {relatedGem.image ? (
                    <img
                      src={`data:${relatedGem.image.contentType};base64,${relatedGem.image.data}`}
                      alt={relatedGem.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{relatedGem.name}</h3>
                  <p className="text-blue-600 font-bold mt-1">${relatedGem.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GemDetail;