"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const blobVert = /* glsl */ `
  uniform float uTime; uniform vec2 uMouse;
  varying vec3 vNormal; varying vec3 vView; varying float vDisp;
  void main(){
    vec3 p = position;
    float d = sin(p.x*2.6+uTime*.9)*sin(p.y*2.4+uTime*1.1)*sin(p.z*2.8+uTime*.7);
    d += .35*sin(p.x*6.0+uTime*1.6+uMouse.x*3.0)*sin(p.y*6.0-uTime*1.2+uMouse.y*3.0);
    p += normal * d * .28;
    vDisp = d;
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;
const blobFrag = /* glsl */ `
  uniform float uTime; uniform float uProgress;
  varying vec3 vNormal; varying vec3 vView; varying float vDisp;
  void main(){
    vec3 n = normalize(vNormal); vec3 v = normalize(vView);
    float fres = pow(1.0 - max(dot(n,v),0.0), 2.4);
    vec3 a = vec3(.05,.65,.95); vec3 b = vec3(.2,.4,.95); vec3 c = vec3(.45,.75,1.0);
    vec3 col = mix(a,b,smoothstep(-.6,.6,vDisp + sin(uTime*.4)*.3));
    col = mix(col,c,uProgress*.6);
    vec3 base = vec3(.92,.97,1.0);
    vec3 outc = mix(base, col, .35 + fres*.9);
    gl_FragColor = vec4(outc, .92);
  }`;
const ptVert = /* glsl */ `
  uniform float uTime; uniform float uPx; attribute float aSeed;
  varying float vA;
  void main(){
    vec3 p = position;
    p.y += sin(uTime*.3 + aSeed*20.0)*.25;
    p.x += cos(uTime*.25 + aSeed*13.0)*.2;
    vec4 mv = modelViewMatrix*vec4(p,1.0);
    gl_PointSize = (1.2 + aSeed*2.6) * uPx * (8.0 / -mv.z);
    vA = .35 + .65*abs(sin(uTime*.8 + aSeed*30.0));
    gl_Position = projectionMatrix*mv;
  }`;
const ptFrag = /* glsl */ `
  varying float vA;
  void main(){
    float d = length(gl_PointCoord-.5);
    if(d>.5) discard;
    gl_FragColor = vec4(.1,.55,.95, smoothstep(.5,0.,d)*vA*.8);
  }`;

export default function HeroScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const small = window.innerWidth < 800;
    const dpr = Math.min(window.devicePixelRatio, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeaf6ff, 0.045);
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const uniforms = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uProgress: { value: 0 } };
    const blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, small ? 24 : 48),
      new THREE.ShaderMaterial({ uniforms, vertexShader: blobVert, fragmentShader: blobFrag, transparent: true })
    );
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.35, 2),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.25 })
    );
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.008, 8, 220), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.006, 8, 220), new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.45 }));
    ring1.rotation.x = 1.2; ring2.rotation.set(0.5, 0.9, 0);
    const hero = new THREE.Group();
    hero.add(blob, wire, ring1, ring2);
    scene.add(hero);

    // floating shards
    const shards = new THREE.Group();
    const shardGeo = [new THREE.OctahedronGeometry(0.22), new THREE.TetrahedronGeometry(0.25), new THREE.BoxGeometry(0.28, 0.28, 0.28)];
    const shardMat = new THREE.MeshBasicMaterial({ color: 0x38a6e8, wireframe: true, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(shardGeo[i % 3], shardMat);
      const r = 4 + Math.random() * 4, a = Math.random() * Math.PI * 2;
      m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 9, Math.sin(a) * r - 3);
      m.userData = { s: 0.2 + Math.random() * 0.6, o: Math.random() * 10 };
      shards.add(m);
    }
    scene.add(shards);

    // particles
    const N = small ? 1000 : 2600;
    const pos = new Float32Array(N * 3), seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
      seed[i] = Math.random();
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const pm = new THREE.ShaderMaterial({
      uniforms: { uTime: uniforms.uTime, uPx: { value: dpr * 100 } },
      vertexShader: ptVert, fragmentShader: ptFrag, transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(pg, pm);
    scene.add(points);

    const mouse = new THREE.Vector2(), smooth = new THREE.Vector2();
    const onMove = (e: MouseEvent) => {
      mouse.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    let progress = 0, smoothP = 0;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress = h > 0 ? window.scrollY / h : 0;
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      smooth.lerp(mouse, 0.05);
      smoothP += (progress - smoothP) * 0.06;
      uniforms.uMouse.value.copy(smooth);
      uniforms.uProgress.value = smoothP;

      const wide = window.innerWidth > 800;
      // blob drifts across the page as you scroll
      const tx = wide ? Math.sin(smoothP * Math.PI * 3) * 2.8 + (smoothP < 0.12 ? 2.4 * (1 - smoothP / 0.12) : 0) : 0;
      hero.position.x += (tx - hero.position.x) * 0.08;
      hero.position.y = -smoothP * 2.5 + Math.sin(t * 0.6) * 0.15;
      const sc = (wide ? Math.min(1, camera.aspect / 1.4 + 0.3) : Math.min(0.62, 0.3 + camera.aspect * 0.4)) * (1 - smoothP * 0.35);
      hero.scale.setScalar(sc);
      hero.rotation.y = t * 0.15 + smooth.x * 0.5 + smoothP * 6;
      hero.rotation.x = smooth.y * 0.3 + smoothP * 2;
      wire.rotation.y = -t * 0.1; wire.rotation.z = t * 0.05;
      ring1.rotation.z = t * 0.2; ring2.rotation.z = -t * 0.15; ring2.rotation.x = 0.5 + Math.sin(t * 0.3) * 0.2;

      shards.children.forEach((m) => {
        const u = m.userData as { s: number; o: number };
        m.rotation.x = t * u.s; m.rotation.y = t * u.s * 0.7;
        m.position.y += Math.sin(t * u.s + u.o) * 0.002;
      });
      shards.rotation.y = t * 0.03 + smoothP * 2;
      points.rotation.y = t * 0.012 + smoothP * 0.8;
      points.position.y = smoothP * 3;

      camera.position.x = smooth.x * 0.6;
      camera.position.y = smooth.y * 0.4;
      camera.position.z = 8 - smoothP * 1.5;
      camera.lookAt(0, -smoothP * 1.2, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | undefined;
        if (mat) mat.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="scene-canvas" aria-hidden="true" />;
}
