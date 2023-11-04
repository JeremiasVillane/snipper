"use client";

import { useMediaQuery } from "@/hooks";
import { motion } from "framer-motion";

const colors = [
  "rgb(125 211 252)",
  "rgb(249 168 212)",
  "rgb(134 239 172)",
  "rgb(253 224 71)",
  "rgb(252 165 165)",
  "rgb(216 180 254)",
  "rgb(147 197 253)",
  "rgb(165 180 252)",
  "rgb(196 181 253)",
];

export default function BoxesContainer(): JSX.Element {
  const isGreaterThan1024 = useMediaQuery("(min-width: 1024px)");

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < 150; i++) {
      const row = [];

      for (let j = 0; j < 100; j++) {
        row.push(
          <motion.div
            key={`col${j}`}
            className="w-16 h-8 border-r border-t border-slate-700 relative"
            whileHover={{
              backgroundColor: getRandomColor(),
              transition: { duration: 0 },
            }}
            animate={{
              transition: { duration: 2 },
            }}
          />
        );
      }

      grid.push(
        <motion.div
          key={`row${i}`}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {row}
        </motion.div>
      );
    }

    return grid;
  };

  return (
    <div className="absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0">
      {isGreaterThan1024 ? renderGrid() : null}
    </div>
  );
}
