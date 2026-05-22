import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import LiquidityPanel from '../components/treasury/LiquidityPanel';
import BankFailureTable from '../components/treasury/BankFailureTable';
import PayoutCycleChart from '../components/treasury/PayoutCycleChart';
import TreasuryAiSummary from '../components/treasury/TreasuryAiSummary';
import CashFlowForecast from '../components/treasury/CashFlowForecast';
import AiChatSidebar from '../components/chat/AiChatSidebar';
import AiChatButton from '../components/chat/AiChatButton';
import { generatePayoutCycles, generateBankFailures, generateLiquiditySummary } from '../lib/treasury-data';
import { Landmark, BarChart2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
  { id: 'overview',  label: 'Overview',   icon: BarChart2 },
  { id: 'forecasts', label: 'Forecasts',  icon: TrendingUp },
];

export default function Treasury() {
  const [cycles]    = useState(() => generatePayoutCycles(30));
  const [banks, setBanks] = useState(() => generateBankFailures());
  const [liquidity] = useState(() => generateLiquiditySummary());
  const [activeLines, setActiveLines] = useState(banks.map(b => b.id));
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleLine = (id) =>
    setActiveLines(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
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

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit mb-6">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active ? 'bg-[#635BFF] text-white shadow-sm' : 'text-[#425466] hover:text-[#0A2540] hover:bg-gray-50'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <>
              <TreasuryAiSummary cycles={cycles} banks={banks} liquidity={liquidity} />
              <div className="mt-6"><LiquidityPanel liquidity={liquidity} /></div>
              <div className="mt-6"><PayoutCycleChart data={cycles} /></div>
              <div className="mt-6"><BankFailureTable banks={banks} activeLines={activeLines} onToggle={toggleLine} /></div>
            </>
          )}

          {/* Forecasts tab */}
          {activeTab === 'forecasts' && (
            <CashFlowForecast cycles={cycles} />
          )}

        </div>

        <AiChatButton onClick={() => setChatOpen(true)} />
        <AiChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}