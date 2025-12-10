import React, { useState, useEffect } from 'react';

const Typewriter = ({ 
  text, 
  delay = 100, 
  onComplete,
  // Added className prop with default styles for the main title
  className = "font-mono text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight"
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse text-yellow-400">|</span>
    </span>
  );
};

export default Typewriter;