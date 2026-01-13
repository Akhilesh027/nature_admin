// App.js
import React, { useState, useEffect } from 'react';
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

const ADMIN_PASSWORD = "admin@123";   // 🔐 Default Security Password

function App() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const changeSection = (section) => {
    setActiveSection(section);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError('');
    } else {
      setError("Invalid Security Password");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setPassword('');
  };

  // 🔐 SECURITY LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2>🔐 Admin Security</h2>
          <p>Enter Security Password</p>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={handleLogin} style={styles.button}>
            Unlock Dashboard
          </button>

          <p style={{ marginTop: "10px", fontSize: "12px", color: "#777" }}>
            Default Password: <b>admin@123</b>
          </p>
        </div>
      </div>
    );
  }

  // 🔓 MAIN ADMIN PANEL
  return (
    <div className="App">
      <Sidebar 
        active={sidebarActive} 
        activeSection={activeSection} 
        changeSection={changeSection} 
      />

      <div id="content" className={sidebarActive ? 'active' : ''}>
        <TopNavigation toggleSidebar={toggleSidebar} />

        <div style={{ textAlign: "right", padding: "10px" }}>
          <button onClick={logout} style={styles.logoutBtn}>🔒 Lock</button>
        </div>

        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'user-management' && <UserManagement />}
        {activeSection === 'booking-management' && <BookingManagement />}
        {activeSection === 'product-management' && <ProductManagement />}
        {activeSection === 'service-management' && <ServiceManagement />}
        {activeSection === 'Course-management' && <Course />}
        {activeSection === 'Enrollement-management' && <EnrollmentManagement />}
        {activeSection === 'Banner' && <AdminBannerManager />}
      </div>
    </div>
  );
}

export default App;

// 🔧 Inline styles
const styles = {
  loginContainer: {
    height: "100vh",
    background: "linear-gradient(to right, #141e30, #243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "15px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#141e30",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 15px",
    background: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};
