'use client';
import './globals.css';
import { goerli, hardhat } from 'wagmi/chains';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { w3mConnectors, w3mProvider, EthereumClient } from '@web3modal/ethereum';
import { useIsReady } from '@/utilities/useIsReady';
import { Web3Modal } from '@web3modal/react';
import Head from 'next/head';

export default function RootLayout({ children }) {
  const mounted = useIsReady();

  // 1. Setup project id for Web3Modal
  if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
    throw new Error('Please provide PROJECT_ID env variable');
  }
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  // 2. Configure chains
  const chains = [goerli, hardhat];

  // 3. Configure provider
  const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

  // 4. Create Wagmi client
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ version: 1, chains, projectId }),
    provider,
  });
  // 5. Configure Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <html lang="en">
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Smart Contract Lottery" />
      </Head>
      <body>
        {/* Wrap content with WagmiConfig and Web3Modal Content providers */}
        {mounted ? <WagmiConfig client={wagmiClient}>{children}</WagmiConfig> : null}
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </body>
    </html>
  );
}
