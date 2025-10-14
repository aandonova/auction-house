import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "watchlist:v1";

type WatchListContextValue = {
  ids: number[];
  has: (id: number | string) => boolean;
  add: (id: number | string) => void;
  remove: (id: number | string) => void;
  toggle: (id: number | string) => void;
  clear: () => void;
};

const WatchlistContext = createContext<WatchListContextValue | undefined>(undefined);

export function WatchListProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.map((x) => Number(x)).filter(Number.isFinite));
        }
      }

    } catch { }
    console.log("[WatchlistProvider] loaded ids =", ids);

  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch { }
  }, [ids]);

  const api = useMemo<WatchListContextValue>(() => {
    const n = (id: number | string) => Number(id);
    const has = (id: number | string) => ids.includes(n(id));
    const add = (id: number | string) => setIds((s) => {
      const v = n(id);
      return s.includes(v) ? s : [...s, v];
    });
    const remove = (id: number | string) => setIds((s) => {
      const v = n(id);
      return s.filter((x) => x !== v);
    });
    const toggle = (id: number | string) => setIds((s) => {
      const v = n(id);
      return s.includes(v) ? s.filter((x) => x !== v) : [...s, v];
    });
    const clear = () => setIds([]);
    return { ids, has, add, remove, toggle, clear };
  }, [ids]);

  return React.createElement(WatchlistContext.Provider, { value: api }, children);
}

export function useWatchList() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within <WatchlistProvider>");
  return ctx;
}
