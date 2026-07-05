"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProfitLossPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
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
      const res = await api.get("/reports/profit-loss", {
        headers: { "company-id": companyId },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Profit & Loss Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="max-w-lg">
          <div className="bg-white rounded shadow overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Profit & Loss Statement</h3>
            </div>

            {/* Income Section */}
            <div className="p-6 border-b">
              <h4 className="font-semibold text-gray-700 mb-3">Income</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Sales</span>
                <span className="font-medium text-green-600">
                  ₹{data.totalSales.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">GST Collected</span>
                <span className="font-medium text-green-600">
                  ₹{data.totalGst.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Expense Section */}
            <div className="p-6 border-b">
              <h4 className="font-semibold text-gray-700 mb-3">Expenses</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Purchases</span>
                <span className="font-medium text-red-600">
                  ₹{data.totalPurchases.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Profit Section */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">
                  {data.grossProfit >= 0 ? "Gross Profit" : "Gross Loss"}
                </span>
                <span className={`text-2xl font-bold ${
                  data.grossProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  ₹{Math.abs(data.grossProfit).toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}