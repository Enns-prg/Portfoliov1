import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Typewriter from './components/Typewriter';

// --- SUN DETAIL VIEW ---
const SunDetailView = ({ onClose }) => (
  <div className="w-screen h-screen bg-black text-white flex items-center justify-between px-20">
    {/* Left Side - Text */}
    <div className="max-w-md">
      <h2 className="text-4xl font-bold mb-8">MY PICTURE</h2>
      <h3 className="text-3xl font-bold mb-8">ABOUT ME</h3>
      <p className="text-xl leading-relaxed text-gray-300">THE CONTEXT OF ABOUT ME</p>
    </div>

    {/* Right Side - 3D Model */}
    <div className="flex-1 flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Starfield />
          <Planet name="Sun" scale={5} rotationSpeed={0.01} />
        </Suspense>
        <pointLight position={[5, 5, 5]} intensity={1} />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>

    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-8 right-8 text-white text-3xl font-bold hover:text-yellow-400 transition"
    >
      ✕
    </button>
  </div>
);

// --- MAIN PORTFOLIO CONTENT ---
const MainPortfolio = () => (
  <div className="w-screen h-screen bg-neutral-900 text-white flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">Portfolio Content Loaded</h1>
    <p className="text-gray-400">Your actual site components go here.</p>
  </div>
);

// --- LOADING / LANDING SCREEN ---
const LandingOverlay = ({ onEnter }) => {
  const { progress } = useProgress();
  const [typingDone, setTypingDone] = useState(false);
  const isLoaded = progress === 100;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 min-h-[4rem]">
         <Typewriter 
           text="Frederick Ian Aranico" 
           delay={150} 
           onComplete={() => setTypingDone(true)} 
         />
      </div>

      {/* Subtitle / Status */}
      <div className="h-8 mb-6">
        {typingDone && !isLoaded && (
          <p className="text-yellow-400 font-mono animate-pulse">
            INITIALIZING SYSTEM... {Math.round(progress)}%
          </p>
        )}
        {typingDone && isLoaded && (
          <p className="text-gray-300 font-light tracking-widest uppercase text-sm">
            Full Stack Developer 
          </p>
        )}
      </div>
      <div className={`transition-all duration-700 transform ${typingDone && isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button 
          onClick={onEnter}
          className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-yellow-400 text-yellow-400 font-bold hover:text-black transition-colors duration-300"
        >
          <span className="absolute inset-0 w-full h-full bg-yellow-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10 flex items-center gap-2">
            ABOUT ME 
            <span className="text-lg">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

function App() {
  const [entered, setEntered] = useState(false);
  const [sunClicked, setSunClicked] = useState(false);

  if (sunClicked) return <SunDetailView onClose={() => setSunClicked(false)} />;

  if (entered) return <MainPortfolio />;

  const planets = [
    { name: "Mercury", scale: 6, distance:  5,  speed: 1},
    { name: "Venus",   scale: 9, distance:  7.5, speed: 0.6},
    { name: "Earth",   scale: 0.15, distance: 11, speed: 0.3},
    { name: "Mars",    scale: 6, distance: 14, speed: 0.5},
  ];

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas shadows camera={{ position: [0, 20, 25], fov: 45 }}>
        <pointLight position={[0, 0, 0]} intensity={2} color="white" castShadow />
        <ambientLight intensity={0.5} />

        <Suspense fallback={null}>
          <Starfield />
          <Planet 
            name="Sun" 
            scale={3} 
            rotationSpeed={0.002}
            onPlanetClick={() => setSunClicked(true)}
          />
          
          {planets.map((planet, index) => (
            <group key={index}>
              <Orbit radius={planet.distance} />
              <Planet 
                name={planet.name} 
                scale={planet.scale} 
                orbitRadius={planet.distance}
                orbitSpeed={planet.speed}
                rotationSpeed={0.01}
                onPlanetClick={() => {}} 
              />
            </group>
          ))}
        </Suspense>

        <OrbitControls 
          makeDefault 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.8} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Landing Overlay - Outside Canvas */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 select-none pointer-events-none z-50">
        <div className="pointer-events-auto">
          <LandingOverlay onEnter={() => setEntered(true)} />
        </div>
      </div>
    </div>
  );
}

export default App;