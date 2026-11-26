'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Scene 8's keepsake star — the only Three.js surface in the project.
 *
 * It is loaded lazily (see `FinaleScene`) and never renders on the server.
 * Under reduced motion it draws a single still frame: the object is still
 * there, it simply does not move or burst.
 */
export function KeepsakeStar({ className, reduced = false }: { className?: string; reduced?: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 320;
    let height = mount.clientHeight || 320;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    /* ── the star ─────────────────────────────────────────────────────── */
    const shape = new THREE.Shape();
    const spikes = 5;
    const outerRadius = 2;
    const innerRadius = 0.88;
    for (let i = 0; i < spikes * 2; i += 1) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSize: 0.12,
      bevelThickness: 0.12,
      bevelSegments: 3,
    });
    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      metalness: 0.62,
      roughness: 0.3,
    });
    const star = new THREE.Mesh(geometry, material);
    scene.add(star);

    const key = new THREE.DirectionalLight(0xfff3d6, 2.6);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fc6ff, 1.5);
    rim.position.set(-5, -2, 4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    /* ── one celebratory burst ────────────────────────────────────────── */
    const COUNT = 260;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 1.6 + Math.random() * 2.8;
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed * 0.5;
    }
    const burstGeometry = new THREE.BufferGeometry();
    burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const burstMaterial = new THREE.PointsMaterial({
      color: 0xf2c9d2,
      size: 0.1,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const burst = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burst);

    const drawStatic = () => {
      renderer.render(scene, camera);
    };

    if (reduced) {
      burst.visible = false;
      drawStatic();
    }

    let frame = 0;
    let progress = 0;
    let elapsed = 0;
    let visible = true;

    const tick = () => {
      if (!visible || document.hidden) {
        frame = 0;
        return;
      }
      frame = window.requestAnimationFrame(tick);
      elapsed += 0.016;

      star.rotation.y += 0.013;
      star.rotation.x = Math.sin(elapsed * 0.6) * 0.2;
      star.position.y = Math.sin(elapsed * 1.1) * 0.16;

      if (progress < 1) {
        progress = Math.min(1, progress + 0.011);
        const attribute = burstGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < COUNT; i += 1) {
          attribute.setXYZ(
            i,
            velocities[i * 3] * progress * 1.7,
            velocities[i * 3 + 1] * progress * 1.7,
            velocities[i * 3 + 2] * progress * 1.7,
          );
        }
        attribute.needsUpdate = true;
        burstMaterial.opacity = 1 - progress;
        burst.visible = progress < 1;
      }

      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (!reduced && !frame && visible && !document.hidden) tick();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) startLoop();
        else if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(mount);

    const onVisibility = () => {
      if (!document.hidden) startLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (!reduced) startLoop();

    const onResize = () => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (reduced) drawStatic();
    };
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      if (frame) window.cancelAnimationFrame(frame);
      geometry.dispose();
      material.dispose();
      burstGeometry.dispose();
      burstMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduced]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
