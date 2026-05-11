'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Hide the global site header on marketplace listing pages and admin
  const isMarketplacePage = pathname?.startsWith('/consulting/') || pathname?.startsWith('/admin');

  if (isMarketplacePage) {
    return null;
  }

  return <Header />;
}
