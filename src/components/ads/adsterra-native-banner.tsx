'use client';

import { useEffect, useRef } from 'react';

export function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//certainwolveshonestly.com/7d74ab49a62de32fed0d8f4a6cbd019c/invoke.js';
      
      const container = document.createElement('div');
      container.id = 'container-7d74ab49a62de32fed0d8f4a6cbd019c';

      containerRef.current.appendChild(script);
      containerRef.current.appendChild(container);
    }
  }, []);

  return <div ref={containerRef} className="my-8" />;
}
