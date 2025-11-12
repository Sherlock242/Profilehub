'use client';

import { useEffect, useRef, useState } from 'react';

export function AdsterraBanner728x90() {
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
          'key' : '52ce2023b906a42256fa65faf339e453',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = '//certainwolveshonestly.com/52ce2023b906a42256fa65faf339e453/invoke.js';

      adRef.current.appendChild(scriptOptions);
      adRef.current.appendChild(scriptInvoke);
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return <div ref={adRef} className="my-8 flex justify-center" />;
}
