import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const Planet = ({ 
  name, 
  scale, 
  rotationSpeed = 0.01, 
  orbitSpeed = 0,   
  startAngle = 0,   
  orbitRadius = 0,  
  initialPosition = [0, 0, 0],
  yOffset = 0,
  isPaused = false,         // NEW: Stops orbit if true
  onPlanetClick = () => {}  // NEW: Function to run when clicked
}) => {
  const { scene } = useGLTF(`/assets/models/${name}.glb`);
  const planetRef = useRef();

  const sceneClone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const offset = useRef(startAngle);

  useEffect(() => {
    sceneClone.traverse((child) => {
      if (child.isMesh) {
        if (name === 'Sun') {
          // --- SUN SETUP ---
           child.geometry = new THREE.IcosahedronGeometry(1, 1);
           const canvas = document.createElement('canvas');
           canvas.width = 128; canvas.height = 128;
           const context = canvas.getContext('2d');
           const gradient = context.createLinearGradient(0, 0, 0, 128);
           gradient.addColorStop(0, '#ffcc00');   
           gradient.addColorStop(0.5, '#ff5500'); 
           gradient.addColorStop(1, '#ff5500');   
           context.fillStyle = gradient;
           context.fillRect(0, 0, 128, 128);
           const gradientTexture = new THREE.CanvasTexture(canvas);

           child.material = new THREE.MeshStandardMaterial({
            map: gradientTexture,
            flatShading: true,
            roughness: 1,
            metalness: 0,
            emissive: 0xffaa00,
            emissiveMap: gradientTexture,
            emissiveIntensity: 0.5
          });
        } else {
            // --- PLANET SETUP ---
            child.castShadow = true;
            child.receiveShadow = true;
        }
      }
    });
  }, [sceneClone, name]);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      // Always rotate the planet itself (Day/Night cycle)
      planetRef.current.rotation.y += rotationSpeed;

      // ONLY Orbit if NOT paused
      if (orbitRadius > 0 && !isPaused) {
        const t = clock.getElapsedTime() * orbitSpeed + offset.current;
        const x = Math.cos(t) * orbitRadius;
        const z = Math.sin(t) * orbitRadius;
        planetRef.current.position.set(x, yOffset, z);
      }
    }
  });

  return (
    <primitive 
      ref={planetRef}
      object={sceneClone} 
      position={initialPosition} 
      scale={scale} 
      // NEW: Handle Click
      onClick={(e) => {
        e.stopPropagation(); // Stop click from passing through
        onPlanetClick(name, planetRef.current.position); // Tell App we were clicked
      }}
      // Change cursor to hand when hovering
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    />
  );
};

export default Planet;