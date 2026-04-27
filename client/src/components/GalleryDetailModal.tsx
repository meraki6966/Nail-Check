import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Share2, Sparkles, Check, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: number;
  image: string;
  name: string;
  category: string;
}

const STYLE_BLURBS: Record<string, string> = {
  "Nail Shapes": "A foundational shape that defines the silhouette of every set — choose the cut that fits your vibe and lifestyle.",
  "Effects": "Light-catching finishes that transform a flat color into something you can't stop staring at.",
  "Design Styles": "Hand-painted, sculpted, or layered art — full creative range, from minimal to maximal.",
  "Themes": "Statement sets curated around an occasion, season, or mood.",
};

export function GalleryDetailModal({
  item,
  allItems,
  onClose,
  onSelect,
  onDownload,
  isPremium,
}: {
  item: GalleryItem | null;
  allItems: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
  onDownload?: (item: GalleryItem) => void;
  isPremium?: boolean;
}) {
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setShared(false);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  if (!item) {
    return (
      <AnimatePresence>{null}</AnimatePresence>
    );
  }

  const similar = allItems.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 12);
  const currentIdx = allItems.findIndex((i) => i.id === item.id);

  const goPrev = () => {
    if (!allItems.length) return;
    const next = allItems[(currentIdx - 1 + allItems.length) % allItems.length];
    onSelect(next);
  };
  const goNext = () => {
    if (!allItems.length) return;
    const next = allItems[(currentIdx + 1) % allItems.length];
    onSelect(next);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      onClose();
      return;
    }
    if (info.offset.x < -100 || info.velocity.x < -500) goNext();
    else if (info.offset.x > 100 || info.velocity.x > 500) goPrev();
  };

  const handleShare = async () => {
    const shareData = {
      title: `${item.name} — Nail Check Gallery`,
      text: `Loving this ${item.name} look on Nail Check`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) await navigator.clipboard.writeText(`${shareData.text} — ${shareData.url}`);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      /* dismissed */
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="gallery-backdrop"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

        {/* Side nav arrows (desktop) */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur hover:bg-white/30 hover:scale-110 active:scale-95 transition-all items-center justify-center text-white z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur hover:bg-white/30 hover:scale-110 active:scale-95 transition-all items-center justify-center text-white z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <motion.div
          key={item.id}
          className="relative bg-white w-full md:max-w-4xl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[94vh] overflow-y-auto"
          initial={{ scale: 0.55, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.9 }}
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile drag handle */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          >
            <X className="h-5 w-5 text-gray-800" />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Image — animated zoom-in */}
            <div className="relative aspect-square bg-gradient-to-br from-[#FFF5F8] via-[#F8F0FF] to-[#E0F7FF] overflow-hidden">
              <motion.img
                key={item.image}
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  const t = e.currentTarget;
                  if (t.dataset.fallback) return;
                  t.dataset.fallback = "1";
                  const safeName = item.name.replace(/[<>&]/g, "");
                  t.src = "data:image/svg+xml;utf8," + encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FF6B9D'/><stop offset='1' stop-color='#9B5DE5'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='200' y='210' text-anchor='middle' font-family='serif' font-size='28' fill='white' opacity='0.95'>${safeName}</text></svg>`
                  );
                }}
                className="w-full h-full object-cover anime-image-pop"
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Floating particles overlay */}
              <FloatingParticles seed={item.id} />

              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow text-[9px] uppercase tracking-widest font-bold text-[#FF6B9D] animate-wiggle-hover">
                {item.category}
              </div>

              {/* Sparkle accents */}
              <Sparkles className="absolute top-4 right-12 h-5 w-5 text-white drop-shadow-lg animate-sparkle pointer-events-none" />
              <Sparkles className="absolute bottom-6 left-6 h-4 w-4 text-[#FFD700] drop-shadow-lg animate-sparkle-slow pointer-events-none" />

              {/* Mobile chevrons */}
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous"
                className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center active:scale-90"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next"
                className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center active:scale-90"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 space-y-5">
              <motion.div
                key={`info-${item.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                <h2 className="text-3xl md:text-4xl font-serif mb-2 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent leading-tight">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500 italic">
                  {STYLE_BLURBS[item.category] || "An iconic Nail Check style."}
                </p>
              </motion.div>

              <div className="space-y-2 pt-2">
                <a href="/design-lab">
                  <Button className="w-full uppercase text-[10px] tracking-widest text-white bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-[0.96] transition-all animate-cta-bounce hover-sparkle">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try this style
                  </Button>
                </a>

                {onDownload && (
                  <Button
                    onClick={() => onDownload(item)}
                    variant="outline"
                    className="w-full uppercase text-[10px] tracking-widest border-[#9B5DE5]/40 hover:bg-[#9B5DE5]/5"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isPremium ? "Download (clean)" : "Download"}
                  </Button>
                )}

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full uppercase text-[10px] tracking-widest border-[#FF6B9D]/40 hover:bg-[#FF6B9D]/5"
                >
                  {shared ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-[#10B981]" />
                      Shared!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </>
                  )}
                </Button>
              </div>

              {/* Similar styles carousel */}
              {similar.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-bold">
                    Similar Styles
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                    {similar.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onSelect(s)}
                        className={cn(
                          "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden snap-start ring-2 ring-transparent hover:ring-[#9B5DE5] hover:scale-105 active:scale-95 transition-all",
                          "shadow-sm"
                        )}
                        title={s.name}
                      >
                        <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[9px] uppercase tracking-widest text-gray-300 text-center md:hidden">
                Swipe ← → to browse · ↓ to close
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Floating particles overlay ─────────────────────────── */
const PARTICLE_GLYPHS = ["✦", "✧", "★", "♡", "✨", "❀"];
const PARTICLE_COLORS = ["#FF6B9D", "#9B5DE5", "#00D9FF", "#FFD700", "#FF8A5B", "#FFFFFF"];

function FloatingParticles({ seed }: { seed: number }) {
  const particles = useMemo(() => {
    const rng = (n: number) => {
      const x = Math.sin(seed * 9301 + n * 49297) * 233280;
      return x - Math.floor(x);
    };
    return Array.from({ length: 14 }).map((_, i) => ({
      glyph: PARTICLE_GLYPHS[Math.floor(rng(i) * PARTICLE_GLYPHS.length)],
      color: PARTICLE_COLORS[Math.floor(rng(i + 100) * PARTICLE_COLORS.length)],
      left: `${Math.floor(rng(i + 200) * 90) + 5}%`,
      top: `${Math.floor(rng(i + 300) * 90) + 5}%`,
      size: 10 + Math.floor(rng(i + 400) * 16),
      delay: rng(i + 500) * 2.5,
      duration: 2 + rng(i + 600) * 2,
      pxOffset: (rng(i + 700) - 0.5) * 30,
    }));
  }, [seed]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="anime-particle absolute"
          style={{
            left: p.left,
            top: p.top,
            color: p.color,
            fontSize: `${p.size}px`,
            textShadow: `0 0 10px ${p.color}cc, 0 0 4px white`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--px" as any]: `${p.pxOffset}px`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
