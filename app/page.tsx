import Link from 'next/link';
import { HeroPhotos, Gallery } from '@/components/site-photos';
import { GoogleReviews } from '@/components/google-reviews';
export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span></span> Serwis komputerowy · Strzelce Opolskie
          </p>
          <h1 id="hero-title">
            Sprawny komputer.
            <br />
            <em>Spokojna głowa.</em>
          </h1>
          <p className="hero-description">
            Naprawiamy komputery i laptopy, rozwiązujemy problemy z oprogramowaniem i pomagamy
            odzyskać dane.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/panel/nowe">
              Zgłoś naprawę <span aria-hidden="true">↗</span>
            </Link>
            <a className="text-link" href="#services">
              Poznaj nasze usługi <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-area">
            Strzelce Opolskie <span> / </span> Zawadzkie <span> / </span> Rożniątów
          </p>
        </div>
        <HeroPhotos />
      </section>
      <section id="whoweare" className="wrap about">
        <p className="eyebrow">01 / O nas</p>
        <h2>
          Fachowa pomoc.
          <br />
          Rozsądne decyzje.
        </h2>
        <p>
          Nasz zespół to specjaliści o szerokiej wiedzy z zakresu technologii sprzętu komputerowego
          oraz oprogramowania.
        </p>
        <p>
          Realizujemy również fachową pomoc podczas wyboru sprzętu komputerowego. Chętnie doradzimy
          Ci jaki komputer będzie odpowiedni do Twoich potrzeb – na co warto wydać pieniądze, a
          czego nie warto kupować.
        </p>
        <p>
          Często spotykamy się z sytuacją gdy ktoś znacznie przepłacił za sprzęt komputerowy tylko
          dlatego, że sprzedawca nakłonił go do niepotrzebnego zakupu ładnie prezentując produkt.
          Rzetelnie przedstawiamy rozkład wydatków.
        </p>
        <p>
          Stosujemy zasadę „Kupujesz ile potrzebujesz”. Nasz cel to likwidacja awarii i Twoje
          zadowolenie z naszych usług.
        </p>{' '}
      </section>
      <section className="wrap locations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Blisko Ciebie</p>
            <h2>Gdzie działamy</h2>
          </div>
          <p>Trzy lokalizacje. Ten sam cel: sprawny sprzęt i Twoje zadowolenie.</p>
        </div>
        <picture>
          <source media="(max-width: 600px)" srcSet="/assets/images/punkty_mobile.jpg" />
          <img
            loading="lazy"
            src="/assets/images/punkty.jpg"
            alt="Punkty serwisowe: Strzelce Opolskie, Zawadzkie i Rożniątów"
          />
        </picture>
      </section>
      <section id="services" className="wrap">
        <span id="zakres"></span>
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / Usługi</p>
            <h2>
              Rozwiązanie dla
              <br />
              Twojego sprzętu.
            </h2>
          </div>
          <p>Od diagnostyki po modernizację — dobieramy zakres prac do Twoich potrzeb.</p>
        </div>
        <div className="services">
          <article>
            <div className="service-top">
              <span className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 32 32"
                  width={32}
                  height={32}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.5" y="5" width={19} height={15} rx="2" />
                  <path d="M3 16h18M12 20v5M7.5 25h9" />
                  <rect x="25" y="5" width="4.5" height={21} rx="1.5" />
                  <path d="M26.5 9H28M26.5 12H28" />
                  <circle cx="27.25" cy="22" r=".6" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="service-number" aria-hidden="true">
                01
              </span>
            </div>
            <h3>
              <strong>Komputery stacjonarne</strong>
            </h3>
            <ul>
              <li>naprawa,</li>
              <li>modernizacja,</li>
              <li>składanie z wybranych części,</li>
              <li>konserwacja,</li>
              <li>rozbudowa,</li>
              <li>instalacja oprogramowania,</li>
              <li>czyszczenie układu chłodzenia,</li>
              <li>montaż wybranej części,</li>
              <li>ogólna diagnostyka.</li>
            </ul>{' '}
          </article>
          <article>
            <div className="service-top">
              <span className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 32 32"
                  width={32}
                  height={32}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="5.5" width={20} height={16} rx="2" />
                  <path d="m6 21.5-3.5 4a1 1 0 0 0 .8 1.5h25.4a1 1 0 0 0 .8-1.5l-3.5-4M12.5 24h7M10 9.5h12" />
                </svg>
              </span>
              <span className="service-number" aria-hidden="true">
                02
              </span>
            </div>
            <h3>
              <strong>Laptopy i netbooki</strong>
            </h3>
            <ul>
              <li>
                wymiana:
                <ul>
                  <li>matrycy,</li>
                  <li>klawiatury,</li>
                  <li>obudowy,</li>
                  <li>gniazda zasilania,</li>
                </ul>
              </li>
              <li>naprawa po zalaniu,</li>
              <li>modernizacja,</li>
              <li>czyszczenie układu chłodzenia,</li>
              <li>montaż wybranej części,</li>
              <li>ogólna diagnostyka.</li>
            </ul>{' '}
          </article>
          <article>
            <div className="service-top">
              <span className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 32 32"
                  width={32}
                  height={32}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4.5" width={26} height={23} rx="3" />
                  <path d="M3 10.5h26M11 15l-4 4 4 4M21 15l4 4-4 4M18 14l-4 10" />
                  <circle cx="7" cy="7.5" r=".7" fill="currentColor" stroke="none" />
                  <circle cx="10" cy="7.5" r=".7" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="service-number" aria-hidden="true">
                03
              </span>
            </div>
            <h3>
              <strong>Oprogramowanie</strong>
            </h3>
            <ul>
              <li>reinstalacja systemu Windows, </li>
              <li>aktualizacja systemu, </li>
              <li>instalacja i konfiguracja wybranych urządzeń, </li>
              <li>usuwanie wirusów i złośliwego oprogramowania, </li>
              <li>instalacja pakietów office, </li>
              <li>zabezpieczenie komputera.</li>
            </ul>{' '}
          </article>
          <article>
            <div className="service-top">
              <span className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 32 32"
                  width={32}
                  height={32}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 14.5 8.5 7h15l2.5 7.5" />
                  <rect x="5" y="14.5" width={22} height={12} rx="3" />
                  <path d="M9 22h6M20 18.5a4 4 0 1 1-2 4.5M17.5 18.5H21v3.5" />
                </svg>
              </span>
              <span className="service-number" aria-hidden="true">
                04
              </span>
            </div>
            <h3>
              <strong>Dodatkowo oferujemy</strong>
            </h3>
            <ul>
              <li>
                odzyskiwanie danych
                <ul>
                  <li>z zalanych laptopów, </li>
                  <li>uszkodzonych nośników,</li>
                  <li>uszkodzonych dysków twardych, </li>
                  <li>usuniętych plików, </li>
                  <li>utraconych plików wskutek formatowania</li>
                </ul>
              </li>
            </ul>
            <div>
              <ul>
                <li>
                  fachowe doradztwo
                  <ul>
                    <li>przy zakupie sprzętu,</li>
                    <li>pomoc z wyborem części,</li>
                    <li>urządzeń,</li>
                    <li>sprzęt dopasowany do potrzeb klienta.</li>
                  </ul>
                </li>
              </ul>
            </div>{' '}
          </article>
        </div>
      </section>
      <GoogleReviews />
      <section id="gallery" className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / Z serwisu</p>
            <h2>Liczą się szczegóły.</h2>
          </div>
          <p>Zajrzyj do naszego warsztatu. Kliknij zdjęcie, aby zobaczyć je z bliska.</p>
        </div>
        <Gallery />
      </section>
      <section id="contact" className="wrap">
        <p className="eyebrow">05 / Kontakt</p>
        <h2>
          Porozmawiajmy
          <br />o Twoim komputerze.
        </h2>
        <p className="contact-intro">
          Opisz problem lub po prostu zadzwoń. Wspólnie ustalimy kolejny krok.
        </p>
        <div className="contact">
          <div>
            <h3>Dane kontaktowe</h3>
            <p>
              <strong>
                „Pogromcy awarii”
                <br />
                MP BRAND Mateusz Porombka
              </strong>
            </p>
            <p>
              {' '}
              ul. Osiedle Piastów Śląskich 14/11
              <br />
              47-100 Strzelce Opolskie
              <br /> 510 265 219
              <br /> <a href="mailto:kontakt@pogromcyawarii.pl">kontakt@pogromcyawarii.pl</a>
            </p>
            <p>
              <a href="https://www.google.com/maps/dir/?api=1&amp;destination=Osiedle%20Piast%C3%B3w%20%C5%9Al%C4%85skich%2014%2F11%2C%20Strzelce%20Opolskie%2C%20Polska">
                <strong>Strzelce Opolskie, Osiedle Piastów Śląskich 14/11</strong>{' '}
                <span aria-hidden="true">↗</span>
              </a>
            </p>
            <p>
              <a href="https://www.google.com/maps/dir/?api=1&amp;destination=Opolska%2C%20Zawadzkie%2C%20Polska">
                <strong>Zawadzkie, ul. Opolska</strong> <span aria-hidden="true">↗</span>
              </a>{' '}
              (po uprzednim kontakcie tel.)
            </p>
            <p>
              <a href="https://www.google.com/maps/dir/?api=1&amp;destination=Kr%C3%B3tka%2023%2C%20Ro%C5%BCni%C4%85t%C3%B3w%2C%20Polska">
                <strong>Rożniątów, ul. Krótka 23</strong> <span aria-hidden="true">↗</span>
              </a>
            </p>{' '}
            <a className="button" href="tel:+48510265219">
              Zadzwoń: 510 265 219
            </a>
            <iframe
              loading="lazy"
              title="Lokalizacja Pogromców awarii"
              src="https://maps.google.com/maps?q=Pogromcy%20awarii&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near"
            ></iframe>
          </div>
          <div>
            <h3>Zgłoś sprzęt do naprawy</h3>
            <p>Opisz usterkę i przygotuj wysyłkę w swoim panelu.</p>
            <Link className="button" href="/panel/nowe">
              Zgłoś naprawę
            </Link>
            <p className="contact-email">
              Masz pytanie? <a href="mailto:kontakt@pogromcyawarii.pl">Napisz do nas</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
