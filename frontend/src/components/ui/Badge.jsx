import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: 'bg-laboratory-800 text-gray-300 border-laboratory-600',
  success: 'bg-toxic-400/20 text-toxic-400 border-toxic-400/50 shadow-glow-green',
  danger: 'bg-blood-600/20 text-blood-400 border-blood-400/50 shadow-glow-red',
  warning: 'bg-copper-500/20 text-copper-400 border-copper-400/50',
  outline: 'border-2 border-copper-500 text-copper-400',
};

export function Badge({ className, variant = 'default', children, animate = true, ...props }) {
  const Component = animate ? motion.span : 'span';
  
  return (
    <Component
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider',
        badgeVariants[variant],
        className
      )}
      {...(animate && {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      })}
      {...props}
    >
      {children}
    </Component>
  );
}

// Pulsing Badge for Active States
export function PulsingBadge({ children, ...props }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Badge {...props}>{children}</Badge>
    </motion.div>
  );
}
