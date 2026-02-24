/**
 * Network status context: healthy | offline | degraded.
 * Consumed by NetworkBanner and Login (fail-safe). Status propagates from
 * connectivityMonitor (navigator.onLine + periodic Supabase health check).
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  startConnectivityMonitor,
  type NetworkStatus,
} from "./connectivityMonitor";

export interface NetworkState {
  status: NetworkStatus;
  lastChecked: Date | null;
}

const defaultState: NetworkState = {
  status: "healthy",
  lastChecked: null,
};

const NetworkContext = createContext<NetworkState | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NetworkState>(defaultState);

  useEffect(() => {
    const cleanup = startConnectivityMonitor((status) => {
      setState({ status, lastChecked: new Date() });
    });
    return cleanup;
  }, []);

  return (
    <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkState {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return ctx;
}
