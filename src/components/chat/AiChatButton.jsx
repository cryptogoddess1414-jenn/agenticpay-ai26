import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiChatButton({ onClick, hasUnread }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#635BFF] hover:bg-[#5751e8] text-white px-4 py-3 rounded-2xl shadow-lg shadow-[#635BFF]/30 transition-colors"
    >
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-bold">AI Assistant</span>
      {hasUnread && (
        <span className="w-2 h-2 bg-green-400 rounded-full" />
      )}
    </motion.button>
  );
}