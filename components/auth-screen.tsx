'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useDemo } from './demo-provider';
import { ProfileFields, readProfile } from './profile-fields';
import { errorMessage } from '@/lib/domain';
export function AuthScreen({ register = false }: { register?: boolean }) {
  const { auth, state, user } = useDemo();
  const router = useRouter();
  const [error, setError] = useState('');
  function login(email: string) {
    try {
      const actor = auth.login(email);
      router.push(actor.role === 'staff' ? '/serwis' : '/panel');
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    if (!register) {
      login(String(data.get('email')));
      return;
    }
    try {
      auth.register(readProfile(data));
      router.push('/panel');
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  return (
    <section className="app-wrap auth-wrap">
      <p className="eyebrow">Twoje konto</p>
      <h1>{register ? 'Utwórz konto demo.' : 'Witaj ponownie.'}</h1>
      <p className="muted">
        Logowanie jest symulowane: wystarczy email konta demo. Nie podawaj prawdziwego hasła ani
        danych osobowych.
      </p>
      {user && (
        <p className="success alert">
          Jesteś zalogowany jako {user.name}.{' '}
          <Link href={user.role === 'staff' ? '/serwis' : '/panel'}>Przejdź do panelu</Link>.
        </p>
      )}
      {!state ? (
        <p role="status">Przygotowujemy konta…</p>
      ) : (
        <div className="app-card">
          <form onSubmit={submit}>
            {register ? (
              <ProfileFields />
            ) : (
              <label>
                Email konta demo
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  placeholder="klient@example.com"
                />
              </label>
            )}
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            <button type="submit">{register ? 'Utwórz konto' : 'Zaloguj się'}</button>
          </form>
          {!register && (
            <>
              <p className="muted" style={{ marginTop: 24 }}>
                Możesz też wybrać gotowe konto:
              </p>
              <div className="demo-accounts">
                <button className="button secondary" onClick={() => login('klient@example.com')}>
                  Klient demo
                </button>
                <button className="button secondary" onClick={() => login('serwis@example.com')}>
                  Serwis demo
                </button>
              </div>
            </>
          )}
          <p className="notice-link">
            {register ? (
              <Link href="/logowanie">Masz konto? Zaloguj się</Link>
            ) : (
              <Link href="/rejestracja">Utwórz konto demo</Link>
            )}
          </p>
        </div>
      )}
    </section>
  );
}
