
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { getUserOnServer } from '@/lib/auth';
import { GoogleAnalytics } from '@/components/google-analytics';

export const metadata: Metadata = {
  title: 'ProHub',
  description: 'Manage your user profile with ease.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserOnServer();
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/fevicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full">
        <div className="overflow-x-hidden">
          <GoogleAnalytics gaId="G-9TK0FLDJ3Z" />
          <div className="flex flex-col min-h-screen">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Footer year={currentYear} />
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
