
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p className="text-muted-foreground text-sm">
            Your hub for professional insights.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-6">
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
            Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
            </Link>
            <Link href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">
            Disclaimer
            </Link>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ProHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
