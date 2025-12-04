import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  default: 'bg-gradient-to-br from-toxic-400 to-toxic-500 text-black hover:from-toxic-300 hover:to-toxic-400 shadow-glow-green',
  destructive: 'bg-gradient-to-br from-blood-600 to-blood-800 text-white hover:from-blood-500 hover:to-blood-700 shadow-glow-red',
  outline: 'border-2 border-copper-500 text-copper-400 hover:bg-copper-500/10',
  ghost: 'hover:bg-laboratory-800 text-gray-300',
};

const sizeVariants = {
  default: 'h-12 px-8 py-3',
  sm: 'h-9 px-4 py-2 text-sm',
  lg: 'h-14 px-10 py-4 text-lg',
  icon: 'h-10 w-10',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  children,
  ...props
}) {
  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center gap-3 rounded-lg font-black uppercase tracking-wider',
        'transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic-400 focus-visible:ring-offset-2 focus-visible:ring-offset-laboratory-950',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </motion.button>
  );
}

// Electric Spark Effect on Click
export function ElectricButton({ children, ...props }) {
  return (
    <motion.div className="relative">
      <Button {...props}>
        {children}
      </Button>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileTap={{
          opacity: [0, 1, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 left-1/4 w-1 h-4 bg-toxic-400 blur-sm" />
        <div className="absolute top-0 right-1/4 w-1 h-4 bg-toxic-400 blur-sm" />
        <div className="absolute bottom-0 left-1/3 w-1 h-4 bg-toxic-400 blur-sm" />
        <div className="absolute bottom-0 right-1/3 w-1 h-4 bg-toxic-400 blur-sm" />
      </motion.div>
    </motion.div>
  );
}
