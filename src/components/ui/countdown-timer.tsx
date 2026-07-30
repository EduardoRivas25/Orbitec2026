import React, { useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

const COUNTDOWN_FROM = "2026-09-28T00:00:00"; // 28 de Septiembre de 2026

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function ShiftingCountdown() {
  return (
    <div className="relative px-4 sm:px-6 md:px-8 py-2 md:py-2.5 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-full flex flex-row items-center gap-1 sm:gap-3 justify-center shadow-[0_0_30px_rgba(200,10,25,0.15)] w-auto mx-auto max-w-[95%]">
      <span className="font-title text-rojo-light font-bold text-xl md:text-2xl mr-1 sm:mr-2">T-</span>
      <div className="flex items-center">
        <CountdownItem unit="Day" label="DÍAS" />
        <span className="text-lg sm:text-xl md:text-2xl font-bold pb-2 sm:pb-3 opacity-50 mx-0.5 sm:mx-1">:</span>
        <CountdownItem unit="Hour" label="HRS" />
        <span className="text-lg sm:text-xl md:text-2xl font-bold pb-2 sm:pb-3 opacity-50 mx-0.5 sm:mx-1">:</span>
        <CountdownItem unit="Minute" label="MIN" />
        <span className="text-lg sm:text-xl md:text-2xl font-bold pb-2 sm:pb-3 text-rojo-light mx-0.5 sm:mx-1">:</span>
        <CountdownItem unit="Second" label="SEG" highlight={true} />
      </div>
    </div>
  );
}

function CountdownItem({ unit, label, highlight = false }: { unit: string, label: string, highlight?: boolean }) {
  const { ref, time } = useTimer(unit);
  const display = String(time).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center px-0.5 sm:px-1 md:px-2 w-10 sm:w-12 md:w-16">
      <div className="relative overflow-hidden text-center h-6 sm:h-7 md:h-8 w-full flex items-center justify-center">
        <span
          ref={ref}
          className="block font-mono font-bold text-lg sm:text-xl md:text-2xl tracking-tight sm:tracking-widest text-white absolute"
        >
          {display}
        </span>
      </div>
      <span className={`text-[8px] sm:text-[9px] md:text-[10px] uppercase font-sans tracking-widest mt-0.5 ${highlight ? 'text-rojo-light' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

function useTimer(unit: string) {
  const [ref, animate] = useAnimate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    handleCountdown();
    intervalRef.current = setInterval(handleCountdown, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    let newTime = 0;
    if (distance > 0) {
      switch (unit) {
        case "Day":
          newTime = Math.floor(distance / DAY);
          break;
        case "Hour":
          newTime = Math.floor((distance % DAY) / HOUR);
          break;
        case "Minute":
          newTime = Math.floor((distance % HOUR) / MINUTE);
          break;
        default:
          newTime = Math.floor((distance % MINUTE) / SECOND);
      }
    }

    if (newTime !== timeRef.current) {
      if (ref.current) {
        await animate(
          ref.current,
          { y: ["0%", "-50%"], opacity: [1, 0] },
          { duration: 0.35 }
        );
      }

      timeRef.current = newTime;
      setTime(newTime);

      if (ref.current) {
        await animate(
          ref.current,
          { y: ["50%", "0%"], opacity: [0, 1] },
          { duration: 0.35 }
        );
      }
    }
  };

  return { ref, time };
}
