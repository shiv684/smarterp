"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function PurchaseReportPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const company = localStorage.getItem("selectedCompany");
    if (!company) {
      router.push("/dashboard/companies");
      return;
    }
    fetchReport(JSON.parse(company).id);
  }, []);

  const fetchReport = async (companyId) => {
    try {
      const res = await api.get("/reports/purchases", {
        headers: { "company-id": companyId },
      });
      setPurchases(res.data.purchases);
      setTotalPurchases(res.data.totalPurchases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Purchase Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-2xl font-bold text-red-600">₹{totalPurchases.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">{purchases.length}</p>
        </div>
      </div>

      {/* Purchase Table */}
      {loading ? (
        <p>Loading...</p>
      ) : purchases.length === 0 ? (
        <div className="bg-white p-8 rounded text-center text-gray-500">
          No purchases found!
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Supplier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={purchase.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{purchase.supplier_name}</td>
                  <td className="px-4 py-3 text-sm">{new Date(purchase.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">₹{purchase.total_amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      purchase.payment_type === "cash"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {purchase.payment_type}
                    </span>
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