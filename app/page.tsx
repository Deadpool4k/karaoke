import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-8">
      <h1
        className="font-display text-5xl md:text-7xl text-center text-glow-magenta animate-pulse-neon tracking-wider"
        style={{ fontFamily: "var(--font-display)" }}
      >
        The Last Dance
      </h1>
      <p className="text-zinc-400 text-lg">Karaoke Event Management</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 w-full max-w-xl">
        <Link
          href="/admin"
          className="px-6 py-4 rounded-lg border border-neon-magenta/50 bg-neon-magenta/10 text-neon-magenta font-semibold hover:bg-neon-magenta/20 transition-all border-glow-magenta text-center text-sm"
        >
          Admin
        </Link>
        <Link
          href="/projector"
          className="px-6 py-4 rounded-lg border border-neon-yellow/50 bg-neon-yellow/10 text-neon-yellow font-semibold hover:bg-neon-yellow/20 transition-all text-center text-sm"
        >
          Projector
        </Link>
        <Link
          href="/register"
          className="px-6 py-4 rounded-lg border border-zinc-600 bg-zinc-900/50 text-zinc-300 font-semibold hover:bg-zinc-800 transition-all text-center text-sm"
        >
          Înscriere
        </Link>
      </div>
    </main>
  );
}
