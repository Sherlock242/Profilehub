
'use client';

import React, { useState, useEffect } from 'react';
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

export function ShareButton({ title, url }: { title: string, url?: string }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [canShare, setCanShare] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (navigator.share) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if the button is inside a link
    e.stopPropagation();

    const shareUrl = url ? `${window.location.origin}${url}` : `${window.location.origin}${pathname}`;
    
    if (mounted && canShare) {
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

  const icon = mounted && canShare ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />;
  const tooltipText = mounted && canShare ? 'Share article' : 'Copy link';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label={tooltipText}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
