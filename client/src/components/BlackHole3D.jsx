const BlackHole3D = () => {
  const scroll = useScroll();
  const bhRef = useRef();

  useFrame(() => {
    if (bhRef.current) {
      // Rotate the black hole
      bhRef.current.rotation.y += 0.005; 
      
      // VISIBILITY LOGIC:
      // Only visible during the 2nd/3rd page (Skills Section)
      const start = 0.3; // Approx page 2 starts here
      const end = 0.55; 
      const offset = scroll.offset;

      // Scale up when in view, scale down when out
      const visible = offset > start && offset < end;
      const targetScale = visible ? 2 : 0;
      
      const currentScale = bhRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
      
      bhRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    // Positioned on the LEFT, since text is on the RIGHT
    <group ref={bhRef} position={[-8, 0, 0]} scale={[0,0,0]}>
      <Planet name="BlackHole" scale={1} /> 
      {/* Add a purple light for the accretion disk effect */}
      <pointLight color="#a855f7" distance={20} intensity={5} />
    </group>
  );
};