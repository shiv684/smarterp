"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function StockReportPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
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
      const res = await api.get("/reports/stock", {
        headers: { "company-id": companyId },
      });
      setStocks(res.data.stocks);
      setTotalValue(res.data.totalValue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Stock Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Stock Value</p>
          <p className="text-2xl font-bold text-blue-600">₹{totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold text-green-600">{stocks.length}</p>
        </div>
      </div>

      {/* Stock Table */}
      {loading ? (
        <p>Loading...</p>
      ) : stocks.length === 0 ? (
        <div className="bg-white p-8 rounded text-center text-gray-500">
          No stock found!
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Item Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Purchase Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Selling Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">GST%</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`border-t hover:bg-gray-50 ${
                    item.quantity <= 5 ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.sku}</td>
                  <td className="px-4 py-3 text-sm">₹{item.purchase_price}</td>
                  <td className="px-4 py-3 text-sm">₹{item.selling_price}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-medium ${
                      item.quantity <= 5 ? "text-red-600" : "text-green-600"
                    }`}>
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    ₹{parseFloat(item.stock_value).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.gst_percent}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={6} className="px-4 py-3 text-right font-semibold text-sm">
                  Total Stock Value:
                </td>
                <td className="px-4 py-3 font-bold text-blue-600">
                  ₹{totalValue.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}