'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
      const currentUrl = window.location.href;
      if (targetUrl !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation: MutationCallback = () => {
      const anchorElements = document.querySelectorAll('a');
      anchorElements.forEach((anchor) => {
        if (anchor.target === '_blank') return;
        
        // Prevent adding multiple listeners
        const hasListener = (anchor as any)._hasNProgressListener;
        if (!hasListener) {
            anchor.addEventListener('click', handleAnchorClick);
            (anchor as any)._hasNProgressListener = true;
        }
      });
    };

    NProgress.done();
    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    window.addEventListener('popstate', NProgress.done);

    return () => {
      mutationObserver.disconnect();
      document.querySelectorAll('a').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
        delete (anchor as any)._hasNProgressListener;
      });
      window.removeEventListener('popstate', NProgress.done);
    };
  }, []);

  return null;
}
