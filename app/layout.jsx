import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Geist, DM_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-geist' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-mono' });

export const metadata = {
  title: 'OGGEL digital — Web design studio',
  description: 'OGGEL digital — a one-person web design and digital solutions studio based in Amsterdam.'
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${dmMono.variable}`}>
      <body data-cursor="dot" data-am="accent" data-heroblobs="both" className="dense">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
