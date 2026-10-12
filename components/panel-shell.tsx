'use client';
import Link from 'next/link';
import { useDemo } from './demo-provider';
import type { ReactNode } from 'react';
export function PanelShell({
  children,
  title,
  staff = false,
}: {
  children: ReactNode;
  title: string;
  staff?: boolean;
}) {
  const { state, user, reset } = useDemo();
  if (!state)
    return (
      <section className="app-wrap">
        <p role="status">Przygotowujemy dane demo…</p>
      </section>
    );
  if (!user)
    return (
      <section className="app-wrap">
        <h1>Zaloguj się do swojego konta.</h1>
        <p>Zobacz naprawy i przygotuj wysyłkę sprzętu.</p>
        <Link className="button" href="/logowanie">
          Zaloguj się
        </Link>{' '}
        <Link href="/rejestracja">Utwórz konto demo</Link>
      </section>
    );
  if (staff && user.role !== 'staff')
    return (
      <section className="app-wrap">
        <h1>Panel serwisu</h1>
        <p>Ta część jest dostępna dla pracowników serwisu.</p>
        <Link href="/panel">Wróć do moich zgłoszeń</Link>
      </section>
    );
  return (
    <section className="app-wrap">
      <p className="eyebrow">
        {user.role === 'staff' ? 'Panel serwisu' : 'Panel klienta'} / {user.name}
      </p>
      <div className="app-heading">
        <h1>{title}</h1>
        <Link className="button" href={user.role === 'staff' ? '/serwis' : '/panel/nowe'}>
          {user.role === 'staff' ? 'Wszystkie zgłoszenia' : 'Nowe zgłoszenie'}
        </Link>
      </div>
      <div className="panel-tabs" role="navigation" aria-label="Panel użytkownika">
        <Link href={user.role === 'staff' ? '/serwis' : '/panel'}>Zgłoszenia</Link>
        <Link href="/panel/profil">Mój profil</Link>
        {user.role === 'staff' && <Link href="/serwis/uzytkownicy">Użytkownicy</Link>}
        <button
          className="link-button"
          onClick={() => {
            if (
              window.confirm(
                'Przywrócić dane początkowe? Usunie to lokalne konta i zgłoszenia demo oraz wyloguje Cię.',
              )
            )
              reset();
          }}
        >
          Resetuj demo
        </button>
      </div>
      {children}
    </section>
  );
}
