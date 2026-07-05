"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const company = localStorage.getItem("selectedCompany");
    if (company) {
      const parsed = JSON.parse(company);
      setCompanyId(parsed.id);
      fetchSummary(parsed.id);
    }
  }, []);

  const fetchSummary = async (companyId) => {
    try {
      const res = await api.get("/reports/dashboard", {
        headers: { "company-id": companyId },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Gateway of SmartERP</h2>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Total Purchases</p>
            <p className="text-2xl font-bold text-red-600">₹{summary.totalPurchases.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Stock Value</p>
            <p className="text-2xl font-bold text-blue-600">₹{summary.totalStockValue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Outstanding Balance</p>
            <p className="text-2xl font-bold text-yellow-600">₹{summary.outstandingBalance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-purple-600">{summary.totalCustomers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Total Suppliers</p>
            <p className="text-2xl font-bold text-orange-600">{summary.totalSuppliers}</p>
          </div>
        </div>
      )}

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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold">Inventory</h3>
          <p className="text-gray-500 text-sm mt-1">Stock Management</p>
        </div>
        <div
          onClick={() => router.push("/dashboard/reports/sales")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-purple-500"
        >
          <h3 className="text-lg font-semibold">Reports</h3>
          <p className="text-gray-500 text-sm mt-1">Sales, Purchase, Stock</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-orange-500">
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
    </DashboardLayout>
  );
}