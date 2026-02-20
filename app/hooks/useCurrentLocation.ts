import { useLocationContext } from "@/app/contexts/LocationContext";

export function useCurrentLocation() {
  return useLocationContext();
}
