"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function SalesVoucherPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vouchers, setVouchers] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    customer_id: "",
    payment_type: "credit",
    date: new Date().toISOString().split("T")[0],
    items: [{ item_id: "", quantity: 1, rate: "", gst_percent: 18 }],
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
      // Fetch customers, items, vouchers
      const [custRes, itemRes, voucherRes] = await Promise.all([
        api.get("/customers", { headers: { "company-id": companyId } }),
        api.get("/items", { headers: { "company-id": companyId } }),
        api.get("/sales", { headers: { "company-id": companyId } }),
      ]);
      setCustomers(custRes.data.customers);
      setItems(itemRes.data.items);
      setVouchers(voucherRes.data.vouchers);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new item row
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_id: "", quantity: 1, rate: "", gst_percent: 18 }],
    });
  };

  // Remove item row
  const removeItemRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto fill rate from item master
    if (field === "item_id") {
      const selectedItem = items.find((i) => i.id === parseInt(value));
      if (selectedItem) {
        newItems[index].rate = selectedItem.selling_price;
        newItems[index].gst_percent = selectedItem.gst_percent;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  // Calculate total
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const itemTotal = item.quantity * item.rate;
      const gst = (itemTotal * item.gst_percent) / 100;
      return total + itemTotal + gst;
    }, 0);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/sales", formData, {
        headers: { "company-id": companyId },
      });

      // Reset form
      setFormData({
        customer_id: "",
        payment_type: "credit",
        date: new Date().toISOString().split("T")[0],
        items: [{ item_id: "", quantity: 1, rate: "", gst_percent: 18 }],
      });

      // Refresh data
      fetchData(companyId);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Sales Voucher</h2>

      {/* Create Voucher Form */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create Sales Voucher</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer + Date + Payment Type */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">GST%</th>
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
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.gst_percent}
                        onChange={(e) => handleItemChange(index, "gst_percent", e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      ₹{((item.quantity * item.rate) * (1 + item.gst_percent / 100)).toFixed(2)}
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
                  <td colSpan={4} className="px-3 py-2 text-right font-semibold text-sm">
                    Grand Total:
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Sales Voucher"}
          </button>
        </form>
      </div>

      {/* Vouchers List */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">Sales Vouchers List</h3>
        {vouchers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No vouchers found!</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{voucher.invoice_no}</td>
                  <td className="px-4 py-3 text-sm">{voucher.customer_name}</td>
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