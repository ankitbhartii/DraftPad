<div align="center">

<img src="https://img.wattpad.com/cover/80428185-256-k819228.jpg" width="120" height="180" style="border-radius:12px;" alt="Through My Window">

# 📖 WattpadClone

### A pixel-perfect, full-stack Wattpad clone powered by the live Wattpad API

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[🌐 Live Demo](#) · [📚 Features](#-features) · [🚀 Quick Start](#-quick-start) · [🔧 API Reference](#-api-reference)

---

![Home Page Preview](https://img.wattpad.com/cover/193021273-256-k819228.jpg)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Live Home Page** | 15 category shelves (300+ books) loaded server-side from the live Wattpad API |
| 🔍 **Real Search** | Search any of Wattpad's 1B+ stories — results appear instantly with covers, stats, and read counts |
| 📖 **In-App Reader** | Full chapter reader with real chapter text — no redirects to Wattpad |
| 🎭 **Story Details** | Cover, synopsis, author profile, full parts list, vote/read counts |
| 📚 **15 Genre Shelves** | Romance, Fantasy, Teen Fiction, Mystery, Werewolf, Vampire, Sci-Fi, Horror, LGBTQ+, and more |
| ⭐ **Wattpad Originals** | Featured shelf with direct access to Wattpad Originals (Through My Window, After, etc.) |
| 🌙 **Dark Mode** | Immersive dark UI matching Wattpad's aesthetic |
| ⚡ **Server-Side Rendering** | All book covers and metadata pre-rendered — zero loading spinners on home page |
| 📱 **Responsive Design** | Fully mobile-optimised scrollable shelves |
| 🔄 **Chapter Navigation** | Prev/Next navigation across all parts of every story |

---

## 🖼️ Screenshots

<div align="center">

### 🏠 Home Page — 15 Live Shelves
> 300+ books from 15 genres, all server-side rendered with real covers and stats

### 🔍 Search — Live Wattpad Results
> Search any book, find it instantly with full metadata

### 📖 Reader — Real Chapter Text
> Full immersive reader with progress bar and chapter navigation

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- A **Supabase** project (free tier works fine)

### 1. Clone the repository

```bash
git clone https://github.com/ankitbhartii/DraftPad.git
cd DraftPad
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set up the Supabase database

Run the schema SQL file in your Supabase SQL editor:

```bash
# File is at: supabase/schema.sql
# Paste its contents into the Supabase Dashboard → SQL Editor → Run
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                     # 🏠 Home page (SSR, 15 shelves)
│   ├── story/
│   │   └── [id]/
│   │       ├── page.tsx             # 📚 Story details page
│   │       └── read/[chapter_order]/
│   │           └── page.tsx         # 📖 Chapter reader
│   └── api/
│       ├── wattpad/
│       │   ├── search/route.ts      # 🔍 Search proxy
│       │   ├── story/[id]/route.ts  # 📗 Story metadata proxy
│       │   ├── chapter/[partId]/    # 📄 Chapter text proxy
│       │   └── trending/route.ts    # 📈 Trending/category proxy
│       ├── migrate/route.ts         # 🔄 Custom story ingestion
│       └── seed/route.ts            # 🌱 Database seeder
├── components/
│   ├── Header.tsx                   # 🔝 Navigation + search bar
│   ├── WattpadSearchResults.tsx     # 🔍 Live search results grid
│   ├── WattpadHero.tsx              # 🦸 Featured story hero
│   ├── WattpadShelf.tsx             # 📚 Scrollable story shelf
│   ├── MigrationForm.tsx            # ⚙️ Custom story ingestor
│   └── SeedButton.tsx               # 🌱 Quick seed button
└── lib/
    ├── wattpad-client.ts            # 🔌 Wattpad API client
    └── supabase.ts                  # 🗄️ Supabase client
```

---

## 🔧 API Reference

All API routes act as **server-side proxies** to bypass CORS and add browser-like headers.

### Wattpad Search
```http
GET /api/wattpad/search?q={query}&limit={20}&offset={0}
```

### Story Metadata
```http
GET /api/wattpad/story/{storyId}
```

### Chapter Text
```http
GET /api/wattpad/chapter/{partId}
```

### Trending / Category
```http
GET /api/wattpad/trending?category={romance}&limit={20}
```

---

## 🔌 Wattpad API Integration

This project uses the **same public API endpoints** as the official Wattpad website (reverse-engineered from [wattpad.js](https://github.com/Gimenz/wattpad.js)):

| Endpoint | Base URL | Purpose |
|----------|----------|---------|
| Search | `https://api.wattpad.com/v4/search/stories` | Search stories |
| Story details | `https://www.wattpad.com/api/v3/stories/{id}` | Metadata + parts list |
| Chapter text | `https://www.wattpad.com/apiv2/?m=storytext&id={partId}` | Real chapter content |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, SSR) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Custom CSS |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Images** | [Next/Image](https://nextjs.org/docs/app/api-reference/components/image) |
| **Fonts** | [Google Fonts – Nunito](https://fonts.google.com/specimen/Nunito) |

---

## 📦 Deployment

### Deploy to Vercel (recommended)

```bash
npm run build   # Verify build passes
vercel --prod   # Deploy
```

Set these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🎨 Design Highlights

- **Dark-first design** — deep `#0f0f12` background matching Wattpad's premium look
- **Wattpad orange** (`#ff6122`) accent color throughout
- **Glassmorphism** on modals and overlay elements
- **Smooth hover animations** — book covers scale and glow on hover
- **Reading progress bar** — shows chapter progress percentage
- **Blurred hero backdrop** — featured book cover blurred behind hero section

---

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Your deployment URL | Optional |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

This project is built for **educational purposes only**. It uses Wattpad's public API endpoints to display story metadata and content. All stories, covers, and content belong to their respective authors and Wattpad. This is not affiliated with or endorsed by Wattpad.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [ankitbhartii](https://github.com/ankitbhartii)

⭐ **Star this repo** if you found it helpful!

</div>
