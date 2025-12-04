import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-lg border-2 border-laboratory-700',
        'bg-laboratory-900/95 px-4 py-3 text-base',
        'text-gray-100 placeholder:text-gray-500',
        'transition-all duration-300',
        'focus:outline-none focus:border-toxic-400 focus:shadow-glow-green',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'flex min-h-[450px] w-full rounded-lg border-2 border-laboratory-700',
        'bg-laboratory-900/95 px-5 py-4 text-sm font-mono',
        'terminal-text placeholder:text-gray-600',
        'transition-all duration-300 resize-vertical',
        'focus:outline-none focus:border-toxic-400 focus:shadow-glow-green',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'shadow-inner-dark',
        className
      )}
      {...props}
    />
  );
}

// Electric Input with animated border
export function ElectricInput({ className, ...props }) {
  return (
    <motion.div className="relative">
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-toxic-400 via-toxic-500 to-toxic-400 rounded-lg opacity-0 blur"
        whileFocus={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />
      <Input className={cn('relative', className)} {...props} />
    </motion.div>
  );
}
