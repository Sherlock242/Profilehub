'use client';

import { useEffect, useRef, useState } from 'react';

export function AdsterraBanner300x250() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && adRef.current && adRef.current.children.length === 0) {
      const scriptOptions = document.createElement('script');
      scriptOptions.type = 'text/javascript';
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : 'f98dda47c6232ae63a5b74205b025faa',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = '//certainwolveshonestly.com/f98dda47c6232ae63a5b74205b025faa/invoke.js';

      adRef.current.appendChild(scriptOptions);
      adRef.current.appendChild(scriptInvoke);
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return <div ref={adRef} className="my-8 flex justify-center" />;
}
