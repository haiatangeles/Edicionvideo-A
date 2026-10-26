/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// En este entorno usamos el Chromium preinstalado (no se puede descargar el de Remotion).
const PREINSTALLED_CHROME =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (require("fs").existsSync(PREINSTALLED_CHROME)) {
  Config.setBrowserExecutable(PREINSTALLED_CHROME);
}
