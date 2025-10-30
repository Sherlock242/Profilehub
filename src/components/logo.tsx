import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <div className="h-6 w-6 bg-primary text-primary-foreground flex items-center justify-center rounded-md font-bold text-sm">
        P
      </div>
      <span className="text-lg font-bold">Profile Hub</span>
    </Link>
  );
}
