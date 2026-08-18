# The Last Dance — Karaoke Event Management

Premium real-time karaoke queue & teleprompter app built with Next.js and Socket.io.

## Quick Start

```bash
npm install
npm run dev
```

Open:
- **Admin Panel:** http://localhost:3000/admin
- **Projector Screen:** http://localhost:3000/projector

## Usage

### Admin (phone/laptop)
1. Add singers with name, song, optional YouTube link
2. Toggle **Special Guest** for VIP intro styling
3. Toggle **Lyrics Mode** and paste lyrics — separate slides with blank lines
4. Use **Next in Queue** or tap any queue item to push to projector
5. When lyrics are active, the **Lyrics Monitor** PIP appears — use Prev/Next to sync slides

### Projector (fullscreen on second display)
- Shows idle neon sign when nothing is active
- Plays reveal animation + sound when a singer goes live
- **Lyrics Mode:** use `→`, `←`, or `Space` to change slides (syncs back to admin PIP)

## Deploy on Railway

This app uses a custom Node server (`server.js`) for Socket.io. Railway auto-detects:

- **Build:** `npm run build`
- **Start:** `npm start`

Set `PORT` env var (Railway sets this automatically).

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Socket.io 4
