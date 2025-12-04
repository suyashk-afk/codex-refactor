import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const alertVariants = {
  default: {
    container: 'bg-laboratory-850 border-laboratory-700 text-gray-300',
    icon: AlertCircle,
    iconColor: 'text-gray-400',
  },
  success: {
    container: 'bg-toxic-400/10 border-toxic-400/50 text-toxic-400',
    icon: CheckCircle,
    iconColor: 'text-toxic-400',
  },
  error: {
    container: 'bg-blood-600/10 border-blood-400/50 text-blood-400',
    icon: XCircle,
    iconColor: 'text-blood-400',
  },
  warning: {
    container: 'bg-copper-500/10 border-copper-400/50 text-copper-400',
    icon: AlertTriangle,
    iconColor: 'text-copper-400',
  },
};

export function Alert({ variant = 'default', children, className, ...props }) {
  const { container, icon: Icon, iconColor } = alertVariants[variant];
  
  return (
    <motion.div
      className={cn(
        'relative flex items-start gap-4 rounded-lg border-2 p-5',
        container,
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <Icon className={cn('h-6 w-6 flex-shrink-0', iconColor)} />
      <div className="flex-1">{children}</div>
      
      {/* Blood Drip Effect for Errors */}
      {variant === 'error' && (
        <motion.div
          className="absolute -top-2 left-1/4 w-1 h-4 bg-blood-600 rounded-b-full"
          animate={{
            y: [0, 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}

export function AlertTitle({ children, className }) {
  return (
    <h5 className={cn('mb-1 font-bold text-lg', className)}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className }) {
  return (
    <div className={cn('text-sm leading-relaxed whitespace-pre-wrap', className)}>
      {children}
    </div>
  );
}
