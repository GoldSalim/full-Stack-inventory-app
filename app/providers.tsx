'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      {React.createElement(QueryClientProvider, { client: queryClient }, children)}
      {React.createElement(Toaster, { position: 'top-right' })}
    </>
  );
}