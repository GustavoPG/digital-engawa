import React from 'react';
import { motion } from 'motion/react';

export interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subValue: string;
  iconBg: string;
  iconColor: string;
}

export const StatCard = ({ icon, value, label, subValue, iconBg, iconColor }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-surface-container-low rounded-lg p-8 hover:bg-surface-container-high transition-colors duration-300"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-on-surface-variant/50">{subValue}</span>
    </div>
    <p className="text-4xl font-black mb-1">{value}</p>
    <p className="text-sm font-medium text-on-surface-variant">{label}</p>
  </motion.div>
);
