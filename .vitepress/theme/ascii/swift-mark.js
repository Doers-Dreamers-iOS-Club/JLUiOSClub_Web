// The Swift badge as a solid: the rounded-square plate extruded, the bird cut clean through,
// so light passes through the silhouette the way the Codrops mark's droplet does.
//
// The source is `swift-logo.svg` (the black badge): path 0 is the plate, path 1 the bird,
// drawn white — here white means void, so it becomes the plate's hole.

import { ExtrudeGeometry } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// `?raw` is Vite handing the file over as a string.
import swiftSvg from "./swift-logo.svg?raw";

/** The badge's bounding box, in modules (the SVG's own viewBox edge). */
export const LOGO_SIZE = 106.063;

/** Plate thickness, and the bevel softening both faces — the badge's side profile. */
const DEPTH = 12;
const BEVEL = 2.6;

export function buildLogoGeometry() {
  const { paths } = new SVGLoader().parse(swiftSvg);

  if (paths.length < 2) {
    throw new Error("swift-mark: expected the plate and bird paths in swift-logo.svg");
  }

  const plate = paths[0].toShapes(true)[0];
  // The bird rides on the plate as a hole; ExtrudeGeometry punches it through both faces.
  plate.holes.push(...paths[1].toShapes(true));

  const geometry = new ExtrudeGeometry(plate, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 4,
    curveSegments: 32,
  });

  // Recentre on the origin: SVG coordinates run 0..LOGO_SIZE from the top-left.
  geometry.translate(-LOGO_SIZE / 2, -LOGO_SIZE / 2, -DEPTH / 2);
  // SVG y runs down, the scene's up. A half-turn about X is a proper rotation, so it flips
  // the badge upright and brings the front face to the camera without touching the winding.
  geometry.rotateX(Math.PI);

  return geometry;
}
