'use client';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { abi, contractAddresses } from '@/constants';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function EnterLottery() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const [ready, setReady] = useState(false);

  const [entranceFee, setEntranceFee] = useState('0');
  const [numberOfPlayers, setNumberOfPlayers] = useState('0');
  const [recentWinner, setRecentWinner] = useState('0');
  const [isEnterRaffleStarted, setIsEnterRaffleStarted] = useState(false);

  const raffleAddress = chain != undefined && chain.id in contractAddresses ? contractAddresses[chain.id][0] : null;
  const contract = { address: raffleAddress, abi: abi, watch: true };

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: 'enterRaffle',
    overrides: { value: entranceFee },
  });

  const {
    data: enterRaffleData,
    isLoading: isEnterRaffleLoading,
    write: enterRaffle,
  } = useContractWrite({
    ...config,
    onSuccess() {
      setIsEnterRaffleStarted(true);
    },
    onError(error) {
      console.log(`Error: ${error}`);
    },
  });

  useContractRead({
    ...contract,
    functionName: 'getEntranceFee',
    onSuccess(data) {
      setEntranceFee(data.toString());
    },
  });

  useContractRead({
    ...contract,
    functionName: 'getNumberOfPlayers',
    onSuccess(data) {
      setNumberOfPlayers(data.toString());
    },
  });

  useContractRead({
    ...contract,
    functionName: 'getRecentWinner',
    onSuccess(data) {
      setRecentWinner(data.toString());
    },
  });

  const { isSuccess } = useWaitForTransaction({
    hash: enterRaffleData?.hash,
    onSettled() {
      setIsEnterRaffleStarted(false);
    },
  });

  useEffect(() => {
    if (isConnected) {
      setReady(true);
    }
  }, [isConnected]);

  return ready ? (
    <div className="border shadow-xl rounded-3xl m-10 p-5">
      {!isConnected && 'Please connect your wallet'}
      {isConnected && !raffleAddress && (
        <div>
          <h1>The network is not supported!</h1>
          <h2>Please connect to Goerli or Hardhat</h2>
        </div>
      )}
      {isConnected && raffleAddress && (
        <div>
          <button
            disabled={isEnterRaffleLoading || isEnterRaffleStarted}
            data-raffle-loading={isEnterRaffleLoading}
            data-raffle-started={isEnterRaffleStarted}
            data-raffle-success={isSuccess}
            onClick={() => enterRaffle?.()}
            className="bg-blue-400 hover:bg-blue-300 border text-white font-bold 
            py-2 px-4 rounded-3xl ml-auto mb-5 data-[raffle-loading=true]:bg-slate-400 
            data-[raffle-started=true]:animate-pulse data-[raffle-success=true]:animate-none"
          >
            {!isEnterRaffleLoading && !isEnterRaffleStarted && 'Enter Raffle'}
            {isEnterRaffleLoading && 'Waiting for approval...'}
            {isEnterRaffleStarted && 'Entering...'}
          </button>
          <div>Entrance fee: {ethers.utils.formatEther(entranceFee)} ETH</div>
          <div>The current number of players is: {numberOfPlayers}</div>
          <div>The most recent winner was: {recentWinner}</div>
        </div>
      )}
    </div>
  ) : null;
}
