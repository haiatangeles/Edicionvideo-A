// Instala whisper.cpp (CPU) y descarga el modelo. Uso: node scripts/instalar-whisper.mjs
import {
  downloadWhisperModel,
  installWhisperCpp,
} from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from "./whisper-config.mjs";

await installWhisperCpp({ to: WHISPER_PATH, version: WHISPER_VERSION });
await downloadWhisperModel({ model: WHISPER_MODEL, folder: WHISPER_PATH });
console.log(`whisper.cpp ${WHISPER_VERSION} + modelo ${WHISPER_MODEL} listos en ${WHISPER_PATH}`);
