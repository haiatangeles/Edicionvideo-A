// Transcribe un vídeo/audio a subtítulos palabra a palabra.
// Uso: node scripts/transcribir.mjs public/mi-video.mp4 [idioma=es]
// Salida: public/<nombre>.captions.json (formato Caption de @remotion/captions)
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from "./whisper-config.mjs";

const [input, language = "es"] = process.argv.slice(2);
if (!input) {
  console.error("Uso: node scripts/transcribir.mjs <archivo> [idioma]");
  process.exit(1);
}

const name = path.parse(input).name;
const tmpDir = path.join(process.cwd(), "tmp");
mkdirSync(tmpDir, { recursive: true });
const wav = path.join(tmpDir, `${name}.wav`);

// whisper.cpp necesita WAV 16 kHz mono
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", input, "-ar", "16000", "-ac", "1", wav], {
  stdio: "inherit",
});

const whisperCppOutput = await transcribe({
  inputPath: wav,
  whisperPath: WHISPER_PATH,
  whisperCppVersion: WHISPER_VERSION,
  model: WHISPER_MODEL,
  language,
  tokenLevelTimestamps: true,
});

const { captions } = toCaptions({ whisperCppOutput });
const out = path.join(path.dirname(input), `${name}.captions.json`);
writeFileSync(out, JSON.stringify(captions, null, 2));
console.log(`${captions.length} palabras -> ${out}`);
