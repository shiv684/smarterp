"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2440 50%, #1a1a2e 100%)" }}>

      {/* Left Side — Branding */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center text-white p-12">
        <h1 className="text-5xl font-bold mb-4">
          Smart<span className="text-blue-300">ERP</span>
        </h1>
        <p className="text-blue-200 text-xl text-center max-w-sm">
          Modern Cloud-Based Business Management System
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { icon: "📒", label: "Ledger Management" },
            { icon: "🧾", label: "Smart Invoicing" },
            { icon: "📦", label: "Inventory Control" },
            { icon: "📊", label: "Business Reports" },
          ].map((f) => (
            <div key={f.label} className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <span className="text-3xl">{f.icon}</span>
              <p className="text-sm mt-2 text-blue-200">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Smart<span className="text-blue-600">ERP</span>
            </h1>
            <p className="text-gray-500 mt-2">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="shiv@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Account nahi hai?{" "}
              <a href="/register" className="text-blue-600 font-medium hover:underline">
                Register karo
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}