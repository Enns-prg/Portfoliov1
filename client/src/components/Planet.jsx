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
}) => {
  const { scene } = useGLTF(`/assets/models/${name}.glb`);
  const planetRef = useRef();
  
  // Clone scene to allow multiple instances (if needed)
  const sceneClone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  
  // Orbit state
  const offset = useRef(startAngle);
  
  // Interaction State
  const [isSpinning, setIsSpinning] = useState(false);
  const spinSpeed = useRef(rotationSpeed);

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
      // 1. ROTATION (Self)
      // If clicked, spin fast, otherwise normal speed
      const targetSpeed = isSpinning ? 0.2 : rotationSpeed;
      // Smoothly interpolate current speed to target speed
      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, targetSpeed, 0.1);
      planetRef.current.rotation.y += spinSpeed.current;

      // 2. ORBIT (Around Sun)
      // Continuous orbit, never pauses
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
    // Trigger "Spin Boost"
    setIsSpinning(true);
    // Stop spinning after 1 second
    setTimeout(() => setIsSpinning(false), 1000);
    // Forward click event to parent (for scrolling or other behavior)
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