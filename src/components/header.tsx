
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
import { LogOut, User as UserIcon, Trophy, RadioTower } from "lucide-react";
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
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-client";

export function Header({ user }: { user: AppUser | null }) {
  const router = useRouter();
  const [hasNewVotes, setHasNewVotes] = useState(user?.hasUnreadNotifications || false);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  useEffect(() => {
    setHasNewVotes(user?.hasUnreadNotifications || false);

    // This custom event is dispatched from the /live page when it loads
    // or when a new notification arrives in real-time.
    const handleNotificationUpdate = () => {
        // When we get an update, we can't be sure if there are new votes or not,
        // so we need to re-check with the server. A page refresh does this by
        // re-running the root layout and the `getUser` server action.
        router.refresh();
    };

    window.addEventListener('notifications-read', handleNotificationUpdate);

    // Set up a real-time listener just for the notification dot.
    // This ensures the dot appears instantly even if the user isn't on the live page.
    const supabase = createClient();
    const channel = supabase
      .channel('header-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
            // Check if the notification is for the current user
            if (payload.new.user_id === user?.id) {
                setHasNewVotes(true);
            }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('notifications-read', handleNotificationUpdate);
      supabase.removeChannel(channel);
    };
  }, [user, router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-[5px]">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-2">
            {user ? (
              <>
                <TooltipProvider>
                   <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" asChild size="icon" className="relative">
                        <Link href="/live">
                          {hasNewVotes && (
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          )}
                          <RadioTower className="h-5 w-5" />
                          <span className="sr-only">Live Feed</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Live Feed</p>
                    </TooltipContent>
                  </Tooltip>
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
