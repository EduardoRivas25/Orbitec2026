import React, { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({ number = 25, className = "" }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => {
      const duration = Math.random() * 3 + 3; // 3-6s
      return {
        top: Math.floor(Math.random() * 50) + "%",
        left: Math.floor(Math.random() * 100) + "%",
        animationDelay: -(Math.random() * duration) + "s",
        animationDuration: duration + "s",
      };
    });
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={`meteor-trail ${className}`}
          style={style}
        />
      ))}
    </>
  );
};
