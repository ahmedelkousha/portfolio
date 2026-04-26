import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static Gradient Orbs - Animation removed for performance */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 blur-[100px]"
        style={{
          background: "linear-gradient(135deg, hsl(var(--cyan)), hsl(var(--electric-blue)))",
        }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-[100px]"
        style={{
          background: "linear-gradient(135deg, hsl(var(--electric-blue)), hsl(var(--cyan)))",
        }}
      />

      {/* Floating Programming Symbols - Slowed down and simplified */}
      <motion.span
        className="absolute top-1/4 left-1/4 text-2xl font-mono text-primary/25 select-none"
        animate={{ y: [-10, 10] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        {"</>"}
      </motion.span>
      <motion.span
        className="absolute top-1/3 right-1/4 text-3xl font-mono text-secondary/25 select-none"
        animate={{ y: [10, -10] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        {"{ }"}
      </motion.span>
      <motion.span
        className="absolute bottom-1/3 left-1/3 text-xl font-mono text-primary/20 select-none"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {"( )"}
      </motion.span>
      <motion.span
        className="absolute top-2/3 right-1/3 text-2xl font-mono text-cyan/20 select-none"
      >
        {"==="}
      </motion.span>
      <motion.span
        className="absolute top-1/2 right-[20%] text-lg font-mono text-secondary/25 select-none"
        animate={{ y: [-15, 15] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        {"//"}
      </motion.span>
      <motion.span
        className="absolute top-[15%] left-[60%] text-xl font-mono text-primary/20 select-none"
      >
        {"=>"}
      </motion.span>
      <motion.span
        className="absolute bottom-1/4 right-[15%] text-2xl font-mono text-cyan/15 select-none"
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        {"[ ]"}
      </motion.span>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};
