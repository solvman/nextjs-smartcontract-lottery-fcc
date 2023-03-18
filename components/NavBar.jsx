'use client';
import { Web3Button } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

export function NavBar() {
  const { isConnected } = useAccount();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, [isConnected]);

  return ready ? (
    <nav className="flex my-2 p-3 shadow-lg">
      <div className="flex-1">
        <h1 className="m-auto pl-5 text-3xl text-bold">Smart Contract Lottery</h1>
      </div>
      <div className="flex-initial">
        <Web3Button icon="hide" balance="show" />
      </div>
    </nav>
  ) : null;
}
