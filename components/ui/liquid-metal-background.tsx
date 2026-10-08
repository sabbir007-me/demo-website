"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * Raymarched "liquid metal" metaballs. Every pixel marches a ray into a
 * signed-distance field of spheres joined with a smooth minimum, so the
 * blobs merge with real 3D necks and lighting instead of the usual blurred
 * 2D circles. One extra blob follows the mouse, and the camera drifts with
 * it for parallax.
 *
 * Any element marked `data-liquid-avoid` is kept clear: the fixed blobs
 * are pushed out of its column and the cursor blob dissolves over it, so
 * the metal never sits behind form text.
 */

const CAM_Z = 6;
const FOCAL = 1.5;
const BLOB_COUNT = 7; // six drifting blobs + the cursor blob
const CURSOR_RADIUS = 0.42;
const PIXEL_BUDGET = 1.6e6;

type Blob = {
  /** Anchor in viewport space: -1 → 1 from edge to edge on each axis. */
  x: number;
  y: number;
  z: number;
  r: number;
  /** Drift amplitude in world units, angular speed and phase. */
  ax: number;
  ay: number;
  speed: number;
  phase: number;
};

// Landscape: a heavy cluster on the right, a smaller pair bottom-left.
const WIDE: Blob[] = [
  { x: 0.5, y: 0.6, z: 0.2, r: 0.5, ax: 0.25, ay: 0.18, speed: 0.23, phase: 0 },
  { x: 0.8, y: 0.42, z: -0.3, r: 0.66, ax: 0.2, ay: 0.25, speed: 0.19, phase: 1.7 },
  { x: 0.72, y: -0.22, z: 0.1, r: 0.72, ax: 0.22, ay: 0.3, speed: 0.17, phase: 3.1 },
  { x: 1.02, y: 0.05, z: -0.6, r: 0.62, ax: 0.15, ay: 0.35, speed: 0.21, phase: 4.4 },
  { x: -0.78, y: -0.62, z: -0.2, r: 0.54, ax: 0.22, ay: 0.2, speed: 0.2, phase: 2.2 },
  { x: -0.94, y: -0.18, z: 0.3, r: 0.32, ax: 0.18, ay: 0.25, speed: 0.26, phase: 5.3 },
];

// Portrait: no room beside the form, so the metal hugs the top and bottom.
const TALL: Blob[] = [
  { x: 0.55, y: 0.9, z: 0.1, r: 0.42, ax: 0.15, ay: 0.08, speed: 0.23, phase: 0 },
  { x: 0.98, y: 0.72, z: -0.3, r: 0.5, ax: 0.1, ay: 0.12, speed: 0.19, phase: 1.7 },
  { x: 0.1, y: 1.04, z: 0.2, r: 0.34, ax: 0.15, ay: 0.06, speed: 0.17, phase: 3.1 },
  { x: -0.7, y: -0.92, z: -0.2, r: 0.48, ax: 0.15, ay: 0.08, speed: 0.2, phase: 2.2 },
  { x: -1.02, y: -0.7, z: 0.1, r: 0.4, ax: 0.1, ay: 0.12, speed: 0.22, phase: 4.4 },
  { x: 0.82, y: -1.02, z: 0.2, r: 0.32, ax: 0.12, ay: 0.06, speed: 0.26, phase: 5.3 },
];

const VERTEX = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uCamera;
uniform vec4 uBlobs[${BLOB_COUNT}];

const float CAM_Z = ${CAM_Z.toFixed(1)};
const float FOCAL = ${FOCAL.toFixed(1)};

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float d = length(p - uBlobs[0].xyz) - uBlobs[0].w;
  for (int i = 1; i < ${BLOB_COUNT}; i++) {
    d = smin(d, length(p - uBlobs[i].xyz) - uBlobs[i].w, 0.6);
  }
  return d;
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0015;
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

// Darkens the creases where blobs merge.
float occlusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float weight = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.07 * float(i);
    occ += (h - map(p + n * h)) * weight;
    weight *= 0.65;
  }
  return clamp(1.0 - 2.2 * occ, 0.0, 1.0);
}

// Monochrome studio lighting: a soft key from the top left, an overhead
// softbox in the reflections and a faint rim, tuned to read as brushed mercury.
float shade(vec3 p, vec3 n, vec3 rd) {
  vec3 key = normalize(vec3(-0.55, 0.75, 0.55));
  float diffuse = pow(clamp(dot(n, key) * 0.5 + 0.5, 0.0, 1.0), 1.8);
  vec3 r = reflect(rd, n);
  float env = smoothstep(-0.2, 1.0, r.y);
  float spec = pow(clamp(dot(r, key), 0.0, 1.0), 28.0);
  float fresnel = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 4.0);
  float c = 0.035 + 0.42 * diffuse + 0.12 * env + 0.22 * spec + 0.1 * fresnel * env;
  return c * mix(0.5, 1.0, occlusion(p, n));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec3 ro = vec3(uCamera, CAM_Z);
  vec3 rd = normalize(vec3(uv, -FOCAL));

  // Nothing sits closer than z = 2, so start the march partway in.
  float t = 2.5;
  float closest = 1e9;
  float tClosest = t;
  bool hit = false;
  for (int i = 0; i < 80; i++) {
    float d = map(ro + rd * t);
    float angular = d / t;
    if (angular < closest) {
      closest = angular;
      tClosest = t;
    }
    if (d < 0.001) {
      hit = true;
      break;
    }
    t += d * 0.95;
    if (t > 10.0) break;
  }

  // Coverage from the ray's closest approach gives anti-aliased silhouettes.
  float pixel = 1.0 / (uResolution.y * FOCAL);
  float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, 1.5 * pixel, closest);
  if (alpha <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 p = ro + rd * (hit ? t : tClosest);
  float c = shade(p, normalAt(p), rd);
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0; // dither away banding
  gl_FragColor = vec4(vec3(c) * alpha, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createScene(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  // One oversized triangle covers the whole viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);

  return {
    program,
    buffer,
    resolution: gl.getUniformLocation(program, "uResolution"),
    camera: gl.getUniformLocation(program, "uCamera"),
    blobs: gl.getUniformLocation(program, "uBlobs"),
  };
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Visible half-height of the view frustum at depth `z`. */
const halfHeightAt = (z: number) => (0.5 * (CAM_Z - z)) / FOCAL;

function mountLiquidMetal(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
  });
  if (!gl) return () => {};

  let scene = createScene(gl);
  if (!scene) return () => {};

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;

  const pointer = { x: 0, y: 0, inside: false };
  const cursor = { x: 0, y: 0, z: 0.6, presence: 0 };
  const camera = { x: 0, y: 0 };
  const uniforms = new Float32Array(BLOB_COUNT * 4);
  let avoid: DOMRect | null = null;
  let quality = 1;
  let frameId = 0;
  let last = performance.now();
  let elapsed = 0;
  let intro = 0;
  let slowFrames = 0;
  let shown = false;

  const avoidTarget = document.querySelector<HTMLElement>("[data-liquid-avoid]");
  const measureAvoid = () => {
    avoid = avoidTarget?.getBoundingClientRect() ?? null;
  };

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    let scale = Math.min(window.devicePixelRatio || 1, 2) * quality;
    if (width * height * scale * scale > PIXEL_BUDGET) {
      scale = Math.sqrt(PIXEL_BUDGET / (width * height));
    }
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    measureAvoid();
  };

  const render = (dt: number) => {
    if (!scene) return;
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    const aspect = width / height;
    const wide = aspect >= 1.05;
    const layout = wide ? WIDE : TALL;
    const ease = 1 - Math.exp(-dt * 5);

    // Camera parallax and the cursor blob both chase the pointer.
    const mx = pointer.inside ? (pointer.x / width) * 2 - 1 : 0;
    const my = pointer.inside ? 1 - (pointer.y / height) * 2 : 0;
    camera.x += (mx * 0.2 - camera.x) * ease;
    camera.y += (my * 0.12 - camera.y) * ease;

    let presence = 0;
    if (pointer.inside && !reduced) {
      presence = 1;
      if (avoid) {
        const dx = Math.max(avoid.left - pointer.x, 0, pointer.x - avoid.right);
        const dy = Math.max(avoid.top - pointer.y, 0, pointer.y - avoid.bottom);
        presence = smoothstep(24, 180, Math.hypot(dx, dy));
      }
    }
    const cursorHalf = halfHeightAt(cursor.z);
    const targetX = camera.x + mx * cursorHalf * aspect;
    const targetY = camera.y + my * cursorHalf;
    if (cursor.presence < 0.02) {
      // Appear under the pointer rather than flying in from elsewhere.
      cursor.x = targetX;
      cursor.y = targetY;
    }
    const follow = 1 - Math.exp(-dt * 7);
    cursor.x += (targetX - cursor.x) * follow;
    cursor.y += (targetY - cursor.y) * follow;
    cursor.presence += (presence - cursor.presence) * (1 - Math.exp(-dt * 4));

    // How far the kept-clear column reaches from the centre lines, in px.
    // Landscape clears it sideways; portrait has no side room, so it clears
    // above and below instead.
    const clearX =
      wide && avoid ? Math.max(width / 2 - avoid.left, avoid.right - width / 2) + 32 : 0;
    const clearY =
      !wide && avoid ? Math.max(height / 2 - avoid.top, avoid.bottom - height / 2) + 24 : 0;

    layout.forEach((blob, i) => {
      const half = halfHeightAt(blob.z);
      const toWorld = half / (height / 2);
      const angle = elapsed * blob.speed + blob.phase;
      const grow = 1 - Math.pow(1 - smoothstep(i * 0.12, i * 0.12 + 1.4, intro), 3);
      const r = blob.r * grow * (1 + 0.05 * Math.sin(angle * 1.7));

      let x = blob.x * half * aspect;
      if (clearX > 0) {
        x = Math.sign(x) * Math.max(Math.abs(x), clearX * toWorld + r * 0.8);
      }
      let y = blob.y * half;
      if (clearY > 0) {
        y = Math.sign(y) * Math.max(Math.abs(y), clearY * toWorld + r * 0.85);
      }
      uniforms[i * 4] = x + Math.sin(angle) * blob.ax;
      uniforms[i * 4 + 1] = y + Math.cos(angle * 0.8 + blob.phase) * blob.ay;
      uniforms[i * 4 + 2] = blob.z + Math.sin(angle * 0.6) * 0.25;
      uniforms[i * 4 + 3] = r;
    });

    // A negative radius keeps the hidden cursor blob out of the smooth union.
    const c = (BLOB_COUNT - 1) * 4;
    uniforms[c] = cursor.x;
    uniforms[c + 1] = cursor.y;
    uniforms[c + 2] = cursor.z;
    uniforms[c + 3] = CURSOR_RADIUS * cursor.presence - 0.7 * (1 - cursor.presence);

    gl.uniform2f(scene.resolution, canvas.width, canvas.height);
    gl.uniform2f(scene.camera, camera.x, camera.y);
    gl.uniform4fv(scene.blobs, uniforms);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
    }
  };

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    intro += dt;

    // Drop the internal resolution on GPUs that can't hold ~40fps.
    slowFrames = dt > 0.026 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && quality > 0.45) {
      quality *= 0.8;
      slowFrames = 0;
      resize();
    }

    render(dt);
    frameId = requestAnimationFrame(tick);
  };

  // Reduced motion: one still frame of the settled scene, redrawn on resize.
  const start = () => {
    cancelAnimationFrame(frameId);
    if (reduced) {
      elapsed = 6;
      intro = 10;
      frameId = requestAnimationFrame(() => render(1));
    } else {
      last = performance.now();
      frameId = requestAnimationFrame(tick);
    }
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reduced) start();
  });
  resizeObserver.observe(canvas);
  if (avoidTarget) resizeObserver.observe(avoidTarget);

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.inside = true;
  };
  const onPointerOut = (event: PointerEvent) => {
    if (!event.relatedTarget) pointer.inside = false;
  };
  const onMotionChange = () => {
    reduced = motionQuery.matches;
    start();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(frameId);
    scene = null;
  };
  const onContextRestored = () => {
    scene = createScene(gl);
    if (!scene) return;
    resize();
    start();
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerout", onPointerOut);
  window.addEventListener("scroll", measureAvoid, { passive: true });
  motionQuery.addEventListener("change", onMotionChange);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  resize();
  start();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("scroll", measureAvoid);
    motionQuery.removeEventListener("change", onMotionChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    if (scene) {
      gl.deleteBuffer(scene.buffer);
      gl.deleteProgram(scene.program);
    }
  };
}

export function LiquidMetalBackground({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    return canvas ? mountLiquidMetal(canvas) : undefined;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none opacity-0 transition-opacity duration-1000 motion-reduce:transition-none",
        className,
      )}
    />
  );
}
