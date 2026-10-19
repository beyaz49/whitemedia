import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type SceneOptions = {
  reviewTime?: number;
  onSignature: () => void;
  onFinish: () => void;
};
export type CameraScene = { setTime: (seconds: number) => void; dispose: () => void };

const DURATION = 4.8;
const clamp = T.MathUtils.clamp;
const ease = (value: number) => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };

/** Original, dimensioned camera geometry. The optical axis is +Z throughout. */
function buildCamera() {
  const root = new T.Group();
  const body = new T.Group();
  const lens = new T.Group();
  root.add(body, lens);
  const textures: T.Texture[] = [];

  function grain(repeat: number) {
    const size = 256;
    const bytes = new Uint8Array(size * size * 4);
    let seed = 9173;
    for (let i = 0; i < size * size; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      const v = 92 + ((seed >>> 24) % 72);
      bytes.set([v, v, v, 255], i * 4);
    }
    const texture = new T.DataTexture(bytes, size, size);
    texture.wrapS = texture.wrapT = T.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.magFilter = T.LinearFilter;
    texture.minFilter = T.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    textures.push(texture);
    return texture;
  }

  const powder = new T.MeshStandardMaterial({ color: 0x181a1c, metalness: .47, roughness: .46, bumpMap: grain(5), bumpScale: .014 });
  const rubber = new T.MeshStandardMaterial({ color: 0x101113, metalness: .02, roughness: .76, bumpMap: grain(8), bumpScale: .035 });
  const barrel = new T.MeshStandardMaterial({ color: 0x131517, metalness: .63, roughness: .31, bumpMap: grain(3), bumpScale: .006 });
  const steel = new T.MeshStandardMaterial({ color: 0xb6bbbd, metalness: .97, roughness: .24 });
  const darkSteel = new T.MeshStandardMaterial({ color: 0x24282b, metalness: .91, roughness: .34 });
  const black = new T.MeshStandardMaterial({ color: 0x060708, metalness: .17, roughness: .56 });
  const copper = new T.MeshStandardMaterial({ color: 0x754026, metalness: .87, roughness: .31 });
  const gold = new T.MeshStandardMaterial({ color: 0xb79a54, metalness: .95, roughness: .28 });
  const ink = new T.MeshStandardMaterial({ color: 0x383d40, metalness: .7, roughness: .33 });

  function mesh(parent: T.Group, geometry: T.BufferGeometry, material: T.Material, x = 0, y = 0, z = 0) {
    const object = new T.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(parent: T.Group, size: [number, number, number], at: [number, number, number], material: T.Material, radius = .07) {
    return mesh(parent, new RoundedBoxGeometry(...size, 3, radius), material, ...at);
  }
  function ring(parent: T.Group, inner: number, outer: number, z: number, material: T.Material, x = 0, y = 0) {
    return mesh(parent, new T.RingGeometry(inner, outer, 96), material, x, y, z);
  }
  function torus(parent: T.Group, radius: number, tube: number, at: [number, number, number], material: T.Material) {
    return mesh(parent, new T.TorusGeometry(radius, tube, 8, 96), material, ...at);
  }
  function lathe(parent: T.Group, points: number[][], material: T.Material, at: [number, number, number] = [0, 0, 0]) {
    const geometry = new T.LatheGeometry(points.map(([r, z]) => new T.Vector2(r, z)), 96);
    geometry.rotateX(Math.PI / 2);
    return mesh(parent, geometry, material, ...at);
  }
  function label(parent: T.Group, text: string, width: number, height: number, at: [number, number, number], font = "600 76px Arial", normal?: T.Vector3) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#d9dcdd";
    ctx.font = font;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, 512, 128, 950);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    texture.anisotropy = 4;
    textures.push(texture);
    const object = mesh(parent, new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }), ...at);
    object.castShadow = false;
    if (normal) object.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), normal.normalize());
    return object;
  }
  function screw(parent: T.Group, x: number, y: number, z: number, radius = .115) {
    const cap = mesh(parent, new T.CylinderGeometry(radius, radius, .035, 16), steel, x, y, z);
    cap.rotation.x = Math.PI / 2;
    const slot = box(parent, [radius * 1.4, .025, .009], [x, y, z + .023], black, .005);
    slot.rotation.z = .47;
    const slot2 = box(parent, [radius * 1.4, .025, .009], [x, y, z + .024], black, .005);
    slot2.rotation.z = .47 + Math.PI / 2;
  }

  // The body is a beveled shell with a real opening, rather than a painted disc.
  const outline = new T.Shape();
  outline.moveTo(-6.18, -3.7);
  outline.lineTo(5.95, -3.7); outline.quadraticCurveTo(6.5, -3.7, 6.5, -3.12);
  outline.lineTo(6.5, 2.9); outline.quadraticCurveTo(6.5, 3.55, 5.85, 3.55);
  outline.lineTo(-5.65, 3.55); outline.quadraticCurveTo(-6.5, 3.55, -6.5, 2.75);
  outline.lineTo(-6.5, -3.15); outline.quadraticCurveTo(-6.5, -3.7, -6.18, -3.7);
  const hole = new T.Path();
  hole.absarc(.4, -.1, 2.64, 0, Math.PI * 2, true);
  outline.holes.push(hole);
  const shell = new T.ExtrudeGeometry(outline, { depth: 4.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .065, bevelThickness: .065, curveSegments: 40 });
  shell.translate(0, 0, -4.1);
  mesh(body, shell, powder);
  box(body, [2.95, 7.12, 3.6], [-5.02, -.08, .08], rubber, .52);
  box(body, [2.72, 1.1, 3.65], [-5.05, 3.0, .05], powder, .38);
  box(body, [12.22, .36, 3.98], [.03, 3.53, -2.1], powder, .08);
  box(body, [8.3, 5.3, .28], [-.65, -.15, -4.2], black, .17);
  box(body, [7.55, 4.63, .06], [-.65, -.15, -4.38], new T.MeshPhysicalMaterial({ color: 0x090e11, roughness: .1, metalness: .33, clearcoat: 1 }), .09);
  box(body, [.14, 3.72, 2.55], [6.52, -.13, -2.12], rubber, .065);
  box(body, [.17, 1.1, 1.5], [-6.52, 1.32, -2.32], black, .06);
  for (const y of [-3.21, 3.05]) for (const x of [-6.05, 6.04]) screw(body, x, y, .09, .09);

  const hump = new T.Shape();
  hump.moveTo(-1.95, 3.54); hump.lineTo(-1.47, 4.91); hump.lineTo(-.95, 5.12);
  hump.lineTo(1.46, 5.12); hump.lineTo(2.14, 4.45); hump.lineTo(2.34, 3.54); hump.closePath();
  const humpGeometry = new T.ExtrudeGeometry(hump, { depth: 3.85, bevelEnabled: true, bevelSize: .09, bevelThickness: .09, bevelSegments: 3 });
  humpGeometry.translate(0, 0, -3.58);
  mesh(body, humpGeometry, powder);
  box(body, [2.75, 1.32, .85], [.2, 4.03, -4.0], rubber, .23);
  label(body, "SONY", 2.7, .71, [.12, 4.37, .48], "bold 90px Georgia");
  label(body, "α", .98, .73, [4.86, 2.53, .1], "normal 116px Georgia");
  box(body, [.94, .47, .04], [4.84, 1.84, .08], darkSteel, .02);
  label(body, "7 IV", .85, .38, [4.84, 1.84, .108], "normal 90px Georgia");
  box(body, [1.92, .1, 1.7], [.12, 5.25, -1.82], darkSteel, .025);
  for (const x of [-.76, .99]) box(body, [.12, .18, 1.7], [x, 5.34, -1.82], steel, .02);
  for (let i = 0; i < 8; i++) box(body, [.13, .02, .2], [-.43 + i * .15, 5.32, -2.46], gold, .008);

  function dial(x: number, z: number, radius: number, y: number) {
    mesh(body, new T.CylinderGeometry(radius, radius, .48, 64), barrel, x, y, z);
    const ribs = new T.InstancedMesh(new T.BoxGeometry(.045, .38, .09), rubber, 72);
    const dummy = new T.Object3D();
    for (let i = 0; i < 72; i++) {
      const a = i / 72 * Math.PI * 2;
      dummy.position.set(x + Math.cos(a) * radius, y, z + Math.sin(a) * radius);
      dummy.rotation.set(0, -a, 0); dummy.updateMatrix(); ribs.setMatrixAt(i, dummy.matrix);
    }
    ribs.castShadow = true; body.add(ribs);
    const text = label(body, "M  A  S  P  1  2  3", radius * 1.45, radius * .43, [x, y + .255, z], "500 54px Arial", new T.Vector3(0, 1, 0));
    text.rotation.z = .15;
    mesh(body, new T.CylinderGeometry(.25, .25, .035, 32), darkSteel, x, y + .26, z);
  }
  dial(-4.67, -1.32, 1.0, 4.01);
  dial(4.58, -1.82, .86, 3.99);
  const shutter = mesh(body, new T.CylinderGeometry(.39, .45, .18, 48), darkSteel, -4.98, 3.82, 1.13);
  shutter.rotation.x = -.18;
  label(body, "ON   OFF", 1.1, .3, [-5.0, 3.94, .55], "500 48px Arial", new T.Vector3(0, 1, .12));
  for (const x of [-6.57, 6.56]) {
    const lug = torus(body, .3, .075, [x, 2.53, -1.78], steel);
    lug.rotation.y = Math.PI / 2;
  }
  const dots = new T.InstancedMesh(new T.SphereGeometry(.036, 5, 4), black, 24);
  const dot = new T.Object3D();
  for (let i = 0; i < 24; i++) {
    dot.position.set(2.85 + i % 6 * .14, 3.74, -2.9 + Math.floor(i / 6) * .14);
    dot.updateMatrix(); dots.setMatrixAt(i, dot.matrix);
  }
  body.add(dots);

  const mx = .4, my = -.1;
  lathe(body, [[2.62, -.08], [2.62, .25], [3.05, .25], [3.05, .09], [2.62, -.08]], steel, [mx, my, 0]);
  torus(body, 3.085, .052, [mx, my, .08], copper);
  torus(body, 2.66, .047, [mx, my, .27], darkSteel);
  ring(body, 2.68, 3.02, .28, steel, mx, my);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + .3;
    screw(body, mx + Math.cos(a) * 2.84, my + Math.sin(a) * 2.84, .305, .104);
  }
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2 + .3;
    const tab = mesh(body, new T.RingGeometry(2.47, 2.67, 18, 1, a, .72), darkSteel, mx, my, .18);
    tab.material.side = T.DoubleSide;
  }
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * 1.15 + i * .073;
    const contact = mesh(body, new T.SphereGeometry(.065, 12, 8), gold, mx + Math.cos(a) * 2.45, my + Math.sin(a) * 2.45, .07);
    contact.scale.z = .42;
  }
  const sensorGlass = new T.MeshPhysicalMaterial({ color: 0x193034, roughness: .16, metalness: .63, clearcoat: 1, clearcoatRoughness: .08, iridescence: .3, iridescenceThicknessRange: [270, 410] });
  box(body, [3.98, 2.81, .1], [mx, my, -1.83], black, .05);
  box(body, [3.55, 2.37, .045], [mx, my, -1.76], sensorGlass, .015);
  label(body, "E-mount", 1.08, .22, [mx, my + 2.79, .302], "400 48px Arial");

  // A separately modeled, hollow lens assembly. Rear flange remains at local Z=0.
  lens.position.set(mx, my, .31);
  lathe(lens, [[2.25, 0], [2.67, 0], [2.69, .24], [3.1, .35], [3.49, .76], [3.53, 1.15], [3.64, 1.24], [3.64, 6.75], [3.54, 7.05], [3.5, 7.84], [3.42, 8.12], [2.96, 8.12], [2.88, 7.95], [2.81, 1.0], [2.25, .1], [2.25, 0]], barrel);
  ring(lens, 2.25, 2.67, -.012, steel);
  torus(lens, 2.66, .034, [0, 0, .05], steel);
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    mesh(lens, new T.RingGeometry(2.35, 2.8, 16, 1, a, .56), steel, 0, 0, .1);
  }
  for (const z of [1.18, 2.28, 3.19, 6.69, 7.75, 8.13]) torus(lens, z === 8.13 ? 3.43 : 3.63, .026, [0, 0, z], darkSteel);
  lathe(lens, [[3.62, 3.43], [3.69, 3.49], [3.69, 6.14], [3.63, 6.21]], rubber);
  const focusRibs = new T.InstancedMesh(new RoundedBoxGeometry(.043, .105, 2.58, 1, .016), rubber, 160);
  const rib = new T.Object3D();
  for (let i = 0; i < 160; i++) {
    const a = i / 160 * Math.PI * 2;
    rib.position.set(Math.cos(a) * 3.685, Math.sin(a) * 3.685, 4.82);
    rib.rotation.z = a - Math.PI / 2; rib.updateMatrix(); focusRibs.setMatrixAt(i, rib.matrix);
  }
  focusRibs.castShadow = true; lens.add(focusRibs);
  const apertureRibs = new T.InstancedMesh(new T.BoxGeometry(.055, .09, .75), rubber, 112);
  for (let i = 0; i < 112; i++) {
    const a = i / 112 * Math.PI * 2;
    rib.position.set(Math.cos(a) * 3.65, Math.sin(a) * 3.65, 1.77);
    rib.rotation.z = a - Math.PI / 2; rib.updateMatrix(); apertureRibs.setMatrixAt(i, rib.matrix);
  }
  lens.add(apertureRibs);
  label(lens, "SONY", 1.6, .42, [-3.58, .45, 2.77], "bold 68px Georgia", new T.Vector3(-1, .13, 0));
  label(lens, "FE 35mm F1.4 GM", 2.2, .35, [-3.5, -.8, 6.81], "500 60px Arial", new T.Vector3(-1, -.23, 0));
  const badge = box(lens, [.04, .47, .55], [-3.65, .37, 3.03], new T.MeshStandardMaterial({ color: 0x6c2a24, roughness: .48, metalness: .15 }), .045);
  badge.rotation.z = -.1;
  label(lens, "G", .42, .38, [-3.683, .37, 3.03], "bold 110px Arial", new T.Vector3(-1, 0, 0));
  const focusButton = mesh(lens, new T.CylinderGeometry(.34, .36, .11, 40), rubber, -3.63, -.67, 2.72);
  focusButton.rotation.z = Math.PI / 2;
  const dotMaterial = new T.MeshStandardMaterial({ color: 0xdfdeda, roughness: .46 });
  mesh(lens, new T.SphereGeometry(.075, 12, 8), dotMaterial, 0, 3.54, .79);

  const iris = new T.Group(); lens.add(iris);
  ring(iris, .77, 2.86, 6.81, black);
  for (let i = 0; i < 9; i++) {
    const blade = new T.Shape();
    blade.moveTo(.77, -.32); blade.lineTo(2.83, -.25); blade.quadraticCurveTo(2.8, 1.01, 2.01, 1.73); blade.lineTo(.81, .4); blade.closePath();
    const object = mesh(iris, new T.ShapeGeometry(blade), ink, 0, 0, 6.84 + i * .001);
    object.rotation.z = i / 9 * Math.PI * 2;
  }
  function opticalSurface(radius: number, z: number, bulge: number, material: T.Material) {
    const positions: number[] = [], uv: number[] = [], indices: number[] = [];
    const radial = 14, angular = 96;
    for (let r = 0; r <= radial; r++) for (let a = 0; a <= angular; a++) {
      const distance = radius * r / radial, angle = a / angular * Math.PI * 2;
      positions.push(Math.cos(angle) * distance, Math.sin(angle) * distance, z + bulge * (1 - (r / radial) ** 2));
      uv.push(.5 + Math.cos(angle) * r / radial * .5, .5 + Math.sin(angle) * r / radial * .5);
      if (r < radial && a < angular) {
        const p = r * (angular + 1) + a;
        indices.push(p, p + 1, p + angular + 1, p + 1, p + angular + 2, p + angular + 1);
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const glass = mesh(lens, geometry, material); glass.castShadow = false;
  }
  opticalSurface(2.54, 7.15, -.1, new T.MeshPhysicalMaterial({ color: 0x121b25, roughness: .07, metalness: .15, transmission: .65, thickness: .3, ior: 1.52, iridescence: .3, iridescenceThicknessRange: [200, 370], side: T.DoubleSide }));
  opticalSurface(2.9, 7.85, .17, new T.MeshPhysicalMaterial({ color: 0x10151b, roughness: .045, metalness: .03, transmission: .9, thickness: .24, ior: 1.52, clearcoat: 1, clearcoatRoughness: .035, iridescence: .16, iridescenceThicknessRange: [270, 410], side: T.DoubleSide }));
  torus(lens, 3.24, .065, [0, 0, 8.14], black);
  torus(lens, 3.44, .024, [0, 0, 8.155], steel);

  const engraving = document.createElement("canvas"); engraving.width = engraving.height = 1024;
  const ctx = engraving.getContext("2d")!;
  ctx.fillStyle = "#bfc3c5"; ctx.font = "500 25px Arial"; ctx.textAlign = "center";
  const legend = "FE 1.4 / 35 GM    Ø67";
  [...legend].forEach((letter, i) => {
    const a = -Math.PI / 2 + (i - (legend.length - 1) / 2) * .047;
    ctx.save(); ctx.translate(512 + Math.cos(a) * 450, 512 + Math.sin(a) * 450); ctx.rotate(a + Math.PI / 2); ctx.fillText(letter, 0, 0); ctx.restore();
  });
  const legendMap = new T.CanvasTexture(engraving); legendMap.colorSpace = T.SRGBColorSpace; textures.push(legendMap);
  mesh(lens, new T.PlaneGeometry(6.9, 6.9), new T.MeshBasicMaterial({ map: legendMap, transparent: true, depthWrite: false, toneMapped: false }), 0, 0, 8.18).castShadow = false;

  return { root, lens, iris, textures };
}

export async function createCameraScene(canvas: HTMLCanvasElement, options: SceneOptions): Promise<CameraScene> {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene(); scene.background = new T.Color(0x080a0c);
  scene.fog = new T.FogExp2(0x080a0c, .011);
  const camera = new T.PerspectiveCamera(30, 1, .5, 220);
  const environment = new T.Scene(); environment.background = new T.Color(0x202225);
  function softbox(w: number, h: number, at: [number, number, number], power: number) {
    const panel = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color().setRGB(power, power, power), side: T.DoubleSide }));
    panel.position.set(...at); panel.lookAt(0, 0, 0); environment.add(panel);
  }
  softbox(13, 7, [-9, 15, 10], 5.0);
  softbox(2.0, 17, [14, 7, 4], 5.0);
  softbox(2.0, 15, [-14, 6, -8], 6.0);
  softbox(13, 3, [0, 12, -10], 3.5);
  softbox(12, 5, [-4, 0, 19], .9);
  const pmrem = new T.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .04, .1, 80);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = .86;
  environment.traverse(object => { if (object instanceof T.Mesh) { object.geometry.dispose(); (object.material as T.Material).dispose(); } });
  pmrem.dispose();

  const built = buildCamera(); scene.add(built.root);
  const floor = new T.Mesh(new T.PlaneGeometry(180, 180), new T.MeshStandardMaterial({ color: 0x101315, roughness: .43, metalness: .38 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -4.03; floor.receiveShadow = true; scene.add(floor);
  const key = new T.DirectionalLight(0xf1f3f4, 3.1); key.position.set(-11, 16, 14); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -22; key.shadow.camera.right = 22;
  key.shadow.camera.top = 22; key.shadow.camera.bottom = -22; key.shadow.camera.near = 1; key.shadow.camera.far = 75;
  key.shadow.bias = -.0004; key.shadow.normalBias = .025; key.shadow.radius = 4; scene.add(key);
  const rim = new T.DirectionalLight(0xd8e0e6, 2.0); rim.position.set(13, 8, -9); scene.add(rim);
  const fill = new T.DirectionalLight(0xe5e7e8, .56); fill.position.set(-10, 1, 20); scene.add(fill);
  scene.add(new T.HemisphereLight(0x9faab3, 0x09090a, .23));

  let width = 1, height = 1, time = options.reviewTime ?? 0, frame = 0, disposed = false, signatureSent = false, finishSent = false;
  const target = new T.Vector3();
  function render(seconds: number) {
    const t = clamp(seconds, 0, DURATION);
    const approach = ease((t - .42) / 1.85);
    const twist = ease((t - 2.25) / .48);
    built.lens.position.z = .31 + 6.35 * (1 - approach);
    built.lens.rotation.z = -.29 * (1 - twist);
    built.iris.rotation.z = .06 * ease((t - 2.7) / .5);
    const orbit = ease(t / 3.5);
    const theta = -.68 + orbit * .2;
    const aspect = width / height;
    const viewHeight = Math.max(20.5, 22.5 / aspect) * (1 + .06 * orbit);
    const distance = viewHeight / (2 * Math.tan(T.MathUtils.degToRad(camera.fov * .5)));
    target.set(.15, .45, 2.65 + (1 - approach) * 2.15);
    camera.position.set(target.x + Math.sin(theta) * distance, target.y + distance * .235, target.z + Math.cos(theta) * distance);
    camera.lookAt(target); camera.updateMatrixWorld();
    renderer.render(scene, camera);
    if (t >= 3.6 && !signatureSent && options.reviewTime === undefined) { signatureSent = true; options.onSignature(); }
    if (t >= DURATION && !finishSent && options.reviewTime === undefined) { finishSent = true; options.onFinish(); }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1.4 : 1.6));
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    render(time);
  }
  resize();
  await renderer.compileAsync(scene, camera);
  if (!canvas.isConnected) {
    renderer.dispose(); renderer.forceContextLoss(); environmentTarget.dispose();
    throw new Error("Opening was dismissed before the renderer was ready");
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  let previous = performance.now();
  function tick(now: number) {
    if (disposed) return;
    const delta = Math.min((now - previous) / 1000, .08); previous = now;
    if (!document.hidden) { time += delta; render(time); }
    if (time < DURATION) frame = requestAnimationFrame(tick);
  }
  if (options.reviewTime === undefined) frame = requestAnimationFrame(tick);
  else render(options.reviewTime);

  return {
    setTime(seconds) { if (!disposed) { time = seconds; render(seconds); } },
    dispose() {
      if (disposed) return; disposed = true;
      cancelAnimationFrame(frame); observer.disconnect();
      const geometries = new Set<T.BufferGeometry>(), materials = new Set<T.Material>();
      scene.traverse(object => {
        if (object instanceof T.Mesh || object instanceof T.InstancedMesh) {
          geometries.add(object.geometry);
          const list = Array.isArray(object.material) ? object.material : [object.material];
          list.forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      built.textures.forEach(texture => texture.dispose()); environmentTarget.dispose();
      key.shadow.map?.dispose(); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
