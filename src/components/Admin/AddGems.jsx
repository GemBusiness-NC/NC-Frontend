import React, { useState, useEffect } from 'react';

export default function GemForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    carat: '',
    shortdes: '',
    des: '',
    image: null,
    color: '',
    category: '',
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, text: '', type: '' });
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Categories for dropdown
  const categories = [
    "Diamond", "Ruby", "Sapphire", "Emerald", "Amethyst", 
    "Topaz", "Opal", "Pearl", "Garnet", "Other"
  ];

  // Common colors for dropdown
  const colors = [
    "Clear/White", "Blue", "Red", "Green", "Purple", 
    "Yellow", "Pink", "Orange", "Black", "Multi-colored", "Other"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) <= 0) 
      newErrors.price = "Price must be a positive number";
    
    if (!formData.carat) newErrors.carat = "Carat weight is required";
    else if (isNaN(formData.carat) || Number(formData.carat) <= 0) 
      newErrors.carat = "Carat must be a positive number";
    
    if (!formData.shortdes.trim()) newErrors.shortdes = "Short description is required";
    if (!formData.des.trim()) newErrors.des = "Full description is required";
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.image) newErrors.image = "Image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      // Image validation
      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        setErrors({...errors, image: "Only JPG, PNG, or WEBP formats are accepted"});
        return;
      }
      
      if (fileSize > 10) {
        setErrors({...errors, image: "Image must be less than 10MB"});
        return;
      }
      
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      setErrors({...errors, image: null});
    } else {
      setFormData({ ...formData, [name]: value });
      // Clear error when field is populated
      if (errors[name]) {
        setErrors({...errors, [name]: null});
      }
    }
    
    if (!formTouched) setFormTouched(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        setErrors({...errors, image: "Only JPG, PNG, or WEBP formats are accepted"});
        return;
      }
      
      if (fileSize > 10) {
        setErrors({...errors, image: "Image must be less than 10MB"});
        return;
      }
      
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      setErrors({...errors, image: null});
    }
  };

  const showNotification = (text, type) => {
    setNotification({ visible: true, text, type });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch('http://localhost:4000/api/gems', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        showNotification('Gem uploaded successfully!', 'success');
        // Reset form
        setFormData({
          name: '',
          price: '',
          carat: '',
          shortdes: '',
          des: '',
          image: null,
          color: '',
          category: '',
        });
        setPreview(null);
        setFormTouched(false);
      } else {
        showNotification(result.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showNotification('Connection error. Please try again.', 'error');
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Confirm before leaving if form is touched
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formTouched) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formTouched]);

  // Clean up URL object when unmounting
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg relative mt-8 md:mt-14 border">
      {/* Popup Notification */}
      {notification.visible && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm transform transition-transform duration-300 ease-out ${
          notification.type === 'success' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <p className="font-medium">{notification.text}</p>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
              className="ml-auto text-gray-500 hover:text-gray-700"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">Add New Gem</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Gem Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name"
                name="name" 
                value={formData.name}
                onChange={handleChange} 
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="price"
                  name="price" 
                  value={formData.price}
                  onChange={handleChange} 
                  step="0.01"
                  min="0.01"
                  className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
                  aria-invalid={errors.price ? "true" : "false"}
                  aria-describedby={errors.price ? "price-error" : undefined}
                />
                {errors.price && (
                  <p id="price-error" className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="carat" className="block text-sm font-medium text-gray-700 mb-1">
                  Carat Weight <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="carat"
                  name="carat"
                  step="0.01"
                  min="0.01"
                  value={formData.carat}
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border ${errors.carat ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  aria-invalid={errors.carat ? "true" : "false"}
                  aria-describedby={errors.carat ? "carat-error" : undefined}
                />
                {errors.carat && (
                  <p id="carat-error" className="mt-1 text-sm text-red-600">{errors.carat}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="shortdes" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="shortdes"
                name="shortdes" 
                value={formData.shortdes}
                onChange={handleChange} 
                maxLength="100"
                className={`w-full px-4 py-2 border ${errors.shortdes ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                aria-invalid={errors.shortdes ? "true" : "false"}
                aria-describedby={errors.shortdes ? "shortdes-error" : undefined}
              />
              {errors.shortdes ? (
                <p id="shortdes-error" className="mt-1 text-sm text-red-600">{errors.shortdes}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">{formData.shortdes.length}/100 characters</p>
              )}
            </div>
            
            <div>
              <label htmlFor="des" className="block text-sm font-medium text-gray-700 mb-1">
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="des"
                name="des" 
                value={formData.des}
                onChange={handleChange} 
                rows="4" 
                className={`w-full px-4 py-2 border ${errors.des ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                aria-invalid={errors.des ? "true" : "false"}
                aria-describedby={errors.des ? "des-error" : undefined}
              />
              {errors.des && (
                <p id="des-error" className="mt-1 text-sm text-red-600">{errors.des}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color Field as Dropdown */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Gem Color <span className="text-red-500">*</span>
                </label>
                <select 
                  id="color"
                  name="color" 
                  value={formData.color}
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border ${errors.color ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  aria-invalid={errors.color ? "true" : "false"}
                  aria-describedby={errors.color ? "color-error" : undefined}
                >
                  <option value="">Select a color</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                {errors.color && (
                  <p id="color-error" className="mt-1 text-sm text-red-600">{errors.color}</p>
                )}
              </div>

              {/* Category Field as Dropdown */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Gem Category <span className="text-red-500">*</span>
                </label>
                <select 
                  id="category"
                  name="category" 
                  value={formData.category}
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  aria-invalid={errors.category ? "true" : "false"}
                  aria-describedby={errors.category ? "category-error" : undefined}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <label htmlFor="gemImage" className="block text-sm font-medium text-gray-700 mb-1">
                Gem Image <span className="text-red-500">*</span>
              </label>
              <div 
                className="flex items-center justify-center w-full" 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label 
                  htmlFor="gemImage"
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 ${
                    errors.image ? 'border-red-500 bg-red-50' : 
                    isDragging ? 'border-blue-500 bg-blue-50' : 
                    'border-gray-300 bg-gray-50'
                  } ${
                    !errors.image ? 'border-dashed' : 'border-solid'
                  } rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200`}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="object-contain w-full h-full p-2" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className={`w-10 h-10 mb-3 ${errors.image ? 'text-red-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, or WEBP (Max 10MB)</p>
                    </div>
                  )}
                  <input 
                    type="file"
                    id="gemImage" 
                    name="image" 
                    accept="image/jpeg,image/png,image/webp" 
                    onChange={handleChange} 
                    className="hidden"
                    aria-invalid={errors.image ? "true" : "false"}
                    aria-describedby={errors.image ? "image-error" : undefined}
                  />
                </label>
              </div>
              {errors.image && (
                <p id="image-error" className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>
            
            {preview && (
              <div className="flex justify-between items-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setPreview(null);
                    setFormData({...formData, image: null});
                  }} 
                  className="text-red-600 hover:text-red-800 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Remove image
                </button>
                <p className="text-xs text-gray-500">
                  {formData.image && `${(formData.image.size / 1024 / 1024).toFixed(2)}MB`}
                </p>
              </div>
            )}
            
            {/* Progress indicators and tips */}
            <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-blue-800 font-medium mb-2 text-sm">Form Completion Tips:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.name ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={formData.name ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}></path>
                  </svg>
                  Add a descriptive name
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.price && formData.carat ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={formData.price && formData.carat ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}></path>
                  </svg>
                  Include pricing and weight details
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.color && formData.category ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={formData.color && formData.category ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}></path>
                  </svg>
                  Select color and category
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.image ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={formData.image ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}></path>
                  </svg>
                  Upload a high-quality image
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.shortdes && formData.des ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={formData.shortdes && formData.des ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}></path>
                  </svg>
                  Add compelling descriptions
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => {
              setFormData({
                name: '',
                price: '',
                carat: '',
                shortdes: '',
                des: '',
                image: null,
                color: '',
                category: '',
              });
              setPreview(null);
              setErrors({});
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Reset Form
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Upload Gem
              </span>
            )}
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-2">
          <p>Fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </form>
    </div>
  );
}