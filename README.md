🚀 Installation
Prerequisites
Node.js (v18 or higher)

MongoDB (local or Atlas)

npm or yarn

Git

git clone https://github.com/yourusername/mvep.git
cd mvep

npm install

npm run dev


📋 Table of Contents
Overview

Tech Stack

Features

Project Structure

Installation

Environment Variables

Usage Guide

API Documentation

Screenshots

Contributing

License

🌟 Overview
MVEP is a complete e-commerce solution that connects three types of users:

Customers - Browse products, shop, and chat with vendors

Vendors - Manage products, process orders, and communicate with customers

Admins - Oversee platform operations, manage users, and monitor analytics

Built with Next.js, Node.js, MongoDB, and Tailwind CSS for a seamless shopping experience.

💻 Tech Stack
Frontend
Framework: Next.js 15 with App Router

Language: TypeScript

Styling: Tailwind CSS

State Management: Context API (Auth, Cart, Chat)

Real-time: Socket.io Client

Icons: Lucide React

Notifications: React Hot Toast

Forms: Native with TypeScript validation

Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose

Authentication: JWT (JSON Web Tokens)

Real-time: Socket.io

File Upload: Multer

Payment: Stripe, Braintree, PayPal integrations

Email: Nodemailer

✨ Features
👤 User Features
✅ Role-based registration (Customer, Vendor, Admin)

✅ Secure login with JWT

✅ Profile management

✅ Password change functionality

✅ Email verification

🛍️ Customer Features
✅ Browse products with advanced filtering

✅ Search by name, category, brand

✅ Price range & stock filters

✅ Sorting options (price, name, date, stock)

✅ Add to cart with quantity management

✅ Checkout with multiple payment methods

✅ Order history & tracking

✅ Real-time chat with vendors

✅ View order status updates

🏪 Vendor Features
✅ Dashboard with statistics

✅ Product management (CRUD operations)

✅ Inventory management

✅ Order management

✅ Order status updates (pending → processing → shipped → delivered)

✅ Chat with customers

✅ Order history

✅ Sales analytics

👑 Admin Features
✅ Comprehensive dashboard

✅ User management (view, edit, delete)

✅ Product management across all vendors

✅ Order management & monitoring

✅ Category management

✅ Analytics & reports

✅ Settings configuration

✅ System-wide notifications

💬 Chat System
✅ Real-time messaging

✅ One-on-one chat between customers and vendors

✅ File sharing in messages

✅ Read receipts

✅ Unread message badges

✅ Chat blocking/unblocking

✅ Message history

💳 Payment Integration
✅ Stripe integration

✅ Braintree support

✅ PayPal checkout

✅ Cash on delivery option

✅ Transaction history

✅ Payment confirmation emails

📱 Responsive Design
✅ Mobile-first approach

✅ Tablet-optimized layouts

✅ Desktop-enhanced experience

✅ Touch-friendly buttons and inputs

✅ Responsive tables and cards

✅ Adaptive navigation


PROJECT STRUCTURE:
mvep/
├── app/                          # Next.js App Router
│   ├── Admin/                    # Admin routes
│   │   ├── accounts/             # User management
│   │   ├── analytics/            # Analytics dashboard
│   │   ├── categories/           # Category management
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── orders/               # Order management
│   │   │   └── history/          # Order history
│   │   ├── products/             # Product management
│   │   └── settings/             # System settings
│   ├── Customer/                  # Customer routes
│   │   ├── chat/                  # Chat interface
│   │   ├── dashboard/             # Customer dashboard
│   │   ├── orders/                # Order management
│   │   │   ├── [id]/              # Order details
│   │   │   └── history/           # Order history
│   │   └── products/              # Product browsing
│   ├── Vendor/                     # Vendor routes
│   │   ├── chat/                   # Vendor chat
│   │   ├── dashboard/              # Vendor dashboard
│   │   ├── orders/                 # Order management
│   │   │   └── history/            # Order history
│   │   └── products/               # Product management
│   ├── cart/                        # Shopping cart
│   ├── checkout/                    # Checkout process
│   ├── components/                  # Reusable components
│   │   ├── chat/                    # Chat components
│   │   │   ├── ChatBox.tsx
│   │   │   ├── ChatLogic.ts
│   │   │   ├── GroupChatModal.tsx
│   │   │   ├── MyChats.tsx
│   │   │   ├── ScrollableChat.tsx
│   │   │   ├── SearchUser.tsx
│   │   │   ├── UserBadgeItem.tsx
│   │   │   └── UserListItem.tsx
│   │   ├── Navbar.tsx
│   │   ├── ParticlesBackground.tsx
│   │   ├── ProductCard.tsx
│   │   └── Sidebar.tsx
│   ├── login/                       # Login page
│   ├── products/                     # Product listing
│   │   └── [id]/                     # Product details
│   ├── signup/                        # Registration page
│   ├── payment/                       # Payment success page
│   ├── globals.css                     # Global styles
│   └── layout.tsx                      # Root layout
├── context/                            # React Context
│   ├── AuthContext.tsx                 # Authentication
│   ├── CartContext.tsx                 # Shopping cart
│   └── ChatContext.tsx                 # Real-time chat
├── services/                           # API services
│   ├── adminAccounts.service.ts
│   ├── auth.api.ts
│   ├── cart.api.ts
│   ├── chat.api.ts
│   ├── http.ts                         # Axios instance
│   ├── order.api.ts
│   ├── payment.api.ts
│   └── product.api.ts
├── shared/                             # Shared utilities
│   └── ProtectedRoute.tsx              # Route protection
├── types/                               # TypeScript types
│   ├── order.ts
│   └── user.ts
├── .env.local                           # Environment variables
├── next.config.js                       # Next.js config
├── package.json                         # Dependencies
├── tailwind.config.js                   # Tailwind config
└── tsconfig.json                        # TypeScript config



