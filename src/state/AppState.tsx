import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Concept, History, Profile, Store } from "../data/types";
import { emptyStore, localRepository } from "../services/storage";
const Context = createContext<null | {
  data: Store;
  ready: boolean;
  error: string;
  setProfile: (p: Profile) => Promise<void>;
  saveTerm: (t: Concept) => Promise<void>;
  toggleLearned: (id: string) => Promise<void>;
  addHistory: (h: History) => Promise<void>;
}>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Store>(emptyStore),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const ref = useRef(data);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    localRepository
      .load()
      .then((d) => {
        ref.current = d;
        setData(d);
      })
      .catch(() =>
        setError(
          "Your saved data could not be loaded. Please restart the app before making changes.",
        ),
      )
      .finally(() => setReady(true));
  }, []);
  function update(change: (d: Store) => Store) {
    const next = queue.current
      .catch(() => {})
      .then(async () => {
        const d = change(ref.current);
        try {
          await localRepository.save(d);
          ref.current = d;
          setData(d);
          setError("");
        } catch {
          setError("Could not save on this device. Please try again.");
          throw new Error("Storage unavailable");
        }
      });
    queue.current = next;
    return next;
  }
  return (
    <Context.Provider
      value={{
        data,
        ready,
        error,
        setProfile: (p) => update((d) => ({ ...d, profile: p })),
        saveTerm: (t) =>
          update((d) =>
            d.saved.some((x) => x.term.toLowerCase() === t.term.toLowerCase())
              ? d
              : {
                  ...d,
                  saved: [
                    {
                      ...t,
                      id: `${Date.now()}-${Math.random()}`,
                      learned: false,
                      created_at: new Date().toISOString(),
                    },
                    ...d.saved,
                  ],
                },
          ),
        toggleLearned: (id) =>
          update((d) => ({
            ...d,
            saved: d.saved.map((t) =>
              t.id === id ? { ...t, learned: !t.learned } : t,
            ),
          })),
        addHistory: (h) =>
          update((d) => ({ ...d, history: [h, ...d.history].slice(0, 100) })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("AppProvider missing");
  return ctx;
}
