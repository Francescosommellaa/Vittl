"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface LocationItem {
  id: string;
  name: string;
  city?: string | null;
  address?: string | null;
}

interface LocationContextValue {
  locations: LocationItem[];
  activeLocation: LocationItem | null;
  setActiveLocation: (location: LocationItem) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

// Lazy initializer — eseguito solo una volta al mount, lato client
function resolveInitialLocation(
  locations: LocationItem[],
): LocationItem | null {
  if (locations.length === 0) return null;
  // Guard SSR (Next.js può pre-renderare lato server)
  if (typeof window === "undefined") return locations[0];

  try {
    const stored = sessionStorage.getItem("vittl_active_location");
    if (stored) {
      const parsed = JSON.parse(stored) as LocationItem;
      const found = locations.find((l) => l.id === parsed.id);
      if (found) return found;
    }
  } catch {}

  return locations[0];
}

export function LocationProvider({
  children,
  locations,
}: {
  children: ReactNode;
  locations: LocationItem[];
}) {
  // Lazy initializer: nessun useEffect, nessun cascading render
  const [activeLocation, setActiveLocationState] =
    useState<LocationItem | null>(() => resolveInitialLocation(locations));

  const setActiveLocation = (location: LocationItem) => {
    setActiveLocationState(location);
    sessionStorage.setItem("vittl_active_location", JSON.stringify(location));
  };

  return (
    <LocationContext.Provider
      value={{ locations, activeLocation, setActiveLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocationContext must be used within LocationProvider");
  return ctx;
}
