import React from 'react';
import * as THREE from 'three';

const Orbit = ({ radius, color = 'white' }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* RingGeometry args: [innerRadius, outerRadius, thetaSegments] */}
      {/* We make the inner/outer radius very close to create a thin line */}
      <ringGeometry args={[radius, radius + 0.05, 64]} />
      <meshBasicMaterial 
        color={color} 
        side={THREE.DoubleSide} 
        transparent={true} 
        opacity={0.3} // Faded look
      />
    </mesh>
  );
};

export default Orbit;