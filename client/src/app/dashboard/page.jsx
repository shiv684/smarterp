"use client";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Gateway of SmartERP</h2>
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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer border-l-4 border-purple-500">
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