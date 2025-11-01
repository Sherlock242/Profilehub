
'use client';

import { useState, useEffect } from 'react';
import { getInitialUsers } from '@/lib/versus-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VersusForm } from '@/components/versus/versus-form';
import { type ProfileForVote } from '@/lib/definitions';
import { VersusFormSkeleton } from '@/components/versus/versus-form-skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getUserOnClient as getUser } from '@/lib/auth';
import { AppUser } from '@/lib/definitions';

// Force this page to be dynamic to prevent caching of the random users
export const dynamic = 'force-dynamic';

const articles = [
    {
      title: 'The Future of Professional Networking',
      excerpt: 'Discover how platforms like ProHub are changing the way we connect, compete, and build our professional identities in the digital age.',
      slug: '#',
      image: 'https://picsum.photos/seed/tech/600/400'
    },
    {
      title: 'How to Build a Profile That Gets Noticed',
      excerpt: 'Learn the top 5 tips for creating a compelling user profile that stands out from the crowd and gets you the votes you deserve.',
      slug: '#',
      image: 'https://picsum.photos/seed/profile/600/400'
    },
    {
      title: 'The Psychology of Voting: Why We Choose a Winner',
      excerpt: 'An inside look into the subtle psychological cues that influence our decisions when pitting two profiles against each other.',
      slug: '#',
      image: 'https://picsum.photos/seed/psychology/600/400'
    }
];

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [users, setUsers] = useState<[ProfileForVote, ProfileForVote] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [versusKey, setVersusKey] = useState(Date.now());


  useEffect(() => {
    // First, check if there's a user.
    async function checkUser() {
        const currentUser = await getUser();
        setUser(currentUser);
        if (currentUser) {
            // If user exists, fetch profiles for voting.
            fetchUsers();
        } else {
            // If no user, stop loading and show public content.
            setIsLoading(false);
        }
    }
    checkUser();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    getInitialUsers()
      .then(({ users, error }) => {
        if (error) {
          setError(error);
          setUsers(null);
        } else if (users) {
          setUsers(users);
          setError(null);
          setVersusKey(Date.now()); 
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVoteCasted = () => {
    fetchUsers();
  };
  
  if (user === undefined) {
    // Still checking for user, show nothing or a full page loader if preferred
    return null;
  }
  
  if (!user) {
    // User is not logged in, show the articles
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-10">
            From the Blog
          </h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.title} className="overflow-hidden flex flex-col">
                <Link href={article.slug} className="block">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint="technology blog"
                  />
                </Link>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-muted-foreground mb-4 flex-grow">{article.excerpt}</p>
                  <Link href={article.slug} className="text-sm font-semibold text-primary hover:underline mt-auto">
                    Read More &rarr;
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // User is logged in, manage voting UI
  if (isLoading) {
    return (
       <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <VersusFormSkeleton />
       </div>
    )
  }

  if (error) {
     return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
             <Alert className="max-w-md animate-fade-in">
                <AlertTitle>Welcome!</AlertTitle>
                <AlertDescription>{error} Invite some friends to join!</AlertDescription>
            </Alert>
        </div>
     )
  }

  if (users) {
      return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <VersusForm key={versusKey} users={users} onVoteCasted={handleVoteCasted} />
        </div>
      );
  }

  // Fallback content if something goes wrong after login
  return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
         <Alert className="max-w-md animate-fade-in">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Could not load voting session. Please try again later.</AlertDescription>
        </Alert>
    </div>
  )
}
