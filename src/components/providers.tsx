"use client";

import * as React from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { zoraSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type Chain } from "viem";

interface ProvidersProps {
  children: React.ReactNode;
}

export const iliad = {
  id: 1513, // Your custom chain ID
  name: "Story Network Testnet",
  nativeCurrency: {
    name: "Testnet IP",
    symbol: "IP",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.storyrpc.io"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://testnet.storyscan.xyz" },
  },
  testnet: true,
} as const satisfies Chain;

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [zoraSepolia, iliad],
    appName: "VisualizeIt.ai",
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="rounded">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
