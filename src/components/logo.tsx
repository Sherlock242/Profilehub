import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center" prefetch={false}>
      <div className="h-5 w-5 bg-accent text-accent-foreground flex items-center justify-center rounded-md font-bold text-sm">
        P
      </div>
      <span className="text-lg font-bold font-headline tracking-tighter">
        <span className="text-accent">rofile</span>
        <span>Hub</span>
      </span>
    </Link>
  );
}
