import Script from 'next/script';
export function GoogleReviews() {
  return (
    <section id="opinions" className="wrap">
      <p className="eyebrow">03 / Opinie</p>
      <h2>
        Najlepsza rekomendacja?
        <br />
        Zadowolony klient.
      </h2>
      <div className="reviews-widget">
        <div className="elfsight-app-c44c6aac-425a-43a1-a9cc-a852a528cde2" data-elfsight-app-lazy />
      </div>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className="reviews-profile">
        <div>
          <p className="eyebrow">Opinie w Google</p>
          <h3>Twoje zaufanie ma znaczenie.</h3>
          <p>
            Sprawdź, co klienci mówią o naszym serwisie. Po wizycie podziel się też swoją opinią.
          </p>
        </div>
        <a className="button" href="https://share.google/mKe3rNKmiIHc8blY0">
          Zobacz opinie w Google ↗
        </a>
      </div>
    </section>
  );
}
