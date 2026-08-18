const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

/** @type {import('./lib/types').AppState} */
let state = {
  queue: [],
  activeId: null,
  lyricsSlideIndex: 0,
  isRevealing: false,
  showContent: false,
  showYoutube: false,
};

function broadcastState(io) {
  io.emit("state:update", state);
}

function getActiveItem() {
  if (!state.activeId) return null;
  return state.queue.find((item) => item.id === state.activeId) ?? null;
}

function setActive(id, io) {
  const item = state.queue.find((q) => q.id === id);
  if (!item) return;

  state.activeId = id;
  state.lyricsSlideIndex =
    item.mode === "surpriza_speciala" &&
    item.lyricsMode &&
    item.lyricsSlides.length > 0
      ? -1
      : 0;
  state.isRevealing = true;
  state.showContent = false;
  state.showYoutube = false;
  broadcastState(io);

  // Auto-complete reveal after animation duration
  setTimeout(() => {
    if (state.activeId === id && state.isRevealing) {
      state.isRevealing = false;
      state.showContent = true;
      broadcastState(io);
    }
  }, 2800);
}

function setLyricsSlide(index, io) {
  const active = getActiveItem();
  if (!active || !active.lyricsMode) return;

  const surprizaIntro =
    active.mode === "surpriza_speciala" && active.lyricsSlides.length > 0;
  const minIndex = surprizaIntro ? -1 : 0;
  const maxIndex = Math.max(0, active.lyricsSlides.length - 1);
  state.lyricsSlideIndex = Math.max(minIndex, Math.min(index, maxIndex));
  broadcastState(io);
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    socket.emit("state:update", state);

    socket.on("state:request", () => {
      socket.emit("state:update", state);
    });

    socket.on("queue:add", (item) => {
      const newItem = {
        id: uuidv4(),
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        songName: item.songName || "",
        youtubeLink: item.youtubeLink || "",
        mode: item.mode || "standard",
        lyricsMode: !!item.lyricsMode,
        lyricsSlides: item.lyricsSlides || [],
      };
      state.queue.push(newItem);
      broadcastState(io);
    });

    socket.on("queue:update", (payload) => {
      const index = state.queue.findIndex((q) => q.id === payload.id);
      if (index === -1) return;
      state.queue[index] = {
        ...state.queue[index],
        firstName: payload.firstName ?? state.queue[index].firstName,
        lastName: payload.lastName ?? state.queue[index].lastName,
        songName: payload.songName ?? state.queue[index].songName,
        youtubeLink: payload.youtubeLink ?? state.queue[index].youtubeLink,
        mode: payload.mode ?? state.queue[index].mode,
        lyricsMode: payload.lyricsMode ?? state.queue[index].lyricsMode,
        lyricsSlides: payload.lyricsSlides ?? state.queue[index].lyricsSlides,
      };
      broadcastState(io);
    });

    socket.on("queue:remove", (id) => {
      state.queue = state.queue.filter((q) => q.id !== id);
      if (state.activeId === id) {
        state.activeId = null;
        state.lyricsSlideIndex = 0;
        state.isRevealing = false;
        state.showContent = false;
        state.showYoutube = false;
      }
      broadcastState(io);
    });

    socket.on("queue:reorder", (orderedIds) => {
      if (!Array.isArray(orderedIds) || orderedIds.length !== state.queue.length) {
        return;
      }
      const map = new Map(state.queue.map((q) => [q.id, q]));
      const reordered = orderedIds.map((id) => map.get(id)).filter(Boolean);
      if (reordered.length !== state.queue.length) return;
      state.queue = reordered;
      broadcastState(io);
    });

    socket.on("queue:move", ({ id, direction }) => {
      const index = state.queue.findIndex((q) => q.id === id);
      if (index === -1) return;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= state.queue.length) return;
      const [item] = state.queue.splice(index, 1);
      state.queue.splice(target, 0, item);
      broadcastState(io);
    });

    socket.on("active:set", (id) => {
      setActive(id, io);
    });

    socket.on("active:next", () => {
      if (state.queue.length === 0) return;
      const currentIndex = state.activeId
        ? state.queue.findIndex((q) => q.id === state.activeId)
        : -1;
      const nextIndex = (currentIndex + 1) % state.queue.length;
      setActive(state.queue[nextIndex].id, io);
    });

    socket.on("active:clear", () => {
      state.activeId = null;
      state.lyricsSlideIndex = 0;
      state.isRevealing = false;
      state.showContent = false;
      state.showYoutube = false;
      broadcastState(io);
    });

    socket.on("youtube:open", () => {
      const active = getActiveItem();
      if (!active?.youtubeLink) return;
      state.showYoutube = true;
      broadcastState(io);
    });

    socket.on("lyrics:slide", (index) => {
      setLyricsSlide(index, io);
    });

    socket.on("lyrics:next", () => {
      setLyricsSlide(state.lyricsSlideIndex + 1, io);
    });

    socket.on("lyrics:prev", () => {
      setLyricsSlide(state.lyricsSlideIndex - 1, io);
    });

    socket.on("reveal:complete", () => {
      state.isRevealing = false;
      state.showContent = true;
      broadcastState(io);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Admin:   http://localhost:${port}/admin`);
    console.log(`> Projector: http://localhost:${port}/projector`);
  });
});
