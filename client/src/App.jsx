import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Typewriter from './components/Typewriter';

// --- HTML SECTIONS ---
// Added pointer-events-none to container so it doesn't block 3D, 
// but re-enabled it for children so buttons work.
const Section = ({ align = 'left', justify = 'center', children }) => (
  <div className={`h-screen w-screen flex flex-col px-20 relative pointer-events-none ${
    align === 'right' ? 'items-end' : 
    align === 'left' ? 'items-start' : 'items-center'
  } ${
    justify === 'center' ? 'justify-center' : 
    justify === 'start' ? 'justify-start' : 'justify-end'
  }`}>
    <div className="pointer-events-auto">
      {children}
    </div>
  </div>
);

// --- HERO SECTION ---
const HeroSection = () => {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <Section align="left" justify="center">
      <div className="z-10 select-none mt-[-10vh]"> 
        <div className={`transition-opacity duration-1000 ${typingDone ? 'opacity-100' : 'opacity-0'} animate-bounce text-yellow-400 mb-4 opacity-80`}>
            <p className="text-xs mb-1 tracking-widest">SCROLL TO ENTER</p>
            <span className="text-xl">▼</span>
        </div>
        <div className="mb-4 min-h-[3rem]">
           <Typewriter 
             text="Frederick Ian Aranico" 
             delay={100} 
             onComplete={() => setTypingDone(true)} 
           />
        </div>
        <div className={`transition-opacity duration-1000 ${typingDone ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-300 font-light tracking-widest uppercase text-sm border-l-2 border-yellow-400 pl-4">
            Full Stack Developer 
          </p>
        </div>
      </div>
    </Section>
  );
};

// --- CONTENT SECTIONS ---
const AboutMeContent = () => (
  <Section align="left">
    <div className="w-[45%] text-white mt-[-5rem] z-10">
      
      {/* --- IMAGE --- */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 via-transparent to-red-400 rounded-full opacity-50 blur-sm animate-spin [animation-duration:3s] group-hover:opacity-80 transition duration-500"></div>
        <img 
          src="/assets/images/me.jpg" 
          alt="Frederick Ian Aranico" 
          className="relative w-48 h-48 rounded-full border-2 border-yellow-100/50 object-cover shadow-2xl"
        />
      </div>

      <h3 className="text-3xl font-bold mb-6">ABOUT ME</h3>
      <p className="text-xl leading-relaxed text-gray-300 text-justify mb-8" style={{ textAlign: 'justify' }}>
       Hi! I’m Frederick Ian Aranico, a Computer Science student and aspiring AI engineer with a strong focus on building practical, data-driven, and AI-powered applications. I enjoy working across the full stack—developing backend systems, crafting intuitive interfaces, and integrating machine learning models that solve real-world problems.
      </p>

      {/* --- SOCIAL LINKS (ADDED HERE) --- */}
      <div className="flex gap-4">
        <a 
          href="/resume.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 border border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-300 font-bold tracking-wider text-sm flex items-center gap-2"
        >
          <span>📄</span> RESUME
        </a>
        <a 
          href="https://github.com/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 border border-white/30 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm flex items-center gap-2"
        >
          <span>💻</span> GITHUB
        </a>
        <a 
          href="https://linkedin.com/in/yourname" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 border border-white/30 text-white rounded-full hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 text-sm flex items-center gap-2"
        >
          <span>🔗</span> LINKEDIN
        </a>
      </div>

    </div>
  </Section>
);

const StandardContent = ({ title, subtitle, color, align }) => (
  <Section align={align}>
    <div className={`w-[40%] p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl text-white ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <h2 className={`text-5xl font-bold mb-2 ${color}`}>{title}</h2>
      <h3 className="text-xl font-mono text-gray-400 mb-6 tracking-widest uppercase">{subtitle}</h3>
      <p className="text-lg leading-relaxed text-gray-200">
        Context about {title} goes here.
      </p>
    </div>
  </Section>
);

// --- 3D SCENE: CAMERA RIG ---
const CameraRig = () => {
  const scroll = useScroll();
  useFrame((state) => {
    const scrollOffset = scroll.offset; 
    const transitionPhase = THREE.MathUtils.clamp(scrollOffset * 3, 0, 1);
    
    const startPos = new THREE.Vector3(0, 20, 25);
    const endPos = new THREE.Vector3(0, 13, 20); 
    
    state.camera.position.lerpVectors(startPos, endPos, transitionPhase);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// --- 3D SCENE: HERO SOLAR SYSTEM ---
const HeroSolarSystem = () => {
  const scroll = useScroll();
  const solarSystemRef = useRef();

  useFrame(() => {
    if (solarSystemRef.current) {
      solarSystemRef.current.rotation.y += 0.001; 
      const scrollOffset = scroll.offset;
      const targetY = scrollOffset > 0.01 ? 50 : -2; 
      solarSystemRef.current.position.y = THREE.MathUtils.lerp(
        solarSystemRef.current.position.y, targetY, 0.05
      );
    }
  });

  return (
    <group ref={solarSystemRef} position={[5, -2, 0]}>
      <Planet name="Sun" scale={3} rotationSpeed={0.002} />
      <group>
        <Orbit radius={5} />   <Planet name="Mercury" scale={6} orbitRadius={5} orbitSpeed={1} />
        <Orbit radius={7} />   <Planet name="Venus" scale={9} orbitRadius={7} orbitSpeed={0.6} />
        <Orbit radius={10} />  <Planet name="Earth" scale={0.15} orbitRadius={10} orbitSpeed={0.4} />
        <Orbit radius={12.5} /> <Planet name="Mars" scale={6} orbitRadius={12.5} orbitSpeed={0.3} />
      </group>
    </group>
  );
};

// --- 3D SCENE: SCROLLABLE CONTENT PLANETS ---
const ContentPlanets = () => {
  const { viewport } = useThree();
  const scroll = useScroll(); 
  const groupRef = useRef();
  
  const xOffset = viewport.width / 10; 

  const planets = useMemo(() => [
    { name: "Mercury", scale: 54, position: [xOffset, -viewport.height * 1, 0] },
    { name: "Venus",   scale: 35, position: [-xOffset, -viewport.height * 2, 0] },
    { name: "Earth",   scale: 0.75, position: [xOffset, -viewport.height * 3, 0] },
    { name: "Mars",    scale: 34, position: [-xOffset, -viewport.height * 4, 0] },
  ], [viewport, xOffset]);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = scroll.offset > 0.02 ? 1 : 0;
      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      groupRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {planets.map((p, i) => (
        <group key={i} position={p.position}>
          <Planet name={p.name} scale={p.scale} rotationSpeed={0.01} />
          <pointLight distance={10} intensity={4} color="white" />
        </group>
      ))}
    </group>
  );
};

function App() {
  return (
    <div className="fixed inset-0 bg-black">
      <Canvas shadows camera={{ position: [0, 20, 25], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} color="white" />
        
        <Suspense fallback={null}>
          <Starfield />
          
          <ScrollControls pages={5} damping={0.3}>
            <CameraRig />
            <HeroSolarSystem />
            
            <Scroll>
              <ContentPlanets />
            </Scroll>

            <Scroll html>
              <HeroSection />
              <AboutMeContent />
              <StandardContent title="SKILLS" subtitle="Tools & Tech" align="right" color="text-blue-400" />
              <StandardContent title="PORTFOLIO" subtitle="Selected Works" align="left" color="text-green-400" />
              <StandardContent title="EXPERIENCE" subtitle="My Journey" align="right" color="text-red-400" />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;