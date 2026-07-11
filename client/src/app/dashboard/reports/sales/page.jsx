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

  // Download sales invoice PDF
  const downloadInvoice = async (saleId, invoiceNo) => {
    try {
      const company = JSON.parse(localStorage.getItem("selectedCompany"));
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/invoice/sales/${saleId}`,
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
      a.download = `invoice-${invoiceNo}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
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
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.invoice_no} className="bg-white rounded shadow overflow-hidden">

              {/* Voucher Header */}
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex gap-6 flex-wrap">
                  <span className="text-sm font-bold text-blue-600">{sale.invoice_no}</span>
                  <span className="text-sm text-gray-600">👤 {sale.customer_name}</span>
                  <span className="text-sm text-gray-600">📅 {new Date(sale.date).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    sale.payment_type === "cash"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {sale.payment_type}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-800">₹{sale.total_amount}</span>
                  <button
                    onClick={() => downloadInvoice(sale.id, sale.invoice_no)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-sm">{index + 1}</td>
                      <td className="px-4 py-2 text-sm font-medium">{item.item_name}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-2 text-sm">₹{item.rate}</td>
                      <td className="px-4 py-2 text-sm font-medium">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-xs text-gray-500">
                      GST: ₹{sale.gst_amount}
                    </td>
                    <td className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                      Grand Total:
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-blue-600">
                      ₹{sale.total_amount}
                    </td>
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