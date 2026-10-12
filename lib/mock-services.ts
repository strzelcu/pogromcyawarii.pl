import {
  canRead,
  profileSchema,
  type AuthProvider,
  type DemoState,
  type NotificationProvider,
  type Repair,
  type RepairRepository,
  type ShippingProvider,
  type User,
} from './domain';

export const STORAGE_KEY = 'pogromcy-demo-v1';
// This provider is intentionally local demo identity, not production authentication.
export function authProvider(
  read: () => DemoState,
  write: (state: DemoState) => void,
): AuthProvider {
  return {
    login(email) {
      const state = read();
      const user = state.users.find((u) => u.email === email.trim().toLowerCase());
      if (!user)
        throw new Error('Nie znaleziono konta demo. Zarejestruj się lub wybierz gotowe konto.');
      write({ ...state, sessionId: user.id });
      return user;
    },
    register(profile) {
      const parsed = profileSchema.parse(profile);
      const state = read();
      if (state.users.some((u) => u.email === parsed.email))
        throw new Error('Konto z tym adresem email już istnieje.');
      const user: User = { ...parsed, id: crypto.randomUUID(), role: 'client' };
      write({ ...state, users: [...state.users, user], sessionId: user.id });
      return user;
    },
    logout() {
      write({ ...read(), sessionId: null });
    },
  };
}
export function repairRepository(
  read: () => DemoState,
  write: (state: DemoState) => void,
): RepairRepository {
  return {
    list(actor) {
      return read().repairs.filter((r) => canRead(actor, r));
    },
    get(id, actor) {
      return read().repairs.find((r) => r.id === id && canRead(actor, r));
    },
    add(repair, actor) {
      if (actor.role !== 'client' || actor.id !== repair.userId)
        throw new Error('Możesz tworzyć tylko własne zgłoszenia.');
      const state = read();
      if (state.repairs.some((r) => r.id === repair.id))
        throw new Error('Zgłoszenie już istnieje.');
      write({ ...state, repairs: [repair, ...state.repairs] });
    },
    replace(repair, actor) {
      const state = read();
      const current = state.repairs.find((r) => r.id === repair.id);
      if (!current || !canRead(actor, current) || repair.userId !== current.userId)
        throw new Error('Nie masz dostępu do tego zgłoszenia.');
      write({ ...state, repairs: state.repairs.map((r) => (r.id === repair.id ? repair : r)) });
    },
  };
}
export const shippingProvider: ShippingProvider = {
  async create(repairId, direction) {
    const response = await fetch('/api/demo/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repairId, direction }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Nie udało się przygotować przesyłki demo.');
    return data.shipment;
  },
};
export const notificationProvider: NotificationProvider = {
  list(repair: Repair) {
    return repair.history;
  },
};
