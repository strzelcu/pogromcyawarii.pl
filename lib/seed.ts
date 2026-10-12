import {
  advanceStatus,
  createRepair,
  publishQuote,
  sendInbound,
  type DemoState,
  type User,
} from './domain';
export function createSeed(): DemoState {
  const users: User[] = [
    {
      id: 'client-anna',
      role: 'client',
      name: 'Anna Kowalska',
      email: 'klient@example.com',
      phone: '500 100 200',
      address: { street: 'Polna 12/3', postalCode: '47-100', city: 'Strzelce Opolskie' },
    },
    {
      id: 'client-piotr',
      role: 'client',
      name: 'Piotr Nowak',
      email: 'piotr@example.com',
      phone: '500 200 300',
      address: { street: 'Leśna 8', postalCode: '47-120', city: 'Zawadzkie' },
    },
    {
      id: 'staff-demo',
      role: 'staff',
      name: 'Pracownik serwisu',
      email: 'serwis@example.com',
      phone: '510 265 219',
      address: {
        street: 'Osiedle Piastów Śląskich 14/11',
        postalCode: '47-100',
        city: 'Strzelce Opolskie',
      },
    },
  ];
  const first = createRepair(
    {
      device: 'laptop',
      brand: 'Lenovo',
      model: 'ThinkPad T14',
      problem: 'Laptop przegrzewa się i wyłącza podczas pracy.',
      accessories: 'Zasilacz',
      sender: users[0],
    },
    users[0].id,
    'PA-DEMO-001',
  );
  const inbound = sendInbound(first, users[0], {
    tracking: 'DEMO-SEED-001',
    direction: 'inbound',
    createdAt: first.createdAt,
  });
  const received = advanceStatus(inbound, users[2], 'received');
  const diagnostic = advanceStatus(received, users[2], 'diagnostics');
  const quoted = publishQuote(
    diagnostic,
    users[2],
    249,
    'Czyszczenie układu chłodzenia i wymiana pasty termoprzewodzącej.',
  );
  const second = createRepair(
    {
      device: 'desktop',
      brand: 'Dell',
      model: 'OptiPlex 7090',
      problem: 'Komputer nie uruchamia się po naciśnięciu przycisku zasilania.',
      accessories: 'Kabel zasilający',
      sender: users[1],
    },
    users[1].id,
    'PA-DEMO-002',
  );
  return { version: 1, users, repairs: [quoted, second], sessionId: null };
}
