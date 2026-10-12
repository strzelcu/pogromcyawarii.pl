'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="app-wrap">
      <h1>Nie udało się otworzyć strony.</h1>
      <p>Spróbuj ponownie. Zapisane dane demo pozostają w przeglądarce.</p>
      <button className="button" onClick={reset}>
        Spróbuj ponownie
      </button>
    </section>
  );
}
