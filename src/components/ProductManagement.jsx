import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE_URL = 'https://api.hellonature.in/api';

const categories = {
  salon_for_women: {
    name: 'Salon for Women',
    categories: [
      { id: 'waxing', name: 'Waxing', icon: '✨', color: '#E6E6FA' },
      { id: 'facials', name: 'Facials', icon: '💆', color: '#E6E6FA' },
      { id: 'body', name: 'Body', icon: '💪', color: '#E6E6FA' },
      { id: 'mani_pedi', name: 'Mani-Pedi', icon: '💅', color: '#E6E6FA' },
      { id: 'cleanup', name: 'Cleanup', icon: '✨', color: '#E6E6FA' },
      { id: 'bleach_dtan', name: 'Bleach & D-Tan', icon: '🌟', color: '#E6E6FA' },
      { id: 'hair', name: 'Hair', icon: '💇', color: '#E6E6FA' },
    ],
    subCategories: {
      waxing: ["Self Care Package", "Roll-on Wax", "Rica Wax", "Keri Wax", "Face Wax"],
      facials: ["Classic Facial", "Premium Facial", "Ayurvedic Facial", "Gold Facial", "Brightening Facial Kit"],
      body: ["Body Polishing", "Threading & Face Wax"],
      mani_pedi: ["Manicure", "Pedicure", "Combo"],
      cleanup: ["Classic Clean-up", "Gold Clean-up", "Face/Neck Massage"],
      bleach_dtan: ["Bleach + D-Tan"],
      hair: ["Keratin", "Hair Spa with Serum"]
    }
  },
  spa_for_women: {
    name: 'Spa for Women',
    categories: [
      { id: 'Stress relief', name: 'Stress relief', icon: '🌸', color: '#E6E6FA' },
      { id: 'pain relief', name: 'pain relief', icon: '🔥', color: '#E6E6FA' },
      { id: 'post natal', name: 'post natal', icon: '🇹🇭', color: '#E6E6FA' },
      { id: 'Body rituals', name: 'Body rituals', icon: '🦶', color: '#E6E6FA' },
      { id: 'skin care and scrub', name: 'skin care and scrub', icon: '🦶', color: '#E6E6FA' },
    ],
  },
  hydra_facial: {
    name: 'Hydra Facial',
    categories: [
      { id: 'Hydra Basic', name: 'Hydra Basic', icon: '💧', color: '#E6E6FA' },
      { id: 'Hydra clean-up', name: 'Hydra clean-up', icon: '✨', color: '#E6E6FA' },
      { id: 'Body Polishing', name: 'Body Polishing', icon: '🌟', color: '#E6E6FA' },
      { id: 'intimate care', name: 'intimate care', icon: '🌟', color: '#E6E6FA' },
    ],
    subCategories: {
      basic: ["Hydra facials", "Hydra Glow"],
    }
  },
  pre_bridal: {
    name: 'Pre Bridal',
    categories: [
      { id: 'Premium', name: 'Premium', icon: '🎁', color: '#E6E6FA' },
    ],
  }
};

const serviceTypes = [
  { value: 'home_service', label: 'Home Service' },
  { value: 'clinic_service', label: 'Clinic Service' },
  { value: 'both', label: 'Both' }
];

const genderTypes = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' }
];

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Complete product structure with all required fields
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    type: "",
    category: "",
    subCategory: "",
    serviceType: "",
    gender: "",
    sku: '',
    price: '',
    stock: '',
    maxStock: '',
    overview: ['', '', '', ''],
    thingsToKnow: ['', '', '', '', ''],
    procedure: [
      { title: '', desc: '', img: '' },
      { title: '', desc: '', img: '' },
      { title: '', desc: '', img: '' },
      { title: '', desc: '', img: '' }
    ],
    precautions: ['', '', '', '', ''],
    faqs: [
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' }
    ],
    image: '',
    oldPrice: '',
    discount: '',
    rating: '4.8',
    time: '60 mins',
    tag: ''
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [newOverviewItem, setNewOverviewItem] = useState('');
  const [newThingToKnow, setNewThingToKnow] = useState('');
  const [newPrecaution, setNewPrecaution] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Simulate upload - replace with your actual upload endpoint
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      setNewProduct(prev => ({
        ...prev,
        image: data.imageUrl
      }));
      
      setImagePreview(URL.createObjectURL(file));
      setUploadingImage(false);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadingImage(false);
      alert('Image upload failed. Please use image URL instead.');
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      handleImageUpload(file);
    }
  };

  // Handle edit image upload
  const handleEditImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      setEditingProduct(prev => ({
        ...prev,
        image: data.imageUrl
      }));
      
      setUploadingImage(false);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadingImage(false);
      alert('Image upload failed. Please use image URL instead.');
    }
  };

  // Handle edit file input change
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      handleEditImageUpload(file);
    }
  };

  // Stats calculation
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === 'low').length;
  const outOfStockCount = products.filter(p => p.status === 'out').length;
  const categoriesCount = new Set(products.map(p => p.category)).size;

  // Handle form input changes
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    
    if (isEdit) {
      setEditingProduct({
        ...editingProduct,
        [name]: value
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (field, index, value, isEdit = false) => {
    if (isEdit) {
      const updatedArray = [...editingProduct[field]];
      updatedArray[index] = value;
      setEditingProduct({
        ...editingProduct,
        [field]: updatedArray
      });
    } else {
      const updatedArray = [...newProduct[field]];
      updatedArray[index] = value;
      setNewProduct({
        ...newProduct,
        [field]: updatedArray
      });
    }
  };

  // Handle procedure field changes
  const handleProcedureChange = (index, field, value, isEdit = false) => {
    if (isEdit) {
      const updatedProcedure = [...editingProduct.procedure];
      updatedProcedure[index][field] = value;
      setEditingProduct({
        ...editingProduct,
        procedure: updatedProcedure
      });
    } else {
      const updatedProcedure = [...newProduct.procedure];
      updatedProcedure[index][field] = value;
      setNewProduct({
        ...newProduct,
        procedure: updatedProcedure
      });
    }
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value, isEdit = false) => {
    if (isEdit) {
      const updatedFaqs = [...editingProduct.faqs];
      updatedFaqs[index][field] = value;
      setEditingProduct({
        ...editingProduct,
        faqs: updatedFaqs
      });
    } else {
      const updatedFaqs = [...newProduct.faqs];
      updatedFaqs[index][field] = value;
      setNewProduct({
        ...newProduct,
        faqs: updatedFaqs
      });
    }
  };

  // Add new item to array fields
  const addArrayItem = (field, value, setValue, isEdit = false) => {
    if (value.trim()) {
      if (isEdit) {
        setEditingProduct({
          ...editingProduct,
          [field]: [...editingProduct[field], value.trim()]
        });
      } else {
        setNewProduct({
          ...newProduct,
          [field]: [...newProduct[field], value.trim()]
        });
      }
      setValue('');
    }
  };

  // Add new FAQ
  const addFaq = (isEdit = false) => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      if (isEdit) {
        setEditingProduct({
          ...editingProduct,
          faqs: [...editingProduct.faqs, { ...newFaq }]
        });
      } else {
        setNewProduct({
          ...newProduct,
          faqs: [...newProduct.faqs, { ...newFaq }]
        });
      }
      setNewFaq({ question: '', answer: '' });
    }
  };

  // Remove item from array
  const removeArrayItem = (field, index, isEdit = false) => {
    if (isEdit) {
      const updatedArray = [...editingProduct[field]];
      updatedArray.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        [field]: updatedArray
      });
    } else {
      const updatedArray = [...newProduct[field]];
      updatedArray.splice(index, 1);
      setNewProduct({
        ...newProduct,
        [field]: updatedArray
      });
    }
  };

  // Remove FAQ
  const removeFaq = (index, isEdit = false) => {
    if (isEdit) {
      const updatedFaqs = [...editingProduct.faqs];
      updatedFaqs.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        faqs: updatedFaqs
      });
    } else {
      const updatedFaqs = [...newProduct.faqs];
      updatedFaqs.splice(index, 1);
      setNewProduct({
        ...newProduct,
        faqs: updatedFaqs
      });
    }
  };

// Fix the handleAddProduct function
const handleAddProduct = async () => {
  try {
    // Validate required fields
    if (!newProduct.name || !newProduct.type || !newProduct.category || !newProduct.serviceType || !newProduct.gender || !newProduct.sku || !newProduct.price || !newProduct.stock || !newProduct.maxStock) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare the product data with proper array filtering
    const product = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      maxStock: parseInt(newProduct.maxStock),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
      discount: newProduct.discount ? parseInt(newProduct.discount) : null,
      rating: newProduct.rating ? parseFloat(newProduct.rating) : 4.8,
      
      // Fix: Only send non-empty array items
      overview: newProduct.overview.filter(item => item && item.trim() !== ''),
      thingsToKnow: newProduct.thingsToKnow.filter(item => item && item.trim() !== ''),
      precautions: newProduct.precautions.filter(item => item && item.trim() !== ''),
      faqs: newProduct.faqs.filter(faq => 
        faq.question && faq.question.trim() !== '' && 
        faq.answer && faq.answer.trim() !== ''
      ),
      procedure: newProduct.procedure.filter(step => 
        (step.title && step.title.trim() !== '') || 
        (step.desc && step.desc.trim() !== '')
      )
    };
    
    console.log('Sending product data:', product);
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add product');
    }
    
    await fetchProducts();
    setShowAddModal(false);
    
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      type: "",
      category: "",
      subCategory: "",
      serviceType: "",
      gender: "",
      sku: '',
      price: '',
      stock: '',
      maxStock: '',
      overview: ['', '', '', ''],
      thingsToKnow: ['', '', '', '', ''],
      procedure: [
        { title: '', desc: '', img: '' },
        { title: '', desc: '', img: '' },
        { title: '', desc: '', img: '' },
        { title: '', desc: '', img: '' }
      ],
      precautions: ['', '', '', '', ''],
      faqs: [
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' }
      ],
      image: '',
      oldPrice: '',
      discount: '',
      rating: '4.8',
      time: '60 mins',
      tag: ''
    });
    setImagePreview('');
  } catch (err) {
    setError(err.message);
    console.error('Error adding product:', err);
    alert(`Error: ${err.message}`);
  }
};
// Fix the handleEditProduct function
const handleEditProduct = async () => {
  try {
    if (!editingProduct.name || !editingProduct.type || !editingProduct.category || !editingProduct.serviceType || !editingProduct.gender || !editingProduct.sku || !editingProduct.price || !editingProduct.stock || !editingProduct.maxStock) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      stock: parseInt(editingProduct.stock),
      maxStock: parseInt(editingProduct.maxStock),
      oldPrice: editingProduct.oldPrice ? parseFloat(editingProduct.oldPrice) : null,
      discount: editingProduct.discount ? parseInt(editingProduct.discount) : null,
      rating: editingProduct.rating ? parseFloat(editingProduct.rating) : 4.8,
      
      // Fix: Ensure arrays are properly filtered
      overview: Array.isArray(editingProduct.overview) ? 
        editingProduct.overview.filter(item => item && typeof item === 'string' && item.trim() !== '') : [],
      thingsToKnow: Array.isArray(editingProduct.thingsToKnow) ? 
        editingProduct.thingsToKnow.filter(item => item && typeof item === 'string' && item.trim() !== '') : [],
      precautions: Array.isArray(editingProduct.precautions) ? 
        editingProduct.precautions.filter(item => item && typeof item === 'string' && item.trim() !== '') : [],
      faqs: Array.isArray(editingProduct.faqs) ? 
        editingProduct.faqs.filter(faq => 
          faq && typeof faq === 'object' &&
          faq.question && typeof faq.question === 'string' && faq.question.trim() !== '' &&
          faq.answer && typeof faq.answer === 'string' && faq.answer.trim() !== ''
        ) : [],
      procedure: Array.isArray(editingProduct.procedure) ? 
        editingProduct.procedure.filter(step => 
          step && typeof step === 'object' &&
          (
            (step.title && typeof step.title === 'string' && step.title.trim() !== '') ||
            (step.desc && typeof step.desc === 'string' && step.desc.trim() !== '')
          )
        ) : []
    };

    console.log('Updating product with:', updatedProduct);
    
    const response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }
    
    await fetchProducts();
    setShowEditModal(false);
    setEditingProduct(null);
  } catch (err) {
    setError(err.message);
    console.error('Error updating product:', err);
    alert(`Error: ${err.message}`);
  }
};

  // Delete a product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        await fetchProducts();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting product:', err);
      }
    }
  };

  // Open edit modal with product data
  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      overview: Array.isArray(product.overview) ? product.overview : [],
      thingsToKnow: Array.isArray(product.thingsToKnow) ? product.thingsToKnow : [],
      precautions: Array.isArray(product.precautions) ? product.precautions : [],
      faqs: Array.isArray(product.faqs) ? product.faqs : [],
      procedure: Array.isArray(product.procedure) ? product.procedure : []
    });
    setShowEditModal(true);
  };

  // Category badge styling
  const getCategoryClass = (category) => {
    switch(category) {
      case 'cleaning': return 'category-cleaning';
      case 'beauty': return 'category-beauty';
      case 'wellness': return 'category-wellness';
      case 'maintenance': return 'category-maintenance';
      default: return 'category-default';
    }
  };

  // Status badge styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'low': return 'status-low';
      case 'out': return 'status-out';
      default: return 'status-default';
    }
  };

  // Status text
  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'In Stock';
      case 'low': return 'Low Stock';
      case 'out': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  // Category text
  const getCategoryText = (category) => {
    switch(category) {
      case 'cleaning': return 'Cleaning Supplies';
      case 'beauty': return 'Beauty Products';
      case 'wellness': return 'Wellness Items';
      case 'maintenance': return 'Maintenance Tools';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <button className="btn btn-primary" onClick={fetchProducts}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <style>
        {`
          .product-category {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .category-cleaning {
            background-color: rgba(67, 97, 238, 0.15);
            color: #4361ee;
          }
          
          .category-beauty {
            background-color: rgba(247, 37, 133, 0.15);
            color: #f72585;
          }
          
          .category-wellness {
            background-color: rgba(114, 9, 183, 0.15);
            color: #7209b7;
          }
          
          .category-maintenance {
            background-color: rgba(76, 201, 240, 0.15);
            color: #4cc9f0;
          }

          .category-default {
            background-color: rgba(108, 117, 125, 0.15);
            color: #6c757d;
          }
          
          .status-badge {
            padding: 0.35rem 0.65rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
          }
          
          .status-active {
            background-color: rgba(40, 167, 69, 0.15);
            color: #28a745;
          }
          
          .status-low {
            background-color: rgba(255, 193, 7, 0.15);
            color: #ffc107;
          }
          
          .status-out {
            background-color: rgba(220, 53, 69, 0.15);
            color: #dc3545;
          }

          .status-default {
            background-color: rgba(108, 117, 125, 0.15);
            color: #6c757d;
          }
          
          .inventory-bar {
            height: 8px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .inventory-progress {
            height: 100%;
            border-radius: 4px;
          }

          .no-products {
            text-align: center;
            padding: 3rem;
            color: #6c757d;
          }

          .no-products i {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .array-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
          }
          
          .procedure-item {
            margin-bottom: 1rem;
            padding: 1rem;
            border: 1px solid #dee2e6;
            border-radius: 0.375rem;
          }
          
          .faq-item {
            margin-bottom: 1rem;
            padding: 1rem;
            border: 1px solid #dee2e6;
            border-radius: 0.375rem;
          }

          .image-preview {
            max-width: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 0.375rem;
            margin-top: 0.5rem;
          }

          .upload-area {
            border: 2px dashed #dee2e6;
            border-radius: 0.375rem;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.15s ease-in-out;
          }

          .upload-area:hover {
            border-color: #0d6efd;
          }

          .upload-area.dragover {
            border-color: #0d6efd;
            background-color: rgba(13, 110, 253, 0.05);
          }

          .required-field::after {
            content: " *";
            color: #dc3545;
          }
        `}
      </style>
      
      {/* Product Management Section */}
      <section id="product-management">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Product Management</h2>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>Add New Product
          </button>
        </div>

        {/* Quick Stats */}
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title text-muted">Total Products</h5>
                <h2 className="text-primary">{totalProducts}</h2>
                <p className="card-text text-success">
                  <i className="bi bi-arrow-up"></i> 12% from last month
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title text-muted">Low Stock</h5>
                <h2 className="text-warning">{lowStockCount}</h2>
                <p className="card-text text-danger">
                  <i className="bi bi-exclamation-triangle"></i> Needs attention
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title text-muted">Out of Stock</h5>
                <h2 className="text-danger">{outOfStockCount}</h2>
                <p className="card-text">
                  <i className="bi bi-clock"></i> Restock pending
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title text-muted">Categories</h5>
                <h2 className="text-info">{categoriesCount}</h2>
                <p className="card-text">
                  <i className="bi bi-tags"></i> Product categories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>All Products</span>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2">
                <i className="bi bi-filter me-1"></i>Filter
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="bi bi-download me-1"></i>Export
              </button>
            </div>
          </div>
          <div className="card-body">
            {products.length === 0 ? (
              <div className="no-products">
                <i className="bi bi-inbox"></i>
                <h4>No Products Available</h4>
                <p>Get started by adding your first product to the inventory.</p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add New Product
                </button>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value=""/>
                          </div>
                        </th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Service Type</th>
                        <th>Gender</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Inventory</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id}>
                          <td>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value=""/>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={product.image || '/placeholder-image.jpg'} 
                                className="rounded me-3" 
                                alt="Product" 
                                width="40" 
                                height="40"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMCAxM0MxNi4xMyAxMyAxMyAxNi4xMyAxMyAyMEMxMyAyMy44NyAxNi4xMyAyNyAyMCAyN0MyMy44NyAyNyAyNyAyMy44NyAyNyAyMEMyNyAxNi4xMyAyMy44NyAxMyAyMCAxM1pNMjAgMjVDMTcuMjQgMjUgMTUgMjIuNzYgMTUgMjBDMTUgMTcuMjQgMTcuMjQgMTUgMjAgMTVDMjIuNzYgMTUgMjUgMTcuMjQgMjUgMjBDMjUgMjIuNzYgMjIuNzYgMjUgMjAgMjVaIiBmaWxsPSIjQ0VDRUNFIi8+CjxwYXRoIGQ9Ik0yNi4zNiAxNC4zNkwyNS4yNyAxMy4yN0wyMCAxOC41NEwxNC43MyAxMy4yN0wxMy42NCAxNC4zNkwxOC45MSAxOS42M0wxMy42NCAyNC45TDE0LjczIDI1Ljk5TDIwIDIwLjcyTDI1LjI3IDI1Ljk5TDI2LjM2IDI0LjlMMjEuMDkgMTkuNjNMMjYuMzYgMTQuMzZaIiBmaWxsPSIjQ0VDRUNFIi8+Cjwvc3ZnPgo=';
                                }}
                              />
                              <div>
                                <h6 className="mb-0">{product.name}</h6>
                                <small className="text-muted">{product.description}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`product-category ${getCategoryClass(product.category)}`}>
                              {getCategoryText(product.category)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {serviceTypes.find(st => st.value === product.serviceType)?.label || product.serviceType}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {genderTypes.find(gt => gt.value === product.gender)?.label || product.gender}
                            </span>
                          </td>
                          <td>{product.sku}</td>
                          <td>${product.price?.toFixed(2)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">{product.stock}/{product.maxStock}</div>
                              <div className="inventory-bar" style={{width: '100px'}}>
                                <div 
                                  className={`inventory-progress ${
                                    product.status === 'active' ? 'bg-success' : 
                                    product.status === 'low' ? 'bg-warning' : 'bg-danger'
                                  }`} 
                                  style={{width: `${(product.stock / product.maxStock) * 100}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusClass(product.status)}`}>
                              {getStatusText(product.status)}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => openEditModal(product)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex="-1">Previous</a>
                    </li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                      <a className="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                <form>
                  <h6 className="mb-3">Basic Information</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productName" className="form-label required-field">Product Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    {/* Service Type Dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label required-field">Service Type</label>
                      <select
                        className="form-select"
                        name="serviceType"
                        value={newProduct.serviceType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Service Type</option>
                        {serviceTypes.map(st => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    {/* Gender Dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label required-field">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={newProduct.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        {genderTypes.map(gt => (
                          <option key={gt.value} value={gt.value}>
                            {gt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type Dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label required-field">Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={newProduct.type}
                        onChange={(e) => {
                          handleInputChange(e);
                          setNewProduct((prev) => ({ ...prev, category: "", subCategory: "" }));
                        }}
                        required
                      >
                        <option value="">Select Type</option>
                        {Object.keys(categories).map((type) => (
                          <option key={type} value={type}>
                            {categories[type].name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category Dropdown (after Type is selected) */}
                  {newProduct.type && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label required-field">Category</label>
                        <select
                          className="form-select"
                          name="category"
                          value={newProduct.category}
                          onChange={(e) => {
                            handleInputChange(e);
                            setNewProduct((prev) => ({ ...prev, subCategory: "" }));
                          }}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories[newProduct.type].categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory Dropdown (only if subcategories exist for selected category) */}
                      {newProduct.type &&
                        newProduct.category &&
                        categories[newProduct.type]?.subCategories?.[newProduct.category] && (
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Sub Category</label>
                            <select
                              className="form-select"
                              name="subCategory"
                              value={newProduct.subCategory}
                              onChange={handleInputChange}
                            >
                              <option value="">Select Sub Category</option>
                              {categories[newProduct.type].subCategories[newProduct.category].length > 0 ? (
                                categories[newProduct.type].subCategories[newProduct.category].map((sub) => (
                                  <option key={sub} value={sub}>
                                    {sub}
                                  </option>
                                ))
                              ) : (
                                <option value="All">All</option>
                              )}
                            </select>
                          </div>
                        )}
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productSKU" className="form-label required-field">SKU</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="sku"
                        value={newProduct.sku}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productDescription" className="form-label">Description</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="productPrice" className="form-label required-field">Price ($)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        min="0" 
                        step="0.01" 
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="productOldPrice" className="form-label">Original Price ($)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="oldPrice"
                        value={newProduct.oldPrice}
                        onChange={handleInputChange}
                        min="0" 
                        step="0.01" 
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="productDiscount" className="form-label">Discount (%)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="discount"
                        value={newProduct.discount}
                        onChange={handleInputChange}
                        min="0" 
                        max="100" 
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="productStock" className="form-label required-field">Current Stock</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        min="0" 
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="productMaxStock" className="form-label required-field">Max Stock</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="maxStock"
                        value={newProduct.maxStock}
                        onChange={handleInputChange}
                        min="0" 
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="productTime" className="form-label">Service Duration</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="time"
                        value={newProduct.time}
                        onChange={handleInputChange}
                        placeholder="e.g., 60 mins"
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productRating" className="form-label">Rating</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="rating"
                        value={newProduct.rating}
                        onChange={handleInputChange}
                        min="0" 
                        max="5" 
                        step="0.1"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productTag" className="form-label">Tag/Subtitle</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="tag"
                        value={newProduct.tag}
                        onChange={handleInputChange}
                        placeholder="Short descriptive tag"
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    
                    {/* Upload Area */}
                    <div 
                      className="upload-area"
                      onClick={() => document.getElementById('imageUpload').click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('dragover');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageUpload(file);
                      }}
                    >
                      <input
                        type="file"
                        id="imageUpload"
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <i className="bi bi-cloud-upload display-4 text-muted"></i>
                      <p className="mt-2 mb-1">Click to upload or drag and drop</p>
                      <p className="text-muted small">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    
                    {/* Image Preview */}
                    {(imagePreview || newProduct.image) && (
                      <div className="mt-3">
                        <p className="form-label">Image Preview:</p>
                        <img 
                          src={imagePreview || newProduct.image} 
                          alt="Preview" 
                          className="image-preview"
                        />
                      </div>
                    )}
                    
                    {/* Manual URL Input as Fallback */}
                    <div className="mt-3">
                      <label htmlFor="productImage" className="form-label">Or enter image URL:</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="image"
                        value={newProduct.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    {/* Uploading Indicator */}
                    {uploadingImage && (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Uploading...</span>
                        </div>
                        <small className="text-muted">Uploading image...</small>
                      </div>
                    )}
                  </div>
                  
                  <hr className="my-4" />
                  <h6 className="mb-3">Product Details</h6>
                  
                  <div className="mb-3">
                    <label className="form-label">Overview Features</label>
                    {newProduct.overview.map((item, index) => (
                      item.trim() !== '' && (
                        <div key={index} className="array-item">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={item}
                            onChange={(e) => handleArrayFieldChange('overview', index, e.target.value)}
                            placeholder={`Feature ${index + 1}`}
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeArrayItem('overview', index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )
                    ))}
                    <div className="d-flex mt-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={newOverviewItem}
                        onChange={(e) => setNewOverviewItem(e.target.value)}
                        placeholder="Add new feature"
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-primary"
                        onClick={() => addArrayItem('overview', newOverviewItem, setNewOverviewItem)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Things To Know</label>
                    {newProduct.thingsToKnow.map((item, index) => (
                      item.trim() !== '' && (
                        <div key={index} className="array-item">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={item}
                            onChange={(e) => handleArrayFieldChange('thingsToKnow', index, e.target.value)}
                            placeholder={`Important note ${index + 1}`}
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeArrayItem('thingsToKnow', index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )
                    ))}
                    <div className="d-flex mt-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={newThingToKnow}
                        onChange={(e) => setNewThingToKnow(e.target.value)}
                        placeholder="Add new note"
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-primary"
                        onClick={() => addArrayItem('thingsToKnow', newThingToKnow, setNewThingToKnow)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                {newProduct.procedure.map((step, index) => (
  <div key={index} className="procedure-item">
    <h6>Step {index + 1}</h6>
    <div className="row">
      <div className="col-md-6 mb-2">
        <input
          type="text"
          className="form-control"
          value={step.title}
          onChange={e => handleProcedureChange(index, 'title', e.target.value)}
          placeholder="Step title"
        />
      </div>
      <div className="col-md-6 mb-2">
        <input
          type="text"
          className="form-control"
          value={step.img}
          onChange={e => handleProcedureChange(index, 'img', e.target.value)}
          placeholder="Image URL"
        />
      </div>
    </div>
    <textarea
      className="form-control"
      value={step.desc}
      onChange={e => handleProcedureChange(index, 'desc', e.target.value)}
      placeholder="Step description"
      rows="2"
    />
  </div>
))}

                  
                  <div className="mb-3">
                    <label className="form-label">Precautions & Aftercare</label>
                    {newProduct.precautions.map((item, index) => (
                      item.trim() !== '' && (
                        <div key={index} className="array-item">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={item}
                            onChange={(e) => handleArrayFieldChange('precautions', index, e.target.value)}
                            placeholder={`Precaution ${index + 1}`}
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeArrayItem('precautions', index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )
                    ))}
                    <div className="d-flex mt-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={newPrecaution}
                        onChange={(e) => setNewPrecaution(e.target.value)}
                        placeholder="Add new precaution"
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-primary"
                        onClick={() => addArrayItem('precautions', newPrecaution, setNewPrecaution)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">FAQs</label>
                    {newProduct.faqs.map((faq, index) => (
                      faq.question.trim() !== '' && faq.answer.trim() !== '' && (
                        <div key={index} className="faq-item">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>FAQ {index + 1}</h6>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFaq(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                          <div className="mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={faq.question}
                              onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                              placeholder="Question"
                            />
                          </div>
                          <div>
                            <textarea
                              className="form-control"
                              value={faq.answer}
                              onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                              placeholder="Answer"
                              rows="3"
                            />
                          </div>
                        </div>
                      )
                    ))}
                    <div className="faq-item">
                      <h6>Add New FAQ</h6>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={newFaq.question}
                          onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                          placeholder="Question"
                        />
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          value={newFaq.answer}
                          onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                          placeholder="Answer"
                          rows="3"
                        />
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-primary"
                        onClick={() => addFaq()}
                      >
                        Add FAQ
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Add Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                <form>
                  <h6 className="mb-3">Basic Information</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editProductName" className="form-label required-field">Product Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={editingProduct.name}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      />
                    </div>
                    
                    {/* Service Type Dropdown in Edit Modal */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label required-field">Service Type</label>
                      <select
                        className="form-select"
                        name="serviceType"
                        value={editingProduct.serviceType || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      >
                        <option value="">Select Service Type</option>
                        {serviceTypes.map(st => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    {/* Gender Dropdown in Edit Modal */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label required-field">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={editingProduct.gender || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      >
                        <option value="">Select Gender</option>
                        {genderTypes.map(gt => (
                          <option key={gt.value} value={gt.value}>
                            {gt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type Dropdown in Edit Modal */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label required-field">Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={editingProduct.type || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      >
                        <option value="">Select Type</option>
                        {Object.keys(categories).map((type) => (
                          <option key={type} value={type}>
                            {categories[type].name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category Dropdown in Edit Modal */}
                  {editingProduct.type && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label required-field">Category</label>
                        <select
                          className="form-select"
                          name="category"
                          value={editingProduct.category || ''}
                          onChange={(e) => handleInputChange(e, true)}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories[editingProduct.type].categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory Dropdown in Edit Modal */}
                      {editingProduct.type &&
                        editingProduct.category &&
                        categories[editingProduct.type]?.subCategories?.[editingProduct.category] && (
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Sub Category</label>
                            <select
                              className="form-select"
                              name="subCategory"
                              value={editingProduct.subCategory || ''}
                              onChange={(e) => handleInputChange(e, true)}
                            >
                              <option value="">Select Sub Category</option>
                              {categories[editingProduct.type].subCategories[editingProduct.category].length > 0 ? (
                                categories[editingProduct.type].subCategories[editingProduct.category].map((sub) => (
                                  <option key={sub} value={sub}>
                                    {sub}
                                  </option>
                                ))
                              ) : (
                                <option value="All">All</option>
                              )}
                            </select>
                          </div>
                        )}
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editProductSKU" className="form-label required-field">SKU</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="sku"
                        value={editingProduct.sku}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editProductDescription" className="form-label">Description</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="description"
                        value={editingProduct.description}
                        onChange={(e) => handleInputChange(e, true)}
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editProductPrice" className="form-label required-field">Price ($)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price"
                        value={editingProduct.price}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0" 
                        step="0.01" 
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editProductOldPrice" className="form-label">Original Price ($)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="oldPrice"
                        value={editingProduct.oldPrice || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0" 
                        step="0.01" 
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editProductDiscount" className="form-label">Discount (%)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="discount"
                        value={editingProduct.discount || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0" 
                        max="100" 
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editProductStock" className="form-label required-field">Current Stock</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="stock"
                        value={editingProduct.stock}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0" 
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editProductMaxStock" className="form-label required-field">Max Stock</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="maxStock"
                        value={editingProduct.maxStock}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0" 
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editProductTime" className="form-label">Service Duration</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="time"
                        value={editingProduct.time || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="e.g., 60 mins"
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editProductRating" className="form-label">Rating</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="rating"
                        value={editingProduct.rating || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0" 
                        max="5" 
                        step="0.1"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editProductTag" className="form-label">Tag/Subtitle</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="tag"
                        value={editingProduct.tag || ''}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Short descriptive tag"
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Section in Edit Modal */}
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    
                    {/* Current Image Preview */}
                    {editingProduct.image && (
                      <div className="mb-3">
                        <p className="form-label">Current Image:</p>
                        <img 
                          src={editingProduct.image} 
                          alt="Current" 
                          className="image-preview"
                        />
                      </div>
                    )}
                    
                    {/* Upload Area for Edit */}
                    <div 
                      className="upload-area"
                      onClick={() => document.getElementById('editImageUpload').click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('dragover');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                        const file = e.dataTransfer.files[0];
                        if (file) handleEditImageUpload(file);
                      }}
                    >
                      <input
                        type="file"
                        id="editImageUpload"
                        className="d-none"
                        accept="image/*"
                        onChange={handleEditFileChange}
                      />
                      <i className="bi bi-cloud-upload display-4 text-muted"></i>
                      <p className="mt-2 mb-1">Click to upload or drag and drop</p>
                      <p className="text-muted small">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    
                    {/* Manual URL Input as Fallback */}
                    <div className="mt-3">
                      <label htmlFor="editProductImage" className="form-label">Or enter image URL:</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="image"
                        value={editingProduct.image}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    {/* Uploading Indicator */}
                    {uploadingImage && (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Uploading...</span>
                        </div>
                        <small className="text-muted">Uploading image...</small>
                      </div>
                    )}
                  </div>
                  
                  <hr className="my-4" />
                  <h6 className="mb-3">Product Details</h6>
                  
                  {/* The rest of the edit form sections (overview, thingsToKnow, procedure, precautions, faqs) */}
                  {/* These would be similar to the add modal but using editingProduct state */}
                  
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleEditProduct}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modals */}
      {(showAddModal || showEditModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default ProductManagement;