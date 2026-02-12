import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(var(--cyan)), hsl(var(--electric-blue)))",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(var(--electric-blue)), hsl(var(--cyan)))",
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
      />

      {/* Floating Programming Symbols */}
      <motion.span
        className="absolute top-1/4 left-1/4 text-2xl font-mono text-primary/25 select-none"
        animate={{ y: [-20, 20], rotate: [-10, 10] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      >
        {"</>"}
      </motion.span>
      <motion.span
        className="absolute top-1/3 right-1/4 text-3xl font-mono text-secondary/25 select-none"
        animate={{ y: [20, -20], x: [-10, 10] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      >
        {"{ }"}
      </motion.span>
      <motion.span
        className="absolute bottom-1/3 left-1/3 text-xl font-mono text-primary/20 select-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {"( )"}
      </motion.span>
      <motion.span
        className="absolute top-2/3 right-1/3 text-2xl font-mono text-cyan/20 select-none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {"==="}
      </motion.span>
      <motion.span
        className="absolute top-1/2 right-[20%] text-lg font-mono text-secondary/25 select-none"
        animate={{ y: [-30, 30], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      >
        {"//"}
      </motion.span>
      <motion.span
        className="absolute top-[15%] left-[60%] text-xl font-mono text-primary/20 select-none"
        animate={{ y: [10, -15], rotate: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      >
        {"=>"}
      </motion.span>
      <motion.span
        className="absolute bottom-1/4 right-[15%] text-2xl font-mono text-cyan/15 select-none"
        animate={{ x: [-10, 10], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
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
