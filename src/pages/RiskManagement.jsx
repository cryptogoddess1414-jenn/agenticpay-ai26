import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import RiskMetricsBar from '../components/risk/RiskMetricsBar';
import TransactionRiskTable from '../components/risk/TransactionRiskTable';
import SmartApprovalModal from '../components/risk/SmartApprovalModal';
import AiChatSidebar from '../components/chat/AiChatSidebar';
import AiChatButton from '../components/chat/AiChatButton';
import { generateTransactions } from '../lib/risk-data';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RiskManagement() {
  const [transactions, setTransactions] = useState(() => generateTransactions(40));
  const [selectedTx, setSelectedTx] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleSmartApprove = (tx) => setSelectedTx(tx);

  const handleDecision = (txId, decision) => {
    setTransactions(prev =>
      prev.map(t => t.id === txId ? { ...t, refundStatus: decision } : t)
    );
    setSelectedTx(null);
  };

  const refresh = () => setTransactions(generateTransactions(40));

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Page header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">Risk Management</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] uppercase tracking-wider">
                  AgenticPay AI
                </span>
              </div>
              <p className="text-sm text-[#8898AA] ml-[42px]">
                AI-powered transaction scanning, risk scoring, and smart refund approval based on customer lifetime value.
              </p>
            </div>
            <Button onClick={refresh} variant="outline" size="sm"
              className="flex items-center gap-2 border-gray-200 text-[#425466] hover:bg-gray-50">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </div>

          {/* Metrics */}
          <RiskMetricsBar transactions={transactions} />

          {/* Transaction table */}
          <div className="mt-6">
            <TransactionRiskTable
              transactions={transactions}
              onSmartApprove={handleSmartApprove}
            />
          </div>

        </div>

        <AiChatButton onClick={() => setChatOpen(true)} />
        <AiChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>

      {/* Smart Approval Modal */}
      {selectedTx && (
        <SmartApprovalModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
}