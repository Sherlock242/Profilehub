
"use client";

import { useState, useEffect, useRef } from "react";
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
import { LogIn, LogOut, User as UserIcon, Trophy, Shield, Menu, UserPlus, Search, X } from "lucide-react";
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
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export function Header({ user }: { user: AppUser | null }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const navLinks: { href: string; label: string }[] = [
    { href: "/category/gym", label: "Gym" },
    { href: "/category/exercises", label: "Exercises" },
    { href: "/category/yoga", label: "Yoga" },
    { href: "/category/nutrition", label: "Nutrition" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <button className="p-2 md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Navigation</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <SheetHeader className="text-left">
                      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                      <SheetDescription className="sr-only">A list of pages to navigate to.</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 py-8">
                        <SheetClose asChild>
                          <Logo />
                        </SheetClose>
                        {navLinks.length > 0 && (
                          <nav className="flex flex-col gap-2">
                              {navLinks.map((link) => (
                                  <SheetClose asChild key={link.href}>
                                      <Button asChild variant="ghost" className="justify-start">
                                          <Link href={link.href}>{link.label}</Link>
                                      </Button>
                                  </SheetClose>
                              ))}
                          </nav>
                        )}
                    </div>
                    
                    {!user && (
                        <div className="mt-auto flex flex-col gap-2">
                            <Separator />
                            <SheetClose asChild>
                                <Button asChild variant="ghost">
                                    <Link href="/login">
                                        <LogIn className="mr-2"/>
                                        Log In
                                    </Link>
                                </Button>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button asChild>
                                    <Link href="/signup">
                                        <UserPlus className="mr-2"/>
                                        Sign Up
                                    </Link>
                                </Button>
                            </SheetClose>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
            <div className={cn("hidden md:block", isSearchOpen && "hidden")}>
              <Logo />
            </div>
        </div>

        <div className={cn("absolute left-1/2 -translate-x-1/2 md:hidden", { "hidden": isSearchOpen })}>
          <Logo />
        </div>

        <nav className="hidden md:flex md:gap-4 lg:gap-6">
            {navLinks.map(link => (
                <Button key={link.href} variant="ghost" size="sm" asChild>
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
        </nav>
        
        <div ref={searchRef} className={cn("flex flex-1 items-center justify-end space-x-2", isSearchOpen && "w-full", !isSearchOpen && "md:flex-initial")}>
            <div className={cn(
              "w-full max-w-sm transition-all duration-300 ease-in-out md:w-auto",
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            )}>
              <form onSubmit={handleSearchSubmit} className={cn("relative", !isSearchOpen && "hidden md:block")}>
                <Input
                  type="search"
                  placeholder="Search..."
                  className={cn(
                    "w-full pl-10 peer h-9",
                    isSearchOpen && "bg-transparent border-0 border-b-2 border-primary rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground peer-focus:text-primary" />
              </form>
            </div>
            
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-muted-foreground hover:text-primary transition-colors md:hidden"
            >
              {isSearchOpen ? <X className="h-5 w-5"/> : <Search className="h-5 w-5"/>}
              <span className="sr-only">{isSearchOpen ? "Close search" : "Open search"}</span>
            </button>

            {user ? (
            <div className="flex items-center space-x-1">
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
            </div>
            ) : (
                <div className="hidden md:flex items-center space-x-1">
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
