import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ExternalLink, Lock, Share2, Star, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupplyProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  description?: string;
  imageUrl?: string;
  productUrl?: string;
  price?: string;
  utility?: string;
  tags?: string[];
  featured: boolean;
  memberOnly: boolean;
}

const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

const CATEGORY_PALETTE: Record<string, string[]> = {
  "Color":     ["#FF6B9D", "#FF8FA3", "#E91E63", "#9B5DE5", "#7C3AED", "#6366F1", "#00D9FF", "#10B981", "#F59E0B", "#FF8A5B"],
  "Base Coat": ["#FFE5EC", "#FFD6E0", "#F8C8DC", "#FFF0F5"],
  "Top Coat":  ["#9B5DE5", "#A78BFA", "#C4B5FD", "#DDD6FE"],
  "Tool":      ["#00D9FF", "#22D3EE", "#06B6D4", "#0EA5E9"],
  "Equipment": ["#9B5DE5", "#7C3AED", "#6D28D9"],
  "Specialty": ["#D4AF37", "#FFD700", "#B08D57", "#FF8A5B"],
  "Nail Care": ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
};

function paletteFor(cat: string): string[] {
  return CATEGORY_PALETTE[cat] || ["#B08D57", "#D4AF37", "#FF6B9D", "#9B5DE5"];
}

export function SupplyDetailModal({
  product,
  isAuthenticated,
  onClose,
}: {
  product: SupplyProduct | null;
  isAuthenticated: boolean;
  onClose: () => void;
}) {
  const [shadeIdx, setShadeIdx] = useState(0);
  const [shared, setShared] = useState(false);

  const palette = useMemo(() => (product ? paletteFor(product.category) : []), [product]);
  const isColor = product?.category === "Color";

  useEffect(() => {
    setShadeIdx(0);
    setShared(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
  };

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: `${product.name} — ${product.brand}`,
      text: `Check out ${product.name} by ${product.brand} on Nail Check`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} — ${shareData.url}`);
      }
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      /* user dismissed */
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="supply-backdrop"
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            key="supply-card"
            className="relative bg-white w-full md:max-w-3xl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
            initial={{ scale: 0.6, opacity: 0, y: 80 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.9 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Visual side */}
              <div className="relative bg-gradient-to-br from-[#FFF5F8] via-[#F8F0FF] to-[#E0F7FF] aspect-square flex items-center justify-center overflow-hidden">
                {isColor ? (
                  <motion.div
                    key={shadeIdx}
                    initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="relative"
                  >
                    <div
                      className="w-56 h-56 md:w-64 md:h-64 rounded-full shadow-2xl ring-8 ring-white/60"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${palette[shadeIdx]}, ${palette[shadeIdx]}cc 60%, ${palette[shadeIdx]}88)`,
                        boxShadow: `0 24px 60px -12px ${palette[shadeIdx]}aa, inset -8px -12px 30px rgba(0,0,0,0.18), inset 8px 8px 18px rgba(255,255,255,0.4)`,
                      }}
                    />
                    {/* Sparkle */}
                    <Sparkles
                      className="absolute -top-3 -right-3 h-7 w-7 text-white drop-shadow-md animate-float"
                      style={{ filter: `drop-shadow(0 0 10px ${palette[shadeIdx]})` }}
                    />
                  </motion.div>
                ) : product.imageUrl ? (
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                ) : (
                  <div className="text-6xl">📦</div>
                )}

                {/* Featured badge */}
                {product.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-md">
                    <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#B08D57]">
                      Featured
                    </span>
                  </div>
                )}

                {/* Color shade slider */}
                {isColor && palette.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/85 backdrop-blur-md rounded-full p-2 shadow-lg flex items-center gap-2 overflow-x-auto">
                      {palette.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setShadeIdx(i)}
                          aria-label={`Shade ${i + 1}`}
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95",
                            shadeIdx === i ? "ring-4 ring-offset-1 ring-[#B08D57] scale-110" : "ring-1 ring-gray-200"
                          )}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details side */}
              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1">
                    {product.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl uppercase tracking-wider mb-1 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                  {product.price && (
                    <p className="text-xl font-bold mt-2 text-[#B08D57]">{product.price}</p>
                  )}
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 italic leading-relaxed">{product.description}</p>
                )}

                {product.utility && (
                  <div className="bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] p-4 rounded-xl border-l-4 border-[#9B5DE5]">
                    <p className="text-[9px] uppercase tracking-widest text-[#9B5DE5] mb-1 font-bold">
                      Utility
                    </p>
                    <p className="text-sm text-gray-700">{product.utility}</p>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-pink-50 to-purple-50 text-[#9B5DE5] px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {isColor && (
                    <a href="/critique">
                      <Button
                        className={cn(
                          "w-full uppercase text-[10px] tracking-widest text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all",
                          "bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF]"
                        )}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate with this color
                      </Button>
                    </a>
                  )}

                  {product.memberOnly && !isAuthenticated ? (
                    <a href="/subscribe">
                      <Button className={cn("w-full uppercase text-[10px] tracking-widest text-white", GOLD_GRADIENT)}>
                        <Lock className="h-4 w-4 mr-2" />
                        Members-only — Subscribe
                      </Button>
                    </a>
                  ) : product.productUrl && product.productUrl !== "#" ? (
                    <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                      <Button className={cn("w-full uppercase text-[10px] tracking-widest text-white", GOLD_GRADIENT)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get Product Link
                      </Button>
                    </a>
                  ) : null}

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full uppercase text-[10px] tracking-widest border-[#9B5DE5]/40 hover:bg-[#9B5DE5]/5"
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

                <p className="text-[9px] uppercase tracking-widest text-gray-300 text-center pt-2 md:hidden">
                  Swipe down to close
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
