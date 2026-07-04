"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
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
    fetchItems(parsedCompany.id);
  }, []);

  const fetchItems = async (companyId) => {
    try {
      const res = await api.get("/items", {
        headers: { "company-id": companyId },
      });
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/items/${id}`, {
        headers: { "company-id": companyId },
      });
      fetchItems(companyId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Items / Stock</h2>
        <button
          onClick={() => router.push("/dashboard/masters/items/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="bg-white p-8 rounded text-center text-gray-500">
          No items found. Add your first item!
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Purchase Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Selling Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">GST</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.sku}</td>
                  <td className="px-4 py-3 text-sm">₹{item.purchase_price}</td>
                  <td className="px-4 py-3 text-sm">₹{item.selling_price}</td>
                  <td className="px-4 py-3 text-sm">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-sm">{item.gst_percent}%</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDelete(item.id)}
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