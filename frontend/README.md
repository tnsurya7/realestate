# RealEstateCrm - Frontend

This is the frontend application for **RealEstateCrm**, a modern and comprehensive Real Estate CRM platform.

## Features

- **Public Website:** Browse premium properties, dedicated about and contact pages with lead capture integration.
- **Admin Dashboard:** Secure, role-based dashboard for managing leads, property listings, and viewing analytics.
- **Modern UI:** Built with React, TypeScript, Tailwind CSS, and Framer Motion for a fluid, responsive user experience.
- **State Management:** Fully integrated with Axios for backend interactions and local Context for Auth.

## Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom utilities
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Icons:** Custom SVGs
- **HTTP Client:** Axios

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development

- Start local dev server: `npm run dev`
- Run typecheck: `npx tsc --noEmit`

## Environment Variables
Create a `.env` file in the root if you need to point to a remote backend server:
```
VITE_API_URL=http://localhost:8080/api
```
