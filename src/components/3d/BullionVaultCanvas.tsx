'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { MetalType } from '@/types/bullion';

interface BullionVaultCanvasProps {
  activeMetal?: MetalType;
  onMetalChange?: (metal: MetalType) => void;
}

export function BullionVaultCanvas({
  activeMetal = 'gold_24k',
  onMetalChange,
}: BullionVaultCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(activeMetal);
  const [isRotating, setIsRotating] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep internal state in sync with prop
  useEffect(() => {
    setSelectedMetal(activeMetal);
  }, [activeMetal]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 360;
    const height = currentMount.clientHeight || 320;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.05);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    currentMount.replaceChildren(renderer.domElement);

    // 2. Texture Generator for Ingot Hallmark
    const createIngotTexture = (metal: MetalType) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Base texture fill with subtle brushed metal gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      if (metal === 'silver') {
        grad.addColorStop(0, '#E2E8F0');
        grad.addColorStop(0.5, '#CBD5E1');
        grad.addColorStop(1, '#94A3B8');
      } else if (metal === 'gold_22k') {
        grad.addColorStop(0, '#F59E0B');
        grad.addColorStop(0.5, '#D97706');
        grad.addColorStop(1, '#B45309');
      } else {
        grad.addColorStop(0, '#FDE047');
        grad.addColorStop(0.5, '#EAB308');
        grad.addColorStop(1, '#CA8A04');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Engraved border bevel line
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 944, 432);

      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(48, 48, 928, 416);

      // Hallmark Text Engraving
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 1;

      // Brand Title
      ctx.font = 'bold 54px monospace';
      ctx.fillText('AURUM ALERT', 512, 130);

      // Hallmark Emblem Circle
      ctx.beginPath();
      ctx.arc(512, 230, 50, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.stroke();

      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('★ 999 ★', 512, 238);

      // Purity & Weight
      ctx.font = 'bold 44px sans-serif';
      if (metal === 'silver') {
        ctx.fillText('FINE SILVER 999.0', 512, 340);
        ctx.font = '32px sans-serif';
        ctx.fillText('NET WEIGHT 1000g • KILO BAR', 512, 395);
      } else if (metal === 'gold_22k') {
        ctx.fillText('STANDARD GOLD 916.0', 512, 340);
        ctx.font = '32px sans-serif';
        ctx.fillText('NET WEIGHT 10g • 22 KARAT', 512, 395);
      } else {
        ctx.fillText('FINE GOLD 999.9', 512, 340);
        ctx.font = '32px sans-serif';
        ctx.fillText('NET WEIGHT 10g • 24 KARAT', 512, 395);
      }

      ctx.font = '22px monospace';
      ctx.fillText('SERIES 2026-IST • ASSAY CERTIFIED', 512, 445);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    // 3. Trapezoidal Cast Ingot Geometry
    const shape = new THREE.Shape();
    const l = 1.4;
    const w = 0.8;
    const r = 0.08;
    shape.moveTo(-l + r, -w);
    shape.lineTo(l - r, -w);
    shape.quadraticCurveTo(l, -w, l, -w + r);
    shape.lineTo(l, w - r);
    shape.quadraticCurveTo(l, w, l - r, w);
    shape.lineTo(-l + r, w);
    shape.quadraticCurveTo(-l, w, -l, w - r);
    shape.lineTo(-l, -w + r);
    shape.quadraticCurveTo(-l, -w, -l + r, -w);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // 4. Metal Physical Materials
    const texture = createIngotTexture(selectedMetal);

    const getMaterialConfig = (metal: MetalType) => {
      if (metal === 'silver') {
        return {
          color: 0xd8e0ea,
          metalness: 0.96,
          roughness: 0.16,
          clearcoat: 0.4,
          clearcoatRoughness: 0.15,
        };
      }
      if (metal === 'gold_22k') {
        return {
          color: 0xeba832,
          metalness: 0.94,
          roughness: 0.19,
          clearcoat: 0.35,
          clearcoatRoughness: 0.2,
        };
      }
      return {
        color: 0xf6c535,
        metalness: 0.97,
        roughness: 0.15,
        clearcoat: 0.45,
        clearcoatRoughness: 0.12,
      };
    };

    const matConfig = getMaterialConfig(selectedMetal);
    const material = new THREE.MeshPhysicalMaterial({
      ...matConfig,
      map: texture,
      reflectivity: 0.9,
    });

    const ingotMesh = new THREE.Mesh(geometry, material);
    ingotMesh.rotation.x = -Math.PI / 4.5;
    ingotMesh.rotation.y = Math.PI / 6;
    scene.add(ingotMesh);

    // 5. Floating Dust / Atmospheric Particles
    const particleCount = 60;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: selectedMetal === 'silver' ? 0xcbd5e1 : 0xfde047,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Realistic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.8);
    scene.add(ambientLight);

    // Golden Key Spotlight
    const keyLight = new THREE.DirectionalLight(0xfffae6, 3.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Cyan / Platinum Rim Light
    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    rimLight.position.set(-4, 2, -2);
    scene.add(rimLight);

    // Warm underside bounce light
    const bounceLight = new THREE.PointLight(0xe5b842, 1.8, 8);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 7. Mouse Drag Interactive Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      ingotMesh.rotation.y += deltaX * 0.01;
      ingotMesh.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      ingotMesh.rotation.y += deltaX * 0.012;
      ingotMesh.rotation.x += deltaY * 0.012;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when not user-dragging
      if (isRotating && !isDragging) {
        ingotMesh.rotation.y += 0.006;
        ingotMesh.position.y = Math.sin(elapsedTime * 1.4) * 0.08;
      }

      // Rotate particle aura
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [selectedMetal, isRotating]);

  const handleSelectMetal = (metal: MetalType) => {
    setSelectedMetal(metal);
    if (onMetalChange) onMetalChange(metal);
  };

  return (
    <div className="relative w-full rounded-2xl glass-panel p-5 overflow-hidden group">
      {/* Ambient background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
            Interactive 3D Vault Ingot
          </span>
        </div>

        {/* Rotation Lock Toggle */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          title="Toggle 3D Auto-Rotation"
          className="text-slate-400 hover:text-amber-300 transition-colors p-1 rounded-md bg-vault-800/80 border border-slate-700/60 text-xs flex items-center gap-1 cursor-pointer"
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">{isRotating ? 'Spinning' : 'Static'}</span>
        </button>
      </div>

      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing relative flex items-center justify-center"
      >
        {!isLoaded && (
          <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span>Forging 3D Specimen...</span>
          </div>
        )}
      </div>

      {/* Drag Hint & Spec Selector */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 text-[11px] flex items-center gap-1.5 font-mono">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Click & Drag to Rotate 360°</span>
        </span>

        {/* Metal Select Tabs */}
        <div className="inline-flex rounded-xl bg-vault-900 p-1 border border-amber-500/20 text-xs">
          <button
            onClick={() => handleSelectMetal('gold_24k')}
            className={`px-3 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
              selectedMetal === 'gold_24k'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24K Ingot
          </button>
          <button
            onClick={() => handleSelectMetal('gold_22k')}
            className={`px-3 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
              selectedMetal === 'gold_22k'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            22K Crown
          </button>
          <button
            onClick={() => handleSelectMetal('silver')}
            className={`px-3 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
              selectedMetal === 'silver'
                ? 'bg-slate-700/40 text-slate-100 border border-slate-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Silver Kilo
          </button>
        </div>
      </div>
    </div>
  );
}
