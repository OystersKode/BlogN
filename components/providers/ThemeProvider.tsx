'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // We apply suppressHydrationWarning here to handle React 19's stricter script checks for theme injection
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
