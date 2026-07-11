"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import DashboardLayout from "@/components/DashboardLayout";

function CompanyUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company_id");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (companyId) fetchUsers();
  }, [companyId]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/company-users/${companyId}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/company-users", {
        company_id: parseInt(companyId),
        email,
        role,
      });
      setSuccess("User added successfully ✅");
      setEmail("");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!confirm("Remove this user?")) return;
    try {
      await api.delete(`/company-users/${companyId}/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (!companyId) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Manage Company Users</h2>
          <div className="bg-white p-8 rounded text-center text-gray-500">
            Please select a company first!{" "}
            <button
              onClick={() => router.push("/dashboard/companies")}
              className="text-blue-600 underline"
            >
              Go to Companies
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Company Users</h2>
          <button
            onClick={() => router.push("/dashboard/companies")}
            className="text-gray-600 hover:text-blue-600 text-sm"
          >
            ← Back to Companies
          </button>
        </div>

        {/* Add User Form */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add User to Company</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                placeholder="employee@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User (View & Edit)</option>
                <option value="viewer">Viewer (View Only)</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add User
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white rounded shadow overflow-hidden">
          <h3 className="text-lg font-semibold p-4 border-b">Company Users</h3>
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users added yet!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === "user"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleRemoveUser(user.user_id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function CompanyUsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyUsersContent />
    </Suspense>
  );
}