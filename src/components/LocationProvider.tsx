"use client";
import { useEffect, useState, createContext, useContext } from "react";

interface LocationContextProps {
  location: GeolocationPosition | null;
  error: string | null;
}

const LocationContext = createContext<LocationContextProps>({
  location: null,
  error: null,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos),
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, error }}>
      {children}
    </LocationContext.Provider>
  );
};
