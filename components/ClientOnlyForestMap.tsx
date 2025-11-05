'use client';

import dynamic from 'next/dynamic';

const ForestMap = dynamic(() => import('./ForestMap'), { ssr: false });

export default function ClientOnlyForestMap() {
  return <ForestMap />;
}


