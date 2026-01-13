import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Beauty',
    price: '',
    duration: '',
    image: '',
    rating: '4.5',
    level: 'Beginner',
    instructor: '',
    whatYouWillLearn: '',
    prerequisites: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState('');
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const BACKEND_API_URL = 'https://api.hellonature.in/api/courses';
  const UPLOAD_API_URL = 'https://api.hellonature.in/api/upload';
  const categories = ['Beauty', 'Wellness', 'Training', 'Business', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BACKEND_API_URL);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file, isEdit = false) => {
    try {
      if (isEdit) {
        setUploadingEditImage(true);
      } else {
        setUploadingImage(true);
      }
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(UPLOAD_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.imageUrl) {
        if (isEdit) {
          setFormData(prev => ({
            ...prev,
            image: response.data.imageUrl
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            image: response.data.imageUrl
          }));
        }
      }
      
      if (isEdit) {
        setEditingImagePreview(URL.createObjectURL(file));
        setUploadingEditImage(false);
      } else {
        setImagePreview(URL.createObjectURL(file));
        setUploadingImage(false);
      }
      
    } catch (err) {
      console.error('Error uploading image:', err);
      if (isEdit) {
        setUploadingEditImage(false);
      } else {
        setUploadingImage(false);
      }
      alert('Image upload failed. Please use image URL instead.');
    }
  };

  // Handle file input change for add form
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
      
      setImageFile(file);
      handleImageUpload(file, false);
    }
  };

  // Handle file input change for edit form
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
      
      setEditingImageFile(file);
      handleImageUpload(file, true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Course name is required');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Description is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price)) {
      alert('Valid price is required');
      return false;
    }
    if (!formData.duration.trim()) {
      alert('Duration is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const courseData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: formData.duration,
        image: formData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
        rating: parseFloat(formData.rating) || 4.5,
        level: formData.level,
        students: editingCourse?.students || 0,
        instructor: { name: formData.instructor || 'Expert Instructor' },
        whatYouWillLearn: formData.whatYouWillLearn
          ? formData.whatYouWillLearn.split(',').map(item => item.trim()).filter(item => item)
          : [],
        prerequisites: formData.prerequisites
          ? formData.prerequisites.split(',').map(item => item.trim()).filter(item => item)
          : [],
        isActive: true,
        certificate: true,
      };

      if (editingCourse) {
        // Update existing course
        await axios.put(`${BACKEND_API_URL}/${editingCourse._id}`, courseData);
        alert('Course updated successfully!');
      } else {
        // Add new course
        await axios.post(BACKEND_API_URL, courseData);
        alert('Course added successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Beauty',
        price: '',
        duration: '',
        image: '',
        rating: '4.5',
        level: 'Beginner',
        instructor: '',
        whatYouWillLearn: '',
        prerequisites: '',
      });
      setImagePreview('');
      setImageFile(null);
      setEditingImagePreview('');
      setEditingImageFile(null);
      setEditingCourse(null);
      setShowForm(false);
      
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert(error.response?.data?.message || 'Failed to save course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      category: course.category,
      price: course.price.toString(),
      duration: course.duration,
      image: course.image,
      rating: course.rating?.toString() || '4.5',
      level: course.level || 'Beginner',
      instructor: course.instructor?.name || '',
      whatYouWillLearn: Array.isArray(course.whatYouWillLearn) 
        ? course.whatYouWillLearn.join(', ') 
        : '',
      prerequisites: Array.isArray(course.prerequisites) 
        ? course.prerequisites.join(', ') 
        : '',
    });
    setEditingImagePreview('');
    setEditingImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`${BACKEND_API_URL}/${courseId}`);
      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.message || 'Failed to delete course. Please try again.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const allCategories = ['All', ...new Set(courses.map(c => c.category))];
  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  // Course Detail Modal
  if (selectedCourse) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <img 
              src={selectedCourse.image} 
              alt={selectedCourse.name}
              className="w-full h-64 object-cover rounded-t-2xl"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60';
              }}
            />
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="absolute bottom-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {selectedCourse.category}
            </span>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{selectedCourse.name}</h2>
              <span className="text-3xl font-bold text-purple-600">₹{selectedCourse.price}</span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span>{selectedCourse.rating} ({selectedCourse.students || 0} students)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{selectedCourse.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {selectedCourse.level}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    handleEdit(selectedCourse);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setDeleteConfirm(selectedCourse);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{selectedCourse.description}</p>
            </div>

            {selectedCourse.instructor && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Instructor</h3>
                <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedCourse.instructor.name}</p>
                    {selectedCourse.instructor.bio && (
                      <p className="text-sm text-gray-600">{selectedCourse.instructor.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedCourse.whatYouWillLearn && selectedCourse.whatYouWillLearn.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">What You Will Learn</h3>
                <ul className="space-y-2">
                  {selectedCourse.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {selectedCourse.prerequisites.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500">📚</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Delete Confirmation Modal
  if (deleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Course</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add/Edit Course Form
  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingCourse ? 'Update the course details' : 'Fill in the details to create a new course'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCourse(null);
                setImagePreview('');
                setImageFile(null);
                setEditingImagePreview('');
                setEditingImageFile(null);
                setFormData({
                  name: '',
                  description: '',
                  category: 'Beauty',
                  price: '',
                  duration: '',
                  image: '',
                  rating: '4.5',
                  level: 'Beginner',
                  instructor: '',
                  whatYouWillLearn: '',
                  prerequisites: '',
                });
              }}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name *</label>
              <input
                type="text"
                placeholder="e.g., Professional Hair Styling"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                placeholder="Brief description of the course"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleInputChange('category', cat)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                      formData.category === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="199.99"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                <input
                  type="text"
                  placeholder="6 weeks"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange('level', level)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                      formData.level === level
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course Image</label>
              
              {/* Current Image (for edit mode) */}
              {editingCourse && formData.image && !editingImagePreview && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Current Image:</p>
                  <img 
                    src={formData.image} 
                    alt="Current" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition"
                onClick={() => document.getElementById(
                  editingCourse ? 'editImageUpload' : 'courseImageUpload'
                ).click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-purple-500', 'bg-purple-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    if (editingCourse) {
                      handleEditFileChange({ target: { files: [file] } });
                    } else {
                      handleFileChange({ target: { files: [file] } });
                    }
                  }
                }}
              >
                <input
                  type="file"
                  id={editingCourse ? 'editImageUpload' : 'courseImageUpload'}
                  className="hidden"
                  accept="image/*"
                  onChange={editingCourse ? handleEditFileChange : handleFileChange}
                />
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              
              {/* Image Preview */}
              {(imagePreview || editingImagePreview || (!editingCourse && formData.image)) && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</p>
                  <img 
                    src={imagePreview || editingImagePreview || formData.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              {/* Manual URL Input as Fallback */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Or enter image URL:</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => {
                    handleInputChange('image', e.target.value);
                    if (editingCourse) {
                      setEditingImagePreview('');
                      setEditingImageFile(null);
                    } else {
                      setImagePreview('');
                      setImageFile(null);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              
              {/* Uploading Indicator */}
              {(uploadingImage || uploadingEditImage) && (
                <div className="mt-3 flex items-center gap-2 text-sm text-purple-600">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading image...</span>
                </div>
              )}
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor Name</label>
              <input
                type="text"
                placeholder="e.g., Sarah Johnson"
                value={formData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* What You Will Learn */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What You Will Learn</label>
              <textarea
                placeholder="Topic 1, Topic 2, Topic 3"
                value={formData.whatYouWillLearn}
                onChange={(e) => handleInputChange('whatYouWillLearn', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1 italic">Separate each topic with a comma</p>
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prerequisites</label>
              <textarea
                placeholder="Prerequisite 1, Prerequisite 2"
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || uploadingImage || uploadingEditImage}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving Course...' : 
               uploadingImage || uploadingEditImage ? 'Uploading Image...' : 
               editingCourse ? 'Update Course' : 'Add Course'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Course List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">Course Academy</h1>
            <p className="text-gray-600 text-sm mt-1">Expand your skills with expert-led courses</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Course
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No courses found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Add Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {course.category}
                  </span>
                  
                  {/* Action buttons overlay */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                      title="Edit course"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(course)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      title="Delete course"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>{course.students || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {course.level}
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{course.price}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                      onClick={() => setSelectedCourse(course)}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(course)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add some helpful text at the bottom */}
        {filteredCourses.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
              {activeCategory !== 'All' && ` in ${activeCategory} category`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;