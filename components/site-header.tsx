'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDemo } from './demo-provider';
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, auth } = useDemo();
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Pogromcy awarii — strona główna">
          <img
            className="logo"
            src="/assets/images/logo.png"
            alt="Pogromcy awarii"
            width="250"
            height="80"
          />
        </Link>
        <button
          id="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          <span>Menu</span>
          <span className="menu-lines" aria-hidden="true" />
        </button>
        <nav
          id="navigation"
          className={open ? 'open' : ''}
          aria-label="Menu główne"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
        >
          <Link
            href="/"
            aria-current={pathname === '/' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Start
          </Link>
          <Link href="/#services" onClick={() => setOpen(false)}>
            Usługi
          </Link>
          <Link href="/#contact" onClick={() => setOpen(false)}>
            Kontakt
          </Link>
          <Link href="/panel/nowe" onClick={() => setOpen(false)}>
            Zgłoś naprawę
          </Link>
          <Link href={user?.role === 'staff' ? '/serwis' : '/panel'} onClick={() => setOpen(false)}>
            {user ? 'Moje konto' : 'Zaloguj się'}
          </Link>
          {user && (
            <button
              className="link-button"
              onClick={() => {
                auth.logout();
                setOpen(false);
              }}
            >
              Wyloguj
            </button>
          )}
        </nav>
        <a className="header-phone" href="tel:+48510265219">
          510 265 219 ↗
        </a>
      </div>
    </header>
  );
}
