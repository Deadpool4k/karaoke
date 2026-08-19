# The Last Dance — Karaoke Event Management

Premium real-time karaoke queue & teleprompter app.

## Quick Start

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set your admin PIN (default: `1234`).

## Pages

| URL | Rol |
|-----|-----|
| `/admin` | Control panel (PIN required) |
| `/projector` | Full-screen display + QR pentru înscriere |
| `/register` | Invitații trimit cereri de cântat |

## Features

- Real-time queue via Socket.io
- Persistență automată în `data/state.json`
- Cereri invitați cu aprobare admin
- Lyrics teleprompter, YouTube manual, moduri speciale
- Istoric cântăreți, duplicate check, skip reveal
- PIN admin

## Deploy (Railway)

- Build: `npm run build`
- Start: `npm start`
- Set `ADMIN_PIN` env var on Railway
