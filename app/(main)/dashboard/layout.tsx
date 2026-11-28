'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setAllowed(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <div>
     <Link href={"/dashboard/profile"}>Profile</Link>
    {children}</div>;
}