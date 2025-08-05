import { useLoader } from "./contexts/LoaderContext";
import Player from "lottie-react";
import starloader from "./assets/animations/starloder.json";
import { motion } from "framer-motion";

export function LoaderOverlay() {
  const { loading } = useLoader();
  if (!loading) return null;
  return (
    <motion.div
      className="fixed inset-0 bg-[#f0f7f5] flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Player
        autoplay
        animationData={starloader}
        style={{ height: "200px", width: "200px" }}
      />
    </motion.div>
  );
}
