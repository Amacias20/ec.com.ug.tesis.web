import { useState, useEffect } from "react";

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
}

const useGeolocation = (): Location => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "La geolocalización no es soportada por este navegador.",
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
      }));
    };

    const watcher = navigator.geolocation.watchPosition(onSuccess, onError);

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return location;
};

export default useGeolocation;