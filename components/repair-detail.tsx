'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useDemo } from './demo-provider';
import { PanelShell } from './panel-shell';
import {
  advanceStatus,
  decideQuote,
  errorMessage,
  nextStatuses,
  publishQuote,
  sendInbound,
  sendReturn,
  statusLabels,
  type Repair,
} from '@/lib/domain';
import { notificationProvider, shippingProvider } from '@/lib/mock-services';

function date(value: string) {
  return new Date(value).toLocaleString('pl-PL');
}
export function RepairDetail({ id }: { id: string }) {
  const { user, repairs } = useDemo();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const repair = user ? repairs.get(id, user) : undefined;
  function update(action: (repair: Repair) => Repair) {
    if (!user) return;
    setError('');
    try {
      const current = repairs.get(id, user);
      if (!current) throw new Error('Brak dostępu do zgłoszenia.');
      repairs.replace(action(current), user);
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  async function ship(direction: 'inbound' | 'return') {
    if (!repair || !user || busy) return;
    setBusy(true);
    setError('');
    try {
      const shipment = await shippingProvider.create(repair.id, direction);
      const current = repairs.get(id, user);
      if (!current) throw new Error('Brak dostępu do zgłoszenia.');
      repairs.replace(
        direction === 'inbound'
          ? sendInbound(current, user, shipment)
          : sendReturn(current, user, shipment),
        user,
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  function quote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    update((r) => publishQuote(r, user, Number(data.get('amount')), String(data.get('diagnosis'))));
  }
  return (
    <PanelShell title={repair ? repair.id : 'Szczegóły zgłoszenia'}>
      {!repair ? (
        <div className="app-card">
          <h2>Zgłoszenie jest niedostępne.</h2>
          <p>Nie istnieje w tej przeglądarce lub należy do innego klienta.</p>
          <Link href="/panel">Wróć do listy</Link>
        </div>
      ) : (
        <>
          <p>
            <span className="status-badge" data-status={repair.status}>
              {statusLabels[repair.status]}
            </span>
          </p>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          <div className="details-grid">
            <div>
              <section className="app-card">
                <h2>
                  {repair.brand} {repair.model}
                </h2>
                <dl>
                  <dt>Typ sprzętu</dt>
                  <dd>{repair.device === 'laptop' ? 'Laptop' : 'Komputer stacjonarny'}</dd>
                  <dt>Opis usterki</dt>
                  <dd>{repair.problem}</dd>
                  <dt>Akcesoria</dt>
                  <dd>{repair.accessories || 'Brak'}</dd>
                  <dt>Data zgłoszenia</dt>
                  <dd>{date(repair.createdAt)}</dd>
                </dl>
              </section>
              <section className="app-card">
                <h2>Wycena naprawy</h2>
                {repair.quote ? (
                  <>
                    <p className="quote-amount">
                      {repair.quote.amount.toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN',
                      })}
                    </p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{repair.quote.diagnosis}</p>
                    <p className="muted">
                      Decyzja:{' '}
                      {
                        {
                          pending: 'oczekuje na akceptację',
                          accepted: 'zaakceptowana',
                          rejected: 'odrzucona',
                        }[repair.quote.decision]
                      }
                    </p>
                    {user?.role === 'client' && repair.status === 'awaiting_approval' && (
                      <div className="form-actions">
                        <button
                          className="button"
                          onClick={() => update((r) => decideQuote(r, user, true))}
                        >
                          Akceptuję wycenę
                        </button>
                        <button
                          className="button secondary"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Odrzucić wycenę? Sprzęt zostanie zwrócony bez naprawy.',
                              )
                            )
                              update((r) => decideQuote(r, user, false));
                          }}
                        >
                          Odrzucam wycenę
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="muted">Wycena pojawi się po diagnostyce sprzętu.</p>
                )}
                {user?.role === 'staff' && repair.status === 'diagnostics' && (
                  <form onSubmit={quote}>
                    <label>
                      Diagnoza *
                      <textarea name="diagnosis" required minLength={10} maxLength={3000} />
                    </label>
                    <label>
                      Kwota brutto (PLN) *
                      <input
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="100000"
                        required
                      />
                    </label>
                    <button type="submit">Przekaż wycenę klientowi</button>
                  </form>
                )}
              </section>
              {user?.role === 'staff' && (
                <section className="app-card no-print">
                  <h2>Obsługa zgłoszenia</h2>
                  <div className="form-actions">
                    {nextStatuses(repair).map((next) => (
                      <button
                        className="button"
                        key={next}
                        onClick={() => update((r) => advanceStatus(r, user, next))}
                      >
                        {next === 'received'
                          ? 'Potwierdź przyjęcie sprzętu'
                          : next === 'diagnostics'
                            ? 'Rozpocznij diagnostykę'
                            : 'Potwierdź zakończenie'}
                      </button>
                    ))}
                    {(repair.status === 'repairing' ||
                      (repair.status === 'received' && repair.quote?.decision === 'rejected')) && (
                      <button className="button" disabled={busy} onClick={() => ship('return')}>
                        {busy
                          ? 'Przygotowywanie…'
                          : repair.quote?.decision === 'rejected'
                            ? 'Zwróć sprzęt bez naprawy'
                            : 'Zakończ naprawę i nadaj zwrot'}
                      </button>
                    )}
                  </div>
                  <p className="muted">
                    {repair.status === 'awaiting_approval'
                      ? 'Poczekaj na decyzję klienta. Sprawdzisz ją po zalogowaniu na jego konto w tej samej przeglądarce.'
                      : repair.status === 'submitted'
                        ? 'Klient musi najpierw przygotować przesyłkę demo.'
                        : repair.status === 'completed'
                          ? 'Zgłoszenie zostało zakończone.'
                          : 'Kolejne czynności zależą od bieżącego statusu zgłoszenia.'}
                  </p>
                </section>
              )}
              <section className="app-card">
                <h2>Historia i powiadomienia</h2>
                <ol className="timeline">
                  {notificationProvider
                    .list(repair)
                    .slice()
                    .reverse()
                    .map((entry, i) => (
                      <li key={`${entry.at}-${i}`}>
                        <time dateTime={entry.at}>{date(entry.at)}</time>
                        <p>
                          <strong>{statusLabels[entry.status]}</strong>
                        </p>
                        <p>{entry.message}</p>
                      </li>
                    ))}
                </ol>
                <p className="muted">
                  Powiadomienia demo są widoczne tutaj. Nie wysyłamy emaili ani SMS-ów.
                </p>
              </section>
            </div>
            <div>
              <section className="app-card">
                <h2>Dane nadawcy</h2>
                <p>
                  {repair.sender.name}
                  <br />
                  {repair.sender.email}
                  <br />
                  {repair.sender.phone}
                </p>
                <h3>Adres zwrotny</h3>
                <p>
                  {repair.sender.address.street}
                  <br />
                  {repair.sender.address.postalCode} {repair.sender.address.city}
                </p>
              </section>
              <section className="app-card">
                <h2>Przesyłki</h2>
                {!repair.shipments.length && (
                  <p className="muted">Nie przygotowano jeszcze przesyłki.</p>
                )}
                {repair.shipments.map((shipment) => (
                  <div key={shipment.tracking}>
                    <h3>{shipment.direction === 'inbound' ? 'Do serwisu' : 'Do klienta'}</h3>
                    <p>
                      Numer testowy: <strong>{shipment.tracking}</strong>
                      <br />
                      <span className="muted">{date(shipment.createdAt)}</span>
                    </p>
                    <div className="label-demo">
                      <strong>ETYKIETA DEMO — NIE NADAWAJ PACZKI</strong>
                      <p>
                        {repair.id} · {shipment.tracking}
                      </p>
                      <p>
                        {shipment.direction === 'inbound'
                          ? 'Odbiorca: Pogromcy awarii (adres nadania zostanie potwierdzony przez serwis).'
                          : `Odbiorca: ${repair.sender.name}, ${repair.sender.address.street}, ${repair.sender.address.postalCode} ${repair.sender.address.city}`}
                      </p>
                      <p>Dokument testowy. Nie stanowi etykiety przewoźnika.</p>
                    </div>
                  </div>
                ))}
                {user?.role === 'client' && repair.status === 'submitted' && (
                  <button className="button" disabled={busy} onClick={() => ship('inbound')}>
                    {busy ? 'Przygotowywanie…' : 'Przygotuj przesyłkę demo'}
                  </button>
                )}
                {!!repair.shipments.length && (
                  <button
                    className="button secondary no-print"
                    style={{ marginTop: 20 }}
                    onClick={() => window.print()}
                  >
                    Drukuj podsumowanie i etykietę demo
                  </button>
                )}
              </section>
              <section className="app-card">
                <h2>Jak zapakować sprzęt?</h2>
                <ol className="packing">
                  <li>Wykonaj kopię zapasową danych i wyłącz urządzenie.</li>
                  <li>
                    Zabezpiecz sprzęt materiałem amortyzującym. Użyj mocnego kartonu i wypełnij
                    wolną przestrzeń.
                  </li>
                  <li>Akcesoria zapakuj oddzielnie i dołącz numer zgłoszenia.</li>
                  <li>Przed prawdziwą wysyłką potwierdź z serwisem adres i sposób nadania.</li>
                </ol>
                <a href="tel:+48510265219">Skontaktuj się z serwisem: 510 265 219</a>
              </section>
            </div>
          </div>
        </>
      )}
    </PanelShell>
  );
}
