"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SmartERP</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Gateway of SmartERP</h2>

        {/* Menu Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            onClick={() => router.push("/dashboard/masters/customers")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold">Masters</h3>
            <p className="text-gray-500 text-sm mt-1">Customers, Suppliers, Items</p>
          </div>

          <div
            onClick={() => router.push("/dashboard/vouchers/sales")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-green-500"
          >
            <h3 className="text-lg font-semibold">Vouchers</h3>
            <p className="text-gray-500 text-sm mt-1">Sales, Purchase</p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-yellow-500"
          >
            <h3 className="text-lg font-semibold">Inventory</h3>
            <p className="text-gray-500 text-sm mt-1">Stock Management</p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-purple-500"
          >
            <h3 className="text-lg font-semibold">Reports</h3>
            <p className="text-gray-500 text-sm mt-1">Sales, Purchase, Stock</p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-orange-500"
          >
            <h3 className="text-lg font-semibold">GST</h3>
            <p className="text-gray-500 text-sm mt-1">GST Reports</p>
          </div>

          <div
            onClick={() => router.push("/dashboard/companies")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-red-500"
          >
            <h3 className="text-lg font-semibold">Companies</h3>
            <p className="text-gray-500 text-sm mt-1">Manage Companies</p>
          </div>
        </div>
      </div>
    </div>
  );
}