import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Starfield from './components/Starfield';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import CameraHandler from './components/CameraHandler';

// --- ANIMATION ---
const styles = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .info-card {
    animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// --- DATA ---
const resumeData = {
  "Mercury": { title: "Technical Skills", content: "React, Three.js, Node.js, Python, MongoDB, WebGL shaders." },
  "Venus":   { title: "About Me",         content: "I am a passionate creative developer focused on building immersive 3D web experiences." },
  "Earth":   { title: "Experience",       content: "Frontend Developer at Tech Corp (2021-Present).\nLead developer for the company's main e-commerce platform serving 1M+ users." },
  "Mars":    { title: "My Projects",      content: "1. Solar System Portfolio (React Three Fiber)\n2. AI-Powered Chatbot Interface\n3. WebGL Data Visualization Dashboard" },
};

function App() {
  const planets = [
    { name: "Mercury", scale: 6, distance:  5,  speed: 1},
    { name: "Venus",   scale: 9, distance:  7.5, speed: 0.6},
    { name: "Earth",   scale: 0.15, distance: 10, speed: 0.3},
    { name: "Mars",    scale: 6, distance: 13, speed: 0.2},
  ];

  const [activePlanet, setActivePlanet] = useState(null); 
  const [targetPos, setTargetPos] = useState(null);       

  const handlePlanetClick = (name, position) => {
    setActivePlanet(name);
    setTargetPos(position);
  };

  const handleBackClick = () => {
    setActivePlanet(null);
    setTargetPos(null);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <style>{styles}</style>

      {/* --- UI OVERLAY --- */}
      {activePlanet && (
        <div className="info-card" style={{
          position: 'absolute', 
          top: '6.5%', 
          left: '3%', 
          transform: 'translateY(50%)', // Keeps it vertically centered
          zIndex: 10, 
          
          // --- PROPORTION FIX ---
          // clamp(minimum, preferred, maximum)
          // It tries to be 30% of the screen, but never smaller than 350px
          width: '350px',
          
          
          
          padding: '40px', 
          background: 'rgba(10, 10, 10, 0.85)', 
          backdropFilter: 'blur(15px)',
          borderRadius: '20px', 
          border: '1px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
          color: '#e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 20px 0', 
            color: '#FFD700', 
            fontSize: '2.5rem', // Big bold title
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '-1px'
          }}>
            {resumeData[activePlanet]?.title}
          </h1>
          
          <p style={{ 
            lineHeight: '1.8', 
            fontSize: '1.1rem', 
            whiteSpace: 'pre-line', 
            color: '#cccccc',
            marginBottom: '30px'
          }}>
            {resumeData[activePlanet]?.content}
          </p>
          
          <button onClick={handleBackClick} style={{ 
              alignSelf: 'flex-start', // Don't stretch button
              padding: '12px 30px', 
              cursor: 'pointer',
              background: 'transparent', 
              color: '#FFD700', 
              border: '2px solid #FFD700',
              borderRadius: '50px', // Pill shape button
              fontSize: '0.9rem', 
              fontWeight: 'bold', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.target.style.background = '#FFD700'; e.target.style.color = 'black'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#FFD700'; }}
          >
            ← Back to Orbit
          </button>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 20, 25], fov: 45 }}>
        <CameraHandler targetPosition={targetPos} isZoomed={activePlanet !== null} />
        <Suspense fallback={null}>
          <Starfield />
          
          {!activePlanet && (
             <Planet name="Sun" scale={3} rotationSpeed={0.002} />
          )}

          {planets.map((planet, index) => {
            if (activePlanet && activePlanet !== planet.name) return null;

            return (
              <group key={index}>
                {!activePlanet && <Orbit radius={planet.distance} />}
                <Planet 
                  name={planet.name} 
                  scale={planet.scale} 
                  orbitRadius={planet.distance}
                  orbitSpeed={planet.speed}
                  rotationSpeed={0.01}
                  startAngle={planet.startAngle}
                  yOffset={planet.yOffset}
                  isPaused={activePlanet !== null} 
                  onPlanetClick={handlePlanetClick}
                />
              </group>
            );
          })}
        </Suspense>

        <pointLight position={[0, 0, 0]} intensity={2} color="white" castShadow />
        <ambientLight intensity={0.5} />
        <OrbitControls makeDefault enableZoom={true} enablePan={false} enableRotate={true} />
      </Canvas>
    </div>
  );
}

export default App;