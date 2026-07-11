require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");

const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const customerRoutes = require("./routes/customer.routes");
const supplierRoutes = require("./routes/supplier.routes");
const itemRoutes = require("./routes/item.routes");
const salesRoutes = require("./routes/sales.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const reportsRoutes = require("./routes/reports.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const companyUsersRoutes = require("./routes/companyUsers.routes");

const app = express();

// CORS — sab origins allow karo deploy ke liye
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "company-id"],
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/company-users", companyUsersRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartERP Server Running ✅" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});