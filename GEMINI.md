# 🔗 MyLink

MyLink is a personalized profile link service that allows users to collect and share multiple social media platforms and website links on a single page.

## 🚀 Project Overview
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Shadcn UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI Structure**:
  - **Split-View**: Admin dashboard with management/input area on the left and real-time Preview on the right.
  - **Responsive Design**: Mobile-first approach, with a centered card-style layout for desktop views.
- **Key Features**:
  - User authentication and unique username-based profile generation.
  - Link CRUD management (Title, URL, Thumbnail, Visibility toggle, Reordering).
  - Real-time Preview viewer.
  - Design customization and visitor analytics (Chart-based).

## 🛠️ Build & Run Guide
- **Development**: `npm run dev` (Turbopack)
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Type Check**: `npm run typecheck`

## 📏 Development Conventions
- **Framework**: Follow Next.js App Router patterns in the `@app/` directory.
- **Styling**: Use Tailwind CSS 4 and Shadcn UI components in `@components/ui/`.
- **Icons**: Use `@phosphor-icons/react` as the primary icon library.
- **Utilities**: Manage conditional classes using the `cn` function in `@lib/utils.ts`.
- **Documentation**: Refer to `@docs/PRD.md`, `@docs/USER_SCENARIO.md`, and `@docs/WIREFRAME.md` for functional and design consistency.

## 📝 Current Status (MVP)
- [x] Initial Project Setup (Next.js, Tailwind 4, Shadcn UI)
- [ ] User Authentication (Firebase Auth)
- [ ] Dashboard & Link Management UI
- [ ] Profile Customization Features
- [ ] Public Profile Page Rendering
- [ ] Drag & Drop Link Reordering
- [ ] Real-time Preview Functionality
