import { useState, useEffect, useRef } from 'react'

interface BatteryState {
  charging?: boolean;
  level?: number;
  chargingTime?: number;
  dischargingTime?: number;
}

const on = (obj: EventTarget, event: string, fn: EventListener): void => 
  obj.addEventListener(event, fn);

const off = (obj: EventTarget, event: string, fn: EventListener): void => 
  obj.removeEventListener(event, fn);

export const useBattery = (): BatteryState => {
  const [state, setState] = useState<BatteryState>({});
  const mounted = useRef(true);
  const batteryRef = useRef<any>(null);

  const onChange = (): void => {
    const { charging, level, chargingTime, dischargingTime } = batteryRef.current;
    setState({
      charging,
      level,
      chargingTime,
      dischargingTime
    });
  };

  const onBattery = (): void => {
    onChange();
    on(batteryRef.current, "chargingchange", onChange);
    on(batteryRef.current, "levelchange", onChange);
    on(batteryRef.current, "chargingtimechange", onChange);
    on(batteryRef.current, "dischargingtimechange", onChange);
  };
  useEffect(() => {
    (navigator as any).getBattery().then((bat: any) => {
      if (mounted.current) {
        batteryRef.current = bat;
        onBattery();
      }
    });

    return () => {
      mounted.current = false;
      if (batteryRef.current) {
        off(batteryRef.current, "chargingchange", onChange);
        off(batteryRef.current, "levelchange", onChange);
        off(batteryRef.current, "chargingtimechange", onChange);
        off(batteryRef.current, "dischargingtimechange", onChange);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};