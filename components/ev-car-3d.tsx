"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EvCar3D · three.js white/silver EV model (procedural, no external assets)
// Slowly turntables on a soft studio ground; battery bar stays in HTML so it
// stays in sync with the target slider without touching the WebGL scene.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export function EvCar3D({
  chargePct,
  targetPct,
}: {
  chargePct: number;
  targetPct: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const height = 190;
    const width = mount.clientWidth || 340;

    // ── Renderer / scene / camera ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(4.4, 2.1, 5.4);
    camera.lookAt(0, 0.55, 0);

    // ── Studio lighting ────────────────────────────────────────────────────
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8dee6, 1.05));

    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(4, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xbfd8ff, 0.7);
    rim.position.set(-5, 3, -4);
    scene.add(rim);

    // ── Materials ──────────────────────────────────────────────────────────
    const paint = new THREE.MeshStandardMaterial({
      color: 0xf4f6f8, // white / silver
      metalness: 0.85,
      roughness: 0.25,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: 0x8fa9bd,
      metalness: 0.9,
      roughness: 0.12,
    });
    const tyre = new THREE.MeshStandardMaterial({
      color: 0x1d1f24,
      metalness: 0.3,
      roughness: 0.7,
    });
    const alloy = new THREE.MeshStandardMaterial({
      color: 0xd5dade,
      metalness: 0.95,
      roughness: 0.2,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0xf26522, // CLP orange — charge port + light strip
      emissive: 0xf26522,
      emissiveIntensity: 0.55,
    });

    // ── Car ────────────────────────────────────────────────────────────────
    const car = new THREE.Group();

    // Lower body
    const body = new THREE.Mesh(new RoundedBoxGeometry(3.3, 0.72, 1.5, 5, 0.24), paint);
    body.position.y = 0.62;
    body.castShadow = true;
    car.add(body);

    // Cabin / glasshouse
    const cabin = new THREE.Mesh(new RoundedBoxGeometry(1.85, 0.6, 1.32, 5, 0.26), glass);
    cabin.position.set(-0.18, 1.16, 0);
    cabin.castShadow = true;
    car.add(cabin);

    // Roof cap (paint over glass top)
    const roof = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.14, 1.2, 3, 0.06), paint);
    roof.position.set(-0.18, 1.48, 0);
    car.add(roof);

    // Front light strip
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 1.1), accent);
    strip.position.set(1.66, 0.78, 0);
    car.add(strip);

    // Charge port (rear fender, driver side)
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 20), accent);
    port.rotation.x = Math.PI / 2;
    port.position.set(-1.15, 0.78, 0.76);
    car.add(port);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 32);
    wheelGeo.rotateX(Math.PI / 2);
    const hubGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.3, 24);
    hubGeo.rotateX(Math.PI / 2);
    const wheelPos: [number, number][] = [
      [1.08, 0.78],
      [1.08, -0.78],
      [-1.08, 0.78],
      [-1.08, -0.78],
    ];
    for (const [x, z] of wheelPos) {
      const w = new THREE.Mesh(wheelGeo, tyre);
      w.position.set(x, 0.36, z);
      w.castShadow = true;
      car.add(w);
      const h = new THREE.Mesh(hubGeo, alloy);
      h.position.set(x, 0.36, z);
      car.add(h);
    }

    car.rotation.y = -0.5;
    scene.add(car);

    // ── Ground ─────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 56),
      new THREE.MeshStandardMaterial({ color: 0xeef0f2, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.32, 3.4, 56),
      new THREE.MeshBasicMaterial({ color: 0xe0e3e7 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    // ── Animate ────────────────────────────────────────────────────────────
    let raf = 0;
    const tick = () => {
      car.rotation.y += 0.006;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth || width;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          (Array.isArray(m) ? m : [m]).forEach((mat) => mat.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={mountRef}
        className="w-full overflow-hidden rounded-xl"
        role="img"
        aria-label="3D model of a white electric car"
      />
      {/* Battery bar — HTML so it stays synced with the target slider */}
      <div className="relative mx-auto mt-1 h-2 w-[70%] rounded-full bg-[#e8f2fa]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-clp-blue"
          style={{ width: `${chargePct}%` }}
        />
        <div
          className="absolute -top-[3px] h-[14px] w-[3px] rounded-full bg-clp-orange"
          style={{ left: `calc(${targetPct}% - 1.5px)` }}
        />
      </div>
      <div className="mx-auto mt-1 flex w-[70%] justify-between text-[11px] font-medium text-mute">
        <span>{chargePct}%</span>
        <span className="font-bold text-clp-orange">{targetPct}%</span>
      </div>
    </div>
  );
}
