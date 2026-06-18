import { useState, useEffect } from "react";

type OS = "Windows Phone" | "Android" | "iOS" | "Windows" | "MacOS" | "Linux" | "Unknown";

const useDetectOS = (): OS => {
  const [os, setOS] = useState<OS>("Unknown");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/windows phone/i.test(userAgent)) {
      setOS("Windows Phone");
    } else if (/android/i.test(userAgent)) {
      setOS("Android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setOS("iOS");
    } else if (/Win/i.test(userAgent)) {
      setOS("Windows");
    } else if (/Mac/i.test(userAgent)) {
      setOS("MacOS");
    } else if (/Linux/i.test(userAgent)) {
      setOS("Linux");
    } else {
      setOS("Unknown");
    }
  }, []);

  return os;
};

export default useDetectOS;