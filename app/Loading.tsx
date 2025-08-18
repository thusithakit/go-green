'use client';
import { motion } from "framer-motion";
import { Recycle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-12 h-12 text-green-600"
      >
        <Recycle size={48} />
      </motion.div>
      <p className="mt-2 text-gray-600 font-medium">Loading...</p>
    </div>
  )
}

export default Loading
