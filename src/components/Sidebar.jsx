// components/Sidebar.js
import React from 'react';

const Sidebar = ({ active, activeSection, changeSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'user-management', label: 'User Management', icon: 'bi-people' },
    { id: 'service-management', label: 'Package Management', icon: 'bi-briefcase' },
    { id: 'booking-management', label: 'Booking Management', icon: 'bi-calendar-event' },
    { id: 'product-management', label: 'Service Management', icon: 'bi-cart' },
    { id: 'Course-management', label: 'Course Management', icon: 'bi-book' },
    { id: 'Banner', label: 'Banner', icon: 'bi-file-earmark-text' },
    { id: 'finance-reports', label: 'Finance & Reports', icon: 'bi-graph-up' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear' }
  ];

  return (
    <nav id="sidebar" className={active ? 'active' : ''}>
      <div className="sidebar-header">
        <h3>ServicePro</h3>
        <p className="mb-0">Admin Dashboard</p>
      </div>

      <ul className="list-unstyled">
        {menuItems.map(item => (
          <li key={item.id}>
            <a 
              href={`#${item.id}`} 
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                changeSection(item.id);
              }}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;