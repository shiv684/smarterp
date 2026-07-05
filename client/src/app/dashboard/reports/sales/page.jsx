"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function SalesReportPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
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
      const res = await api.get("/reports/sales", {
        headers: { "company-id": companyId },
      });
      setSales(res.data.sales);
      setTotalSales(res.data.totalSales);
      setTotalGst(res.data.totalGst);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Sales Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total GST</p>
          <p className="text-2xl font-bold text-blue-600">₹{totalGst.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-purple-600">{sales.length}</p>
        </div>
      </div>

      {/* Sales Table */}
      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <div className="bg-white p-8 rounded text-center text-gray-500">
          No sales found!
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">GST</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.invoice_no} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{sale.invoice_no}</td>
                  <td className="px-4 py-3 text-sm">{sale.customer_name}</td>
                  <td className="px-4 py-3 text-sm">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">₹{sale.total_amount}</td>
                  <td className="px-4 py-3 text-sm">₹{sale.gst_amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sale.payment_type === "cash"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {sale.payment_type}
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