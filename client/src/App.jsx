import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Html, Billboard, Text, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing'; // IMPORT BLOOM
import * as THREE from 'three';
import { useForm, ValidationError } from '@formspree/react';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Typewriter from './components/Typewriter';

// --- 1. SOUND CONTROLLER (Button for Mute/Unmute/Start) ---
const SoundController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/sounds/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.log("Autoplay blocked. User must interact to play.");
          setIsPlaying(false);
        });
    }
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
        title={isPlaying ? "Mute Sound" : "Start Sound"}
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
// --- HTML SECTIONS HELPER (Updated for Mobile) ---
const Section = ({ align = 'left', justify = 'center', children }) => (
  <div className={`h-screen w-screen flex flex-col px-6 md:px-20 relative pointer-events-none ${
    // On mobile, we align items to center. On desktop, we respect the 'align' prop.
    align === 'right' ? 'items-center md:items-end' : 
    align === 'left' ? 'items-center md:items-start' : 'items-center'
  } ${
    justify === 'center' ? 'justify-center' : 
    justify === 'start' ? 'justify-start' : 'justify-end'
  }`}>
    {/* Ensure the inner container takes full width on mobile but auto width on desktop */}
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
      <div className="z-10 select-none mt-[-10vh]"> 
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
          <p className="text-gray-300 font-light tracking-widest uppercase text-lg border-l-2 border-yellow-400 pl-4 font-['Rajdhani']">Full Stack Developer</p>
        </div>
      </div>
    </Section>
  );
};

// --- ABOUT ME SECTION ---
// --- ABOUT ME SECTION (Mobile Responsive) ---
const AboutMeContent = () => {
  const ChipButton = ({ href, download, color, label, logo, index, accentColor }) => (
    <a href={href} download={download} target={download ? "_self" : "_blank"} rel="noopener noreferrer" className="group relative w-fit h-[50px] bg-zinc-900/80 -skew-x-12 border-l-4 border-white/20 flex items-center pr-6 pl-4 transition-all duration-300 hover:bg-zinc-800 hover:border-yellow-400 hover:skew-x-0 hover:translate-x-2">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} transition-all duration-300 group-hover:w-2 group-hover:shadow-[0_0_15px_currentColor]`}></div>
      <div className="flex items-center gap-6"> 
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 flex items-center justify-center bg-black/50 rounded p-1 border border-white/5">
             <img src={logo} alt={label} className={`w-full h-full object-contain ${label === 'GITHUB' ? 'invert' : ''} opacity-70 group-hover:opacity-100 transition-opacity`} />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold font-['Orbitron'] tracking-widest ${color} group-hover:brightness-125 transition-all`}>{label}</span>
            <span className="text-[9px] font-mono text-gray-500 group-hover:text-green-400 transition-colors">
              <span className="group-hover:hidden">/// READY</span>
              <span className="hidden group-hover:inline animate-pulse">● CONNECTED</span>
            </span>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[2rem] leading-none font-bold font-['Rajdhani'] text-white/5 group-hover:text-white/10 transition-colors">0{index}</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
    </a>
  );

  return (
    <Section align="left">
      <div className="w-full md:w-[50%] lg:w-[45%] text-white mt-0 md:mt-[-5rem] z-10 flex flex-col items-center md:items-start">
        <div className="relative mb-6 md:mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-30 blur-md group-hover:opacity-70 transition duration-500"></div>    
          <img 
            src="/assets/images/me.jpg" 
            alt="Frederick Ian Aranico" 
            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-yellow-100/50 object-cover shadow-2xl" 
          />
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 font-['Orbitron'] tracking-wide text-center md:text-left">
          ABOUT ME
        </h3>
        <p 
          className="text-sm md:text-xl leading-relaxed text-gray-300 mb-6 md:mb-8 font-['Rajdhani'] text-center md:text-justify"
        >
         Hi! I’m Frederick Ian Aranico, a Computer Science student and aspiring AI engineer with a strong focus on building practical, data-driven, and AI-powered applications. I enjoy working across the full stack—developing backend systems, crafting intuitive interfaces, and integrating machine learning models that solve real-world problems.
        </p>
        <div className="flex flex-row flex-wrap gap-3 justify-center md:justify-start">
          <ChipButton href="/resume.pdf" download={true} label="RESUME" color="text-yellow-400" accentColor="bg-yellow-400" logo="/assets/logos/resume.png" index={1} />
          <ChipButton href="https://github.com/Ennsss" label="GITHUB" color="text-gray-200" accentColor="bg-white" logo="/assets/logos/github.png" index={2} />
          <ChipButton href="https://www.linkedin.com/in/frederickaranico/" label="LINKEDIN" color="text-blue-400" accentColor="bg-blue-500" logo="/assets/logos/linkedin.jpg" index={3} />
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

// --- SCANNING SATELLITE ---
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
    setFocusTarget(worldPos);
  };
  const handlePointerOut = () => {
    setHover(false);
    setFocusTarget(null);
  };

  return (
    <group position={position} rotation={rotation}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <group onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={() => window.open(project.link, '_blank')} scale={hovered ? 1.05 : 1}>
          <RoundedBox args={[bodyW, bodyH, bodyD]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial color={hovered ? "#0f172a" : "#000000"} roughness={0.2} metalness={0.8} transmission={0.5} transparent={true} opacity={0.8} thickness={0.5} />
          </RoundedBox>
          <mesh ref={scanBarRef} position={[0, 0, bodyD/2 + 0.05]} visible={false}>
             <boxGeometry args={[bodyW + 0.2, 0.05, 0.05]} />
             <meshBasicMaterial color="#00ffff" />
             <pointLight color="#00ffff" intensity={2} distance={2} />
          </mesh>
          <group position={[0, 0, bodyD/2 + 0.02]}>
            <mesh position={[bodyW/2 - 0.4, bodyH/2 - 0.3, 0]}><circleGeometry args={[0.08]} /><meshBasicMaterial color={hovered ? "#22c55e" : "#555"} /></mesh>
            <Text position={[bodyW/2 - 0.7, bodyH/2 - 0.3, 0]} fontSize={0.15} color="#22c55e" anchorX="right" anchorY="middle" font={fontBody}>LIVE</Text>
            <Text position={[-bodyW/2 + 0.2, 1, 0]} fontSize={0.32} color="#38bdf8" anchorX="middle" anchorY="left" font={fontTitle}>{project.title.toUpperCase()}</Text>
            <Text position={[-bodyW/2 + 0.5, 0.25, 0]} fontSize={0.2} color="#cbd5e1" anchorX="left" anchorY="middle" maxWidth={bodyW - 0.8} lineHeight={1.4} font={fontBody}>{project.desc}</Text>
            {project.tech && project.tech.map((tech, i) => (
              <group key={i} position={[-bodyW/2 + 0.8 + (i * 1.3), -0.5, 0]}>
                 <mesh><planeGeometry args={[2.5, 0.5]} /><meshBasicMaterial color="#020617" transparent opacity={0.9} /></mesh>
                 <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.35)]} /><lineBasicMaterial color="#38bdf8" /></lineSegments>
                 <Text position={[0,0,0.01]} fontSize={0.20} color="#23d400ff" font={fontBody}>{tech}</Text>
              </group>
            ))}
            <Text position={[-bodyW/2 + 0.3, -bodyH/2 + 0.3, 0]} fontSize={0.25} color="#facc15" anchorX="left" anchorY="bottom" font={fontTitle}>INITIALIZE →</Text>
             <mesh position={[0, -bodyH/2 + 0.25, 0]}><planeGeometry args={[bodyW - 0.6, 0.02]} /><meshBasicMaterial color="#facc15" /></mesh>
          </group>
        </group>
      </Billboard>
    </group>
  );
};

const DataRing = () => {
  const groupRef = useRef();
  const projects = [
    { title: "Vigilens", desc: "Full-stack AI surveillance automating anomaly detection with multi-camera analysis.", tech: ["PYTHON", "YOLOv11", "REACT"], link: "https://github.com/Ennsss" },
    { title: "Solaris Web", desc: "Immersive 3D portfolio featuring reactive physics, orbital navigation, and 'scrollytelling'.", tech: ["REACT", "THREE.JS", "R3F"], link: "https://github.com/Ennsss" },
    { title: "Scraping Crusaders", desc: "AI-powered web scraper leveraging Gemini API for advanced sentiment classification.", tech: ["FLASK", "GEMINI API", "MONGODB"], link: "https://github.com/Ennsss" },
    { title: "Sentiment Analysis", desc: "Recommendation engine optimizing complaint resolution using NLP and secure user profiling.", tech: ["PYTHON", "TENSORFLOW", "MYSQL"], link: "https://github.com/Ennsss" },
  ];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });
  const radius = 8; 

  return (
    <group ref={groupRef} rotation={[-0, 20, -10]}> 
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
      {projects.map((proj, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return <ScanningSatellite key={i} position={[x, 0, z]} project={proj} />;
      })}
    </group>
  );
};

const ProjectsOverlay = () => (
  <Section align="center" justify="start">
    <div className="mt-10 text-center pointer-events-none z-10">
      <h2 className="text-6xl font-black text-cyan-400 mb-2 tracking-tighter font-['Orbitron'] drop-shadow-lg">PROJECTS</h2>
      <p className="text-white font-mono text-sm tracking-[0.3em] uppercase font-['Rajdhani'] animate-pulse">&lt; GLOBAL DATA RING DETECTED /&gt;</p>
    </div>
  </Section>
);

// --- EXPERIENCE SECTION ---
const ExperienceContent = () => {
  const missions = [
    {
      id: "01",
      role: "Software Developer Intern",
      org: "LGU - Pasig City",
      date: "Jan 2023 - April 2023",
      desc: "Led a 4-member team to digitize incident reporting systems. Developed a normalized MySQL database and automated data migration using C#.",
      stats: ["90% Faster Queries", "30% Faster Response"],
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
      <div className="w-[100%] md:w-[55%] ml-auto z-10 flex flex-col gap-8 mr-10">
        <div className="text-right mb-4">
          <h2 className="text-6xl font-black text-white mb-2 tracking-tighter font-['Orbitron']">MISSION LOG</h2>
          <p className="text-red-400 font-mono text-sm tracking-[0.3em] uppercase font-['Rajdhani'] animate-pulse">&lt; CAREER TRAJECTORY &gt;</p>
        </div>
        <div className="flex flex-col gap-6">
          {missions.map((mission) => (
            <div key={mission.id} className={`relative group p-6 bg-zinc-900/90 backdrop-blur-md border-r-4 ${mission.border} border-y border-l border-white/10 transition-all duration-300 hover:-translate-x-2 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className={`text-2xl font-bold font-['Orbitron'] ${mission.color} mb-1`}>{mission.role}</h3>
                  <div className="flex items-center gap-2 text-white/60 font-mono text-sm"><span className="w-2 h-2 rounded-full bg-white/40"></span>{mission.org}</div>
                </div>
                <div className="text-right">
                  <span className="block text-4xl font-bold font-['Rajdhani'] text-white/5 absolute top-4 right-4">{mission.id}</span>
                  <span className="text-sm font-mono text-gray-400 bg-black/50 px-2 py-1 rounded">{mission.date}</span>
                </div>
              </div>
              <p className="text-gray-300 font-['Rajdhani'] text-lg leading-relaxed mb-6 text-justify">{mission.desc}</p>
              <div className="flex gap-3">
                {mission.stats.map((stat, i) => (<span key={i} className={`px-3 py-1 text-xs font-bold font-['Orbitron'] rounded-sm ${mission.bg} ${mission.color} border border-white/5`}>{stat}</span>))}
              </div>
              <div className="absolute -left-[1px] -top-[1px] w-3 h-3 border-l border-t border-white/50"></div>
              <div className="absolute -right-[1px] -bottom-[1px] w-3 h-3 border-r border-b border-white/50"></div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
// --- CONTACT SECTION (Mobile Responsive) ---
const ContactSection = () => {
  // REPLACE "YOUR_FORM_ID" WITH YOUR ACTUAL FORMSPREE ID
  const [state, handleSubmit] = useForm("manrkbyr");

  return (
    <Section align="center" justify="center">
      <div className="z-10 w-full max-w-xl px-4 md:px-0 mt-[-5rem]">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter font-['Orbitron']">
            CONTACT ME
          </h2>
          <p className="text-green-400 font-mono text-sm tracking-[0.3em] uppercase font-['Rajdhani'] animate-pulse">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-zinc-900/80 p-6 md:p-8 rounded-lg border border-white/10 backdrop-blur-md shadow-2xl relative">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30"></div>

            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-yellow-400 font-['Orbitron'] text-xs tracking-widest">IDENTITY</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="ENTER NAME"
                required
                className="bg-black/50 border border-white/20 p-3 text-white font-['Rajdhani'] focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs" />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-blue-400 font-['Orbitron'] text-xs tracking-widest">FREQUENCY (EMAIL)</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="ENTER EMAIL"
                required
                className="bg-black/50 border border-white/20 p-3 text-white font-['Rajdhani'] focus:outline-none focus:border-blue-400 transition-colors"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs" />
            </div>

            {/* Message Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-green-400 font-['Orbitron'] text-xs tracking-widest">DATA PACKET</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="ENTER MESSAGE..."
                required
                className="bg-black/50 border border-white/20 p-3 text-white font-['Rajdhani'] focus:outline-none focus:border-green-400 transition-colors resize-none"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.submitting}
              className="mt-4 py-3 bg-white/10 border border-white/20 text-white font-bold font-['Orbitron'] tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10">{state.submitting ? 'SENDING...' : 'INITIATE UPLOAD'}</span>
              <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
            </button>
          </form>
        )}
      </div>
    </Section>
  );
};

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

// --- HERO SOLAR SYSTEM (TARGET FOR BLOOM) ---
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

const ContentPlanets = () => {
  const { viewport } = useThree();
  const scroll = useScroll(); 
  const groupRef = useRef();
  const xOffset = viewport.width / 10; 
  const clickSound = useMemo(() => new Audio('/assets/sounds/click.wav'), []);
  const playClick = () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.error(e));
  };

  const planets = useMemo(() => [
    { name: "Mercury", scale: 54, position: [xOffset, -viewport.height * 1, 0] },
    { name: "Venus",   scale: 35, position: [-xOffset, -viewport.height * 2, 0] },
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
          <Planet 
            name={p.name} 
            scale={p.scale} 
            rotationSpeed={0.01} 
            onPlanetClick={playClick} 
          />
          <pointLight distance={10} intensity={4} color="white" />
          {p.name === 'Earth' && <DataRing />}
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