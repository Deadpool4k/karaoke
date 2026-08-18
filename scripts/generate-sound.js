const fs = require("fs");
const path = require("path");

/**
 * Generates a short cinematic "slam" WAV for the singer reveal.
 */
function generateRevealWav() {
  const sampleRate = 44100;
  const duration = 0.8;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 8) * (1 - Math.exp(-t * 200));
    const freq = 80 + 400 * Math.exp(-t * 15);
    const sample =
      env *
      (Math.sin(2 * Math.PI * freq * t) * 0.6 +
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +
        (Math.random() * 2 - 1) * 0.15 * Math.exp(-t * 20));
    const clamped = Math.max(-1, Math.min(1, sample));
    buffer.writeInt16LE(Math.floor(clamped * 32767 * 0.9), 44 + i * 2);
  }

  const dir = path.join(__dirname, "..", "public", "sounds");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "reveal.wav"), buffer);
  console.log("Generated public/sounds/reveal.wav");
}

generateRevealWav();
