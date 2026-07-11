# SmartERP — Cloud-Based Business Management System

A modern, Tally-inspired ERP web application built with Next.js, Node.js, and PostgreSQL. SmartERP helps businesses manage their accounting, inventory, billing, and reporting needs through a clean and intuitive web interface.

## 🌐 Live Demo

- **Frontend:** https://smarterp-ni608f3ds-shiv684s-projects.vercel.app
- **Backend:** https://smarterp-backend-1dqy.onrender.com

## 📸 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Auto logout on token expiry

### 🏢 Company Management
- Create and manage up to 5 companies per account
- Role-Based Access Control (RBAC)
- Add employees to specific companies
- Owner can view all companies, employees can only view assigned companies

### 📒 Masters Module
- **Customer Management** — Add, edit, delete customers with outstanding balance tracking
- **Supplier Management** — Manage suppliers with payment history
- **Item/Stock Management** — Track products with SKU, purchase price, selling price, and GST

### 🧾 Voucher Management
- **Sales Voucher** — Create customer bills with automatic stock reduction
- **Purchase Voucher** — Record supplier purchases with automatic stock increment
- Auto-generated invoice numbers
- Cash and credit payment support

### 📄 PDF Invoice Generation
- Professional Tax Invoice PDF for sales
- Purchase Voucher PDF
- Company details, customer info, items, GST breakdown

### 📊 Reports Module
- **Sales Report** — Complete sales history with items breakdown
- **Purchase Report** — Purchase history with supplier details
- **Stock Report** — Current inventory with stock value and low stock alerts
- **Profit & Loss** — Business financial summary

### 👥 Role-Based Access Control
- Owner role — Full access to all companies
- User role — Access to assigned company only
- Viewer role — Read-only access

## 🛠️ Tech Stack

### Frontend
- Next.js 16
- React.js
- Tailwind CSS
- ShadCN UI
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- PDFKit (PDF Generation)

### Deployment
- Frontend — Vercel
- Backend — Render
- Database — Render PostgreSQL

## 📁 Project Structure

smarterp/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── dashboard/
│   │   │       ├── masters/
│   │   │       │   ├── customers/
│   │   │       │   ├── suppliers/
│   │   │       │   └── items/
│   │   │       ├── vouchers/
│   │   │       │   ├── sales/
│   │   │       │   └── purchase/
│   │   │       ├── reports/
│   │   │       │   ├── sales/
│   │   │       │   ├── purchase/
│   │   │       │   ├── stock/
│   │   │       │   └── profit-loss/
│   │   │       └── companies/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── DashboardLayout.jsx
│   │   └── lib/
│   │       └── axios.js
│
└── server/                 # Node.js Backend
└── src/
├── controllers/
│   ├── auth.controller.js
│   ├── company.controller.js
│   ├── customer.controller.js
│   ├── supplier.controller.js
│   ├── item.controller.js
│   ├── sales.controller.js
│   ├── purchase.controller.js
│   ├── reports.controller.js
│   ├── invoice.controller.js
│   └── companyUsers.controller.js
├── routes/
├── middleware/
└── config/

## 🗄️ Database Schema
users
companies
company_users
customers
suppliers
items
sales_vouchers
sales_items
purchase_vouchers
purchase_items

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/shiv684/smarterp.git
cd smarterp
```

**2. Backend Setup:**
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/smarterp
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Run server:
```bash
npm run dev
```

**3. Frontend Setup:**
```bash
cd client
npm install
npm run dev
```

**4. Database Setup:**
```bash
psql -U postgres -d smarterp -f src/config/schema.sql
```

### Access the Application
Frontend: http://localhost:3000
Backend:  http://localhost:5000

## 📋 API Endpoints

### Auth
POST /api/auth/register
POST /api/auth/login

### Companies
GET    /api/companies
POST   /api/companies
PUT    /api/companies/:id
DELETE /api/companies/:id
### Masters
GET/POST/PUT/DELETE /api/customers
GET/POST/PUT/DELETE /api/suppliers
GET/POST/PUT/DELETE /api/items

### Vouchers

GET/POST /api/sales
GET/POST /api/purchases

### Reports
GET /api/reports/sales
GET /api/reports/purchases
GET /api/reports/stock
GET /api/reports/profit-loss
GET /api/reports/dashboard

### Invoice
GET /api/invoice/sales/:id
GET /api/invoice/purchase/:id

### Company Users (RBAC)
GET    /api/company-users/:company_id
POST   /api/company-users
DELETE /api/company-users/:company_id/:user_id

## 🔮 Future Enhancements
- Barcode Scanner Integration
- WhatsApp Invoice Sharing
- Mobile Application
- AI Business Insights
- Bank API Integration
- Multi-Branch Management
- Audit Logs

## 👨‍💻 Developer

**Shiv Pratap Singh**
- GitHub: [@shiv684](https://github.com/shiv684)
- University: GLA University

## 📄 License

This project is licensed under the MIT License.


