"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function PurchaseVoucherPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vouchers, setVouchers] = useState([]);

  const [formData, setFormData] = useState({
    supplier_id: "",
    payment_type: "credit",
    date: new Date().toISOString().split("T")[0],
    items: [{ item_id: "", quantity: 1, rate: "" }],
  });

  useEffect(() => {
    const company = localStorage.getItem("selectedCompany");
    if (!company) {
      router.push("/dashboard/companies");
      return;
    }
    const parsed = JSON.parse(company);
    setCompanyId(parsed.id);
    fetchData(parsed.id);
  }, []);

  const fetchData = async (companyId) => {
    try {
      const [suppRes, itemRes, voucherRes] = await Promise.all([
        api.get("/suppliers", { headers: { "company-id": companyId } }),
        api.get("/items", { headers: { "company-id": companyId } }),
        api.get("/purchases", { headers: { "company-id": companyId } }),
      ]);
      setSuppliers(suppRes.data.suppliers);
      setItems(itemRes.data.items);
      setVouchers(voucherRes.data.vouchers);
    } catch (err) {
      console.error(err);
    }
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_id: "", quantity: 1, rate: "" }],
    });
  };

  const removeItemRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto fill purchase rate
    if (field === "item_id") {
      const selectedItem = items.find((i) => i.id === parseInt(value));
      if (selectedItem) {
        newItems[index].rate = selectedItem.purchase_price;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + item.quantity * item.rate;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/purchases", formData, {
        headers: { "company-id": companyId },
      });

      setFormData({
        supplier_id: "",
        payment_type: "credit",
        date: new Date().toISOString().split("T")[0],
        items: [{ item_id: "", quantity: 1, rate: "" }],
      });

      fetchData(companyId);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Purchase Voucher</h2>

      {/* Create Voucher Form */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create Purchase Voucher</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
              <select
                value={formData.payment_type}
                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="credit">Credit</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Items</label>
              <button
                type="button"
                onClick={addItemRow}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Item
              </button>
            </div>

            <table className="w-full border rounded overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Item</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Qty</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Rate</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Total</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2">
                      <select
                        value={item.item_id}
                        onChange={(e) => handleItemChange(index, "item_id", e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Select Item</option>
                        {items.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} (Stock: {i.quantity})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        min="1"
                        required
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                        required
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      ₹{(item.quantity * item.rate).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right font-semibold text-sm">
                    Total:
                  </td>
                  <td className="px-3 py-2 font-bold text-blue-600">
                    ₹{calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Purchase Voucher"}
          </button>
        </form>
      </div>

      {/* Vouchers List */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">Purchase Vouchers List</h3>
        {vouchers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No vouchers found!</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Supplier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher, index) => (
                <tr key={voucher.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{voucher.supplier_name}</td>
                  <td className="px-4 py-3 text-sm">{new Date(voucher.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">₹{voucher.total_amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      voucher.payment_type === "cash"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {voucher.payment_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}