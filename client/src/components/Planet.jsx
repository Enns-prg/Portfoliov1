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
  blackHolePosRef = null,
  glowing = false // NEW: Prop to enable bloom
}) => {
  const { scene } = useGLTF(`/assets/models/${name}.glb`);
  const planetRef = useRef();
  
  const sceneClone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const offset = useRef(startAngle);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinSpeed = useRef(rotationSpeed);
  
  const myWorldPos = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    sceneClone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // --- BLOOM LOGIC ---
        if (glowing) {
          // 1. Assign the object's texture/color to its emissive channel
          child.material.emissive = child.material.color;
          child.material.emissiveMap = child.material.map;

          // 2. Set intensity based on object type
          // Sun gets super bright (2.0), others get subtle glow (0.5)
          const glowIntensity = name === 'Sun' ? 2.0 : 0.5;
          child.material.emissiveIntensity = glowIntensity;

          // 3. Disable tone mapping so colors can exceed 1.0 (required for Bloom)
          child.material.toneMapped = false;
        } else {
          // Reset defaults if not glowing
          child.material.emissiveIntensity = 0;
          child.material.toneMapped = true;
        }
      }
    });
  }, [sceneClone, name, glowing]);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      // --- PROXIMITY CHECK ---
      let proximityBoost = 0;
      if (blackHolePosRef && blackHolePosRef.current) {
        planetRef.current.getWorldPosition(myWorldPos);
        const distance = myWorldPos.distanceTo(blackHolePosRef.current);
        if (distance < 10) {
          proximityBoost = THREE.MathUtils.lerp(0.2, 0, distance / 5); 
        }
      }

      // --- ROTATION ---
      const targetSpeed = (isSpinning ? 0.2 : rotationSpeed) + proximityBoost;
      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, targetSpeed, 0.1);
      planetRef.current.rotation.y += spinSpeed.current;

      // --- ORBIT ---
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