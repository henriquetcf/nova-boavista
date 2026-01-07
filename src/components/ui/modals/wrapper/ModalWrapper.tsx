'use client'
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl';
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-md'
}: ModalWrapperProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-[#121212] rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col`}
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    {icon}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 pt-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-8 pt-0 flex gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}