import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "media-parts/manifest.json"), "utf8"));

for (const entry of manifest) {
  const chunks = [];
  for (const part of entry.parts) chunks.push(await readFile(path.join(root, part)));
  const media = Buffer.concat(chunks);
  const digest = createHash("sha256").update(media).digest("hex");
  if (media.length !== entry.size || digest !== entry.sha256) {
    throw new Error(`Incomplete portfolio video: ${entry.target}`);
  }
  const target = path.join(root, entry.target);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, media);
  console.log(`Prepared ${entry.target} (${media.length} bytes)`);
}
