
"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Trophy, Shield, Menu } from "lucide-react";
import { Logo } from "./logo";
import { type AppUser } from "@/lib/definitions";
import { logout } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Header({ user }: { user: AppUser | null }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Navigation</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader className="text-left">
                      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                      <SheetDescription className="sr-only">A list of pages to navigate to.</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 py-8">
                        <SheetClose asChild>
                          <Logo />
                        </SheetClose>
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <Button asChild variant="ghost" className="justify-start">
                                        <Link href={link.href}>{link.label}</Link>
                                    </Button>
                                </SheetClose>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
            <Logo />
        </div>

        <nav className="hidden md:flex md:gap-4 lg:gap-6">
            {navLinks.map(link => (
                <Button key={link.href} variant="ghost" size="sm" asChild>
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
        </nav>

        <div className="flex items-center space-x-2">
            {user ? (
            <>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" asChild size="icon">
                        <Link href="/leaderboard">
                        <Trophy className="h-5 w-5" />
                        <span className="sr-only">Leaderboard</span>
                        </Link>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Leaderboard</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                        {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                        </Link>
                    </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </>
            ) : (
            <div className="flex items-center space-x-1">
                <Button variant="ghost" asChild size="sm">
                <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
            )}
        </div>
      </div>
    </header>
  );
}
