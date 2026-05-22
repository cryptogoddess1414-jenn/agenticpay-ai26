import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, Bot, User, Zap, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
  "Summarize this week's revenue",
  "Which subscribers are at churn risk?",
  "Show top 5 transactions today",
  "Issue a refund for the last failed payment",
  "What's my MRR trend this month?",
];

function generateMockContext() {
  const revenue = (Math.random() * 40000 + 20000).toFixed(0);
  const txCount = Math.floor(Math.random() * 800 + 200);
  const mrr = (Math.random() * 15000 + 8000).toFixed(0);
  const churnRisk = Math.floor(Math.random() * 20 + 5);
  const errorRate = (Math.random() * 2.5).toFixed(2);
  return { revenue, txCount, mrr, churnRisk, errorRate };
}

export default function AiChatSidebar({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your **AgenticPay AI** assistant. I can answer questions about your payment data, generate financial reports, analyze churn risk, or help you take actions like issuing refunds.\n\nWhat would you like to know?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const ctx = useRef(generateMockContext());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const { revenue, txCount, mrr, churnRisk, errorRate } = ctx.current;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the AgenticPay AI assistant embedded in a payment infrastructure dashboard. You help users understand their payment data, generate reports, and perform actions.

Current platform context:
- Weekly revenue: $${revenue}
- Transactions this week: ${txCount}
- Current MRR: $${mrr}
- High churn-risk subscribers: ${churnRisk}
- API error rate: ${errorRate}%
- Platform: AgenticPay AI (intelligent payment infrastructure)

User message: "${userMsg}"

Respond concisely and helpfully. If the user asks to perform an action (like issuing a refund), confirm you're initiating it and describe what would happen. Use markdown for structure when it improves clarity. Keep responses under 150 words. Never break character — you are AgenticPay AI's assistant.`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: result }]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! I'm ready for your next question about your payment data.",
    }]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-[#0A2540]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">AgenticPay AI</p>
                  <p className="text-[10px] text-[#8898AA] mt-0.5">Payment Intelligence Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-[#8898AA] hover:text-white" title="Clear chat">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-[#8898AA] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#635BFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0A2540] text-white rounded-tr-sm'
                      : 'bg-gray-50 text-[#0A2540] border border-gray-100 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
                        components={{
                          code: ({ children }) => (
                            <code className="bg-gray-200 text-[#635BFF] px-1 py-0.5 rounded text-[11px]">{children}</code>
                          ),
                          strong: ({ children }) => <strong className="font-bold text-[#0A2540]">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#635BFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#635BFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#635BFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#635BFF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] font-semibold text-[#8898AA] uppercase tracking-wider mb-2">Quick actions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-[#EEF0FF] text-[#635BFF] border border-[#635BFF]/20 hover:bg-[#635BFF]/15 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about payments, reports, or actions…"
                  rows={1}
                  disabled={loading}
                  className="flex-1 resize-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10 disabled:opacity-50 max-h-28 overflow-y-auto"
                  style={{ height: 'auto', minHeight: '42px' }}
                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px';
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#635BFF] text-white hover:bg-[#5751e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-300 mt-1.5 text-center">AgenticPay AI · Powered by advanced AI models</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}