import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import brushImage from '../../assets/images/hero/brush-rb-horizontal.webp';
import strokeImage from '../../assets/images/hero/hero-brush-stroke.png';

export default function HeroBrushAnimation() {
  const progress = useMotionValue(0);
  const brushX = useTransform(progress, [0, 0.8, 1], ['-42%', '250%', '300%']);
  const strokeClip = useTransform(progress, (value) => {
    const brushTranslate = value <= 0.8
      ? -42 + (292 * value) / 0.8
      : 250 + (50 * (value - 0.8)) / 0.2;
    const bristleEdge = (brushTranslate * 0.40) + ((24 / 1254) * 0.40 * 100);
    const revealedWidth = Math.max(0, Math.min(100, ((bristleEdge - 26) / 68) * 100));

    return `inset(0 ${100 - revealedWidth}% 0 0)`;
  });

  useEffect(() => {
    const controls = animate(progress, [0, 0.8, 1], {
      duration: 3.8,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.8, 1],
    });

    return () => controls.stop();
  }, [progress]);

  return <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[-4%] z-[1] block w-[80vw] max-w-[1040px] sm:right-[-6%] sm:w-[72vw] lg:w-[72vw] xl:w-[67vw]">
    <div className="absolute left-[2%] top-[2%] aspect-[4.8/1] w-[100%] overflow-visible sm:top-[3%] sm:w-[96%]">
      <div className="absolute right-[6%] top-0 aspect-square w-[68%] -translate-y-[40.9%] overflow-visible">
        <motion.div
          style={{ clipPath: strokeClip }}
          className="absolute inset-0"
        >
          <img
            src={strokeImage}
            alt=""
            className="block h-auto w-full max-w-none"
          />
          <p className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-bold uppercase tracking-[0.12em] text-white xl:text-base">3 года гарантии</p>
        </motion.div>
      </div>
      <motion.img
        src={brushImage}
        alt=""
        style={{ x: brushX, y: '-32%', opacity: 1 }}
        className="absolute left-0 top-0 z-[2] w-[40%] max-w-none"
      />
    </div>
  </div>;
}
