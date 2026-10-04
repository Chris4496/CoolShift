"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EvCar3D · three.js white/silver EV model (procedural, no external assets)
// Slowly turntables on a soft studio ground; battery bar stays in HTML so it
// stays in sync with the target slider without touching the WebGL scene.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useT } from "@/lib/store";

export function EvCar3D({
  chargePct,
  targetPct,
}: {
  chargePct: number;
  targetPct: number;
}) {
  const t = useT();
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

    // Metallic car paint looks muddy without reflections, so give the scene a
    // small procedural studio to reflect.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

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
      color: 0x3b4149, // graphite — reads against the white studio floor
      metalness: 0.9,
      roughness: 0.22,
      envMapIntensity: 0.9,
    });

    // ── Car ────────────────────────────────────────────────────────────────
    // Porsche 911 GT2 mesh, pre-converted from the source .obj to a flat
    // Float32 buffer (positions + normals) so nothing has to be parsed here.
    const car = new THREE.Group();
    car.rotation.y = -0.5;
    scene.add(car);

    let disposed = false;

    fetch("/models/porsche.bin")
      .then((r) => {
        if (!r.ok) throw new Error(`model ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        if (disposed) return;
        const count = new Uint32Array(buf, 0, 1)[0];
        const positions = new Float32Array(buf, 4, count * 3);
        const normals = new Float32Array(buf, 4 + count * 12, count * 3);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geo.computeBoundingBox();

        const box = geo.boundingBox!;
        const size = new THREE.Vector3();
        const centre = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(centre);

        // The source model runs nose-to-tail along Z; the scene expects X.
        // Scale so the car is the same 3.3 units long the old one was.
        const scale = 3.9 / size.z;

        const mesh = new THREE.Mesh(geo, paint);
        mesh.castShadow = true;
        mesh.position.set(-centre.x, -box.min.y, -centre.z);

        const holder = new THREE.Group();
        holder.add(mesh);
        holder.scale.setScalar(scale);
        holder.rotation.y = Math.PI / 2;
        car.add(holder);
      })
      .catch((err) => {
        console.error("EvCar3D: could not load the car model", err);
      });

    // ── Ground ─────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(2.9, 56),
      new THREE.MeshStandardMaterial({
        color: 0xeef0f2,
        roughness: 1,
        envMapIntensity: 0,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.82, 2.9, 56),
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
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          (Array.isArray(m) ? m : [m]).forEach((mat) => mat.dispose());
        }
      });
      envRT.dispose();
      pmrem.dispose();
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
        aria-label={t("3D model of a white electric car", "白色電動車 3D 模型")}
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
