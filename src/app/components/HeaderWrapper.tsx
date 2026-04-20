'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Hide the global site header on marketplace listing pages
  const isMarketplacePage = pathname?.startsWith('/consulting/');

  if (isMarketplacePage) {
    return null;
  }

  return <Header />;
}
