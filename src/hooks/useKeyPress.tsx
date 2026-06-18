import { useState, useEffect, useCallback } from 'react';
import useDetectOS from './useDetectOS';

type KeyAlias = {
  [key: string]: string[];
};

const KEY_ALIASES: KeyAlias = {
  ctrl: ['Control', 'ControlLeft', 'ControlRight'],
  alt: ['Alt', 'AltLeft', 'AltRight'],
  shift: ['Shift', 'ShiftLeft', 'ShiftRight'],
  meta: ['Meta', 'MetaLeft', 'MetaRight', 'Command', 'Windows'],
  enter: ['Enter', 'Return'],
  esc: ['Escape', 'Esc'],
};

type KeyPressOptions = {
  combination?: boolean;
  preventDefault?: boolean;
};

const useKeyPress = (
  targetKey: string | string[],
  options: KeyPressOptions = {}
) => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const os = useDetectOS();
  
  const resolveKey = useCallback((key: string): string[] => {
    if (key.toLowerCase() === 'meta' && os === 'Windows') {
      return KEY_ALIASES['ctrl'];
    }
    return KEY_ALIASES[key.toLowerCase()] || [key];
  }, [os]);

  const checkKeyCombination = useCallback((keys: string[], event: KeyboardEvent): boolean => {
    const modifierKeys: Record<string, boolean> = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: os === 'MacOS' ? event.metaKey : event.ctrlKey,
    };

    return keys.every(key => {
      const resolvedKeys = resolveKey(key);
      return (
        modifierKeys[key.toLowerCase()] ||
        resolvedKeys.includes(event.key) ||
        resolvedKeys.includes(event.code)
      );
    });
  }, [os, resolveKey]);

  useEffect(() => {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (checkKeyCombination(keys, event)) {
        if (options.preventDefault) {
          event.preventDefault();
        }
        setIsKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (checkKeyCombination(keys, event)) {
        setIsKeyPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetKey, options.preventDefault, checkKeyCombination]);

  return isKeyPressed;
};

export default useKeyPress;
