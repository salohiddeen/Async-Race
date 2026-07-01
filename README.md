# 🏎️ Async Race

**Score: 310 / 400**

**Deployed:** https://async-race-salohiddin.vercel.app

---

## Backend Setup (Required)

The interviewer must run the backend locally:

```bash
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm start
# Server runs at http://127.0.0.1:3000
```

## Frontend Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (Airbnb config) |
| `npm run format` | Prettier auto-format |
| `npm run ci:format` | Prettier format check |

## Tech Stack

- **React 18** + **TypeScript** (strict mode, noImplicitAny)
- **Redux Toolkit** — state management
- **React Router v6** — SPA routing (HashRouter)
- **Ant Design 5** — UI components
- **Vite 5** — build tool
- **ESLint** (Airbnb) + **Prettier**

---

## Checklist 310 / 400 pts

### 🚀 UI Deployment
- [x] Deployment Platform: Deployed on Vercel (link above)

### ✅ Requirements to Commits and Repository
- [x] Commit guidelines compliance: Conventional Commits format (init, feat, fix, refactor, docs)
- [x] Checklist included in README.md
- [x] Score calculation: 310/400
- [x] UI Deployment link in README.md

### Basic Structure (80 points)
- [x] Two Views (10 points): "Garage" and "Winners" views implemented
- [x] Garage View Content (30 points):
  - [x] Name of view ("Garage")
  - [x] Car creation and editing panel
  - [x] Race control panel
  - [x] Garage section with car list
- [x] Winners View Content (10 points):
  - [x] Name of view ("Winners")
  - [x] Winners table
  - [x] Pagination
- [x] Persistent State (30 points): Page numbers and input values preserved when switching views

### Garage View (90 points)
- [x] Car Creation And Editing Panel — CRUD Operations (20 points): Create, update, delete cars; deleted from winners table too; empty/too-long names handled
- [x] Color Selection (10 points): Ant Design ColorPicker (RGB), color shown on car icon
- [x] Random Car Creation (20 points): 100 cars per click, 15 brands × 15 models combinations, random hex color
- [x] Car Management Buttons (10 points): Edit and Delete buttons per car
- [x] Pagination (10 points): 7 cars per page
- [x] Empty Garage (10 extra points): "No Cars — create some!" message with icon
- [x] Empty Garage Page (10 extra points): Auto-navigates to previous page when last car on page is deleted

### 🏆 Winners View (50 points)
- [x] Display Winners (15 points): Winner saved to DB after race, shown in Winners view
- [x] Pagination for Winners (10 points): 10 winners per page
- [x] Winners Table (15 points): №, car image, name, wins count, best time in seconds; wins incremented, best time updated only if better
- [x] Sorting Functionality (10 points): Sort by wins and best time ASC/DESC via Ant Design Table sorter (server-side via query params)

### 🚗 Race (170 points)
- [x] Start Engine Animation (20 points): Click A → wait for velocity → animate with requestAnimationFrame → drive request; animation stops on 500 error
- [x] Stop Engine Animation (20 points): Click B → stopEngine API → car returns to start position
- [x] Responsive Animation (30 points): Works on screens as small as 500px (tested)
- [x] Start Race Button (10 points): Starts all cars on current page simultaneously
- [x] Reset Race Button (15 points): Returns all cars to starting positions, cancels animations
- [x] Winner Announcement (5 points): Ant Design Modal shows winner name, car color, and time
- [x] Button States (20 points): A disabled when starting/driving/finished; B disabled when idle/stopped
- [x] Actions during the race (50 points): Edit and Delete buttons disabled during race; page navigation allowed; generate random cars allowed

### 🎨 Prettier and ESLint Configuration (10 points)
- [x] Prettier Setup (5 points): `format` and `ci:format` scripts in package.json
- [x] ESLint Configuration (5 points): Airbnb style guide with TypeScript, `lint` script, Redux Toolkit override for reducers

### 🌟 Overall Code Quality (100 points — reviewer discretion)
- Layered architecture: `api/` `store/slices/` `hooks/` `components/` clearly separated
- Custom `useRace` hook encapsulates all animation and engine logic
- Helper functions extracted: `runAnimation`, `cancelAnim`, `buildColumns`, `getWinsColor`
- TypeScript strict mode, no `any` types
- React Router v6, Redux Toolkit, custom hooks, Ant Design 5 dark theme

# Async-Race
