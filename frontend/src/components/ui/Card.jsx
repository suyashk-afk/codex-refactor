import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Card({ className, children, hover = true, ...props }) {
  return (
    <motion.div
      className={cn(
        'lab-container stitched p-6',
        hover && 'hover-lift cursor-pointer hover:border-toxic-400/50',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 pb-4 border-b border-laboratory-700', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('text-2xl font-bold flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-gray-400', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('pt-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center pt-4 border-t border-laboratory-700', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Special Frankenstein Card with Electric Border
export function ElectricCard({ className, children, ...props }) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Electric Border Effect */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-toxic-400 via-toxic-500 to-toxic-400 rounded-lg opacity-0 blur"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <Card className="relative" hover={false} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
