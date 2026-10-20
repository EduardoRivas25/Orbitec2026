import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface RevealTextProps {
  text?: string;
  textColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
}

export function RevealText({
  text = 'STUNNING',
  textColor = 'text-white',
  fontSize = 'text-[125px]',
  letterDelay = 0.08,
  overlayDelay = 0.15,
  overlayDuration = 2.8,
  springDuration = 600,
}: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const lastLetterDelay = (text.length - 1) * letterDelay;
    const overlayStart = lastLetterDelay * 1000 + springDuration;
    const overlayTimer = window.setTimeout(
      () => setShowOverlay(true),
      overlayStart,
    );
    return () => {
      window.clearTimeout(overlayTimer);
      if (touchTimer.current) window.clearTimeout(touchTimer.current);
    };
  }, [text, letterDelay, springDuration]);

  return (
    <span aria-hidden="true" className="relative inline-flex items-center justify-center whitespace-nowrap">
      {Array.from(text).map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className={`${fontSize} relative inline-block cursor-pointer font-black leading-[1.05] tracking-tight`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onTouchStart={() => {
            if (touchTimer.current) window.clearTimeout(touchTimer.current);
            setHoveredIndex(index);
          }}
          onTouchEnd={() => {
            touchTimer.current = window.setTimeout(() => setHoveredIndex(null), 1500);
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * letterDelay, type: 'spring', damping: 8, stiffness: 200, mass: 0.8 }}
        >
          {letter === ' ' ? (
            '\u00A0'
          ) : (
            <>
              <span className="invisible">{letter}</span>

              <motion.span
                className={`absolute inset-0 ${textColor}`}
                animate={{ opacity: hoveredIndex === index ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {letter}
              </motion.span>

              <motion.span
                className="pointer-events-none absolute inset-0 text-transparent"
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  WebkitTextFillColor: 'transparent',
                  WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)',
                }}
              >
                {letter}
              </motion.span>

              {showOverlay && (
                <motion.span
                  className={`pointer-events-none absolute inset-0 ${hoveredIndex === index ? 'invisible' : ''}`}
                  initial={{ opacity: 0, color: '#c80a19' }}
                  animate={{
                    opacity: [0, 1, 1, 1, 1, 1, 1, 0],
                    color: ['#c80a19', '#c80a19', '#c80a19', '#015fb3', '#015fb3', '#ffffff', '#ffffff', '#ffffff'],
                  }}
                  transition={{
                    delay: index * overlayDelay,
                    duration: overlayDuration,
                    times: [0, 0.08, 0.31, 0.42, 0.61, 0.73, 0.92, 1],
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 12,
                  }}
                >
                  {letter}
                </motion.span>
              )}
            </>
          )}
        </motion.span>
      ))}
    </span>
  );
}
