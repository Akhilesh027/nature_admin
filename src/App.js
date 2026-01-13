// App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopNavigation from './components/TopNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';
import UserManagement from './components/Usermanagement.jsx';
import BookingManagement from './components/BookingManagement.jsx';
import ProductManagement from './components/ProductManagement.jsx';
import ServiceManagement from './components/ServiceManagement.jsx';
import AdminBannerManager from './components/Banner.jsx';
import Course from './components/Course.jsx';
import EnrollmentManagement from './components/Enrolement.jsx';

function App() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const changeSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="App">
      <Sidebar 
        active={sidebarActive} 
        activeSection={activeSection} 
        changeSection={changeSection} 
      />
      <div id="content" className={sidebarActive ? 'active' : ''}>
        <TopNavigation toggleSidebar={toggleSidebar} />
        {activeSection === 'dashboard' && <Dashboard />}
{activeSection === 'user-management' && <UserManagement />}
{activeSection === 'booking-management' && <BookingManagement />}
{activeSection === 'product-management' && <ProductManagement />}
{activeSection === 'service-management' && <ServiceManagement />}
{activeSection === 'Course-management' && <Course />}
{activeSection === 'Enrollement-management' && <EnrollmentManagement />}
{activeSection === 'Banner' && <AdminBannerManager />}
        {/* Other sections would be conditionally rendered here */}
      </div>
    </div>
  );
}

export default App;