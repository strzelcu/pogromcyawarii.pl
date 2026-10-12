'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useDemo } from './demo-provider';
import { PanelShell } from './panel-shell';
import { statuses, statusLabels } from '@/lib/domain';
export function RepairList({ staff = false }: { staff?: boolean }) {
  const { user, repairs } = useDemo();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const all = user ? repairs.list(user) : [];
  const visible = all.filter(
    (r) =>
      (!filter || r.status === filter) &&
      `${r.id} ${r.brand} ${r.model} ${staff ? r.sender.name : ''}`
        .toLocaleLowerCase('pl')
        .includes(search.toLocaleLowerCase('pl')),
  );
  return (
    <PanelShell staff={staff} title={staff ? 'Zgłoszenia serwisowe' : 'Moje zgłoszenia'}>
      <div className="list-filters">
        <label>
          Szukaj zgłoszenia
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={staff ? 'Numer, sprzęt lub klient' : 'Numer lub sprzęt'}
          />
        </label>
        <label>
          Status
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Wszystkie statusy</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="muted">
        Zgłoszenia: {visible.length} z {all.length}
      </p>
      <div className="repair-list">
        {visible.map((r) => (
          <Link className="repair-card" key={r.id} href={`/panel/zgloszenia/${r.id}`}>
            <div>
              <p>
                {r.id}
                {staff ? ` · ${r.sender.name}` : ''}
              </p>
              <h2>
                {r.brand} {r.model}
              </h2>
              <p>{new Date(r.createdAt).toLocaleDateString('pl-PL')}</p>
            </div>
            <span className="status-badge" data-status={r.status}>
              {statusLabels[r.status]}
            </span>
          </Link>
        ))}
        {!visible.length && (
          <div className="empty">
            <h2>{all.length ? 'Brak pasujących zgłoszeń.' : 'Tutaj pojawią się Twoje naprawy.'}</h2>
            <p>
              {all.length
                ? 'Zmień wyszukiwanie lub status.'
                : 'Dodaj sprzęt i opisz usterkę, żeby przygotować wysyłkę.'}
            </p>
            {!staff && (
              <Link className="button" href="/panel/nowe">
                Zgłoś naprawę
              </Link>
            )}
          </div>
        )}
      </div>
    </PanelShell>
  );
}
