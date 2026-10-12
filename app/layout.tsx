import type { Metadata } from 'next';
import { DemoProvider } from '@/components/demo-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { DemoNotice } from '@/components/demo-notice';
import './site.css';
import './app.css';
export const metadata: Metadata = {
  title: { default: 'Pogromcy awarii — serwis komputerowy', template: '%s | Pogromcy awarii' },
  description:
    'Naprawa komputerów i laptopów. Zgłoś usterkę, przygotuj wysyłkę i śledź naprawę w swoim panelu.',
  icons: { icon: '/assets/images/cropped-site-32x32.jpg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>
        <DemoProvider>
          <a className="skip" href="#main">
            Przejdź do treści
          </a>
          <SiteHeader />
          <DemoNotice />
          <main id="main">{children}</main>
          <SiteFooter />
        </DemoProvider>
      </body>
    </html>
  );
}
