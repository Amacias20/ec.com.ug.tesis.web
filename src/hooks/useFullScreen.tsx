import { useState, useCallback, RefObject } from 'react';

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }
  
  interface HTMLElement {
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

interface UseFullScreenReturn {
  isFullScreen: boolean;
  toggleFullScreen: () => Promise<void>;
  enterFullScreen: () => Promise<void>;
  exitFullScreen: () => Promise<void>;
}

export const useFullScreen = (element?: RefObject<HTMLElement>): UseFullScreenReturn => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const enterFullScreen = useCallback(async () => {
    const targetElement = element?.current || document.documentElement;

    try {
      if (targetElement.requestFullscreen) {
        await targetElement.requestFullscreen();
      } else if (targetElement.mozRequestFullScreen) {
        await targetElement.mozRequestFullScreen();
      } else if (targetElement.webkitRequestFullscreen) {
        await targetElement.webkitRequestFullscreen();
      } else if (targetElement.msRequestFullscreen) {
        await targetElement.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } catch (error) {
      console.error('Error al entrar en pantalla completa:', error);
    }
  }, [element]);

  const exitFullScreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (error) {
      console.error('Error al salir de pantalla completa:', error);
    }
  }, []);

  const toggleFullScreen = useCallback(async () => {
    if (!isFullScreen) {
      await enterFullScreen();
    } else {
      await exitFullScreen();
    }
  }, [isFullScreen, enterFullScreen, exitFullScreen]);

  return {
    isFullScreen,
    toggleFullScreen,
    enterFullScreen,
    exitFullScreen
  };
};