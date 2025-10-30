import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center" prefetch={false}>
      <span className="text-lg font-bold font-headline tracking-tighter">
        <span className="text-accent">Profile</span>
        <span>Hub</span>
      </span>
    </Link>
  );
}
