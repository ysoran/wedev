// hooks/useAuthRedirect.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect(redirectTo = '/login') {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push(redirectTo);
    } else {
      setIsReady(true);
    }
  }, [router, redirectTo]);

  return isReady;
}
