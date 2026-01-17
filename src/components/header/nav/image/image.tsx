import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import styles from "./style.module.scss";

interface IndexProps {
  src: string;
  isActive: boolean;
}

const Index: React.FC<IndexProps> = ({ src, isActive }) => {
  return (
    <div className={styles.imageContainer}>
      <AnimatePresence mode="wait">
    <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
    >
          <NextImage
        src={src}
        width={400}
            height={225}
            className="my-32 w-full h-auto object-cover rounded-xl shadow-2xl border border-white/10"
            alt="Section Preview"
            priority={false}
      />
    </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
