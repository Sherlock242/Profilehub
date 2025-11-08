
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ShareButton({ title }: { title: string }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isShareApiAvailable, setIsShareApiAvailable] = useState(false);

  React.useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
        setIsShareApiAvailable(true);
    }
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${pathname}`;
    
    if (isShareApiAvailable) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this article: ${title}`,
          url: shareUrl,
        });
      } catch (error) {
        // Silently fail if user cancels share dialog
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Link Copied!',
          description: 'The article link has been copied to your clipboard.',
        });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy the link to your clipboard.',
        });
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share article">
            {isShareApiAvailable ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isShareApiAvailable ? 'Share article' : 'Copy link'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
