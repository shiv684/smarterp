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

  // Download purchase invoice PDF
  const downloadPurchaseInvoice = async (purchaseId) => {
    try {
      const company = JSON.parse(localStorage.getItem("selectedCompany"));
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://smarterp-backend-1dqy.onrender.com/api/invoice/purchase/${purchaseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "company-id": company.id,
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `purchase-${purchaseId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
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
        <div className="space-y-4">
          {purchases.map((purchase, index) => (
            <div key={index} className="bg-white rounded shadow overflow-hidden">
              {/* Voucher Header */}
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex gap-6 flex-wrap">
                  <span className="text-sm font-bold text-gray-700">#{index + 1}</span>
                  <span className="text-sm text-gray-600">🏭 {purchase.supplier_name}</span>
                  <span className="text-sm text-gray-600">📅 {new Date(purchase.date).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    purchase.payment_type === "cash"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {purchase.payment_type}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-800">₹{purchase.total_amount}</span>
                  <button
                    onClick={() => downloadPurchaseInvoice(purchase.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 text-sm">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm font-medium">{item.item_name}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-2 text-sm">₹{item.rate}</td>
                      <td className="px-4 py-2 text-sm font-medium">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2"></td>
                    <td className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Grand Total:</td>
                    <td className="px-4 py-2 text-sm font-bold text-red-600">₹{purchase.total_amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}