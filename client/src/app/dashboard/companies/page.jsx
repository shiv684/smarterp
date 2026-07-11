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

  // Select company
  const handleSelectCompany = (company) => {
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    router.push("/dashboard");
  };

  // Delete company
  const handleDelete = async (e, companyId) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      await api.delete(`/companies/${companyId}`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
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
              className="bg-white p-6 rounded shadow hover:shadow-md cursor-pointer border-l-4 border-blue-500 relative"
            >
              {/* Company Info */}
              <div className="pr-24">
                <h3 className="text-lg font-semibold">{company.name}</h3>
                <p className="text-gray-500 text-sm mt-1">GST: {company.gst_number}</p>
                <p className="text-gray-500 text-sm">{company.address}</p>
                <p className="text-gray-500 text-sm">{company.state}</p>
                {/* Role Badge */}
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                  company.access_role === "owner"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {company.access_role === "owner" ? "👑 Owner" : "👤 User"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {/* Manage Users — sirf owner dekh sake */}
                {company.access_role === "owner" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/companies/users?company_id=${company.id}`);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    👥 Users
                  </button>
                )}

                {/* Delete — sirf owner kar sake */}
                {company.access_role === "owner" && (
                  <button
                    onClick={(e) => handleDelete(e, company.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}