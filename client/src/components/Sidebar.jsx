"use client";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Masters",
      icon: "📒",
      items: [
        { label: "Customers", path: "/dashboard/masters/customers", icon: "👥" },
        { label: "Suppliers", path: "/dashboard/masters/suppliers", icon: "🏭" },
        { label: "Items / Stock", path: "/dashboard/masters/items", icon: "📦" },
      ],
    },
    {
      title: "Vouchers",
      icon: "🧾",
      items: [
        { label: "Sales Voucher", path: "/dashboard/vouchers/sales", icon: "💰" },
        { label: "Purchase Voucher", path: "/dashboard/vouchers/purchase", icon: "🛒" },
      ],
    },
    {
      title: "Reports",
      icon: "📊",
      items: [
        { label: "Sales Report", path: "/dashboard/reports/sales", icon: "📈" },
        { label: "Purchase Report", path: "/dashboard/reports/purchase", icon: "📉" },
        { label: "Stock Report", path: "/dashboard/reports/stock", icon: "📦" },
        { label: "Profit & Loss", path: "/dashboard/reports/profit-loss", icon: "💹" },
      ],
    },
    {
      title: "Company",
      icon: "🏢",
      items: [
        { label: "Companies", path: "/dashboard/companies", icon: "🏢" },
        { label: "Manage Users", path: "/dashboard/companies/users", icon: "👥" },
      ],
    },
  ];

  return (
    <div
      className="w-64 min-h-screen flex flex-col flex-shrink-0"
      style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0f2440 100%)" }}
    >
      {/* Logo */}
      <div
        onClick={() => router.push("/dashboard")}
        className="px-6 py-5 cursor-pointer border-b border-blue-800"
      >
        <h1 className="text-2xl font-bold text-white">
          Smart<span className="text-blue-300">ERP</span>
        </h1>
        <p className="text-blue-400 text-xs mt-1">Business Management System</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            {/* Section Title */}
            <p className="px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              {section.icon} {section.title}
            </p>

            {/* Section Items */}
            {section.items.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm mb-1 transition-all duration-200 flex items-center gap-2 ${
                  pathname === item.path
                    ? "bg-blue-500 text-white font-medium shadow-lg"
                    : "text-blue-200 hover:bg-blue-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-blue-800 p-4">
        <button
          onClick={() => router.push("/dashboard/companies")}
          className="w-full text-left text-sm text-blue-300 hover:text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-all flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Change Company</span>
        </button>
      </div>
    </div>
  );
}