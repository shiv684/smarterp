"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const companyData = localStorage.getItem("selectedCompany");
    if (userData) setUser(JSON.parse(userData));
    if (companyData) setCompany(JSON.parse(companyData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCompany");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-200">
      {/* Company Name */}
      <div className="flex items-center gap-3">
        {company ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {company.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{company.name}</p>
              <p className="text-xs text-gray-400">Active Company</p>
            </div>
          </div>
        ) : (
          <span
            onClick={() => router.push("/dashboard/companies")}
            className="text-sm text-yellow-600 cursor-pointer hover:underline"
          >
            ⚠️ Select a company
          </span>
        )}
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}