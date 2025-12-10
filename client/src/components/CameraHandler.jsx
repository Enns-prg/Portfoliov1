import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraHandler = ({ targetPosition, isZoomed }) => {
  const { controls } = useThree();
  
  useFrame((state) => {
    if (isZoomed && targetPosition) {
      // 1. MOVE CAMERA: Go to the same X position as the planet, but back a bit (z+6)
      const desiredPosition = new THREE.Vector3(
        targetPosition.x, 
        targetPosition.y + 0.5, 
        targetPosition.z + 6 
      );
      
      // 2. LOOK AT OFFSET: Look at empty space to the LEFT (x - 4)
      // This forces the actual planet to sit on the RIGHT side of the screen.
      const lookAtTarget = new THREE.Vector3(
        targetPosition.x - 2, 
        targetPosition.y, 
        targetPosition.z
      );

      // Smoothly animate both position and rotation
      state.camera.position.lerp(desiredPosition, 0.05);
      state.camera.lookAt(lookAtTarget);
      
      // Disable mouse control so user doesn't drag it away
      if (controls?.current) controls.current.enabled = false;

    } else {
      // 3. RESET: If not zoomed, go back to overview
      const defaultPos = new THREE.Vector3(0, 20, 25);
      state.camera.position.lerp(defaultPos, 0.05);
      state.camera.lookAt(0, 0, 0); 
      
      if (controls?.current) controls.current.enabled = true;
    }
  });
  return null;
};

export default CameraHandler;