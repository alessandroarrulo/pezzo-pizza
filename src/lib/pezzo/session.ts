import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderInput, Profile, PunchInput } from "./types";

export type Job =
  | { id: string; type: "order"; body: OrderInput; at: string }
  | { id: string; type: "punch"; body: PunchInput; at: string }
  | {
      id: string;
      type: "deliver";
      body: { orderId: number; code: string; actor: string; paid: boolean; note: string };
      at: string;
    };

export const PROFILES: Profile[] = [
  { role: "cliente", staffId: null, name: "Cliente", title: "Fazer um pedido" },
  { role: "cozinha", staffId: 3, name: "Carla Kapingana", title: "Cozinha" },
  { role: "estafeta", staffId: 4, name: "João Muongo", title: "Estafeta" },
  { role: "admin", staffId: 1, name: "Ana Tavares", title: "Administração" },
  { role: "admin", staffId: 2, name: "Miguel Sousa", title: "Gerente" },
];

type Session = {
  profile: Profile;
  simulatedOffline: boolean;
  sound: boolean;
  kdsDark: boolean;
  queue: Job[];
  lastSync: string | null;
  favorites: number[];
  phone: string;
  customerName: string;
  setProfile: (profile: Profile) => void;
  setOffline: (value: boolean) => void;
  setSound: (value: boolean) => void;
  setKdsDark: (value: boolean) => void;
  setCustomer: (name: string, phone: string) => void;
  toggleFavorite: (id: number) => void;
  enqueue: (job: Job) => void;
  dequeue: (id: string) => void;
  markSync: (iso: string) => void;
};

export const useSession = create<Session>()(
  persist(
    (set) => ({
      profile: PROFILES[0],
      simulatedOffline: false,
      sound: true,
      kdsDark: false,
      queue: [],
      lastSync: null,
      favorites: [],
      phone: "",
      customerName: "",
      setProfile: (profile) => set({ profile }),
      setOffline: (simulatedOffline) => set({ simulatedOffline }),
      setSound: (sound) => set({ sound }),
      setKdsDark: (kdsDark) => set({ kdsDark }),
      setCustomer: (customerName, phone) => set({ customerName, phone }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        })),
      enqueue: (job) => set((s) => ({ queue: [...s.queue, job] })),
      dequeue: (id) => set((s) => ({ queue: s.queue.filter((j) => j.id !== id) })),
      markSync: (lastSync) => set({ lastSync }),
    }),
    { name: "pezzo-session", skipHydration: true },
  ),
);
