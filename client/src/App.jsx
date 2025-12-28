import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Html, Billboard, Text, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useForm, ValidationError } from '@formspree/react';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Typewriter from './components/Typewriter';

// --- DATA: PROJECTS (Shared between 3D and Mobile HTML) ---
const PROJECT_DATA = [
  {
    title: "Vigilens",
    desc: "A comprehensive automated surveillance system designed to enhance security through intelligent monitoring. It utilizes custom AI models built with YOLOv11 to detect anomalies and track objects in real-time, significantly reducing manual oversight. ",
    tech: ["Python", "React", "YOLOv11", "MySQL"],
    link: "https://github.com/Ennsss"
  },
  {
    title: "Scraping Crusaders",
    desc: "An advanced web scraping and analysis tool designed to extract meaningful data from diverse online sources. Built using Flask and MongoDB, it aggregates raw data and employs the Gemini API to perform sentiment analysis, turning scattered information into actionable business insights.",
    tech: ["Flask", "MongoDB", "Gemini API"],
    link: "https://github.com/Ennsss"
  },
  {
    title: "AI Sentiment Analysis",
    desc: "A data-driven recommendation engine focused on optimizing customer support processes. By analyzing large volumes of feedback using Python and TensorFlow, the system categorizes sentiment and suggests tailored responses for complaint resolution.",
    tech: ["Python", "React", "MySQL", "TensorFlow"],
    link: "https://github.com/Ennsss"
  },
  {
    title: "Solaris Web",
    desc: "An immersive 3D portfolio website that showcases the potential of modern interactive web design. Developed with React and Tailwind CSS, it features a physics-based solar system environment powered by Three.js (R3F).",
    tech: ["React", "Tailwind CSS", "Three.js"],
    link: "https://github.com/Ennsss"
  },
];

// --- 1. SOUND CONTROLLER ---
const SoundController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/sounds/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.error("Playback failed:", e));
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={toggleSound}
        className="p-3 bg-zinc-900/80 backdrop-blur-md border border-white/20 rounded-full hover:bg-zinc-800 hover:border-yellow-400 transition-all duration-300 group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H6.31c-.95 0-1.838-.616-2.106-1.503a9.01 9.01 0 01-.194-2.117c.05-.72.23-1.408.528-2.036.319-.675 1.054-1.042 1.782-1.042h2.09z" /></svg>
        )}
      </button>
    </div>
  );
};

// --- HTML SECTIONS HELPER ---
const Section = ({ align = 'left', justify = 'center', children }) => (
  <div className={`h-screen w-screen flex flex-col px-6 md:px-20 relative pointer-events-none ${align === 'right' ? 'items-center md:items-end' :
    align === 'left' ? 'items-center md:items-start' : 'items-center'
    } ${justify === 'center' ? 'justify-center' :
      justify === 'start' ? 'justify-start' : 'justify-end'
    }`}>
    <div className="pointer-events-auto w-full md:w-auto">
      {children}
    </div>
  </div>
);

// --- HERO SECTION ---
const HeroSection = () => {
  const [typingDone, setTypingDone] = useState(false);
  return (
    <Section align="left" justify="center">
      <div className="z-10 select-none mt-[-10vh] text-center md:text-left">
        <div className={`transition-opacity duration-1000 ${typingDone ? 'opacity-100' : 'opacity-0'} animate-bounce text-yellow-400 mb-4 opacity-80`}>
          <p className="text-xs mb-1 tracking-widest font-['Orbitron']">SCROLL TO ENTER</p>
          <span className="text-xl">▼</span>
        </div>
        <div className="mb-4 min-h-[3rem]">
          <div className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter font-['Orbitron']">
            <Typewriter text="Frederick Ian Aranico" delay={100} infinite={true} onComplete={() => setTypingDone(true)} />
          </div>
        </div>
        <div className={`transition-opacity duration-1000 ${typingDone ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-300 font-light tracking-widest uppercase text-lg border-l-2 border-yellow-400 pl-4 font-['Rajdhani'] inline-block md:block">Full Stack Developer</p>
        </div>
      </div>
    </Section>
  );
};

// --- ABOUT ME SECTION ---
const AboutMeContent = () => {
  // Simple Icons as components for reusability in this section
  const IconPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );

  const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const IconAcademic = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.813m-15.482 0A50.55 50.55 0 0112 13.489a50.55 50.55 0 016.744-3.342M14.25 14.25h-4.5v4.5h4.5v-4.5z" />
    </svg>
  );

  const IconCode = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );

  const SocialButton = ({ href, label, iconPath, download }) => (
    <a href={href} target={download ? "_self" : "_blank"} rel="noopener noreferrer" download={download} className="flex items-center gap-3 px-6 py-3 border border-white/10 bg-zinc-900/50 rounded hover:bg-zinc-800 hover:border-yellow-400 transition-all group">
      <svg className="w-5 h-5 fill-current text-white group-hover:text-yellow-400 transition-colors" viewBox="0 0 24 24">
        {iconPath}
      </svg>
      <span className="font-['Orbitron'] text-sm tracking-widest text-white group-hover:text-yellow-400 transition-colors">{label}</span>
    </a>
  );

  return (
    <Section align="left">
      <div className="w-full md:w-[90%] lg:w-[80%] text-white mt-[-2rem] md:mt-[-5rem] z-10 flex flex-col items-start">

        {/* Header Section */}
        <div className="mb-8">
          <h4 className="text-yellow-400 font-['Orbitron'] tracking-[0.2em] text-sm mb-2 border-b border-yellow-400/30 inline-block pb-1">ABOUT_ME</h4>
          <h1 className="text-5xl md:text-7xl font-black font-['Orbitron'] leading-none mb-2">HELLO.</h1>
          <h2 className="text-2xl md:text-4xl text-gray-400 font-['Orbitron'] uppercase">
            I AM <span className="text-white">FREDERICK IAN ARANICO</span>
          </h2>
        </div>

        {/* Bio Text */}
        <div className="mb-8 border-l-2 border-yellow-400 pl-6">
          <p className="text-gray-300 font-['Rajdhani'] text-lg md:text-xl leading-relaxed md:max-w-2xl">
            I am a <span className="text-white font-bold">passionate AI and Fullstack Engineer</span> with deep knowledge in AI development.
            Majority of my projects are done solo, allowing me to master modern web development, AI development, and AI automation.
            I dabble a lot in exploring new technologies and frameworks, never staying stagnant.
          </p>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
          {/* Location */}
          <div className="bg-zinc-900/50 border border-white/10 p-4 rounded flex items-center gap-4 hover:border-yellow-400 transition-colors group">
            <div className="p-3 rounded-full bg-white/5 text-yellow-400 group-hover:text-white transition-colors">
              <IconPin />
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-gray-500 font-['Orbitron'] uppercase">BASE OF OPERATIONS</div>
              <div className="text-xl font-bold font-['Rajdhani']">Taguig, PH</div>
              <div className="text-xs text-gray-400 font-['Rajdhani']">Metro Manila</div>
            </div>
          </div>

          {/* Timezone */}
          <div className="bg-zinc-900/50 border border-white/10 p-4 rounded flex items-center gap-4 hover:border-yellow-400 transition-colors group">
            <div className="p-3 rounded-full bg-white/5 text-yellow-400 group-hover:text-white transition-colors">
              <IconClock />
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-gray-500 font-['Orbitron'] uppercase">TIMEZONE</div>
              <div className="text-xl font-bold font-['Rajdhani']">GMT +8</div>
              <div className="text-xs text-gray-400 font-['Rajdhani']">Philippine Standard Time</div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-zinc-900/50 border border-white/10 p-4 rounded flex items-center gap-4 hover:border-yellow-400 transition-colors group">
            <div className="p-3 rounded-full bg-white/5 text-yellow-400 group-hover:text-white transition-colors">
              <IconAcademic />
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-gray-500 font-['Orbitron'] uppercase">STATUS</div>
              <div className="text-xl font-bold font-['Rajdhani']">Student</div>
              <div className="text-xs text-gray-400 font-['Rajdhani']">Saint Louis University</div>
            </div>
          </div>

          {/* Focus */}
          <div className="bg-zinc-900/50 border border-white/10 p-4 rounded flex items-center gap-4 hover:border-yellow-400 transition-colors group">
            <div className="p-3 rounded-full bg-white/5 text-yellow-400 group-hover:text-white transition-colors">
              <IconCode />
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-gray-500 font-['Orbitron'] uppercase">FOCUS</div>
              <div className="text-xl font-bold font-['Rajdhani']">AI & Full Stack</div>
              <div className="text-xs text-gray-400 font-['Rajdhani']">Jack of All Trades</div>
            </div>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-wrap gap-4">
          <SocialButton
            href="/resume.pdf"
            download="Frederick_Aranico_Resume.pdf"
            label="RESUME"
            iconPath={<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />}
          />
          <SocialButton
            href="https://github.com/Ennsss"
            label="GITHUB"
            iconPath={<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />}
          />
          <SocialButton
            href="https://www.linkedin.com/in/frederickaranico/"
            label="LINKEDIN"
            iconPath={<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
          />
        </div>

      </div>
    </Section>
  );
};

// --- SKILLS SECTION (Mobile Responsive) ---
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
// --- SCANNING SATELLITE (3D) ---
const ScanningSatellite = ({ position, rotation, project, setFocusTarget }) => {
  const [hovered, setHover] = useState(false);
  const scanBarRef = useRef();

  useFrame((state) => {
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
  const fontTitle = "/fonts/Orbitron-Bold.ttf";
  const fontBody = "/fonts/Rajdhani-Medium.ttf";

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHover(true);
    const worldPos = new THREE.Vector3();
    e.object.getWorldPosition(worldPos);
    setFocusTarget && setFocusTarget(worldPos);
  };

  return (
    <group position={position} rotation={rotation}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <group onPointerOver={handlePointerOver} onPointerOut={() => setHover(false)} onClick={() => window.open(project.link, '_blank')} scale={hovered ? 1.05 : 1}>
          <RoundedBox args={[bodyW, bodyH, bodyD]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial color={hovered ? "#0f172a" : "#000000"} roughness={0.2} metalness={0.8} transmission={0.5} transparent opacity={0.8} thickness={0.5} />
          </RoundedBox>
          <mesh ref={scanBarRef} position={[0, 0, bodyD / 2 + 0.05]} visible={false}>
            <boxGeometry args={[bodyW + 0.2, 0.05, 0.05]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <group position={[0, 0, bodyD / 2 + 0.02]}>
            <Text position={[-bodyW / 2 + 0.2, 1, 0]} fontSize={0.32} color="#38bdf8" anchorX="middle" anchorY="left" font={fontTitle}>{project.title.toUpperCase()}</Text>
            <Text position={[-bodyW / 2 + 0.5, 0.25, 0]} fontSize={0.2} color="#cbd5e1" anchorX="left" anchorY="middle" maxWidth={bodyW - 0.8} lineHeight={1.4} font={fontBody}>{project.desc}</Text>
            <Text position={[-bodyW / 2 + 0.3, -bodyH / 2 + 0.3, 0]} fontSize={0.25} color="#facc15" anchorX="left" anchorY="bottom" font={fontTitle}>CLICK TO VIEW →</Text>
          </group>
        </group>
      </Billboard>
    </group>
  );
};

const DataRing = () => {
  const groupRef = useRef();
  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += 0.002; });
  const radius = 8;

  return (
    <group ref={groupRef} rotation={[-0, 20, -10]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
      {PROJECT_DATA.map((proj, i) => {
        const angle = (i / PROJECT_DATA.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return <ScanningSatellite key={i} position={[x, 0, z]} project={proj} />;
      })}
    </group>
  );
};

// --- PROJECTS OVERLAY (Planet Left / List Right V2) ---
const ProjectsOverlay = () => {
  // Colors for the project list accents, matching the reference vibe
  const accents = [
    { border: 'border-yellow-400', text: 'text-yellow-400', bg: 'hover:bg-yellow-400/10' },
    { border: 'border-red-400', text: 'text-red-400', bg: 'hover:bg-red-400/10' },
    { border: 'border-blue-400', text: 'text-blue-400', bg: 'hover:bg-blue-400/10' },
    { border: 'border-green-400', text: 'text-green-400', bg: 'hover:bg-green-400/10' },
  ];

  return (
    <Section align="left">
      <div className="w-[100%] ml-auto flex flex-col items-start z-10 pointer-events-none pl-10">
        {/* Header */}
        <div className="mb-8 pl-4 border-l-2 border-white/20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-1 tracking-tighter font-['Orbitron']">PROJECTS</h2>
          <div className="flex items-center gap-3 text-cyan-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase font-['Rajdhani']">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            ARCHIVE STATUS: UNLOCKED
          </div>
        </div>

        {/* List Container */}
        <div className="w-full flex flex-col gap-4 pointer-events-auto pr-4 md:pr-0 pb-20 md:pb-0 overflow-y-auto max-h-[60vh] md:max-h-none scrollbar-hide">
          {PROJECT_DATA.map((project, idx) => {
            const accent = accents[idx % accents.length];
            return (
              <a key={idx} href={project.link} target="_blank" rel="noopener noreferrer" className={`group relative w-full p-6 transition-all duration-500 hover:translate-x-2 md:hover:-translate-x-2 cursor-pointer bg-zinc-900/40 backdrop-blur-sm border-r-0 md:border-r-[1px] border-white/5`}>
                {/* Hover Gradient & Border */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-white/5 -skew-x-12 border-l-4 ${accent.border} ${accent.bg} transition-colors duration-300 opacity-0 group-hover:opacity-100`}></div>

                {/* Static Border (Normal State) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-white/10 group-hover:opacity-0 transition-opacity`}></div>

                <div className="relative flex flex-col gap-2">
                  {/* Title Row */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-white/20 font-['Rajdhani'] font-bold text-lg">0{idx + 1} //</span>
                    <h3 className={`text-2xl md:text-3xl font-bold font-['Orbitron'] ${accent.text} group-hover:text-white transition-colors tracking-wide`}>
                      {project.title.toUpperCase()}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm font-['Rajdhani'] leading-relaxed max-w-xl group-hover:text-gray-300 transition-colors">
                    {project.desc}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className={`text-[10px] md:text-xs font-bold ${accent.text} font-['Orbitron'] tracking-wider group-hover:text-cyan-300 transition-colors`}>
                        • {t.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

// --- EXPERIENCE SECTION ---
const ExperienceContent = () => {
  const missions = [
    {
      id: "01",
      role: "Software Developer Intern",
      org: "LGU - Pasig City",
      date: "Jan 2023 - April 2023",
      desc: "Led a 4-member team to digitize incident reporting systems. Developed a normalized MySQL database and automated data migration using C#.",
      stats: ["C#", "MySQL", "Automation"],
      color: "text-blue-400", border: "border-blue-500", bg: "bg-blue-500/10"
    },
    {
      id: "02",
      role: "IT Specialist - Networking",
      org: "Certiport Certification",
      date: "May 2024",
      desc: "Validated proficiency in network fundamentals, protocols, and infrastructure management. Demonstrated technical competency in modern IT systems.",
      stats: ["Certified", "Networking"],
      color: "text-yellow-400", border: "border-yellow-500", bg: "bg-yellow-500/10"
    }
  ];

  return (
    <Section align="right">
      <div className="w-full md:w-[55%] ml-auto z-10 flex flex-col gap-6 md:gap-8 mr-0 md:mr-10">
        <div className="text-center md:text-right mb-2 md:mb-4">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter font-['Orbitron']">MISSION LOG</h2>
          <p className="text-red-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase font-['Rajdhani'] animate-pulse">&lt; CAREER TRAJECTORY &gt;</p>
        </div>
        <div className="flex flex-col gap-4 md:gap-6 pb-20 md:pb-0">
          {missions.map((mission) => (
            <div key={mission.id} className={`relative group p-5 md:p-6 bg-zinc-900/90 backdrop-blur-md border-r-4 ${mission.border} border-y border-l border-white/10 transition-all duration-300 md:hover:-translate-x-2 shadow-2xl`}>
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 border-b border-white/10 pb-4 gap-2">
                <div>
                  <h3 className={`text-xl md:text-2xl font-bold font-['Orbitron'] ${mission.color} mb-1`}>{mission.role}</h3>
                  <div className="flex items-center gap-2 text-white/60 font-mono text-sm"><span className="w-2 h-2 rounded-full bg-white/40"></span>{mission.org}</div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto flex justify-between md:block">
                  <span className="text-sm font-mono text-gray-400 bg-black/50 px-2 py-1 rounded inline-block">{mission.date}</span>
                  <span className="md:absolute top-4 right-4 text-4xl font-bold font-['Rajdhani'] text-white/5">{mission.id}</span>
                </div>
              </div>
              <p className="text-gray-300 font-['Rajdhani'] text-sm md:text-lg leading-relaxed mb-4 md:mb-6 text-justify">{mission.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {mission.stats.map((stat, i) => (<span key={i} className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold font-['Orbitron'] rounded-sm ${mission.bg} ${mission.color} border border-white/5`}>{stat}</span>))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// --- CONTACT SECTION ---
const ContactSection = () => {
  const [state, handleSubmit] = useForm("manrkbyr");

  return (
    <Section align="center" justify="center">
      <div className="z-10 w-full max-w-xl px-0 md:px-0 mt-[-2rem] md:mt-[-5rem]">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter font-['Orbitron']">
            CONTACT ME
          </h2>
          <p className="text-green-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase font-['Rajdhani'] animate-pulse">
            &lt; OPEN FREQUENCY /&gt;
          </p>
        </div>

        {/* Success Message */}
        {state.succeeded ? (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-6 rounded text-center backdrop-blur-md">
            <h3 className="text-2xl font-bold font-['Orbitron'] mb-2">TRANSMISSION RECEIVED</h3>
            <p className="font-['Rajdhani']">I will respond to your signal shortly.</p>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 bg-zinc-900/80 p-5 md:p-8 rounded-lg border border-white/10 backdrop-blur-md shadow-2xl relative mx-2 md:mx-0">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30"></div>

            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-yellow-400 font-['Orbitron'] text-[10px] md:text-xs tracking-widest">IDENTITY</label>
              <input id="name" type="text" name="name" placeholder="ENTER NAME" required className="bg-black/50 border border-white/20 p-2 md:p-3 text-white font-['Rajdhani'] focus:outline-none focus:border-yellow-400 transition-colors text-sm" />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-blue-400 font-['Orbitron'] text-[10px] md:text-xs tracking-widest">FREQUENCY (EMAIL)</label>
              <input id="email" type="email" name="email" placeholder="ENTER EMAIL" required className="bg-black/50 border border-white/20 p-2 md:p-3 text-white font-['Rajdhani'] focus:outline-none focus:border-blue-400 transition-colors text-sm" />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-green-400 font-['Orbitron'] text-[10px] md:text-xs tracking-widest">DATA PACKET</label>
              <textarea id="message" name="message" rows="3" placeholder="ENTER MESSAGE..." required className="bg-black/50 border border-white/20 p-2 md:p-3 text-white font-['Rajdhani'] focus:outline-none focus:border-green-400 transition-colors resize-none text-sm" />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs" />
            </div>

            <button type="submit" disabled={state.submitting} className="mt-2 md:mt-4 py-2 md:py-3 bg-white/10 border border-white/20 text-white font-bold font-['Orbitron'] tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden">
              <span className="relative z-10 text-sm md:text-base">{state.submitting ? 'SENDING...' : 'INITIATE UPLOAD'}</span>
              <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
            </button>
          </form>
        )}
      </div>
    </Section>
  );
};

// --- 3D SCENE & MAIN APP ---
const CameraRig = () => {
  const scroll = useScroll();
  useFrame((state) => {
    const scrollOffset = scroll.offset;
    const transitionPhase = THREE.MathUtils.clamp(scrollOffset * 3, 0, 1);
    const startPos = new THREE.Vector3(0, 20, 25);
    const endPos = new THREE.Vector3(0, 0, 20);
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
      <Planet name="Sun" scale={3} rotationSpeed={0.002} glowing={true} />
      <group>
        <Orbit radius={5} />   <Planet name="Mercury" scale={6} orbitRadius={5} orbitSpeed={1} glowing={true} />
        <Orbit radius={7} />   <Planet name="Venus" scale={9} orbitRadius={7} orbitSpeed={0.6} glowing={true} />
        <Orbit radius={10} />  <Planet name="Earth" scale={0.15} orbitRadius={10} orbitSpeed={0.4} glowing={true} />
        <Orbit radius={12.5} /> <Planet name="Mars" scale={6} orbitRadius={12.5} orbitSpeed={0.3} glowing={true} />
      </group>
    </group>
  );
};

// --- MODIFIED CONTENT PLANETS ---
const ContentPlanets = () => {
  const { viewport, size } = useThree(); // 'size' gives the canvas dimensions in pixels
  const scroll = useScroll();
  const groupRef = useRef();
  const xOffset = viewport.width / 10;

  // CHECK FOR MOBILE DEVICE (Width < 768px)
  const isMobile = size.width < 768;

  const clickSound = useMemo(() => new Audio('/assets/sounds/click.wav'), []);
  const playClick = () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.error(e));
  };

  const planets = useMemo(() => [
    { name: "Mercury", scale: 54, position: [xOffset, -viewport.height * 1, 0] },
    { name: "Venus", scale: 35, position: [-xOffset, -viewport.height * 2, 0] },
    { name: "Earth", scale: 0.45, position: [xOffset, -viewport.height * 3, 0] },
    { name: "Mars", scale: 34, position: [-xOffset, -viewport.height * 4, 0] },
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
          <Planet name={p.name} scale={p.scale} rotationSpeed={0.01} onPlanetClick={playClick} />
          <pointLight distance={10} intensity={4} color="white" />
          {/* DataRing removed as requested */}
        </group>
      ))}
    </group>
  );
};

function App() {
  return (
    <div className="fixed inset-0 bg-black">
      <SoundController />
      <Canvas shadows camera={{ position: [0, 20, 25], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} color="white" />
        <Suspense fallback={null}>
          <Starfield />
          <ScrollControls pages={6} damping={0.3}>
            <CameraRig />
            <HeroSolarSystem />
            <Scroll>
              <ContentPlanets />
            </Scroll>
            <Scroll html>
              <div style={{ position: 'absolute', top: '0vh', width: '100vw' }}> <HeroSection /> </div>
              <div style={{ position: 'absolute', top: '100vh', width: '100vw' }}> <AboutMeContent /> </div>
              <div style={{ position: 'absolute', top: '200vh', width: '100vw' }}> <SkillsContent /> </div>
              <div style={{ position: 'absolute', top: '300vh', width: '100vw' }}> <ProjectsOverlay /> </div>
              <div style={{ position: 'absolute', top: '400vh', width: '100vw' }}> <ExperienceContent /> </div>
              <div style={{ position: 'absolute', top: '500vh', width: '100vw' }}> <ContactSection /> </div>
            </Scroll>
          </ScrollControls>
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;