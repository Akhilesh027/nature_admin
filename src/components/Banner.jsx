import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminBannerManager() {
  const [banners, setBanners] = useState([]);
  const [name, setName] = useState("");
  const [navigateTo, setNavigateTo] = useState("");
  const [section, setSection] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("https://api.hellonature.in/api/banners");
      setBanners(res.data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setName("");
    setNavigateTo("");
    setSection("");
    setImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !navigateTo) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("navigateTo", navigateTo);
    formData.append("section", section || "default");
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`https://api.hellonature.in/api/banners/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("https://api.hellonature.in/api/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error saving banner, please try again.");
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setName(banner.name);
    setNavigateTo(banner.navigateTo);
    setSection(banner.section || "");
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await axios.delete(`https://api.hellonature.in/api/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("Failed to delete banner, please try again.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Banners</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
            Banner Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Banner Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="navigateTo"
          >
            Navigate To (Screen Name) <span className="text-red-500">*</span>
          </label>
          <input
            id="navigateTo"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Navigate To"
            value={navigateTo}
            onChange={(e) => setNavigateTo(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="section">
            Section (optional)
          </label>
          <input
            id="section"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-gray-700"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {editingId ? "Update Banner" : "Add Banner"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Existing Banners</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b._id}
            className="border rounded shadow-sm p-4 flex flex-col items-center space-y-4"
          >
            <h4 className="text-lg font-semibold">{b.name} <span className="text-sm text-gray-500">({b.section || "default"})</span></h4>
            <img
              src={b.imageUrl}
              alt={b.name}
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-gray-700">Navigate to: {b.navigateTo}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(b)}
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded text-white font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
