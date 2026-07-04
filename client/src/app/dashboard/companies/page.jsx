"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(res.data.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (company) => {
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    router.push("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Select Company</h2>
        <button
          onClick={() => router.push("/dashboard/companies/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Company
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : companies.length === 0 ? (
        <div className="bg-white p-8 rounded text-center text-gray-500">
          No companies found. Add your first company!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleSelectCompany(company)}
              className="bg-white p-6 rounded shadow hover:shadow-md cursor-pointer border-l-4 border-blue-500"
            >
              <h3 className="text-lg font-semibold">{company.name}</h3>
              <p className="text-gray-500 text-sm mt-1">GST: {company.gst_number}</p>
              <p className="text-gray-500 text-sm">{company.address}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}