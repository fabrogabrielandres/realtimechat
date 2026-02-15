"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RealtimeProvider } from "@upstash/realtime/client";
import { useState } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </RealtimeProvider>
    </QueryClientProvider>
  );
};
