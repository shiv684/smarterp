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
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <div>
        {company ? (
          <span className="text-sm font-medium text-gray-700">
            📊 {company.name}
          </span>
        ) : (
          <span className="text-sm text-yellow-500">⚠️ No company selected</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">👤 {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}