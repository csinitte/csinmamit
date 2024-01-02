"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function TimelineTape() {
  const ref = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0.5 1", "1 1"],
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 50], [0, 10]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollProgress.get() === 1) {
        setIsFixed(false);
      } else {
        setIsFixed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollProgress]);

  return (
    <>
      <div ref={ref} className={`sticky top-0 ${isFixed ? 'fixed' : ''} z-10`}>
        <motion.svg
          width="1047"
          height="743"
          viewBox="0 0 1047 743"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M4.83862 250.07C41.6989 108.7 77.9994 1.91 103.813 5.07C167.506 12.87 123.627 684.95 170.795 689.07C210.644 692.55 278.846 215.97 314.757 220.07C343.16 223.32 320.586 523.73 357.746 529.07C401.164 535.31 476.604 131.48 523.702 137.07C579.067 143.64 530.43 708.28 602.681 720.07C668.084 730.74 788.532 281.23 822.623 290.07C855.455 298.58 756.481 718.9 811.626 737.07C862.553 753.85 998.067 412.11 1044.56 427.07"
            stroke="white"
            strokeWidth="15"
            strokeMiterlimit="10"
            style={{ pathLength: scrollProgress }}
          />
        </motion.svg>
      </div>
    </>
  );
}
