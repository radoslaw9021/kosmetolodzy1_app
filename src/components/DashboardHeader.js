import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <motion.div
      initial={{ boxShadow: '0 0 0px rgba(0,0,0,0)' }}
      whileHover={{
        boxShadow: '0 0 12px 2px rgba(168,85,247,0.5), 0 0 20px 5px rgba(236,72,153,0.25)',
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="inline-flex items-center gap-3 px-8 py-1.5 rounded-full border border-purple-500 bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-fuchsia-900/30 mb-4 self-start min-w-[220px]"
    >
      <Home className="text-purple-300 w-5 h-5" />
      <h1 className="text-2xl font-bold text-white shadow-[0_0_6px_rgba(168,85,247,0.3)]">
        Panel główny
      </h1>
    </motion.div>
  );
} 