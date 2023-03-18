'use client';
import { EnterLottery } from '@/components/EnterLottery';
import { NavBar } from '@/components/NavBar';

export default function Home() {
  return (
    <main className="flex-col">
      <NavBar />
      <EnterLottery />
    </main>
  );
}
