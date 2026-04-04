'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './providers/ThemeProvider';
import { ReactNode } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};
