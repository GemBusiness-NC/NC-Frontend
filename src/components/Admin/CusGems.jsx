import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Edit2, Trash2, X, Save, Search, PlusCircle } from "lucide-react";

const CusGem = () => {
  const [gems, setGems] = useState([]);
  const [editingGem, setEditingGem] = useState(null);
  const [viewingGem, setViewingGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("latest");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    carot: "",
    shortdes: "",
    des: "",
    image: null,
  });

  const fetchGems = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/gems/");
      setGems(res.data.gems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gem?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/gems/${id}`);
      fetchGems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (gem) => {
    setEditingGem(gem._id);
    setViewingGem(null);
    setFormData({
      name: gem.name,
      price: gem.price,
      carot: gem.carot,
      shortdes: gem.shortdes,
      des: gem.des,
      image: null,
    });
  };

  const handleView = (gem) => {
    setViewingGem(gem);
    setEditingGem(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      await axios.put(`http://localhost:4000/api/gems/${editingGem}`, data);
      setEditingGem(null);
      fetchGems();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and sort functions
  const applySortAndFilter = (gems) => {
    // First filter by category if not "All Categories"
    let result = gems;
    if (filterCategory !== "All Categories") {
      // This filter doesn't work because your gem data doesn't have a category field
      // You would need to add a category field to your gem data model
      result = gems;
    }

    // Then filter by search term
    result = result.filter(
      (gem) =>
        gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gem.shortdes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort
    switch (sortOption) {
      case "price-low-high":
        return [...result].sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
      case "price-high-low":
        return [...result].sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
      case "name-az":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: // latest
        // This sort doesn't work because gems don't have a date field
        // You would need to add a date field to your gem data model
        return result;
    }
  };

  const filteredGems = applySortAndFilter(gems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gem Collection
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your premium stone inventory
              </p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <PlusCircle size={16} />
              <span>Add New Gem</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or description..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="border border-gray-300 rounded-md py-2 px-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Diamonds</option>
              <option>Rubies</option>
              <option>Sapphires</option>
              <option>Emeralds</option>
            </select>
            <select
              className="border border-gray-300 rounded-md py-2 px-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Sort by: Latest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-az">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && gems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-dashed rounded-full border-blue-500 animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-900">No gems found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Your collection is currently empty. Add some gems to get started.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <PlusCircle size={16} />
              <span>Add Your First Gem</span>
            </button>
          </div>
        )}

        {/* Gem Grid */}
        {!loading && filteredGems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGems.map((gem) => (
              <div
                key={gem._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={`data:${gem.image.contentType};base64,${gem.image.data}`}
                    alt={gem.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                    <div className="text-xs font-bold px-2 py-1 bg-blue-50 rounded-full text-blue-800">
                      {gem.carot} ct
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {gem.name}
                  </h2>
                  <p className="text-blue-600 font-bold text-xl">
                    ${gem.price}
                  </p>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleView(gem)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(gem)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(gem._id)}
                      className="flex-none bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredGems.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              <button className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 rounded-md bg-blue-600 text-white font-medium">
                1
              </button>
              <button className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                8
              </button>
              <button className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Detail View Modal */}
        {viewingGem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {viewingGem.name}
                </h2>
                <button
                  onClick={() => setViewingGem(null)}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={`data:${viewingGem.image.contentType};base64,${viewingGem.image.data}`}
                        alt={viewingGem.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs font-medium text-blue-500 mb-1">
                          Price
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          ${viewingGem.price}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs font-medium text-blue-500 mb-1">
                          Carats
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {viewingGem.carot}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Short Description
                      </h3>
                      <p className="text-gray-900">{viewingGem.shortdes}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Full Description
                      </h3>
                      <p className="text-gray-800 text-sm">{viewingGem.des}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Category
                        </p>
                        <p className="text-gray-900">Precious Gems</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Added On
                        </p>
                        <p className="text-gray-900">April 15, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      handleEdit(viewingGem);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 size={18} />
                    <span>Edit Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewingGem(null);
                      handleDelete(viewingGem._id);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span>Delete Gem</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form Modal - REDUCED SIZE */}
        {editingGem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Edit Gem</h2>
                <button
                  onClick={() => setEditingGem(null)}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter gem name"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        placeholder="Price"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Carats
                      </label>
                      <input
                        type="number"
                        placeholder="Carats"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        value={formData.carot}
                        onChange={(e) =>
                          setFormData({ ...formData, carot: e.target.value })
                        }
                        required
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      value={formData.shortdes}
                      onChange={(e) =>
                        setFormData({ ...formData, shortdes: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Description
                    </label>
                    <textarea
                      placeholder="Detailed description"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm min-h-24"
                      value={formData.des}
                      onChange={(e) =>
                        setFormData({ ...formData, des: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
                      <option>Diamond</option>
                      <option>Ruby</option>
                      <option>Sapphire</option>
                      <option>Emerald</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.image
                        ? formData.image.name
                        : "Select a new image (optional)"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGem(null)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CusGem;
