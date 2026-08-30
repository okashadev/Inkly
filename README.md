# 🖊️ Inkly – Full-Stack Blogging Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Inkly-blue?style=for-the-badge&logo=vercel)](https://inkly-ecru.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/okashadev/inkly)

> 🔗 **Live Web Application:** [https://inkly-ecru.vercel.app](https://inkly-ecru.vercel.app)

Inkly is a modern, feature-rich full-stack blogging web application designed for creators and readers. Built with **Next.js 15**, **React**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM with PostgreSQL**, it offers a seamless reading experience alongside robust post management and social interaction features.

---

## ✨ Features

- **📝 Post Management:** Full CRUD capabilities for writing, publishing, and updating articles.
- **❤️ Interactive Engagement:** Like posts, bookmark articles for later reading, and track view counts in real-time.
- **👤 Dynamic Author Profiles:** Dedicated profile pages showing author bio, stats (followers/articles count), and follow/unfollow functionality.
- **💬 Commenting System:** Engage in discussions with nested post comments.
- **🔍 Related Content & Categorization:** Topic/Category-based filtering and automated related blogs suggestions.
- **🔐 Secure Authentication:** Seamless user authentication and protected action states.
- **🎨 Modern UI/UX:** Fully responsive, dark-themed UI built with Tailwind CSS, Framer Motion animations, and Lucide icons.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations & Icons:** [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)

### **Backend & Database**
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js / Custom Auth
- **Deployment & Hosting:** [Vercel](https://vercel.com/) with automated CI/CD pipelines

---

## 🚀 Getting Started

Follow these steps to set up and run Inkly locally on your machine.

### **Prerequisites**
- Node.js (v18.x or higher)
- npm, yarn, pnpm, or bun
- PostgreSQL database (Local instance or Cloud DB like Supabase/Neon)

### **1. Clone the Repository**
```bash
git clone [https://github.com/your-username/inkly.git](https://github.com/your-username/inkly.git)
cd inkly
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Variables Setup**
- Create a .env file in the root directory and add the following configuration:

```
# Database Connection
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/inkly_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# CLOUDINARY Configuration
CLOUDINARY_CLOUD_NAME="name"
CLOUDINARY_API_KEY="api_key"
CLOUDINARY_API_SECRET="api_secret"

```

### **4. Database Setup & Migration**

- Run Prisma migrations to set up your PostgreSQL database schema:

```Bash
npx prisma migrate dev --name init
npx prisma generate
```

### **5. Run Development Server**
- Start the local server:

```Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.
```

### **📂 Project Structure**

```text
inkly/
├── prisma/                   # Database schema, seed files, & migrations
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/                   # Static assets & public media files
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router routes & pages
│   │   ├── (auth)/           # Authentication route group (login, register, forget_password UI Pages)
│   │   ├── api/              # Backend REST API route handlers
│   │   ├── authors/          # Author profiles and search page routes
│   │   ├── blog/             # Individual blog post routes
│   │   ├── category/         # Category-wise blog filtering
│   │   ├── user/             # User specific routes(Dashboard, My Blogs, Write Blog, Settings )
│   │   ├── global-error.tsx  # Global error handling page
│   │   ├── globals.css       # Global styles & Tailwind imports
│   │   ├── layout.tsx        # Root layout wrapper
│   │   ├── not-found.tsx     # Custom 404 page
│   │   └── page.tsx          # Homepage
│   ├── components/           # Feature-based modular React components
│   │   ├── auth/             # Login & registration forms
│   │   ├── blog/             # Article cards, comments, & Blog views
│   │   ├── dashboard/        # Author stats & management UI
│   │   ├── editor/           # Rich text post creation editor
│   │   ├── home/             # Hero, trending feeds, & home UI
│   │   ├── layout/           # Navbar & footer
│   │   ├── providers/        # Context & state providers
│   │   ├── settings/         # User profile configuration components
│   │   └── ui/               # Shadcn UI Components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Helper utilities & library configurations
│   ├── types/                # TypeScript interface definitions
│   ├── utils/                # Helper functions
│   ├── auth.config.ts        # NextAuth edge-compatible configuration
│   ├── auth.ts               # NextAuth initialization
│   └── proxy.ts              # Proxy setup utilities
├── .env                      # Local environment configuration
├── components.json           # Shadcn/UI component config
├── next.config.ts            # Next.js custom configuration
├── prisma.config.ts          # Custom Prisma setup configuration
└── tsconfig.json             # TypeScript compiler settings
```

### **☁️ Deployment**
- This project is deployed on Vercel with continuous integration (CI/CD) triggers enabled on main branch commits.

- To deploy your own version:

- Push your repository to GitHub.

- Import the project into Vercel.

- Add DATABASE_URL and other Environment Variables in the Vercel Environment Variables section.

Deploy!