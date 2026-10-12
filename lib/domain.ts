import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().trim().min(3, 'Podaj ulicę i numer.').max(200),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy powinien mieć format 00-000.'),
  city: z.string().trim().min(2, 'Podaj miejscowość.').max(100),
});
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Podaj imię i nazwisko.').max(100),
  email: z
    .email('Podaj poprawny email.')
    .max(200)
    .transform((s) => s.toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{7,25}$/, 'Podaj poprawny numer telefonu.'),
  address: addressSchema,
});
export const repairInputSchema = z.object({
  device: z.enum(['laptop', 'desktop']),
  brand: z.string().trim().min(2, 'Podaj producenta.').max(100),
  model: z.string().trim().min(2, 'Podaj model sprzętu.').max(100),
  problem: z.string().trim().min(10, 'Opisz usterkę w co najmniej 10 znakach.').max(3000),
  accessories: z.string().trim().max(500),
  sender: profileSchema,
});
export type Profile = z.infer<typeof profileSchema>;
export type RepairInput = z.infer<typeof repairInputSchema>;
export type User = Profile & { id: string; role: 'client' | 'staff' };
export const statuses = [
  'submitted',
  'in_transit',
  'received',
  'diagnostics',
  'awaiting_approval',
  'repairing',
  'returning',
  'completed',
] as const;
export type Status = (typeof statuses)[number];
export const statusLabels: Record<Status, string> = {
  submitted: 'Zgłoszone',
  in_transit: 'W drodze do serwisu',
  received: 'Przyjęte w serwisie',
  diagnostics: 'Diagnostyka',
  awaiting_approval: 'Oczekuje na akceptację',
  repairing: 'W naprawie',
  returning: 'Wysyłka zwrotna',
  completed: 'Zakończone',
};
export type Shipment = { tracking: string; direction: 'inbound' | 'return'; createdAt: string };
export type Quote = {
  amount: number;
  diagnosis: string;
  decision: 'pending' | 'accepted' | 'rejected';
};
export type HistoryEntry = { at: string; status: Status; message: string };
export type Repair = RepairInput & {
  id: string;
  userId: string;
  status: Status;
  createdAt: string;
  history: HistoryEntry[];
  shipments: Shipment[];
  quote?: Quote;
};
export type DemoState = { version: 1; users: User[]; repairs: Repair[]; sessionId: string | null };
export interface RepairRepository {
  list(actor: User): Repair[];
  get(id: string, actor: User): Repair | undefined;
  add(repair: Repair, actor: User): void;
  replace(repair: Repair, actor: User): void;
}
export interface AuthProvider {
  login(email: string): User;
  register(profile: Profile): User;
  logout(): void;
}
export interface ShippingProvider {
  create(repairId: string, direction: Shipment['direction']): Promise<Shipment>;
}
export interface NotificationProvider {
  list(repair: Repair): HistoryEntry[];
}

export function canRead(actor: User, repair: Repair) {
  return actor.role === 'staff' || actor.id === repair.userId;
}
export function assertOwner(actor: User, repair: Repair) {
  if (actor.role !== 'client' || actor.id !== repair.userId)
    throw new Error('To zgłoszenie należy do innego klienta.');
}
function assertStaff(actor: User) {
  if (actor.role !== 'staff') throw new Error('Ta czynność wymaga roli pracownika serwisu.');
}
function record(repair: Repair, status: Status, message: string): Repair {
  return {
    ...repair,
    status,
    history: [...repair.history, { at: new Date().toISOString(), status, message }],
  };
}
export function createRepair(
  input: RepairInput,
  userId: string,
  id = `PA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
): Repair {
  const parsed = repairInputSchema.parse(input);
  const now = new Date().toISOString();
  return {
    ...parsed,
    id,
    userId,
    status: 'submitted',
    createdAt: now,
    shipments: [],
    history: [
      {
        at: now,
        status: 'submitted',
        message: 'Przyjęto zgłoszenie. Przygotuj sprzęt do wysyłki.',
      },
    ],
  };
}
export function sendInbound(repair: Repair, actor: User, shipment: Shipment): Repair {
  assertOwner(actor, repair);
  if (repair.status !== 'submitted' || shipment.direction !== 'inbound')
    throw new Error('Przesyłka została już nadana lub zgłoszenie ma inny status.');
  return record(
    { ...repair, shipments: [...repair.shipments, shipment] },
    'in_transit',
    'Symulowane nadanie przesyłki do serwisu.',
  );
}
export function publishQuote(
  repair: Repair,
  actor: User,
  amount: number,
  diagnosis: string,
): Repair {
  assertStaff(actor);
  if (repair.status !== 'diagnostics') throw new Error('Wycenę można dodać podczas diagnostyki.');
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 100000 ||
    diagnosis.trim().length < 10 ||
    diagnosis.length > 3000
  )
    throw new Error('Podaj kwotę od 0,01 do 100 000 zł i diagnozę (10–3000 znaków).');
  return record(
    {
      ...repair,
      quote: {
        amount: Math.round(amount * 100) / 100,
        diagnosis: diagnosis.trim(),
        decision: 'pending',
      },
    },
    'awaiting_approval',
    'Wycena jest gotowa. Oczekujemy na decyzję klienta.',
  );
}
export function decideQuote(repair: Repair, actor: User, accepted: boolean): Repair {
  assertOwner(actor, repair);
  if (repair.status !== 'awaiting_approval' || repair.quote?.decision !== 'pending')
    throw new Error('Nie ma wyceny oczekującej na decyzję.');
  return record(
    { ...repair, quote: { ...repair.quote, decision: accepted ? 'accepted' : 'rejected' } },
    accepted ? 'repairing' : 'received',
    accepted
      ? 'Klient zaakceptował wycenę. Rozpoczynamy naprawę.'
      : 'Klient odrzucił wycenę. Sprzęt zostanie zwrócony bez naprawy.',
  );
}
export function nextStatuses(repair: Repair): Status[] {
  switch (repair.status) {
    case 'in_transit':
      return ['received'];
    case 'received':
      return repair.quote?.decision === 'rejected' ? [] : ['diagnostics'];
    case 'returning':
      return ['completed'];
    default:
      return [];
  }
}
export function advanceStatus(repair: Repair, actor: User, next: Status): Repair {
  assertStaff(actor);
  if (!nextStatuses(repair).includes(next)) throw new Error('Niedozwolona zmiana statusu.');
  return record(repair, next, statusLabels[next]);
}
export function sendReturn(repair: Repair, actor: User, shipment: Shipment): Repair {
  assertStaff(actor);
  if (
    !(
      repair.status === 'repairing' ||
      (repair.status === 'received' && repair.quote?.decision === 'rejected')
    ) ||
    shipment.direction !== 'return'
  )
    throw new Error('Sprzęt nie jest gotowy do wysyłki zwrotnej.');
  return record(
    { ...repair, shipments: [...repair.shipments, shipment] },
    'returning',
    'Symulowane nadanie przesyłki zwrotnej.',
  );
}
export function errorMessage(error: unknown): string {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? 'Sprawdź dane formularza.';
  return error instanceof Error
    ? error.message
    : 'Nie udało się wykonać operacji. Spróbuj ponownie.';
}

// Validate persisted demo data before rendering it (old or corrupted storage can be reset).
const userSchema = profileSchema.extend({
  id: z.string().min(1),
  role: z.enum(['client', 'staff']),
});
const shipmentSchema = z.object({
  tracking: z.string().min(1),
  direction: z.enum(['inbound', 'return']),
  createdAt: z.iso.datetime(),
});
const historySchema = z.object({
  at: z.iso.datetime(),
  status: z.enum(statuses),
  message: z.string(),
});
const repairSchema = repairInputSchema.extend({
  id: z.string().min(1),
  userId: z.string().min(1),
  status: z.enum(statuses),
  createdAt: z.iso.datetime(),
  history: z.array(historySchema),
  shipments: z.array(shipmentSchema),
  quote: z
    .object({
      amount: z.number().positive().max(100000),
      diagnosis: z.string().min(10),
      decision: z.enum(['pending', 'accepted', 'rejected']),
    })
    .optional(),
});
export const demoStateSchema = z.object({
  version: z.literal(1),
  users: z.array(userSchema),
  repairs: z.array(repairSchema),
  sessionId: z.string().nullable(),
});
