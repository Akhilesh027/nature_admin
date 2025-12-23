import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PackagesPage() {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({ name: '', services: [], amount: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPackagesAndServices();
  }, []);

  const fetchPackagesAndServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const [packagesRes, servicesRes] = await Promise.all([
        axios.get('https://api.hellonature.in/api/packages'),
        axios.get('https://api.hellonature.in/api/products'),
      ]);
      setPackages(packagesRes.data);
      setAvailableServices(servicesRes.data);
    } catch (e) {
      setError('Failed to load packages or services.');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId) => {
    setForm((prev) => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      alert('Package name is required.');
      return false;
    }
    if (form.services.length === 0) {
      alert('Select at least one service.');
      return false;
    }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      alert('Enter a valid amount greater than zero.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await axios.post('https://api.hellonature.in/api/packages', {
        name: form.name,
        services: form.services,
        amount: Number(form.amount),
      });
      alert('Package added successfully!');
      setForm({ name: '', services: [], amount: '' });
      setAdding(false);
      fetchPackagesAndServices();
    } catch (e) {
      alert('Failed to add package.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-500 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Packages</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          {adding ? (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Package
            </>
          )}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleSubmit} className="mb-8 border p-6 rounded bg-gray-50">
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold text-gray-700 mb-1">
              Package Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter package name"
              disabled={submitting}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <span className="block font-semibold text-gray-700 mb-1">Services Included</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-auto border p-3 rounded bg-white">
              {availableServices.map((service) => (
                <label key={service._id} className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.services.includes(service._id)}
                    onChange={() => toggleService(service._id)}
                    disabled={submitting}
                    className="form-checkbox h-5 w-5 text-pink-600"
                  />
                  <span className="text-gray-700">{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4 max-w-xs">
            <label htmlFor="amount" className="block font-semibold text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter package amount"
              min="0"
              step="0.01"
              disabled={submitting}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`bg-pink-500 text-white font-semibold px-6 py-2 rounded hover:bg-pink-600 transition ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Submitting...' : 'Add Package'}
          </button>
        </form>
      )}

      <div>
        {packages.length === 0 ? (
          <p className="text-center text-gray-500">No packages available.</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 text-left px-4 py-2">Package Name</th>
                <th className="border border-gray-200 text-left px-4 py-2">Services</th>
                <th className="border border-gray-200 text-right px-4 py-2">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(({ _id, name, services, amount }) => (
                <tr key={_id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{name}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {services.map((s) => s.name || s.productName || s).join(', ')}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">{amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
}
