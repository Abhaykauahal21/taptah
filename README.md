# Taptah — Wholesome Traditions, Modern Bites

A premium Indian snack brand website built with Next.js App Router, React, Tailwind CSS, TypeScript, and motion foundations for editorial storytelling.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components by default)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Typography**: Next/Font (`Playfair Display` for Display Serif, `Plus Jakarta Sans` for Sans/Body)
- **Motion & Storytelling**: GSAP & ScrollTrigger (scroll-based storytelling, pinned sections), Framer Motion (micro-interactions)
- **Smooth Scroll**: Lenis (integrated with GSAP ticker & reduced-motion aware)
- **Icons**: Lucide React
- **Linter**: ESLint with next/core-web-vitals

---

## Getting Started

### Prerequisites

- **Node.js**: v20.x or v22.x (Recommended: v22.13+)
- **npm**: v10.x+

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production site URL | `http://localhost:3000` |

### Development Server

Start the local development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the initial development shell.

### Production Build

Create an optimized production build:

```bash
npm run build
npm run start
```

### Linting

Run code linting:

```bash
npm run lint
```

---

## Folder Structure

```text
src/
├── app/                  # Next.js App Router root
│   ├── layout.tsx        # Root layout, fonts, and global metadata
│   ├── page.tsx          # Initial development shell
│   ├── globals.css       # Design tokens & organic shape utilities
│   ├── loading.tsx       # Loading shell
│   ├── not-found.tsx     # 404 page
│   └── error.tsx         # Error boundary
├── components/
│   ├── layout/           # Global layout (Navbar, Footer)
│   ├── sections/         # Landing page modular sections
│   │   ├── Hero/         # Hero foundation
│   │   ├── Story/        # Brand story foundation
│   │   ├── Process/      # Handcrafted process steps
│   │   ├── Flavours/     # Flavours showcase
│   │   ├── Testimonials/ # Community reviews
│   │   └── CTA/          # Call to action
│   ├── ui/               # Reusable UI primitives (Button, etc.)
│   └── common/           # Shared components (ImagePlaceholder)
├── hooks/                # Custom React hooks (useLenis, useGsap, useMediaQuery, useScrollAnimation)
├── lib/                  # Library utilities (gsap.ts, utils.ts)
├── utils/                # Utility exports
├── constants/            # Structured content constants (navigation, flavours, process, testimonials)
├── types/                # Domain TypeScript definitions
└── config/               # App configuration (fonts, site metadata)

public/
├── images/
│   ├── hero/             # Hero photography
│   ├── story/            # Origin & harvest imagery
│   ├── process/          # Step-by-step imagery
│   ├── flavours/         # Product packaging renders
│   ├── testimonials/     # Community avatars
│   └── common/           # Shared logos & OG imagery
├── icons/                # Brand icons & SVGs
├── illustrations/        # Hand-drawn botanical elements
└── fonts/                # Local font fallbacks
```

---

## Design System

The visual identity embodies an editorial luxury Indian food brand:

- **Background**: Warm cream (`#F9F6F0`) & Soft sand (`#FAF7F2`)
- **Primary / Typography**: Deep maroon (`#381216`)
- **Secondary**: Muted brown (`#6E5343`)
- **Accent**: Warm heritage red (`#B23A22`) & Grain gold (`#D4A373`)
- **Dividers & Shapes**: Organic curved edges (`.organic-curve-top`, `.organic-shape-leaf`, etc.)

---

## Image & Photography Guidelines

1. Always use `next/image` with optimized sizes, priorities, and descriptive alt texts.
2. Store photography exclusively in designated folders under `public/images/`.
3. If real assets are pending, use the included `<ImagePlaceholder />` component instead of external placeholder URLs.

---

## Animation Architecture

- **GSAP + ScrollTrigger**: Dedicated to scroll-based storytelling, pinned sequences, and parallax timeline manipulation via `@/lib/gsap` and `useGsap` / `useScrollAnimation`.
- **Framer Motion**: Reserved for discrete UI transitions (menus, mobile drawer, micro-interactions).
- **Reduced Motion**: Automatically respected globally and in `useLenis`.
