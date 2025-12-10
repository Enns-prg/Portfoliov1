import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Starfield = () => {
  const texture = useTexture('/assets/textures/starfield.png');

  // Repeat the texture to make stars smaller and denser
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  // Try (16, 16) or even (20, 20) to match your reference image
  texture.repeat.set(16, 16); 

  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
      />
    </mesh>
  );
};

export default Starfield;