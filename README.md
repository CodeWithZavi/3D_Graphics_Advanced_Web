# 3D_Graphics_Advanced_Web

A multi-project workspace for interactive 3D creation, collaborative design, and AI-assisted reconstruction. This repo groups three primary apps under one roof:

- 3DModelBuilder: Ininsico 3D builder + marketplace-style frontend with a Node/Express API.
- Olmec: 3D reconstruction platform with a full web app, backend API, and optional AI tooling.
- SyncSketch: Real-time collaborative canvas app (Liveblocks + Fabric).

## Table of Contents

- [Projects](#projects)
- [Quick Start](#quick-start)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Author](#author)

## Projects

### 3DModelBuilder
Ininsico 3D builder experience with a React (Vite) frontend and an Express backend. Includes an editor view, user flows, and server-side APIs for auth and model storage.

Location:
- Frontend: `3DModelBuilder/Ininsico`
- Backend: `3DModelBuilder/backend`

### Olmec
A full 3D reconstruction platform that combines a modern web UI, backend API, and an AI folder with Python-based tooling for reconstruction and experimentation.

Location:
- Frontend: `Olmec/frontend`
- Backend: `Olmec/backend`
- AI: `Olmec/AI`

### SyncSketch
Collaborative whiteboard-style design tool built with Next.js, Fabric, and Liveblocks for live presence, comments, and multi-user interaction.

Location:
- App: `SyncSketch/`

## Quick Start

Pick a project and run it independently. Each project is self-contained.

1) Install dependencies
2) Configure environment variables (if needed)
3) Start the dev server

## Project Setup

### 3DModelBuilder

From repo root:

```bash
cd 3DModelBuilder
npm install
npm run dev
```

Notes:
- The root `npm run dev` runs both the Vite frontend and the backend concurrently.
- The backend connects to a local MongoDB instance by default.

### Olmec

Frontend:

```bash
cd Olmec/frontend
npm install
npm run dev
```

Backend:

```bash
cd Olmec/backend
npm install
npm run dev
```

AI tooling (optional):

```bash
cd Olmec/AI
python -m venv .venv
. .venv/bin/activate  # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python web_app.py
```

### SyncSketch

```bash
cd SyncSketch
npm install
npm run dev
```

## Environment Variables

Some apps require `.env` files. Common cases:

- SyncSketch: `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY`
- Backends: database credentials, auth secrets, and API keys

Create `.env` or `.env.local` files inside the project folder that needs them.

## Scripts

Common scripts used across projects:

- `npm run dev` - start the dev server
- `npm run build` - build for production
- `npm run lint` - run linting

Check each `package.json` for project-specific scripts.

## Author

Noman Shakir (CodeWithZavi)

Email: nomanshaker2@gmail.com
