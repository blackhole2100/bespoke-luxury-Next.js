# Elegant Furniture Hub (Royal Furniture)

An industry-grade, production-ready, and scalable e-commerce application for a luxury furniture brand. Built with a focus on "Luxe Minimalism," this platform transitions from a static layout to a complete **MERN Stack** solution leveraging **Next.js 15 (App Router)**, **TypeScript**, **Mongoose**, and **MongoDB**.

---

## 🚀 Key Features

*   **Luxe Minimalist Aesthetic**: Deep charcoals, warm gold tones, cormorant typography, and custom micro-animations (implemented strictly using Vanilla CSS to avoid template lock-in).
*   **Database-Driven Authentication**: Secure user registration and login flows backed by **bcryptjs** password hashing and **jsonwebtoken** session keys stored in HTTP-Only, SameSite=Strict cookies.
*   **Real-Time Catalog Management**: Full inventory system featuring:
    *   Dynamic text search and categorization tabs (Sofas, Chairs, Sales).
    *   Product detail dynamic routing (`/product/[id]`) showing specifications, stock levels, and category-matching product recommendations.
*   **Fluid Cart & Wishlist System**: Responsive side drawers supporting item selections, quantity controls, subtotal tallies, and persistent localStorage sync.
*   **Inventory-Aware Checkouts**: An interactive checkout flow that verifies available stock, updates database quantities, and creates persistent order logs.
*   **Secure Admin Control Console**: Isolated panel (`/admin/dashboard`) allowing administrators to:
    *   Review key business metrics (aggregated revenue, total users, order volume).
    *   Manage catalog items through product insertion (CRUD) and deleting.
    *   Track and modify customer order shipping statuses (`Pending`, `Processing`, `Shipped`, `Delivered`).

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 15, React 19, TypeScript, Context API (State Sync)
*   **Backend**: Next.js App Router API Route Handlers, Node.js
*   **Database**: MongoDB (enforced via Mongoose schemas and unique search indices)
*   **Validation**: Zod (declarative validation schemas at server boundaries)
*   **Security**: JSON Web Tokens (JWT), BCryptJS (Hashing), Cookies (HTTP-only)
*   **Styling**: Vanilla CSS, Font Awesome, Boxicons, Bootstrap 5 (Grids & Layout Utilities)

---

## 📂 Project Directory Structure

```text
├── _static_backup/        # Archived original static HTML, JS, and CSS files
├── scripts/
│   └── seed.ts            # Database seeder (inserts signature products & default admin)
├── public/
│   ├── images/            # Static image assets (sofa, armchairs, logo, banners)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/ # Admin Console UI
│   │   │   └── login/     # Admin Access portal
│   │   ├── api/           # Backend API routes (Auth, Products, Checkout, Admin Stats)
│   │   ├── product/       # Public shop catalog & dynamic detail view
│   │   ├── signup/        # Account registration & sign-in forms
│   │   ├── globals.css    # Custom global styling rules
│   │   ├── layout.tsx     # Root Layout, CDNs, and Google Fonts
│   │   └── page.tsx       # E-Commerce landing homepage
│   ├── components/        # Reusable React components (Header, Footer, ProductCard, etc.)
│   ├── context/           # AppContext state sync (Theme, Cart, Wishlist, User Session)
│   ├── lib/               # Database connection and JWT helpers
│   ├── models/            # Mongoose MongoDB schemas (User, Product, Order)
│   └── types/             # Common TypeScript interfaces
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## ⚡ Getting Started

### 1. Prerequisites
*   [Node.js](https://nodejs.org) (v18.0.0 or higher recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a MongoDB Atlas URI)

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file at the root of the project to configure connection parameters:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/royal-furniture
JWT_SECRET=your_jwt_super_secure_key
```

### 4. Database Seeding
Seed the database with default admin credentials and the 11 signature furniture pieces:
```bash
npx tsx scripts/seed.ts
```

### 5. Running the Application

*   **Development mode**:
    ```bash
    npm run dev
    ```
    Access the application at [http://localhost:3000](http://localhost:3000).

*   **Production Build & Start**:
    ```bash
    npm run build
    npm run start
    ```

---

## 🔑 Administrative Access

To explore the admin control console, head to the footer and click **Admin** (or go to `/admin/login`) and enter the seeded administrator credentials:
*   **Email**: `admin@royalfurniture.com`
*   **Password**: `password123`

---

## 📜 License
This project is open-source and licensed under the [MIT License](LICENSE).
