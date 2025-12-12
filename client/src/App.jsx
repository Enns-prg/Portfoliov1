import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Html, Billboard, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Typewriter from './components/Typewriter';

// --- HTML SECTIONS HELPER ---
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
            <p className="text-xs mb-1 tracking-widest font-['Orbitron']">SCROLL TO ENTER</p>
            <span className="text-xl">▼</span>
        </div>
        <div className="mb-4 min-h-[3rem]">
           <div className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter font-['Orbitron']">
             <Typewriter 
               text="Frederick Ian Aranico" 
               delay={100} 
               infinite={true} 
               onComplete={() => setTypingDone(true)} 
             />
           </div>
        </div>
        <div className={`transition-opacity duration-1000 ${typingDone ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-300 font-light tracking-widest uppercase text-lg border-l-2 border-yellow-400 pl-4 font-['Rajdhani']">
            Full Stack Developer 
          </p>
        </div>
      </div>
    </Section>
  );
};

// --- ABOUT ME SECTION (COMPACT CYBER-DECK CHIPS) ---
const AboutMeContent = () => {
  // Helper to render a "Tech Chip" button
  const ChipButton = ({ href, download, color, label, logo, index, accentColor }) => (
    <a 
      href={href} 
      download={download}
      target={download ? "_self" : "_blank"}
      rel="noopener noreferrer"
      // CHANGED: 
      // 1. w-full md:w-auto -> w-fit (Shrinks to content size)
      // 2. Reduced padding (pr-6 pl-4) to tighten it further
      className="group relative w-fit h-[50px] bg-zinc-900/80 -skew-x-12 border-l-4 border-white/20 flex items-center pr-6 pl-4 transition-all duration-300 hover:bg-zinc-800 hover:border-yellow-400 hover:skew-x-0 hover:translate-x-2"
    >
      {/* Color Accent Bar (Left Side) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} transition-all duration-300 group-hover:w-2 group-hover:shadow-[0_0_15px_currentColor]`}></div>

      {/* Content Container */}
      <div className="flex items-center gap-6"> 
        
        {/* Left: Logo & Label */}
        <div className="flex items-center gap-3">
          {/* Smaller Logo Container */}
          <div className="relative w-7 h-7 flex items-center justify-center bg-black/50 rounded p-1 border border-white/5">
             <img 
               src={logo} 
               alt={label} 
               className={`w-full h-full object-contain ${label === 'GITHUB' ? 'invert' : ''} opacity-70 group-hover:opacity-100 transition-opacity`} 
             />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold font-['Orbitron'] tracking-widest ${color} group-hover:brightness-125 transition-all`}>
              {label}
            </span>
            {/* Tiny Tech Status Text */}
            <span className="text-[9px] font-mono text-gray-500 group-hover:text-green-400 transition-colors">
              <span className="group-hover:hidden">/// READY</span>
              <span className="hidden group-hover:inline animate-pulse">● CONNECTED</span>
            </span>
          </div>
        </div>

        {/* Right: Serial Number (Decorative) */}
        {/* Kept visible but closer to text due to w-fit */}
        <div className="hidden md:block text-right">
          <span className="text-[2rem] leading-none font-bold font-['Rajdhani'] text-white/5 group-hover:text-white/10 transition-colors">
            0{index}
          </span>
        </div>

      </div>

      {/* Corner Tech Detail */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
    </a>
  );

  return (
    <Section align="left">
      <div className="w-[45%] text-white mt-[-5rem] z-10">
        
        {/* Profile Image (unchanged) */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-30 blur-md group-hover:opacity-70 transition duration-500"></div>     
               <img 
            src="/assets/images/me.jpg" 
            alt="Frederick Ian Aranico" 
            className="relative w-48 h-48 rounded-full border-2 border-yellow-100/50 object-cover shadow-2xl"
          />
        </div>

        <h3 className="text-4xl font-bold mb-6 font-['Orbitron'] tracking-wide">ABOUT ME</h3>
        <p className="text-xl leading-relaxed text-gray-300 text-justify mb-8 font-['Rajdhani']" style={{ textAlign: 'justify' }}>
         Hi! I’m Frederick Ian Aranico, a Computer Science student and aspiring AI engineer with a strong focus on building practical, data-driven, and AI-powered applications. I enjoy working across the full stack—developing backend systems, crafting intuitive interfaces, and integrating machine learning models that solve real-world problems.
        </p>
        
        {/* Data Chips Container */}
        <div className="flex flex-row flex-wrap gap-3">
          
          <ChipButton 
            href="/resume.pdf" 
            download={true}
            label="RESUME" 
            color="text-yellow-400" 
            accentColor="bg-yellow-400"
            logo="/assets/logos/resume.png"
            index={1}
          />

          <ChipButton 
            href="https://github.com/Ennsss" 
            label="GITHUB" 
            color="text-gray-200" 
            accentColor="bg-white"
            logo="/assets/logos/github.png"
            index={2}
          />

          <ChipButton 
            href="https://www.linkedin.com/in/frederickaranico/" 
            label="LINKEDIN" 
            color="text-blue-400" 
            accentColor="bg-blue-500"
            logo="/assets/logos/linkedin.jpg"
            index={3}
          />

        </div>
      </div>
    </Section>
  );
};
// --- SKILLS SECTION ---
const SkillsContent = () => {
  const skillGroups = [
    { category: "LANGUAGES", color: "text-yellow-400", accent: "border-yellow-400", bgHover: "hover:bg-yellow-400/10", skills: ["Python", "JavaScript", "C#", "C++", "Java", "HTML/CSS"] },
    { category: "AI & DATA", color: "text-red-400", accent: "border-red-400", bgHover: "hover:bg-red-400/10", skills: ["TensorFlow", "YOLOv11", "Gemini API", "Pandas", "OpenCV"] },
    { category: "FRAMEWORKS ", color: "text-blue-400", accent: "border-blue-400", bgHover: "hover:bg-blue-400/10", skills: ["React", "Node.js", "Flask", "Django", "ASP.NET", "Three.js"] },
    { category: "TOOLS & DB", color: "text-green-400", accent: "border-green-400", bgHover: "hover:bg-green-400/10", skills: ["MySQL", "MongoDB", "AWS", "Git", "Postman"] }
  ];

  return (
    <Section align="right">
      <div className="w-[100%] ml-auto flex flex-col items-start z-10 pointer-events-none pl-10">
        <div className="mb-10 pl-4 border-l-2 border-white/20">
          <h2 className="text-6xl font-black text-white mb-1 tracking-tighter font-['Orbitron']"> SKILLS</h2>
          <div className="flex items-center gap-3 text-gray-400 font-mono text-sm tracking-[0.3em] uppercase font-tech">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             System Status: Online
          </div>
        </div>
        <div className="w-full flex flex-col gap-6 pointer-events-auto">
          {skillGroups.map((group, idx) => (
            <div key={idx} className={`group relative w-full p-6 transition-all duration-500 hover:translate-x-4`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent -skew-x-12 border-l-4 ${group.accent} ${group.bgHover} transition-colors duration-300`}></div>
              <div className="relative flex flex-col gap-3">
                <h4 className={`text-2xl font-bold font-['Orbitron'] ${group.color} flex items-center gap-3 tracking-widest`}>
                  <span className="text-sm opacity-50 font-['Rajdhani']">0{idx + 1} //</span> {group.category}
                </h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 ml-10">
                  {group.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="group/skill flex items-center gap-2">
                      <span className={`w-1 h-1 rounded-full bg-white/30 group-hover/skill:bg-white transition-colors`}></span>
                      <span className="text-gray-300 font-['Rajdhani'] font-bold text-sm group-hover/skill:text-white group-hover/skill:shadow-[0_0_10px_white] transition-all cursor-default">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// --- SCANNING SATELLITE (WITH LOCAL FONTS) ---

const ScanningSatellite = ({ position, rotation, project }) => {
  const [hovered, setHover] = useState(false);
  const scanBarRef = useRef();
  
  useFrame((state, delta) => {
    if (scanBarRef.current) {
      if (hovered) {
        const time = state.clock.elapsedTime * 2;
        scanBarRef.current.position.y = Math.sin(time) * 1.2; 
        scanBarRef.current.visible = true;
      } else {
        scanBarRef.current.visible = false;
      }
    }
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  });

  const bodyW = 5;
  const bodyH = 3.5;
  const bodyD = 0.2;

  // IMPORTANT: Ensure you have these files in public/fonts/
  const fontTitle = "/fonts/Orbitron-Bold.ttf";
  const fontBody = "/fonts/Rajdhani-Medium.ttf";

  return (
    <group position={position} rotation={rotation}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>``
        <group 
          onPointerOver={() => setHover(true)} 
          onPointerOut={() => setHover(false)}
          onClick={() => window.open(project.link, '_blank')}
          scale={hovered ? 1.05 : 1}
        >
          {/* Chassis */}
          <RoundedBox args={[bodyW, bodyH, bodyD]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial 
              color={hovered ? "#0f172a" : "#000000"} 
              roughness={0.2} 
              metalness={0.8}
              transmission={0.5} 
              transparent={true}
              opacity={0.8} 
              thickness={0.5} 
            />
          </RoundedBox>
          
          {/* Scanner Beam */}
          <mesh ref={scanBarRef} position={[0, 0, bodyD/2 + 0.05]} visible={false}>
             <boxGeometry args={[bodyW + 0.2, 0.05, 0.05]} />
             <meshBasicMaterial color="#00ffff" />
             <pointLight color="#00ffff" intensity={2} distance={2} />
          </mesh>

          {/* UI Layout */}
          <group position={[0, 0, bodyD/2 + 0.02]}>
            
            {/* Live Indicator */}
            <mesh position={[bodyW/2 - 0.4, bodyH/2 - 0.3, 0]}>
               <circleGeometry args={[0.08]} />
               <meshBasicMaterial color={hovered ? "#22c55e" : "#555"} />
            </mesh>
            <Text 
              position={[bodyW/2 - 0.7, bodyH/2 - 0.3, 0]} 
              fontSize={0.15} 
              color="#22c55e" 
              anchorX="right" 
              anchorY="middle"
              font={fontBody}
            >
              LIVE
            </Text>

            {/* TITLE (Orbitron) */}
            <Text 
              position={[-bodyW/2 + 0.3, 0.7, 0]} 
              fontSize={0.35} 
              color="#38bdf8" 
              anchorX="middle" 
              anchorY="left" 
              font={fontTitle}
            >
              {project.title.toUpperCase()}
            </Text>

            {/* Divider */}
            <mesh position={[-bodyW/2 + 0.3, 0.4, 0]}>
               <planeGeometry args={[0.05, 0.8]} />
               <meshBasicMaterial color="#334155" />
            </mesh>

            {/* Description (Rajdhani) */}
            <Text 
              position={[-bodyW/2 + 0.5, 0, 0]} 
              fontSize={0.2} 
              color="#cbd5e1" 
              anchorX="left" 
              anchorY="middle" 
              maxWidth={bodyW - 0.8}
              lineHeight={1.4}
              font={fontBody}
            >
              {project.desc}
            </Text>

            {/* Tech Badges */}
            {project.tech && project.tech.map((tech, i) => (
              <group key={i} position={[-bodyW/2 + 0.6 + (i * 1.2), -0.8, 0]}>
                 <mesh>
                   <planeGeometry args={[1.0, 0.3]} />
                   <meshBasicMaterial color="#1e293b" transparent opacity={0.8} />
                 </mesh>
                 <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(1.0, 0.3)]} />
                    <lineBasicMaterial color="#38bdf8" />
                 </lineSegments>
                 <Text position={[0,0,0.01]} fontSize={0.12} color="#38bdf8" font={fontBody}>
                   {tech}
                 </Text>
              </group>
            ))}

            {/* Footer Action */}
            <Text 
              position={[-bodyW/2 + 0.3, -bodyH/2 + 0.3, 0]} 
              fontSize={0.25} 
              color="#facc15" 
              anchorX="left" 
              anchorY="bottom"
              font={fontTitle}
            >
              INITIALIZE →
            </Text>
             <mesh position={[0, -bodyH/2 + 0.25, 0]}>
               <planeGeometry args={[bodyW - 0.6, 0.02]} />
               <meshBasicMaterial color="#facc15" />
            </mesh>

          </group>
        </group>
      </Billboard>
    </group>
  );
};

const DataRing = () => {
  const groupRef = useRef();
  
  const projects = [
    { title: "AI Sentinel", desc: "Real-time hazard detection using YOLOv11 & OpenCV analysis.", tech: ["PYTHON", "YOLO", "OPENCV"], link: "https://github.com/Ennsss" },
    { title: "Solaris Web", desc: "Immersive 3D portfolio powered by React Three Fiber.", tech: ["REACT", "R3F", "THREEJS"], link: "https://github.com/Ennsss" },
    { title: "Crypto Bot", desc: "Predictive algorithmic trading using TensorFlow LSTM models.", tech: ["PYTHON", "TF", "PANDAS"], link: "https://github.com/Ennsss" },
    { title: "Nexus DB", desc: "High-performance distributed database system written in Go.", tech: ["GO", "SQL", "DOCKER"], link: "https://github.com/Ennsss" },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const radius = 8; 

  return (
    // CHANGED: rotation X from 0.5 to 1.3
    // This tilts the ring up so it faces the camera directly
    <group ref={groupRef} rotation={[0, 20, 0]}> 
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>

      {projects.map((proj, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <ScanningSatellite 
            key={i} 
            position={[x, 0, z]} 
            project={proj}a   
          />
        );
      })}
    </group>
  );
};

// --- PROJECTS OVERLAY ---
const ProjectsOverlay = () => (
  <Section align="center" justify="start">
    <div className="mt-10 text-center pointer-events-none z-10">
      <h2 className="text-6xl font-black text-cyan-400 mb-2 tracking-tighter font-['Orbitron'] drop-shadow-lg">
        PROJECTS
      </h2>
      <p className="text-white font-mono text-sm tracking-[0.3em] uppercase font-['Rajdhani'] animate-pulse">
        &lt; GLOBAL DATA RING DETECTED /&gt;
      </p>
    </div>
  </Section>
);

// --- GENERIC CONTENT ---
const StandardContent = ({ title, subtitle, color, align }) => (
  <Section align={align}>
    <div className={`w-[40%] p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl text-white ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <h2 className={`text-5xl font-bold mb-2 ${color} font-['Orbitron']`}>{title}</h2>
      <h3 className="text-xl font-mono text-gray-400 mb-6 tracking-widest uppercase font-['Rajdhani']">{subtitle}</h3>
      <p className="text-lg leading-relaxed text-gray-200 font-['Rajdhani']">
        Context about {title} goes here.
      </p>
    </div>
  </Section>
);

// --- 3D SCENE ---

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

// REMOVED BlackHole3D component

const ContentPlanets = () => {
  const { viewport } = useThree();
  const scroll = useScroll(); 
  const groupRef = useRef();
  
  const xOffset = viewport.width / 10; 

  const planets = useMemo(() => [
    { name: "Mercury", scale: 54, position: [xOffset, -viewport.height * 1, 0] },
    { name: "Venus",   scale: 35, position: [-xOffset, -viewport.height * 2, 0] },
    // EARTH PROPORTIONS FIXED: 1.5 Scale (Big), Centered X, Lowered Y
    { name: "Earth",   scale: 0.45, position: [0, -viewport.height * 3, 0] }, 
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
          {/* RENDER THE PLANET */}
          <Planet 
            name={p.name} 
            scale={p.scale} 
            rotationSpeed={0.01} 
            // Removed blackHolePosRef prop
          />
          <pointLight distance={10} intensity={4} color="white" />

          {/* IF EARTH: RENDER THE DATA RING AROUND IT */}
          {p.name === 'Earth' && (
            <DataRing />
          )}
        </group>
      ))}
    </group>
  );
};

function App() {
  // Removed blackHolePosRef

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
            {/* Removed BlackHole3D */}
            
            <Scroll>
              <ContentPlanets />
            </Scroll>

            <Scroll html>
              <HeroSection />
              <AboutMeContent />
              <SkillsContent />
              
              {/* USE THE ORBITAL OVERLAY */}
              <ProjectsOverlay />
              
              <StandardContent title="EXPERIENCE & CERTIFICATION" subtitle="My Journey" align="right" color="text-red-400" />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;