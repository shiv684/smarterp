"use client";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Masters",
      items: [
        { label: "Customers", path: "/dashboard/masters/customers" },
        { label: "Suppliers", path: "/dashboard/masters/suppliers" },
        { label: "Items / Stock", path: "/dashboard/masters/items" },
      ],
    },
    {
      title: "Vouchers",
      items: [
        { label: "Sales Voucher", path: "/dashboard/vouchers/sales" },
        { label: "Purchase Voucher", path: "/dashboard/vouchers/purchase" },
      ],
    },
    {
      title: "Reports",
      items: [
        { label: "Sales Report", path: "/dashboard/reports/sales" },
        { label: "Purchase Report", path: "/dashboard/reports/purchase" },
        { label: "Stock Report", path: "/dashboard/reports/stock" },
      ],
    },
  ];

  return (
    <div className="w-56 min-h-screen bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div
        onClick={() => router.push("/dashboard")}
        className="px-6 py-4 border-b cursor-pointer"
      >
        <h1 className="text-xl font-bold text-blue-600">SmartERP</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-6 py-1 text-xs font-semibold text-gray-400 uppercase">
              {section.title}
            </p>
            {section.items.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-6 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t p-4">
        <button
          onClick={() => router.push("/dashboard/companies")}
          className="w-full text-left text-sm text-gray-600 hover:text-blue-600 px-2 py-1"
        >
          🏢 Change Company
        </button>
      </div>
    </div>
  );
}