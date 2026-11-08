import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryProps = {
  images: string[];
  coupleNames: string;
};

/**
 * Elegant pre-shoot gallery: an arched feature photo followed by a
 * framed masonry grid, with a full-screen lightbox (tap / swipe / arrow keys).
 */
export default function Gallery({ images, coupleNames }: GalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: number) => setActive((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, step]);

  if (images.length === 0) return null;

  const [feature, ...rest] = images;

  return (
    <section className="py-24 md:py-36 w-full relative overflow-hidden bg-gradient-to-b from-white via-theme-50/60 to-white">
      <div className="absolute inset-0 opacity-[0.03] paper-grain pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-theme-200 blur-[140px] rounded-full opacity-30 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[420px] h-[420px] bg-theme-200 blur-[140px] rounded-full opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-12 md:mb-20"
        >
          <span className="text-theme-500 text-[10px] md:text-xs uppercase font-cinzel tracking-[0.5em] md:tracking-[0.6em] font-semibold mb-4">
            Pre-Shoot
          </span>
          <h2 className="font-playball text-[3rem] sm:text-[3.5rem] md:text-[5rem] text-theme-900 leading-none drop-shadow-sm">
            Our Moments
          </h2>
          <div className="flex items-center gap-4 mt-6 opacity-70">
            <div className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent to-theme-400" />
            <div className="w-1.5 h-1.5 rotate-45 bg-theme-500" />
            <div className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent to-theme-400" />
          </div>
          <p className="font-serif italic text-[19px] md:text-2xl text-stone-600 font-light mt-6 max-w-xl leading-relaxed">
            A few treasured moments from our journey to forever
          </p>
        </motion.div>

        {/* Arched feature photo */}
        <motion.button
          type="button"
          onClick={() => setActive(0)}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative block mx-auto mb-12 md:mb-20 group"
          aria-label="Open photo 1"
        >
          <div className="absolute -inset-4 md:-inset-6 rounded-t-full rounded-b-[2.5rem] bg-theme-200/40 blur-2xl" />
          <div className="relative bg-white p-2.5 md:p-3 rounded-t-full rounded-b-[2.5rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] border border-theme-200">
            <div className="relative w-[260px] h-[380px] sm:w-[300px] sm:h-[440px] md:w-[360px] md:h-[520px] rounded-t-full rounded-b-[2rem] overflow-hidden">
              <img
                src={feature}
                alt={`${coupleNames} pre-shoot`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-t-full rounded-b-[2rem] border border-white/60 m-2 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
              <p className="absolute bottom-5 inset-x-0 text-center font-playball text-white text-[28px] md:text-4xl drop-shadow-md">
                {coupleNames}
              </p>
            </div>
          </div>
        </motion.button>

        {/* Framed masonry grid */}
        <div className="columns-2 md:columns-3 gap-3 sm:gap-5 md:gap-7">
          {rest.map((src, i) => (
            <motion.button
              type="button"
              key={src}
              onClick={() => setActive(i + 1)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: "easeOut" }}
              className="group relative block w-full mb-3 sm:mb-5 md:mb-7 break-inside-avoid bg-white p-1.5 sm:p-2 rounded-2xl border border-theme-100 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500"
              aria-label={`Open photo ${i + 2}`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={src}
                  alt={`${coupleNames} pre-shoot ${i + 2}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-1.5 sm:inset-2 border border-white/50 rounded-lg pointer-events-none" />
                <div className="absolute inset-0 bg-theme-900/0 group-hover:bg-theme-900/10 transition-colors duration-500" />
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-center mt-8 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">
          Tap a photo to view
        </p>
      </div>

      {/* Lightbox (portaled to body so no ancestor can clip it) */}
      {createPortal(
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={images[active]}
                src={images[active]}
                alt={`${coupleNames} pre-shoot ${active + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  else if (info.offset.x > 60) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-[85dvh] object-contain rounded-xl shadow-2xl border-4 border-white/90 cursor-grab active:cursor-grabbing select-none"
                draggable={false}
              />
            </AnimatePresence>

            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <p className="absolute bottom-5 inset-x-0 text-center text-white/70 text-[11px] tracking-[0.4em] font-bold">
              {active + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </section>
  );
}
