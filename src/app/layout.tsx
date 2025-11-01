import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { getUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'ProHub',
  description: 'Manage your user profile with ease.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2882939249270622"
     crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased h-full overflow-x-hidden">
          <div className="flex flex-col min-h-screen">
            <Header user={user} />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
      </body>
    </html>
  );
}
