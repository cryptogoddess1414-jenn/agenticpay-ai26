import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import LiquidityPanel from '../components/treasury/LiquidityPanel';
import BankFailureTable from '../components/treasury/BankFailureTable';
import PayoutCycleChart from '../components/treasury/PayoutCycleChart';
import TreasuryAiSummary from '../components/treasury/TreasuryAiSummary';
import AiChatSidebar from '../components/chat/AiChatSidebar';
import AiChatButton from '../components/chat/AiChatButton';
import { generatePayoutCycles, generateBankFailures, generateLiquiditySummary } from '../lib/treasury-data';
import { Landmark, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Treasury() {
  const [cycles]    = useState(() => generatePayoutCycles(30));
  const [banks, setBanks] = useState(() => generateBankFailures());
  const [liquidity] = useState(() => generateLiquiditySummary());
  const [activeLines, setActiveLines] = useState(banks.map(b => b.id));
  const [chatOpen, setChatOpen] = useState(false);

  const toggleLine = (id) =>
    setActiveLines(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">Treasury Management</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] uppercase tracking-wider">
                  AgenticPay AI
                </span>
              </div>
              <p className="text-sm text-[#8898AA] ml-[42px]">
                Payout cycle monitoring, bank failure analysis, liquidity tracking, and AI-optimized scheduling.
              </p>
            </div>
          </div>

          {/* AI Summary */}
          <TreasuryAiSummary cycles={cycles} banks={banks} liquidity={liquidity} />

          {/* Liquidity panel */}
          <div className="mt-6">
            <LiquidityPanel liquidity={liquidity} />
          </div>

          {/* Payout cycle chart */}
          <div className="mt-6">
            <PayoutCycleChart data={cycles} />
          </div>

          {/* Bank failure table */}
          <div className="mt-6">
            <BankFailureTable banks={banks} activeLines={activeLines} onToggle={toggleLine} />
          </div>

        </div>

        <AiChatButton onClick={() => setChatOpen(true)} />
        <AiChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}