const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const DATA_DIR = path.join(__dirname, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

console.log(`Starting server (NODE_ENV=${process.env.NODE_ENV || "undefined"}, port=${port})`);

const app = next({ dev });
const handle = app.getRequestHandler();

const defaultState = {
  queue: [],
  pendingRequests: [],
  history: [],
  activeId: null,
  lyricsSlideIndex: 0,
  isRevealing: false,
  showContent: false,
  showYoutube: false,
};

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const saved = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      return {
        ...defaultState,
        queue: (saved.queue || []).map(normalizeQueueItem),
        pendingRequests: saved.pendingRequests || [],
        history: saved.history || [],
        // După restart: proiectorul revine la idle
        activeId: null,
        lyricsSlideIndex: 0,
        isRevealing: false,
        showContent: false,
        showYoutube: false,
      };
    }
  } catch (err) {
    console.error("Failed to load state:", err.message);
  }
  return { ...defaultState };
}

function normalizeQueueItem(item) {
  return {
    id: item.id,
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    songName: item.songName || "",
    youtubeLink: item.youtubeLink || "",
    mode: item.mode || "standard",
    lyricsMode: !!item.lyricsMode,
    lyricsSlides: item.lyricsSlides || [],
    skipReveal: !!item.skipReveal,
  };
}

function persistState() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const snapshot = {
      queue: state.queue,
      pendingRequests: state.pendingRequests,
      history: state.history,
      activeId: state.activeId,
      lyricsSlideIndex: state.lyricsSlideIndex,
      showContent: state.showContent,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(snapshot, null, 2));
  } catch (err) {
    console.error("Failed to persist state:", err.message);
  }
}

/** @type {typeof defaultState} */
let state = loadState();

function broadcastState(io) {
  io.emit("state:update", state);
  persistState();
}

function getActiveItem() {
  if (!state.activeId) return null;
  return state.queue.find((item) => item.id === state.activeId) ?? null;
}

function personKey(first, last) {
  return `${(first || "").trim().toLowerCase()}|${(last || "").trim().toLowerCase()}`;
}

function isDuplicateInQueue(firstName, lastName) {
  if (!firstName.trim()) return false;
  const key = personKey(firstName, lastName);
  return state.queue.some(
    (q) => personKey(q.firstName, q.lastName) === key
  );
}

function isDuplicatePending(firstName, lastName) {
  if (!firstName.trim()) return false;
  const key = personKey(firstName, lastName);
  return state.pendingRequests.some(
    (r) => personKey(r.firstName, r.lastName) === key
  );
}

function addToHistory(item) {
  if (!item) return;
  const last = state.history[0];
  if (
    last &&
    last.id === item.id &&
    Date.now() - last.performedAt < 15000
  ) {
    return;
  }
  state.history.unshift({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    songName: item.songName,
    performedAt: Date.now(),
  });
  state.history = state.history.slice(0, 100);
}

function finishAndGoIdle(io) {
  const current = getActiveItem();
  if (current) addToHistory(current);
  clearActiveDisplay();
  broadcastState(io);
}

function clearActiveDisplay() {
  state.activeId = null;
  state.lyricsSlideIndex = 0;
  state.isRevealing = false;
  state.showContent = false;
  state.showYoutube = false;
}

function setActive(id, io) {
  const item = state.queue.find((q) => q.id === id);
  if (!item) return;

  state.activeId = id;
  state.showYoutube = false;
  state.lyricsSlideIndex =
    item.mode === "surpriza_speciala" &&
    item.lyricsMode &&
    item.lyricsSlides.length > 0
      ? -1
      : 0;

  if (item.skipReveal) {
    state.isRevealing = false;
    state.showContent = true;
    broadcastState(io);
    return;
  }

  state.isRevealing = true;
  state.showContent = false;
  broadcastState(io);

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

function buildQueueItem(item) {
  return normalizeQueueItem({
    id: uuidv4(),
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    songName: item.songName || "",
    youtubeLink: item.youtubeLink || "",
    mode: item.mode || "standard",
    lyricsMode: !!item.lyricsMode,
    lyricsSlides: item.lyricsSlides || [],
    skipReveal: !!item.skipReveal,
  });
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
      if (
        item.mode === "standard" &&
        isDuplicateInQueue(item.firstName, item.lastName)
      ) {
        return;
      }
      state.queue.push(buildQueueItem(item));
      broadcastState(io);
    });

    socket.on("queue:update", (payload) => {
      const index = state.queue.findIndex((q) => q.id === payload.id);
      if (index === -1) return;
      state.queue[index] = normalizeQueueItem({
        ...state.queue[index],
        ...payload,
        id: payload.id,
      });
      broadcastState(io);
    });

    socket.on("queue:remove", (id) => {
      state.queue = state.queue.filter((q) => q.id !== id);
      if (state.activeId === id) clearActiveDisplay();
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

    socket.on("request:submit", (payload) => {
      if (!payload?.firstName?.trim() || !payload?.songName?.trim()) return;
      if (
        isDuplicateInQueue(payload.firstName, payload.lastName) ||
        isDuplicatePending(payload.firstName, payload.lastName)
      ) {
        return;
      }
      state.pendingRequests.push({
        id: uuidv4(),
        firstName: payload.firstName.trim(),
        lastName: (payload.lastName || "").trim(),
        songName: payload.songName.trim(),
        youtubeLink: (payload.youtubeLink || "").trim(),
        createdAt: Date.now(),
      });
      broadcastState(io);
    });

    socket.on("request:approve", (id) => {
      const req = state.pendingRequests.find((r) => r.id === id);
      if (!req) return;
      if (isDuplicateInQueue(req.firstName, req.lastName)) {
        state.pendingRequests = state.pendingRequests.filter((r) => r.id !== id);
        broadcastState(io);
        return;
      }
      state.queue.push(
        buildQueueItem({
          firstName: req.firstName,
          lastName: req.lastName,
          songName: req.songName,
          youtubeLink: req.youtubeLink,
          mode: "standard",
          lyricsMode: false,
          lyricsSlides: [],
          skipReveal: false,
        })
      );
      state.pendingRequests = state.pendingRequests.filter((r) => r.id !== id);
      broadcastState(io);
    });

    socket.on("request:reject", (id) => {
      state.pendingRequests = state.pendingRequests.filter((r) => r.id !== id);
      broadcastState(io);
    });

    socket.on("active:set", (id) => {
      setActive(id, io);
    });

    socket.on("active:next", () => {
      if (state.queue.length === 0) return;
      const current = getActiveItem();
      if (current) addToHistory(current);

      const currentIndex = state.activeId
        ? state.queue.findIndex((q) => q.id === state.activeId)
        : -1;
      const nextIndex = currentIndex + 1;

      if (nextIndex >= state.queue.length) {
        clearActiveDisplay();
        broadcastState(io);
        return;
      }
      setActive(state.queue[nextIndex].id, io);
    });

    socket.on("active:clear", () => {
      clearActiveDisplay();
      broadcastState(io);
    });

    socket.on("active:idle", () => {
      finishAndGoIdle(io);
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
    console.log(`> Admin:    http://localhost:${port}/admin`);
    console.log(`> Projector: http://localhost:${port}/projector`);
    console.log(`> Register: http://localhost:${port}/register`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
