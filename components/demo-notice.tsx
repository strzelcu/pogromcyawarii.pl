'use client';
import { useDemo } from './demo-provider';
export function DemoNotice() {
  const { storageError } = useDemo();
  return (
    <div className="demo-notice">
      <p>
        <strong>Wersja demonstracyjna.</strong> Konta, zgłoszenia i przesyłki są testowe. Dane
        zapisują się tylko w tej przeglądarce.
      </p>
      {storageError && <p role="alert">{storageError}</p>}
    </div>
  );
}
