'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from './demo-provider';
import { PanelShell } from './panel-shell';
import { ProfileFields, readProfile } from './profile-fields';
import { repairInputSchema, errorMessage, type RepairInput } from '@/lib/domain';
export function NewRepair() {
  const { user, repairs } = useDemo();
  const router = useRouter();
  const [draft, setDraft] = useState<RepairInput | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      setDraft(
        repairInputSchema.parse({
          device: data.get('device'),
          brand: data.get('brand'),
          model: data.get('model'),
          problem: data.get('problem'),
          accessories: data.get('accessories'),
          sender: readProfile(data),
        }),
      );
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  async function save() {
    if (!draft || !user || busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/demo/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: draft, userId: user.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Nie udało się utworzyć zgłoszenia.');
      repairs.add(data.repair, user);
      router.push(`/panel/zgloszenia/${data.repair.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <PanelShell title="Zgłoś naprawę">
      {user?.role === 'staff' ? (
        <p>Zgłoszenia tworzy klient. Zaloguj się na konto klienta demo, aby sprawdzić formularz.</p>
      ) : (
        user && (
          <div className="app-card">
            <p className="eyebrow">{draft ? '02 / Podsumowanie' : '01 / Sprzęt i dane wysyłki'}</p>
            <form onSubmit={review} hidden={!!draft}>
              <div className="form-grid">
                <label>
                  Typ sprzętu *
                  <select name="device" defaultValue="laptop">
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Komputer stacjonarny</option>
                  </select>
                </label>
                <label>
                  Producent *<input name="brand" required minLength={2} maxLength={100} />
                </label>
                <label>
                  Model *<input name="model" required minLength={2} maxLength={100} />
                </label>
                <label>
                  Dołączone akcesoria
                  <input
                    name="accessories"
                    maxLength={500}
                    placeholder="Np. zasilacz, kabel lub brak"
                  />
                </label>
                <label className="full">
                  Opis usterki *
                  <textarea
                    name="problem"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={5}
                    placeholder="Co się dzieje i kiedy pojawia się problem?"
                  />
                </label>
              </div>
              <h2>Dane nadawcy i adres zwrotny</h2>
              <ProfileFields profile={user} />
              <button type="submit">Sprawdź podsumowanie</button>
            </form>
            {draft && (
              <div className="review-summary">
                <h2>
                  {draft.brand} {draft.model}
                </h2>
                <dl>
                  <dt>Typ sprzętu</dt>
                  <dd>{draft.device === 'laptop' ? 'Laptop' : 'Komputer stacjonarny'}</dd>
                  <dt>Usterka</dt>
                  <dd>{draft.problem}</dd>
                  <dt>Akcesoria</dt>
                  <dd>{draft.accessories || 'Brak'}</dd>
                  <dt>Nadawca</dt>
                  <dd>
                    {draft.sender.name}
                    <br />
                    {draft.sender.email}
                    <br />
                    {draft.sender.phone}
                  </dd>
                  <dt>Adres zwrotny</dt>
                  <dd>
                    {draft.sender.address.street}
                    <br />
                    {draft.sender.address.postalCode} {draft.sender.address.city}
                  </dd>
                </dl>
                <p className="muted" style={{ marginTop: 24 }}>
                  Zatwierdzenie utworzy zgłoszenie demo. W kolejnym kroku przygotujesz przesyłkę.
                </p>
                <div className="form-actions">
                  <button className="button" disabled={busy} onClick={save}>
                    {busy ? 'Tworzenie…' : 'Zatwierdź zgłoszenie'}
                  </button>
                  <button
                    className="button secondary"
                    disabled={busy}
                    onClick={() => {
                      setDraft(null);
                      setError('');
                    }}
                  >
                    Popraw dane
                  </button>
                </div>
              </div>
            )}
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
          </div>
        )
      )}
    </PanelShell>
  );
}
