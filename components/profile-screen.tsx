'use client';
import { useState, type FormEvent } from 'react';
import { useDemo } from './demo-provider';
import { PanelShell } from './panel-shell';
import { ProfileFields, readProfile } from './profile-fields';
import { errorMessage } from '@/lib/domain';
export function ProfileScreen() {
  const { user, updateProfile } = useDemo();
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaved(false);
    try {
      updateProfile(readProfile(new FormData(event.currentTarget)));
      setSaved(true);
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  return (
    <PanelShell title="Mój profil">
      {user && (
        <div className="app-card">
          <p className="muted">
            Te dane uzupełnią kolejne zgłoszenia. Istniejące zgłoszenia zachowują dane podane przy
            ich tworzeniu.
          </p>
          <form key={user.id} onSubmit={submit}>
            <ProfileFields profile={user} />
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            {saved && (
              <p className="alert success" role="status">
                Zapisano profil.
              </p>
            )}
            <button type="submit">Zapisz profil</button>
          </form>
        </div>
      )}
    </PanelShell>
  );
}
