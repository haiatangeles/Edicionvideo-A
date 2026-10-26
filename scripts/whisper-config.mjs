import path from "node:path";

export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
export const WHISPER_VERSION = "1.5.5";
// Multilingüe (sirve para español). Cambiar a "medium" o "large-v3-turbo" para más precisión.
export const WHISPER_MODEL = process.env.WHISPER_MODEL ?? "small";
