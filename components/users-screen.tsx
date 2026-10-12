'use client';
import { useDemo } from './demo-provider';
import { PanelShell } from './panel-shell';
export function UsersScreen() {
  const { state, user } = useDemo();
  return (
    <PanelShell staff title="Użytkownicy">
      {user?.role === 'staff' && (
        <div className="app-card table-scroll">
          <table className="user-table">
            <caption>Użytkownicy zapisani w tej przeglądarce</caption>
            <thead>
              <tr>
                <th scope="col">Imię i nazwisko</th>
                <th scope="col">Email</th>
                <th scope="col">Rola</th>
                <th scope="col">Zgłoszenia</th>
              </tr>
            </thead>
            <tbody>
              {state?.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'staff' ? 'Pracownik serwisu' : 'Klient'}</td>
                  <td>{state.repairs.filter((r) => r.userId === u.id).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelShell>
  );
}
