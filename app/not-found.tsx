import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="app-wrap">
      <h1>Nie znaleziono strony.</h1>
      <Link className="button" href="/">
        Wróć na stronę główną
      </Link>
    </section>
  );
}
