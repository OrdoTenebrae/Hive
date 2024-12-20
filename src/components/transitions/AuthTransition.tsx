"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AuthTransitionProps {
  children: ReactNode
}

export function AuthTransition({ children }: AuthTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
    >
      {children}
    </motion.div>
  )
} 