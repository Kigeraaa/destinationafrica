import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Destination Africa — Book Africa\'s Best Travel Experiences',
  description: 'Safaris, beaches, culture, food, cities and luxury escapes from verified African tour operators.',
  openGraph: {
    title: 'Destination Africa',
    description: 'Book Africa\'s best travel experiences from verified local operators.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}