import { useState, useEffect, useRef } from "react";

export const useIdle = (delay: number) => {
  const [isIdle, setIsIdle] = useState(false);

  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setup();

    return () => {
      cleanUp();
    };
  }, []);

  const startTimer = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);
    startTimer();
  };

  const setup = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("DOMMouseScroll", resetTimer, false);
    document.addEventListener("mousewheel", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("MSPointerMove", resetTimer, false);

    window.addEventListener("blur", startTimer, false);
    window.addEventListener("focus", resetTimer, false);

    startTimer();
  };

  const cleanUp = () => {
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("mousedown", resetTimer);
    document.removeEventListener("keypress", resetTimer);
    document.removeEventListener("DOMMouseScroll", resetTimer);
    document.removeEventListener("mousewheel", resetTimer);
    document.removeEventListener("touchmove", resetTimer);
    document.removeEventListener("MSPointerMove", resetTimer);

    window.removeEventListener("blur", startTimer);
    window.removeEventListener("focus", resetTimer);

    clearTimeout(timeoutId.current);
  };

  return isIdle;
};