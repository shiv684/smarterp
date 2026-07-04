"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const company = localStorage.getItem("selectedCompany");
    if (!company) {
      router.push("/dashboard/companies");
      return;
    }
    const parsedCompany = JSON.parse(company);
    setCompanyId(parsedCompany.id);
    fetchSuppliers(parsedCompany.id);
  }, []);

  const fetchSuppliers = async (companyId) => {
    try {
      const res = await api.get("/suppliers", {
        headers: { "company-id": companyId },
      });
      setSuppliers(res.data.suppliers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/suppliers/${id}`, {
        headers: { "company-id": companyId },
      });
      fetchSuppliers(companyId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <button
          onClick={() => router.push("/dashboard/masters/suppliers/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : suppliers.length === 0 ? (
        <div className="bg-white p-8 rounded text-center text-gray-500">
          No suppliers found. Add your first supplier!
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mobile</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr key={supplier.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{supplier.name}</td>
                  <td className="px-4 py-3 text-sm">{supplier.mobile}</td>
                  <td className="px-4 py-3 text-sm">{supplier.address}</td>
                  <td className="px-4 py-3 text-sm">₹{supplier.balance}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}