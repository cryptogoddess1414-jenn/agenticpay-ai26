import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Github, Code2, Cpu, Globe, Terminal, Check, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

const PLATFORMS = [
  { name: "OpenAI",       icon: "🤖", desc: "GPT-4o, o1, Embeddings" },
  { name: "LangChain",    icon: "🔗", desc: "Agent orchestration" },
  { name: "LlamaIndex",   icon: "🦙", desc: "RAG & data indexing" },
  { name: "Hugging Face", icon: "🤗", desc: "Open models & inference" },
  { name: "Anthropic",    icon: "🧠", desc: "Claude model family" },
  { name: "CrewAI",       icon: "🚢", desc: "Multi-agent crews" },
  { name: "AutoGen",      icon: "⚙️", desc: "Conversational agents" },
  { name: "Zapier",       icon: "⚡", desc: "Workflow automation" },
  { name: "Slack",        icon: "💬", desc: "Team messaging" },
  { name: "Notion",       icon: "📓", desc: "Knowledge base" },
  { name: "Google",       icon: "🔍", desc: "Search & Workspace" },
  { name: "GitHub",       icon: "🐙", desc: "Code & CI/CD" },
];

const CODE_SNIPPET = `import agenticpay

# Initialize the AgenticPay AI client
client = agenticpay.Client(api_key="YOUR_API_KEY")

# Add the AI model to your existing app
agent = client.create_agent(
    model="agenticpay-v1",
    tools=["payments", "subscriptions", "webhooks"],
    integrations=["slack", "notion", "github"]
)

# Run a payment-aware agent task
result = agent.run(
    "Analyze failed payments this week and "
    "draft a recovery email for each customer."
)

print(result.actions_taken)  # list of completed actions`;

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function OpenSourceSection() {
  return (
    <section id="open-source" className="py-24 bg-[#0A2540] overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#635BFF 1px, transparent 1px), linear-gradient(90deg, #635BFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#635BFF]/20 border border-[#635BFF]/40 mb-5">
            <Github className="w-3.5 h-3.5 text-[#635BFF]" />
            <span className="text-xs font-bold text-[#635BFF] tracking-widest uppercase">Open Source</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] font-extrabold text-white leading-tight tracking-tight mb-4">
            Integrate <span className="text-[#635BFF]">AgenticPay AI</span> with<br />
            every app and platform
          </h2>
          <p className="text-lg text-[#8898AA] max-w-2xl mx-auto leading-relaxed">
            Open-source SDKs, REST APIs, and pre-built connectors to embed the AgenticPay AI model into any stack — in minutes, not months.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left: Platforms grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-[#425466] uppercase tracking-widest mb-5">Supported Platforms & Frameworks</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-[#635BFF]/50 hover:bg-[#635BFF]/10 transition-all cursor-pointer group"
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <p className="text-xs font-bold text-white group-hover:text-[#635BFF] transition-colors">{p.name}</p>
                  <p className="text-[10px] text-[#425466] mt-0.5">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Features list */}
            <div className="mt-8 space-y-3">
              {[
                'MIT-licensed SDK — fork, extend, self-host',
                'Universal REST API compatible with any language',
                'Pre-built plugins for LangChain, CrewAI & AutoGen',
                'Webhook-native: pipe any event to any AI agent',
              ].map(feat => (
                <div key={feat} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#635BFF]/20 border border-[#635BFF]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#635BFF]" />
                  </div>
                  <p className="text-sm text-[#8898AA]">{feat}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <a href="#" className="flex items-center gap-2 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5751e8] px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                <Github className="w-4 h-4" /> View on GitHub
              </a>
              <a href="#" className="flex items-center gap-2 text-sm font-semibold text-[#635BFF] border border-[#635BFF]/40 hover:bg-[#635BFF]/10 px-5 py-2.5 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" /> Read Docs
              </a>
            </div>
          </motion.div>

          {/* Right: Code snippet */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-[#0D1F35] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#425466]" />
                  <span className="text-[11px] text-[#425466] font-mono">agenticpay_example.py</span>
                </div>
                <CopyBtn text={CODE_SNIPPET} />
              </div>
              {/* Code */}
              <pre className="px-5 py-5 text-[12px] font-mono leading-relaxed overflow-x-auto">
                <code>
                  {CODE_SNIPPET.split('\n').map((line, i) => {
                    if (line.startsWith('#')) return <span key={i} className="text-[#425466]">{line}{'\n'}</span>;
                    if (line.includes('import')) return <span key={i} className="text-[#635BFF]">{line}{'\n'}</span>;
                    if (line.includes('"') || line.includes("'")) {
                      return <span key={i} className="text-green-300">{line}{'\n'}</span>;
                    }
                    if (line.includes('=') || line.includes('(')) return <span key={i} className="text-blue-200">{line}{'\n'}</span>;
                    return <span key={i} className="text-gray-300">{line}{'\n'}</span>;
                  })}
                </code>
              </pre>
            </div>

            {/* Install command */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
              <code className="text-sm font-mono text-green-300 flex-1">pip install agenticpay</code>
              <CopyBtn text="pip install agenticpay" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}