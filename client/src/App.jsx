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

// --- ABOUT ME SECTION ---
const AboutMeContent = () => (
  <Section align="left">
    <div className="w-[45%] text-white mt-[-5rem] z-10">
      <div className="relative mb-8 group">
        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 via-transparent to-red-400 rounded-full opacity-50 blur-sm animate-spin [animation-duration:3s] group-hover:opacity-80 transition duration-500"></div>
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
      {/* Social Buttons */}
      <div className="flex flex-wrap gap-8">
        <a href="/resume.pdf" download="Frederick_Aranico_Resume.pdf" className="group relative flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-black/50 border border-yellow-500/30 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] active:scale-95">
          <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          <span className="relative z-10 font-bold tracking-widest text-sm text-yellow-100 transition-all duration-300 group-hover:text-black group-hover:tracking-[0.25em] font-['Orbitron']">RESUME</span>
        </a>
        <a href="https://github.com/Ennsss" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-black/50 border border-white/30 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:scale-95">
          <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          <span className="relative z-10 font-bold tracking-widest text-sm text-gray-200 transition-all duration-300 group-hover:text-black group-hover:tracking-[0.25em] font-['Orbitron']">GITHUB</span>
        </a>
        <a href="https://www.linkedin.com/in/frederickaranico/" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-black/50 border border-blue-400/50 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(96,165,250,0.6)] active:scale-95">
          <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          <span className="relative z-10 font-bold tracking-widest text-sm text-cyan-100 transition-all duration-300 group-hover:text-white group-hover:tracking-[0.25em] font-['Orbitron']">LINKEDIN</span>
        </a>
      </div>
    </div>
  </Section>
);

// --- SKILLS SECTION ---
const SkillsContent = () => {
  const skillGroups = [
    { category: "LANGUAGES", color: "text-yellow-400", accent: "border-yellow-400", bgHover: "hover:bg-yellow-400/10", skills: ["Python", "JavaScript", "C#", "C++", "Java", "HTML/CSS"] },
    { category: "AI & DATA", color: "text-red-400", accent: "border-red-400", bgHover: "hover:bg-red-400/10", skills: ["TensorFlow", "YOLOv11", "Gemini API", "Pandas", "OpenCV"] },
    { category: "FRAMEWORKS", color: "text-blue-400", accent: "border-blue-400", bgHover: "hover:bg-blue-400/10", skills: ["React", "Node.js", "Flask", "Django", "ASP.NET"] },
    { category: "TOOLS & DB", color: "text-green-400", accent: "border-green-400", bgHover: "hover:bg-green-400/10", skills: ["MySQL", "MongoDB", "AWS", "Git", "Postman"] }
  ];

  return (
    <Section align="right">
      <div className="w-[100%] ml-auto flex flex-col items-start z-10 pointer-events-none pl-10">
        <div className="mb-10 pl-4 border-l-2 border-white/20">
          <h2 className="text-6xl font-black text-white mb-2 tracking-tighter font-['Orbitron']">ARSENAL</h2>
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
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
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

  const radius = 6; 

  return (
    <group ref={groupRef} rotation={[0.5, 0, 0]}> {/* Tilted Ring to match screenshot */}
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
            project={proj}
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
        ORBITAL NETWORK
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

// --- 3D SCENE & BLACK HOLE ---

const CameraRig = () => {
  const scroll = useScroll();
  useFrame((state) => {
    const scrollOffset = scroll.offset; 
    const transitionPhase = THREE.MathUtils.clamp(scrollOffset * 3, 0, 1);
    const startPos = new THREE.Vector3(0, 20, 25);
    const endPos = new THREE.Vector3(0, 6, 20); 
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

const BlackHole3D = ({ sharedPosRef }) => {
  const scroll = useScroll();
  const bhRef = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const clickSound = useMemo(() => new Audio('/assets/sounds/click.wav'), []);

  useEffect(() => {
    if (sharedPosRef && bhRef.current) {
      sharedPosRef.current.set(3, 0, 0);
    }
  }, [sharedPosRef]);

  useFrame(() => {
    if (bhRef.current) {
      const targetSpeed = active ? 0.2 : (hovered ? 0.05 : 0.005);
      bhRef.current.rotation.y += targetSpeed;
      
      const start = 0.3; 
      const end = 0.64; 
      const offset = scroll.offset;
      const isVisibleSection = offset > start && offset < end;
      
      let targetScale = 0;
      if (active) {
        targetScale = 50; 
      } else if (isVisibleSection) {
        targetScale = hovered ? 0.2 : 0.15;
      }
      
      const currentScale = bhRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      bhRef.current.scale.set(newScale, newScale, newScale);

      if (sharedPosRef) {
        if (isVisibleSection) {
            sharedPosRef.current.set(3, 0, 0); 
        } else {
            sharedPosRef.current.set(1000, 1000, 1000); 
        }
      }
    }
  });

  const handleInteract = () => {
    if (!active) {
      clickSound.volume = 0.5;
      clickSound.currentTime = 0;
      clickSound.play();
      setActive(true);
      setTimeout(() => setActive(false), 2000);
    }
  };

  return (
    <group 
      ref={bhRef} 
      position={[3, 0, 0]}
      scale={[0,0,0]}
      onClick={handleInteract}
      onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
    >
      <Planet name="BlackHole" scale={1} /> 
      <pointLight color="#a855f7" distance={20} intensity={5} />
      <pointLight color="#ffffff" distance={10} intensity={hovered ? 3 : 0} transition="intensity 0.5s"/>
    </group>
  );
};

const ContentPlanets = ({ blackHolePosRef }) => {
  const { viewport } = useThree();
  const scroll = useScroll(); 
  const groupRef = useRef();
  
  const xOffset = viewport.width / 10; 

  const planets = useMemo(() => [
    { name: "Mercury", scale: 54, position: [xOffset, -viewport.height * 1, 0] },
    { name: "Venus",   scale: 35, position: [-xOffset, -viewport.height * 2, 0] },
    // EARTH PROPORTIONS FIXED: 1.5 Scale (Big), Centered X, Lowered Y
    { name: "Earth",   scale: 0.35, position: [0, -viewport.height * 3, 0] }, 
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
            blackHolePosRef={blackHolePosRef} 
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
  const blackHolePosRef = useRef(new THREE.Vector3(1000, 1000, 1000));

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
            <BlackHole3D sharedPosRef={blackHolePosRef} />
            
            <Scroll>
              <ContentPlanets blackHolePosRef={blackHolePosRef} />
            </Scroll>

            <Scroll html>
              <HeroSection />
              <AboutMeContent />
      
              
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