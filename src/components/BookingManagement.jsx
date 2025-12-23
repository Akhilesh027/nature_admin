import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal component (unchanged)
const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

const BookingManagement = () => {
    const [activeTab, setActiveTab] = useState('all-bookings');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'add' | 'assign'
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('https://api.hellonature.in/api/staff');
                setStaffList(response.data);
            } catch (err) {
                console.error('Failed to fetch staff list');
                setError('Failed to fetch staff list');
            }
        };
        fetchStaff();
    }, []);

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('https://api.hellonature.in/api/bookings'); 
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Filters
    const todayObj = new Date();
    const filterByTab = booking => {
        // NOTE: Use booking.booking?.date for service date, not orderDate, for upcoming/past/today logic
        const date = new Date(booking.booking?.date || booking.orderDate); 
        if (activeTab === 'today') return date.toDateString() === todayObj.toDateString();
        if (activeTab === 'upcoming') return date > todayObj;
        if (activeTab === 'past') return date < todayObj;
        return true;
    };
    const filterByStatus = booking => statusFilter === 'all' || booking.paymentType === statusFilter; 
    const filterBySearch = booking => {
        const term = searchTerm.toLowerCase();
        return (
            (booking.orderId && booking.orderId.toLowerCase().includes(term)) ||
            (booking.address?.fullName && booking.address.fullName.toLowerCase().includes(term)) ||
            (booking.address?.street && booking.address.street.toLowerCase().includes(term))
        );
    };
    const filteredBookings = bookings.filter(filterByTab).filter(filterByStatus).filter(filterBySearch);

    // Stats
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.paymentType === 'Cash on Delivery').length,
        completed: bookings.filter(b => b.paymentType === 'Online Payment').length,
        pending: bookings.filter(b => b.paymentType === 'Credit Card').length,
        cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    };

    const statusBadge = paymentType => {
        const statusClasses = {
            'Cash on Delivery': 'bg-yellow-100 text-yellow-800',
            'Credit Card': 'bg-blue-100 text-blue-800',
            'Online Payment': 'bg-green-100 text-green-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[paymentType] || 'bg-gray-100 text-gray-800'}`}>
                {paymentType}
            </span>
        );
    };
    
    // Service Type Badge helper function (unchanged)
    const serviceTypeBadge = serviceType => {
        const type = serviceType ? serviceType.toLowerCase() : 'unknown';
        const typeClasses = {
            'home': 'bg-indigo-100 text-indigo-800',
            'clinic': 'bg-pink-100 text-pink-800',
            'unknown': 'bg-gray-100 text-gray-800',
        };
        const typeDisplay = {
            'home': 'Home',
            'clinic': 'Clinic',
            'unknown': 'N/A',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[type]}`}>
                {typeDisplay[type]}
            </span>
        );
    };

    // CRUD functions (mostly unchanged)
    const handleDelete = async id => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        setLoading(true);
        try {
            await axios.delete(`https://api.hellonature.in/api/bookings/${id}`);
            setBookings(bookings.filter(b => b._id !== id));
            setSuccessMessage('Booking deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to delete booking.');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, booking = null) => {
        setSelectedBooking(booking);
        setModalType(type);
        setSelectedStaff(booking?.assignedStaff?._id || booking?.assignedStaff?.id || '');
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedBooking(null);
        setSelectedStaff('');
        setAssigning(false);
    };

    const handleSaveEdit = async updatedBooking => {
        setLoading(true);
        closeModal();
        try {
            await axios.put(
                `https://api.hellonature.in/api/bookings/${updatedBooking._id}`,
                updatedBooking
            );
            setBookings(bookings => bookings.map(b => (b._id === updatedBooking._id ? updatedBooking : b)));
            setSuccessMessage('Booking updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to update booking.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAdd = async newBooking => {
        setLoading(true);
        closeModal();
        try {
            const response = await axios.post(
                `https://api.hellonature.in/api/bookings`,
                newBooking
            );
            setBookings(bookings => [...bookings, response.data]);
            setSuccessMessage('Booking added successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to add booking.');
        } finally {
            setLoading(false);
        }
    };

    // Assign staff functionality (unchanged)
    const handleAssignStaff = async () => {
        if (!selectedStaff) return;
        
        setAssigning(true);
        try {
            const response = await axios.patch(
                `https://api.hellonature.in/api/bookings/${selectedBooking._id}/assign`,
                { staffId: selectedStaff }
            );
            
            // Update the booking in state with the assigned staff
            setBookings(bookings =>
                bookings.map(b =>
                    b._id === selectedBooking._id
                        ? { ...b, assignedStaff: response.data.assignedStaff }
                        : b
                )
            );
            
            // Get the staff name for the success message
            const staffName = staffList.find(s => s._id === selectedStaff || s.id === selectedStaff)?.name;
            setSuccessMessage(`Successfully assigned ${staffName} to booking ${selectedBooking.orderId}`);
            
            setTimeout(() => setSuccessMessage(''), 3000);
            closeModal();
        } catch (err) {
            setError('Failed to assign staff.');
            console.error('Assignment error:', err);
        } finally {
            setAssigning(false);
        }
    };

    // Modals (Updated to show full booking details)
    const BookingViewModal = () => selectedBooking && (
        <Modal isOpen onClose={closeModal} title="Booking Details">
            <div className="space-y-3 text-sm">
                <h4 className="text-lg font-semibold border-b pb-1 mb-2">Service Information</h4>
                <div className='flex justify-between items-center'>
                    <b>Service Type:</b> 
                    {serviceTypeBadge(selectedBooking.booking?.serviceType)}
                </div>
                <div className='flex justify-between'>
                    <b>Service Date:</b> {new Date(selectedBooking.booking?.date).toLocaleDateString()}
                </div>
                <div className='flex justify-between'>
                    <b>Time Slot:</b> {selectedBooking.booking?.timeSlot}
                </div>
                
                <h4 className="text-lg font-semibold border-b pb-1 mb-2 mt-4">Order & Customer</h4>
                <div><b>Order ID:</b> {selectedBooking.orderId}</div>
                <div><b>Customer:</b> {selectedBooking.address?.fullName}</div>
                <div><b>Phone:</b> {selectedBooking.address?.phone}</div>
                {/* Conditionally display full address for home service */}
                {selectedBooking.booking?.serviceType === 'home' ? (
                    <div><b>Address:</b> {`${selectedBooking.address?.street}, ${selectedBooking.address?.city}, ${selectedBooking.address?.state}, ${selectedBooking.address?.zipCode}`}</div>
                ) : (
                    <div><b>Location:</b> Clinic Service (No home address required)</div>
                )}
                
                <div><b>Order Placed:</b> {new Date(selectedBooking.orderDate).toLocaleString()}</div>
                <div><b>Total:</b> ${selectedBooking.amounts?.total.toFixed(2)}</div>
                <div><b>Payment Type:</b> {selectedBooking.paymentType}</div>
                <div><b>Assigned Staff:</b> {selectedBooking.assignedStaff?.name || 'Not assigned'}</div>
            </div>
        </Modal>
    );
    
    // Edit, Add, Assign Modals (unchanged as they are placeholder forms)
    const BookingEditModal = () => selectedBooking && (
        <Modal isOpen onClose={closeModal} title="Edit Booking">
            <div>(Edit Booking Form Goes Here)</div>
            <button
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={() => handleSaveEdit(selectedBooking)}
            >
                Save Changes
            </button>
        </Modal>
    );
    
    const BookingAddModal = () => (
        <Modal isOpen onClose={closeModal} title="Add Booking">
            <div>(Add Booking Form Goes Here)</div>
            <button
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={() =>
                    handleSaveAdd({
                        orderId: 'NEWID',
                        address: {
                            fullName: 'Test User',
                            phone: '1234567890',
                            street: 'New Street',
                            city: 'Cityville',
                            state: 'CA',
                            zipCode: '12345',
                        },
                        booking: { date: new Date().toISOString(), timeSlot: '10:00 AM', serviceType: 'home' },
                        orderDate: new Date(),
                        paymentType: 'Cash on Delivery',
                        amounts: { total: 100 },
                    })
                }
            >
                Save Booking
            </button>
        </Modal>
    );
    
    const BookingAssignModal = () => selectedBooking && (
        <Modal isOpen onClose={closeModal} title="Assign Staff">
            <div>
                <label className="mb-2 block text-sm">Select Staff Member:</label>
                <select 
                    className="w-full px-3 py-2 border rounded" 
                    value={selectedStaff} 
                    onChange={e => setSelectedStaff(e.target.value)}
                >
                    <option value="">Select staff...</option>
                    {staffList && staffList.length > 0 ? (
                        staffList.map(staff => (
                            <option value={staff._id || staff.id} key={staff._id || staff.id}>
                                {staff.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No staff available</option>
                    )}
                </select>
                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-400" 
                        onClick={handleAssignStaff}
                        disabled={!selectedStaff || assigning}
                    >
                        {assigning ? 'Assigning...' : 'Assign Staff'}
                    </button>
                </div>
            </div>
        </Modal>
    );

    // Main render
    return (
        <section id="booking-management-content" className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
                <p className="text-gray-600">Manage and track all service bookings</p>
            </div>
            
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {successMessage}
                </div>
            )}
            
            {/* Stats (unchanged) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="rounded-full p-3 bg-blue-100 text-blue-600">
                            <i className="bi bi-calendar-check text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <div className="text-gray-500 text-sm">Total Bookings</div>
                            <div className="text-xl font-bold text-gray-800">{stats.total}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="rounded-full p-3 bg-yellow-100 text-yellow-600">
                            <i className="bi bi-cash text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <div className="text-gray-500 text-sm">Confirmed</div>
                            <div className="text-xl font-bold text-gray-800">{stats.confirmed}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="rounded-full p-3 bg-green-100 text-green-600">
                            <i className="bi bi-credit-card text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <div className="text-gray-500 text-sm">Completed</div>
                            <div className="text-xl font-bold text-gray-800">{stats.completed}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="rounded-full p-3 bg-purple-100 text-purple-600">
                            <i className="bi bi-clock text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <div className="text-gray-500 text-sm">Pending</div>
                            <div className="text-xl font-bold text-gray-800">{stats.pending}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <div className="rounded-full p-3 bg-red-100 text-red-600">
                            <i className="bi bi-x-circle text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <div className="text-gray-500 text-sm">Cancelled</div>
                            <div className="text-xl font-bold text-gray-800">{stats.cancelled}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Filters (unchanged) */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'all-bookings' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveTab('all-bookings')}>All Bookings</button>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'today' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveTab('today')}>Today</button>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'upcoming' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveTab('upcoming')}>Upcoming</button>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'past' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveTab('past')}>Past</button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="all">All Payment Types</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Online Payment">Online Payment</option>
                        </select>
                        <div className="relative">
                            <input type="text" placeholder="Search bookings..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <i className="bi bi-search absolute right-3 top-2.5 text-gray-400"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Booking Table */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading bookings...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service/Time</th> {/* UPDATED COLUMN */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map(booking => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-indigo-600">{booking.orderId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.address?.fullName}</div>
                                            <div className="text-xs text-gray-500">{booking.address?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {/* Show 'Clinic Service' or a truncated address for Home Service */}
                                            {booking.booking?.serviceType === 'clinic' ? (
                                                <span className="text-pink-600 font-medium">Clinic Service</span>
                                            ) : (
                                                `${booking.address?.street}, ${booking.address?.city}`
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {/* Show Service Type Badge */}
                                            <div className="text-sm font-medium text-gray-900">
                                                {serviceTypeBadge(booking.booking?.serviceType)}
                                            </div>
                                            {/* Show Service Date and Time Slot */}
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(booking.booking?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {booking.booking?.timeSlot}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(booking.orderDate).toLocaleDateString()} {new Date(booking.orderDate).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${booking.amounts?.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{statusBadge(booking.paymentType)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {booking.assignedStaff ? (
                                                <div>
                                                    <div className="font-medium">{booking.assignedStaff.name}</div>
                                                    <div className="text-xs text-gray-500">Assigned</div>
                                                </div>
                                            ) : (
                                                <span className="text-red-500">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => openModal('view', booking)}>
                                                <i className="bi bi-eye"></i> View
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900 mr-3" onClick={() => openModal('edit', booking)}>
                                                <i className="bi bi-pencil"></i> Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 mr-3" onClick={() => handleDelete(booking._id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                            <button className="text-green-600 hover:text-green-900" onClick={() => openModal('assign', booking)}>
                                                <i className="bi bi-person-plus"></i> Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Add Booking Button (unchanged) */}
            <div className="fixed bottom-6 right-6">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center" onClick={() => openModal('add')}>
                    <i className="bi bi-plus-lg text-xl"></i>
                </button>
            </div>
            
            {/* Modals */}
            {modalType === 'view' && <BookingViewModal />}
            {modalType === 'edit' && <BookingEditModal />}
            {modalType === 'add' && <BookingAddModal />}
            {modalType === 'assign' && <BookingAssignModal />}
        </section>
    );
};

export default BookingManagement;