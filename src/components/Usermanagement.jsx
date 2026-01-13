import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("all-users");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [usersRes, staffRes] = await Promise.all([
          axios.get("https://api.hellonature.in/api/users"), 
          axios.get("https://api.hellonature.in/api/staff"), 
        ]);

        setUsers(usersRes.data);
        setStaff(staffRes.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users or staff.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Combine users and staff to one array
  const combinedUsers = useMemo(() => {
    const mappedUsers = users.map((u) => ({
      ...u,
      source: "user",
      role: "Customer",
    }));
    const mappedStaff = staff.map((s) => ({
      ...s,
      source: "staff",
      role: "Service vendor",
    }));
    return [...mappedUsers, ...mappedStaff];
  }, [users, staff]);

  // Filter based on search and activeTab
 const filteredUsers = combinedUsers.filter((user) => {
  const name = user.name || user.firstName || "";
  const email = user.email || "";

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase());

  if (activeTab === "customers") return matchesSearch && user.role === "Customer";
  if (activeTab === "providers") return matchesSearch && user.role === "Service Provider";

  // "all-users" tab
  return matchesSearch;
});

  return (
    <section id="user-management-content" className="p-6">
      {/* ... header and search input ... */}

      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "all-users" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"
            } font-semibold`}
            onClick={() => setActiveTab("all-users")}
          >
            All Users
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "customers" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"
            } font-semibold`}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "providers" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"
            } font-semibold`}
            onClick={() => setActiveTab("providers")}
          >
            Service vendors
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center p-10 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center p-10 text-red-500">{error}</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Role</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.firstName}  {user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                {/* Add more columns as needed */}
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default UserManagement;
