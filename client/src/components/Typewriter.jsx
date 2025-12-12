import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay = 100, infinite = false, onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    // Case 1: Typing
    if (!isDeleting && currentText.length < text.length) {
      timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentText.length + 1));
      }, delay);
    } 
    // Case 2: Finished Typing
    else if (!isDeleting && currentText.length === text.length) {
      if (onComplete) onComplete();
      
      if (infinite) {
        // Wait 2 seconds before starting to delete
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } 
    // Case 3: Deleting
    else if (isDeleting && currentText.length > 0) {
      timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentText.length - 1));
      }, 50); // Delete faster (50ms)
    } 
    // Case 4: Finished Deleting
    else if (isDeleting && currentText.length === 0) {
      setIsDeleting(false);
      // Wait 0.5s before typing again
      timeout = setTimeout(() => {}, 500); 
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, text, delay, infinite, onComplete]);

  return (
    <span className="inline-block min-w-[1ch]">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default Typewriter;