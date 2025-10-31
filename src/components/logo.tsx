import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center" prefetch={false}>
      <span className="text-lg font-bold font-headline tracking-tighter uppercase">
        <span className="text-accent">Pro</span>
        <span>Hub</span>
      </span>
    </Link>
  );
}
