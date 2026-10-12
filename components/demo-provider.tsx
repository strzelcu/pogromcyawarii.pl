'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createSeed } from '@/lib/seed';
import {
  demoStateSchema,
  profileSchema,
  type DemoState,
  type Profile,
  type User,
} from '@/lib/domain';
import { authProvider, repairRepository, STORAGE_KEY } from '@/lib/mock-services';

type DemoContextValue = {
  state: DemoState | null;
  user: User | null;
  storageError: string;
  auth: ReturnType<typeof authProvider>;
  repairs: ReturnType<typeof repairRepository>;
  updateProfile: (profile: Profile) => void;
  reset: () => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null);
  const [storageError, setStorageError] = useState('');
  const current = useRef<DemoState | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? demoStateSchema.parse(JSON.parse(saved)) : createSeed();
      current.current = parsed;
      setState(parsed);
    } catch {
      const seed = createSeed();
      current.current = seed;
      setState(seed);
      setStorageError('Nie można odczytać zapisu demo. Używamy danych początkowych.');
    }
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        const data = event.newValue
          ? demoStateSchema.parse(JSON.parse(event.newValue))
          : createSeed();
        current.current = data;
        setState(data);
      } catch {
        setStorageError('Nie udało się odczytać zmian z innej karty.');
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function read() {
    if (!current.current) throw new Error('Trwa przygotowanie danych.');
    return current.current;
  }
  function write(value: DemoState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      setStorageError('');
    } catch {
      setStorageError('Przeglądarka blokuje zapis. Zmiany znikną po odświeżeniu.');
    }
    current.current = value;
    setState(value);
  }
  const user = state?.users.find((u) => u.id === state.sessionId) ?? null;
  function updateProfile(profile: Profile) {
    const parsed = profileSchema.parse(profile);
    const value = read();
    const actor = value.users.find((u) => u.id === value.sessionId);
    if (!actor) throw new Error('Najpierw zaloguj się.');
    if (value.users.some((u) => u.id !== actor.id && u.email === parsed.email))
      throw new Error('Ten email jest już zajęty.');
    write({
      ...value,
      users: value.users.map((u) => (u.id === actor.id ? { ...u, ...parsed } : u)),
    });
  }
  return (
    <DemoContext.Provider
      value={{
        state,
        user,
        storageError,
        auth: authProvider(read, write),
        repairs: repairRepository(read, write),
        updateProfile,
        reset: () => write(createSeed()),
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('Brak DemoProvider.');
  return context;
}
