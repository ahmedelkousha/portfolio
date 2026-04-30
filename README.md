# 🚀 Ahmed Maher | Full-Stack Developer & SEO Specialist

A high-end, 100% dynamic portfolio built for visual excellence and technical performance. This project features a custom-built **Content Management System (CMS)**, real-time client communication, and professional SEO optimization.

![Portfolio Preview](https://ahmedmaher-web.vercel.app/)

## ✨ Key Features

### 🏗️ 100% Dynamic Content (CMS)
- **Firebase Firestore Integration**: Every section (Projects, Skills, Experience, Education, Personal Info) is managed via a secure admin dashboard.
- **Instant Updates**: Changes in the dashboard reflect on the frontend immediately without rebuilding or redeploying.

### 🛡️ Professional Admin Dashboard
- **Secure Authentication**: Protected routes powered by Firebase Auth.
- **Message Center**: A full-featured inbox with **Active**, **Read**, and **Archived** tabs for client inquiries.
- **Stats Manager**: Dynamic management of portfolio metrics (e.g., "100% Satisfaction", "50+ Projects").

### 🎨 Premium UI/UX
- **Interactive Animations**: Powered by **Framer Motion** for smooth, physics-based transitions.
- **Smart Website Previews**: Integrated with **Microlink API** to automatically generate high-quality screenshots from live demo links.
- **Glassmorphism Design**: Modern, premium aesthetic using Tailwind CSS and high-end color palettes.

### 📈 Technical SEO & Performance
- **Dynamic Meta Tags**: Real-time titles, descriptions, and keywords managed through Firestore and `react-helmet-async`.
- **Structured Data**: JSON-LD Schema.org implementation for rich search results.
- **Sitemap & Robots**: Automatically configured `sitemap.xml` and `robots.txt` pointing to `ahmedmaher-web.vercel.app`.
- **PWA Ready**: Web manifest configured for mobile home screen installation.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **Deployment**: Vercel
- **Optimization**: React Helmet Async, Microlink API

## 🚀 Getting Started

### 1. Clone & Install
```sh
git clone https://github.com/ahmedelkousha/portfolio.git
cd portfolio
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory. This project uses the **`PPV_`** prefix for security:

```env
PPV_FIREBASE_API_KEY=your_key
PPV_FIREBASE_AUTH_DOMAIN=your_domain
PPV_FIREBASE_PROJECT_ID=your_id
PPV_FIREBASE_STORAGE_BUCKET=your_bucket
PPV_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PPV_FIREBASE_APP_ID=your_app_id
PPV_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Run Locally
```sh
npm run dev
```

## 📦 Deployment

This project is optimized for **Vercel**.
- The `vercel.json` is pre-configured with SPA rewrites to ensure seamless routing.
- Environment variables must be added in the Vercel Dashboard with the `PPV_` prefix.

## 📄 License
MIT © Ahmed Maher
