'use client';

import { useEffect, useRef, useState } from 'react';

export function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//certainwolveshonestly.com/7d74ab49a62de32fed0d8f4a6cbd019c/invoke.js';
      
      const container = document.createElement('div');
      container.id = 'container-7d74ab49a62de32fed0d8f4a6cbd019c';

      containerRef.current.appendChild(script);
      containerRef.current.appendChild(container);
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return <div ref={containerRef} className="my-8" />;
}
