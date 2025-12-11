import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Typewriter from './components/Typewriter';

// --- HTML SECTIONS ---
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

// --- ABOUT ME SECTION ---
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

      {/* --- INTERACTIVE BUTTONS --- */}
      <div className="flex flex-wrap gap-8">
        
        {/* RESUME BUTTON */}
        <a 
          href="/resume.pdf" 
          download="Frederick_Aranico_Resume.pdf"
          className="group relative flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-black/50 border border-yellow-500/30 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] active:scale-95"
        >
          <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:3s] group-hover:[animation-duration:1s]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#EAB308] group-hover:bg-black transition-colors duration-300"></div>
          </div>
          <span className="relative z-10 font-bold tracking-widest text-sm text-yellow-100 transition-all duration-300 group-hover:text-black group-hover:tracking-[0.25em]">
            RESUME
          </span>
        </a>

        {/* GITHUB BUTTON */}
        <a 
          href="https://github.com/Ennsss" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-black/50 border border-white/30 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:scale-95"
        >
          <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:4s] group-hover:[animation-duration:1.5s]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] group-hover:bg-black transition-colors duration-300"></div>
          </div>
          <span className="relative z-10 font-bold tracking-widest text-sm text-gray-200 transition-all duration-300 group-hover:text-black group-hover:tracking-[0.25em]">
            GITHUB
          </span>
        </a>

        {/* LINKEDIN BUTTON */}
        <a 
          href="https://www.linkedin.com/in/frederickaranico/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-black/50 border border-blue-400/50 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(96,165,250,0.6)] active:scale-95"
        >
          <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:5s] group-hover:[animation-duration:2s]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22D3EE] group-hover:bg-white transition-colors duration-300"></div>
          </div>
          <span className="relative z-10 font-bold tracking-widest text-sm text-cyan-100 transition-all duration-300 group-hover:text-white group-hover:tracking-[0.25em]">
            LINKEDIN
          </span>
        </a>

      </div>

    </div>
  </Section>
);

// --- SKILLS SECTION (UPDATED: Left Aligned) ---
// In client/src/App.jsx

const SkillsContent = () => {
  const skillGroups = [
    {
      category: "LANGUAGES",
      color: "text-yellow-400",
      accent: "border-yellow-400",
      bgHover: "hover:bg-yellow-400/10",
      skills: ["Python", "JavaScript", "C#", "C++", "Java", "HTML/CSS"]
    },
    {
      category: "AI & DATA",
      color: "text-red-400",
      accent: "border-red-400",
      bgHover: "hover:bg-red-400/10",
      skills: ["TensorFlow", "YOLOv11", "Gemini API", "Pandas", "OpenCV"]
    },
    {
      category: "FRAMEWORKS",
      color: "text-blue-400",
      accent: "border-blue-400",
      bgHover: "hover:bg-blue-400/10",
      skills: ["React", "Node.js", "Flask", "Django", "ASP.NET"]
    },
    {
      category: "TOOLS & DB",
      color: "text-green-400",
      accent: "border-green-400",
      bgHover: "hover:bg-green-400/10",
      skills: ["MySQL", "MongoDB", "AWS", "Git", "Postman"]
    }
  ];

  return (
    // Align LEFT to keep text away from the Black Hole on the right
    <Section align="right">
      <div className="w-[75%] ml-auto flex flex-col items-start z-20 pointer-events-none pl-10">
        
        {/* --- HEADER --- */}
        <div className="mb-10 pl-4 border-l-2 border-white/20">
          <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">
            ARSENAL
          </h2>
          <div className="flex items-center gap-3 text-gray-400 font-mono text-sm tracking-[0.3em] uppercase">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             System Status: Online
          </div>
        </div>

        {/* --- HOLOGRAPHIC MODULES --- */}
        <div className="w-full flex flex-col gap-6 pointer-events-auto">
          {skillGroups.map((group, idx) => (
            <div 
              key={idx} 
              className={`group relative w-full p-6 transition-all duration-500 hover:translate-x-4`}
            >
              {/* GLASS BACKGROUND (Fades to right) */}
              <div className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent -skew-x-12 border-l-4 ${group.accent} ${group.bgHover} transition-colors duration-300`}></div>
              
              {/* CONTENT */}
              <div className="relative flex flex-col gap-3">
                {/* Category Header */}
                <h4 className={`text-2xl font-bold font-mono ${group.color} flex items-center gap-3 tracking-widest`}>
                  <span className="text-sm opacity-50">0{idx + 1} //</span> {group.category}
                </h4>
                
                {/* Skill List (Terminal Style) */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 ml-10">
                  {group.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="group/skill flex items-center gap-2">
                      <span className={`w-1 h-1 rounded-full bg-white/30 group-hover/skill:bg-white transition-colors`}></span>
                      <span className="text-gray-300 font-mono text-sm group-hover/skill:text-white group-hover/skill:shadow-[0_0_10px_white] transition-all cursor-default">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DECORATIVE CORNER (Top Right) */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

      </div>
    </Section>
  );
};
// --- GENERIC CONTENT SECTION ---
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

// --- 3D SCENE COMPONENTS ---

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

// --- UPDATED BLACK HOLE COMPONENT ---
// In client/src/App.jsx

const BlackHole3D = () => {
  const scroll = useScroll();
  const bhRef = useRef();
  
  // Interaction States
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false); // True when clicked

  // Audio for the "Warp" effect
  const clickSound = useMemo(() => new Audio('/assets/sounds/click.wav'), []);

  useFrame((state) => {
    if (bhRef.current) {
      // 1. ROTATION LOGIC
      // Normal: 0.005 | Hover: 0.05 (Fast) | Active: 0.2 (Warp Speed)
      const targetSpeed = active ? 0.2 : (hovered ? 0.05 : 0.005);
      bhRef.current.rotation.y += targetSpeed;
      
      // 2. SCROLL VISIBILITY LOGIC
      const start = 0.3; 
      const end = 0.65; 
      const offset = scroll.offset;
      const isVisibleSection = offset > start && offset < end;

      // 3. SCALE LOGIC (The "Pulse" & "Consume" Effect)
      let targetScale = 0;
      
      if (active) {
        targetScale = 50; // CONSUME SCREEN: Grow massive to fill view
      } else if (isVisibleSection) {
        // UPDATED SCALES HERE:
        targetScale = hovered ? 0.2 : 0.15; // Base 0.15, Pulse to 0.2
      }

      // Smoothly animate scale
      const currentScale = bhRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      bhRef.current.scale.set(newScale, newScale, newScale);

      // 4. MOUSE PARALLAX (Follow the mouse slightly)
      if (isVisibleSection && !active) {
        const { x, y } = state.pointer;
        // Base X is 6. Move it slightly based on mouse X/Y
        const targetX = 6 + (x * 1); 
        const targetY = (y * 1);
        
        bhRef.current.position.x = THREE.MathUtils.lerp(bhRef.current.position.x, targetX, 0.05);
        bhRef.current.position.y = THREE.MathUtils.lerp(bhRef.current.position.y, targetY, 0.05);
      }
    }
  });

  const handleInteract = () => {
    if (!active) {
      clickSound.volume = 0.5;
      clickSound.currentTime = 0;
      clickSound.play();
      
      setActive(true);

      // Reset after 2 seconds (Warp complete)
      setTimeout(() => {
        setActive(false);
      }, 2000);
    }
  };

  return (
    <group 
      ref={bhRef} 
      position={[6, 0, 0]} 
      scale={[0,0,0]}
      onClick={handleInteract}
      onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
    >
      <Planet name="BlackHole" scale={1} /> 
      
      {/* Core Purple Light */}
      <pointLight color="#a855f7" distance={20} intensity={5} />
      
      {/* Extra "Energy" Light that appears only on hover */}
      <pointLight 
        color="#ffffff" 
        distance={10} 
        intensity={hovered ? 3 : 0} 
        transition="intensity 0.5s"
      />
    </group>
  );
};

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
            <BlackHole3D />
            
            <Scroll>
              <ContentPlanets />
            </Scroll>

            <Scroll html>
              <HeroSection />
              <AboutMeContent />
              <SkillsContent />
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