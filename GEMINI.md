# GEMINI Context: My link

## Project Overview
**My link** is a link manager application designed to centralize and manage your links. The core application is located within the `my-profile` directory.

### Main Technologies
- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Linting:** ESLint 9

## Project Structure
- `/`: Project root.
  - `README.md`: Basic project description.
  - `my-profile/`: The primary Next.js application directory.
    - `app/`: Contains the application routes and UI components (App Router).
    - `public/`: Static assets such as images and SVGs.
    - `next.config.ts`: Next.js configuration.
    - `tsconfig.json`: TypeScript configuration.
    - `package.json`: Project dependencies and scripts.

## Building and Running
All commands should be executed within the `my-profile` directory.

- **Start Development Server:**
  ```bash
  cd my-profile
  npm run dev
  ```
- **Build for Production:**
  ```bash
  cd my-profile
  npm run build
  ```
- **Run Production Build:**
  ```bash
  cd my-profile
  npm run start
  ```
- **Linting:**
  ```bash
  cd my-profile
  npm run lint
  ```

## Development Conventions
- **Routing:** Uses the Next.js App Router located in `my-profile/app`.
- **Styling:** Tailwind CSS is used for utility-first styling.
- **Types:** TypeScript is strictly used; ensure types are defined for new components and functions.
- **Components:** Favor functional components and React hooks.
