"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gst_number: "",
    address: "",
    state: "",
    financial_year: "2024-2025",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/companies", formData);
      router.push("/dashboard/companies");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add Company</h2>
        <div className="bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                name="name"
                type="text"
                placeholder="Shiv Electronics"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
              <input
                name="gst_number"
                type="text"
                placeholder="27AAPFU0939F1ZV"
                value={formData.gst_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                placeholder="123 Main Street, Mathura"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                name="state"
                type="text"
                placeholder="Uttar Pradesh"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
              <select
                name="financial_year"
                value={formData.financial_year}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>2023-2024</option>
                <option>2024-2025</option>
                <option>2025-2026</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? "Saving..." : "Save Company"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/companies")}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}