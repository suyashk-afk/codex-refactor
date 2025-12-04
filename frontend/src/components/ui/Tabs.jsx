import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  );
}

export function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        'inline-flex h-14 items-center justify-center rounded-lg',
        'bg-laboratory-850 p-1.5 gap-2',
        'border border-laboratory-700',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, active, onClick, children, icon, className }) {
  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md',
        'px-6 py-3 text-sm font-bold uppercase tracking-wider',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic-400',
        'disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'bg-gradient-to-br from-toxic-400 to-toxic-500 text-black shadow-glow-green'
          : 'text-gray-400 hover:text-gray-200 hover:bg-laboratory-800',
        className
      )}
      onClick={() => onClick(value)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </motion.button>
  );
}

export function TabsContent({ value, activeValue, children, className }) {
  if (value !== activeValue) return null;
  
  return (
    <motion.div
      className={cn('mt-6', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
