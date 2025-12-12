import React, { useRef, useEffect, useMemo, useState } from 'react';
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
  onPlanetClick,
  blackHolePosRef = null // NEW: Receive the Black Hole's position
}) => {
  const { scene } = useGLTF(`/assets/models/${name}.glb`);
  const planetRef = useRef();
  
  const sceneClone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const offset = useRef(startAngle);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinSpeed = useRef(rotationSpeed);
  
  // Reuse vector to prevent memory leaks during frame loop
  const myWorldPos = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    sceneClone.traverse((child) => {
      if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
      }
    });
  }, [sceneClone, name]);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      // --- 1. PROXIMITY CHECK (Make planet spin if Black Hole is close) ---
      let proximityBoost = 0;
      
      if (blackHolePosRef && blackHolePosRef.current) {
        // Get this planet's true position in the world (accounting for Scroll)
        planetRef.current.getWorldPosition(myWorldPos);
        
        // Calculate distance to Black Hole
        const distance = myWorldPos.distanceTo(blackHolePosRef.current);
        
        // If closer than 5 units, spin crazy fast!
        if (distance < 10) {
          // The closer it is, the faster it spins (max +0.2 speed)
          proximityBoost = THREE.MathUtils.lerp(0.2, 0, distance / 5); 
        }
      }

      // --- 2. ROTATION LOGIC ---
      // Base Speed + Click Boost + Proximity Boost
      const targetSpeed = (isSpinning ? 0.2 : rotationSpeed) + proximityBoost;
      
      // Smoothly accelerate/decelerate
      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, targetSpeed, 0.1);
      planetRef.current.rotation.y += spinSpeed.current;

      // --- 3. ORBIT LOGIC ---
      if (orbitRadius > 0) {
        const t = clock.getElapsedTime() * orbitSpeed + offset.current;
        const x = Math.cos(t) * orbitRadius;
        const z = Math.sin(t) * orbitRadius;
        planetRef.current.position.set(x, yOffset, z);
      }
    }
  });

  const handleInteract = (e) => {
    e.stopPropagation();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
    if (onPlanetClick) onPlanetClick();
  };

  return (
    <primitive 
      ref={planetRef}
      object={sceneClone} 
      position={initialPosition} 
      scale={scale} 
      onClick={handleInteract}
      onPointerOver={() => document.body.style.cursor = 'grab'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    />
  );
};

export default Planet;