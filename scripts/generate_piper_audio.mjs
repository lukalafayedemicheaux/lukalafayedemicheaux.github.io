import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const narrationDir = path.join(rootDir, "assets", "narration");
const outputDir = path.join(rootDir, "assets", "audio", "tts");
const modelPath = path.join(rootDir, "models", "piper", "fr_FR-siwis-medium.onnx");
const configPath = path.join(rootDir, "models", "piper", "fr_FR-siwis-medium.onnx.json");
const piperPython = path.join(rootDir, ".piper-venv", "bin", "python");

if (!fs.existsSync(piperPython)) {
  throw new Error("Missing .piper-venv. Run scripts/setup_piper.sh first.");
}

if (!fs.existsSync(modelPath) || !fs.existsSync(configPath)) {
  throw new Error("Missing Piper model files in models/piper/. Run scripts/setup_piper.sh first.");
}

const narrationFiles = fs
  .readdirSync(narrationDir)
  .filter((file) => /^slide-\d{2}\.txt$/.test(file))
  .sort();

if (!narrationFiles.length) {
  throw new Error("No narration files found in assets/narration/.");
}

fs.mkdirSync(outputDir, { recursive: true });

for (const file of narrationFiles) {
  const inputPath = path.join(narrationDir, file);
  const outputPath = path.join(outputDir, file.replace(/\.txt$/, ".wav"));
  const text = fs.readFileSync(inputPath, "utf8").trim();

  const run = spawnSync(
    piperPython,
    [
      "-m",
      "piper",
      "--model",
      modelPath,
      "--config",
      configPath,
      "--output-file",
      outputPath,
      "--length-scale",
      "1.08",
      "--noise-scale",
      "0.55",
      "--noise-w-scale",
      "0.7",
      "--sentence-silence",
      "0.28",
    ],
    {
      input: `${text}\n`,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  if (run.status !== 0) {
    process.stderr.write(run.stderr || "");
    throw new Error(`Piper failed for ${file}`);
  }

  process.stdout.write(`Generated ${path.basename(outputPath)}\n`);
}
