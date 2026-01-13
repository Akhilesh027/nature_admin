import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EnrollmentManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    certificateIssued: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    courseName: 'all',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all'
  });
  
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourseForEnrollments, setSelectedCourseForEnrollments] = useState(null);
  const [showCourseEnrollments, setShowCourseEnrollments] = useState(false);

  const BACKEND_API_URL = 'https://api.hellonature.in/api/enrollments';

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BACKEND_API_URL);
      setEnrollments(response.data);
      calculateStats(response.data);
      setFilteredEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const active = data.filter(e => e.status === 'active').length;
    const completed = data.filter(e => e.status === 'completed').length;
    const pending = data.filter(e => e.paymentStatus === 'pending').length;
    const certificateIssued = data.filter(e => e.certificateIssued).length;
    
    setStats({ total, active, completed, pending, certificateIssued });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...enrollments];
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(enrollment => 
        enrollment.userName?.toLowerCase().includes(searchLower) ||
        enrollment.userEmail?.toLowerCase().includes(searchLower) ||
        enrollment.courseName?.toLowerCase().includes(searchLower)
      );
    }
    
    // Course filter
    if (filters.courseName !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.courseName === filters.courseName);
    }
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === filters.status);
    }
    
    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.paymentStatus === filters.paymentStatus);
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const pastDate = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          pastDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          pastDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          pastDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          pastDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(enrollment => {
        const enrollmentDate = new Date(enrollment.enrollmentDate);
        return enrollmentDate >= pastDate;
      });
    }
    
    setFilteredEnrollments(filtered);
  }, [filters, enrollments]);

  // Get unique course names for filter
  const uniqueCourses = ['all', ...new Set(enrollments.map(e => e.courseName))];

  // Handle enrollment status update
  const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
    try {
      await axios.put(`${BACKEND_API_URL}/${enrollmentId}/status`, {
        status: newStatus
      });
      fetchEnrollments();
      alert('Enrollment status updated successfully!');
    } catch (error) {
      console.error('Error updating enrollment:', error);
      alert('Failed to update enrollment status');
    }
  };

  // Handle payment status update
  const updatePaymentStatus = async (enrollmentId, newPaymentStatus) => {
    try {
      await axios.put(`${BACKEND_API_URL}/${enrollmentId}/payment`, {
        paymentStatus: newPaymentStatus
      });
      fetchEnrollments();
      alert('Payment status updated successfully!');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  // Handle certificate issuance
  const issueCertificate = async (enrollmentId) => {
    try {
      await axios.put(`${BACKEND_API_URL}/${enrollmentId}/certificate`, {
        certificateIssued: true,
        certificateUrl: `https://api.hellonature.in/certificates/${enrollmentId}.pdf`
      });
      fetchEnrollments();
      alert('Certificate issued successfully!');
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Failed to issue certificate');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // View enrollment details
  const viewEnrollmentDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetailsModal(true);
  };

  // View enrollments for a specific course
  const viewCourseEnrollments = (courseName) => {
    setSelectedCourseForEnrollments(courseName);
    setShowCourseEnrollments(true);
    setFilters(prev => ({ ...prev, courseName }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      courseName: 'all',
      status: 'all',
      paymentStatus: 'all',
      dateRange: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  // Course-specific enrollment view
  if (showCourseEnrollments && selectedCourseForEnrollments) {
    const courseEnrollments = filteredEnrollments.filter(e => e.courseName === selectedCourseForEnrollments);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Enrollments for: {selectedCourseForEnrollments}
              </h1>
              <p className="text-gray-600 mt-1">
                Total {courseEnrollments.length} enrollments
              </p>
            </div>
            <button
              onClick={() => {
                setShowCourseEnrollments(false);
                setSelectedCourseForEnrollments(null);
                resetFilters();
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to All Enrollments
            </button>
          </div>

          {/* Course Enrollment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{courseEnrollments.length}</div>
              <div className="text-sm text-gray-600">Total Enrollments</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {courseEnrollments.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">
                {courseEnrollments.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {courseEnrollments.filter(e => e.certificateIssued).length}
              </div>
              <div className="text-sm text-gray-600">Certificates Issued</div>
            </div>
          </div>

          {/* Enrollments Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courseEnrollments.map(enrollment => (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.userId.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.userEmail || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(enrollment.enrollmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={enrollment.status}
                          onChange={(e) => updateEnrollmentStatus(enrollment._id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${statusOptions.find(s => s.value === enrollment.status)?.color || 'bg-gray-100'}`}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={enrollment.paymentStatus}
                          onChange={(e) => updatePaymentStatus(enrollment._id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${paymentStatusOptions.find(s => s.value === enrollment.paymentStatus)?.color || 'bg-gray-100'}`}
                        >
                          {paymentStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {enrollment.certificateIssued ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Issued
                          </span>
                        ) : (
                          <button
                            onClick={() => issueCertificate(enrollment._id)}
                            disabled={enrollment.status !== 'completed'}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              enrollment.status === 'completed' 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Issue Certificate
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewEnrollmentDetails(enrollment)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main enrollment management view
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Enrollment Management</h1>
          <p className="text-gray-600 mt-1">Manage student enrollments and track their progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-blue-600 text-2xl">👥</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-green-600 text-2xl">📚</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <span className="text-purple-600 text-2xl">🎓</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <span className="text-yellow-600 text-2xl">💰</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Payment</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                <span className="text-indigo-600 text-2xl">📜</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.certificateIssued}</div>
                <div className="text-sm text-gray-600">Certificates Issued</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, email, or course..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                name="courseName"
                value={filters.courseName}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>
                    {course === 'all' ? 'All Courses' : course}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payment Status</option>
                {paymentStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Enrollments ({filteredEnrollments.length})
            </h2>
            <button
              onClick={() => fetchEnrollments()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
          
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📊</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnrollments.map(enrollment => (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.userName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.userEmail || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.courseName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.courseCategory} • ₹{enrollment.coursePrice}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(enrollment.enrollmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          statusOptions.find(s => s.value === enrollment.status)?.color || 'bg-gray-100'
                        }`}>
                          {statusOptions.find(s => s.value === enrollment.status)?.label || enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          paymentStatusOptions.find(s => s.value === enrollment.paymentStatus)?.color || 'bg-gray-100'
                        }`}>
                          {paymentStatusOptions.find(s => s.value === enrollment.paymentStatus)?.label || enrollment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewEnrollmentDetails(enrollment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => viewCourseEnrollments(enrollment.courseName)}
                            className="text-green-600 hover:text-green-900"
                          >
                            View Course
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Course Enrollment Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Course-wise Enrollment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(
              enrollments.reduce((acc, enrollment) => {
                const courseName = enrollment.courseName || 'Unknown Course';
                if (!acc[courseName]) {
                  acc[courseName] = { total: 0, active: 0, completed: 0 };
                }
                acc[courseName].total++;
                if (enrollment.status === 'active') acc[courseName].active++;
                if (enrollment.status === 'completed') acc[courseName].completed++;
                return acc;
              }, {})
            ).map(([courseName, stats]) => (
              <div key={courseName} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                <h3 className="font-medium text-gray-900 mb-2">{courseName}</h3>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-600">Total</div>
                    <div className="font-medium">{stats.total}</div>
                  </div>
                  <div>
                    <div className="text-green-600">Active</div>
                    <div className="font-medium">{stats.active}</div>
                  </div>
                  <div>
                    <div className="text-blue-600">Completed</div>
                    <div className="font-medium">{stats.completed}</div>
                  </div>
                  <button
                    onClick={() => viewCourseEnrollments(courseName)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Details Modal */}
      {showDetailsModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Enrollment Details</h2>
                  <p className="text-gray-600">ID: {selectedEnrollment._id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Student Information</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-medium">{selectedEnrollment.userName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{selectedEnrollment.userEmail || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">User ID</div>
                      <div className="font-medium">{selectedEnrollment.userId || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Course Information</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-600">Course Name</div>
                      <div className="font-medium">{selectedEnrollment.courseName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Category</div>
                      <div className="font-medium">{selectedEnrollment.courseCategory}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Price</div>
                      <div className="font-medium">₹{selectedEnrollment.coursePrice}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium">{selectedEnrollment.courseDuration}</div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Enrollment Details</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-600">Enrollment Date</div>
                      <div className="font-medium">{formatDate(selectedEnrollment.enrollmentDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${selectedEnrollment.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{selectedEnrollment.progress || 0}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <select
                        value={selectedEnrollment.status}
                        onChange={(e) => updateEnrollmentStatus(selectedEnrollment._id, e.target.value)}
                        className={`mt-1 text-sm font-medium px-3 py-1 rounded-full ${statusOptions.find(s => s.value === selectedEnrollment.status)?.color || 'bg-gray-100'}`}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment & Certificate */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Payment & Certificate</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-600">Payment Status</div>
                      <select
                        value={selectedEnrollment.paymentStatus}
                        onChange={(e) => updatePaymentStatus(selectedEnrollment._id, e.target.value)}
                        className={`mt-1 text-sm font-medium px-3 py-1 rounded-full ${paymentStatusOptions.find(s => s.value === selectedEnrollment.paymentStatus)?.color || 'bg-gray-100'}`}
                      >
                        {paymentStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Certificate</div>
                      {selectedEnrollment.certificateIssued ? (
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            Issued
                          </span>
                          {selectedEnrollment.certificateUrl && (
                            <a 
                              href={selectedEnrollment.certificateUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => issueCertificate(selectedEnrollment._id)}
                          disabled={selectedEnrollment.status !== 'completed'}
                          className={`mt-1 px-3 py-1 rounded text-sm font-medium ${
                            selectedEnrollment.status === 'completed' 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Issue Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Completed Lessons */}
                {selectedEnrollment.completedLessons && selectedEnrollment.completedLessons.length > 0 && (
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Completed Lessons</h3>
                    <div className="space-y-2">
                      {selectedEnrollment.completedLessons.map((lesson, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                          <div className="font-medium">{lesson.lessonId}</div>
                          <div className="text-sm text-gray-600">
                            {lesson.completedAt ? formatDate(lesson.completedAt) : 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;