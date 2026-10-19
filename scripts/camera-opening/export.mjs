import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

const here = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(process.argv[2] || "/tmp/wm-camera-render");
fs.mkdirSync(output, { recursive: true });
GlobalFonts.registerFromPath("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "Arial");
GlobalFonts.registerFromPath("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", "Georgia");
globalThis.document = { createElement: () => createCanvas(1024, 256) };
await build({ entryPoints: [path.join(here, "model.ts")], bundle: true, platform: "node", format: "esm", outfile: path.join(output, "model.mjs") });
const { buildCamera } = await import(path.join(output, "model.mjs"));
const { root, lens } = buildCamera();
root.updateMatrixWorld(true);
const geometries = {}, materials = {}, textures = {}, objects = [];

for (const group of root.children) {
  const parent = group === lens ? "lens" : "body";
  const inverse = group.matrixWorld.clone().invert();
  group.traverse(object => {
    if (!object.isMesh) return;
    const geometry = object.geometry, material = object.material;
    geometries[geometry.uuid] ??= {
      position: Array.from(geometry.attributes.position.array),
      normal: Array.from(geometry.attributes.normal.array),
      uv: geometry.attributes.uv ? Array.from(geometry.attributes.uv.array) : null,
      index: geometry.index ? Array.from(geometry.index.array) : null,
    };
    if (!materials[material.uuid]) {
      const entry = {
        color: material.color.toArray(), metalness: material.metalness ?? 0,
        roughness: material.roughness ?? .5, transmission: material.transmission ?? 0,
        ior: material.ior ?? 1.5, clearcoat: material.clearcoat ?? 0,
        bumpScale: material.bumpScale ?? 0, basic: material.isMeshBasicMaterial ?? false,
        transparent: material.transparent, side: material.side,
      };
      for (const field of ["map", "bumpMap"]) {
        const texture = material[field];
        if (!texture) continue;
        if (!textures[texture.uuid]) {
          let canvas = texture.image;
          if (canvas.data instanceof Uint8Array) {
            canvas = createCanvas(texture.image.width, texture.image.height);
            const context = canvas.getContext("2d");
            const pixels = context.createImageData(texture.image.width, texture.image.height);
            pixels.data.set(texture.image.data); context.putImageData(pixels, 0, 0);
          }
          fs.writeFileSync(path.join(output, texture.uuid + ".png"), canvas.toBuffer("image/png"));
          textures[texture.uuid] = { file: texture.uuid + ".png", repeat: texture.repeat.toArray() };
        }
        entry[field] = texture.uuid;
      }
      materials[material.uuid] = entry;
    }
    const matrix = inverse.clone().multiply(object.matrixWorld);
    const add = matrix => objects.push({ geometry: geometry.uuid, material: material.uuid, matrix: matrix.toArray(), parent });
    if (object.isInstancedMesh) {
      for (let index = 0; index < object.count; index++) {
        const instance = matrix.clone(); object.getMatrixAt(index, instance); instance.premultiply(matrix); add(instance);
      }
    } else add(matrix);
  });
}
fs.writeFileSync(path.join(output, "scene.json"), JSON.stringify({ geometries, materials, textures, objects }));
console.log(`Exported ${objects.length} camera parts to ${output}`);
