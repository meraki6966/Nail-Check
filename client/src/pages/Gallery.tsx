import { Image, Sparkles, Lock, Bell, Filter, Download, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { downloadWithWatermark } from "@/lib/watermark";
import { addNailCheckWatermark } from "@/lib/watermark";
import { UpgradeModal } from "@/components/UpgradeModal";
import { GalleryDetailModal } from "@/components/GalleryDetailModal";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

// Official style names with real images
const GALLERY_ITEMS = [
  // Nail Shapes
  { id: 1, image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Square.png", name: "Square", category: "Nail Shapes" },
  { id: 2, image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Coffin.png", name: "Coffin", category: "Nail Shapes" },
  { id: 3, image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Almond.png", name: "Almond", category: "Nail Shapes" },
  { id: 4, image: "http://nail-check.com/wp-content/uploads/2026/02/Nail-Shape-Stiletto.png", name: "Stiletto", category: "Nail Shapes" },
  
  // Effects & Finishes
  { id: 5, image: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png", name: "Chrome", category: "Effects" },
  { id: 6, image: "http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png", name: "Cat Eye / Velvet", category: "Effects" },
  { id: 7, image: "http://nail-check.com/wp-content/uploads/2026/02/Glass-Nails.png", name: "Glass Nails", category: "Effects" },
  
  // Design Styles
  { id: 8, image: "http://nail-check.com/wp-content/uploads/2026/02/Classy.png", name: "Classy / Minimal", category: "Design Styles" },
  { id: 9, image: "http://nail-check.com/wp-content/uploads/2026/02/Junk.png", name: "Junk Nails", category: "Design Styles" },
  { id: 10, image: "http://nail-check.com/wp-content/uploads/2026/02/3D-Character.png", name: "3D / Character", category: "Design Styles" },
  
  // Themes
  { id: 11, image: "http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png", name: "Bridal Nails", category: "Themes" },
  { id: 12, image: "http://nail-check.com/wp-content/uploads/2026/02/Birthday.png", name: "Birthday Sets", category: "Themes" },

  // AI-Generated Inspirations
  { id: 13, image: "http://nail-check.com/wp-content/uploads/2026/04/lucid-origin_Close-up_of_dark_brown_skin_hands_with_long_coffin_nails_holographic_chrome_fini-0.jpg", name: "Holographic Chrome", category: "Effects" },
  { id: 14, image: "http://nail-check.com/wp-content/uploads/2026/04/lucid-origin_Short_square_nails_on_pale_skin_pastel_pink_base_with_hand-sculpted_3D_white_ros-0.jpg", name: "Short Square with White Roses", category: "Design Styles" },
  { id: 15, image: "http://nail-check.com/wp-content/uploads/2026/04/lucid-origin_Almond_nails_on_warm_brown_skin_intricate_henna-inspired_gold_designs_on_deep_re-0.jpg", name: "Henna Inspired", category: "Design Styles" },
  { id: 16, image: "http://nail-check.com/wp-content/uploads/2026/04/lucid-origin_Square_medium_nails_on_deep_dark_brown_skin_leopard_print_in_gold_and_brown_matt-0.jpg", name: "Leopard Print", category: "Design Styles" },
  { id: 17, image: "http://nail-check.com/wp-content/uploads/2026/04/lucid-origin_Long_almond_nails_on_caramel_skin_full_coverage_holographic_chrome_that_shifts_t-0.jpg", name: "Holographic Chrome Almond", category: "Effects" },
  { id: 18, image: "http://nail-check.com/wp-content/uploads/2026/04/lucid-origin_Long_almond_nails_on_brown_skin_full_coverage_mother_day_theme_nails_rose_colore-0.jpg", name: "Mothers Day", category: "Themes" },
  { id: 19, image: "http://nail-check.com/wp-content/uploads/2026/04/IMG_1958.jpg", name: "Vortex", category: "Design Styles" },
  { id: 20, image: "http://nail-check.com/wp-content/uploads/2026/04/IMG_1957.jpg", name: "Golden Elegance", category: "Themes" },
  { id: 21, image: "http://nail-check.com/wp-content/uploads/2026/04/IMG_1956.jpg", name: "Christmas", category: "Themes" },
  { id: 22, image: "http://nail-check.com/wp-content/uploads/2026/04/IMG_1962.jpg", name: "Springtime", category: "Effects" },
  { id: 23, image: "http://nail-check.com/wp-content/uploads/2026/04/IMG_1961.jpg", name: "Pierced Architecture", category: "Design Styles" },
  { id: 24, image: "http://nail-check.com/wp-content/uploads/2026/04/IMG_1960.jpg", name: "Butterfly and Flowers", category: "Design Styles" },
  { id: 25, image: "https://images.unsplash.com/photo-1632344004625-df03b9bc1c2e?w=800&q=80&auto=format&fit=crop", name: "Cartoon Anime", category: "Design Styles" },
];

const CATEGORIES = ["All", "Nail Shapes", "Effects", "Design Styles", "Themes"];

export default function Gallery() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filteredItems = selectedCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  // Subscription status
  const { data: subStatus } = useQuery<{ tier: "free" | "base" | "premium"; aiGenerationsRemaining: number | "unlimited" }>({
    queryKey: ["/api/subscriptions/status", user?.id],
    queryFn: async () => {
      if (!user?.id) return { tier: "free", aiGenerationsRemaining: 0 };
      const res = await fetch(`/api/subscriptions/status/${user.id}`, { credentials: "include" });
      if (!res.ok) return { tier: "free", aiGenerationsRemaining: 0 };
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const isPremium = subStatus?.tier === "premium";

  const handleDownload = async (item: typeof GALLERY_ITEMS[0]) => {
    setDownloadingId(item.id);
    try {
      if (isPremium) {
        // Premium: clean download, no watermark
        const link = document.createElement("a");
        link.href = item.image;
        link.download = `nail-check-${item.name.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Base/Free: download with watermark, then prompt upgrade
        await downloadWithWatermark(item.image, `nail-check-${item.name.toLowerCase().replace(/\s+/g, "-")}.png`);
        if (subStatus?.tier !== "premium") {
          setShowUpgradeModal(true);
        }
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleNotify = async () => {
    if (email) {
      try {
        await fetch("https://script.google.com/macros/s/AKfycbymz2-QPYcX_pZ0B4wcxAvyKRSAjPmVcH4QFQKTBfh-2-3kLOuqxBeT1H5qXV1gJ3gz/exec", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, source: "Gallery Page" })
        });
        setSubscribed(true);
      } catch (error) {
        console.error("Failed to subscribe:", error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image className="h-10 w-10 text-[#FF6B9D] animate-float" />
              <h1 className="text-5xl uppercase tracking-wider text-brand-gradient-animated">
                Gallery
              </h1>
            </div>
            <p className="text-gray-500 italic">
              Inspiration from the official Nail Check style library
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white shadow-lg shadow-[#FF6B9D]/20"
                    : "bg-white text-gray-600 hover:bg-[#FFF5F8] border border-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm hover-pop hover-glow-pink animate-pop-in transition-all duration-500 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (t.dataset.fallback) return;
                    t.dataset.fallback = "1";
                    const safeName = item.name.replace(/[<>&]/g, "");
                    t.src = "data:image/svg+xml;utf8," + encodeURIComponent(
                      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FF6B9D'/><stop offset='1' stop-color='#9B5DE5'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='200' y='210' text-anchor='middle' font-family='serif' font-size='28' fill='white' opacity='0.9'>${safeName}</text></svg>`
                    );
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay with name + download */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#FF6B9D] mb-0.5">
                    {item.category}
                  </span>
                  <div className="flex items-end justify-between gap-2">
                    <h3 className="text-white font-serif text-base leading-tight">{item.name}</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                      disabled={downloadingId === item.id}
                      title={isPremium ? "Download (no watermark)" : "Download with watermark"}
                      className={cn(
                        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all",
                        isPremium
                          ? "bg-gradient-to-br from-[#9B5DE5] to-[#7c3acd] hover:opacity-90"
                          : "bg-white/90 hover:bg-white"
                      )}
                    >
                      {downloadingId === item.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                      ) : isPremium ? (
                        <Download className="h-4 w-4 text-white" />
                      ) : (
                        <Download className="h-4 w-4 text-[#9B5DE5]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Premium no-watermark badge */}
                {isPremium && (
                  <div className="absolute top-2 left-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9B5DE5]/90 backdrop-blur-sm">
                      <Crown className="h-2.5 w-2.5 text-white" />
                      <span className="text-[9px] text-white font-bold uppercase tracking-wide">Clean DL</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="relative">
            {/* Glowing border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] rounded-3xl blur-lg opacity-20"></div>
            
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="max-w-2xl mx-auto text-center">
                
                {/* Icon */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center">
                    <Image className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#00D9FF] flex items-center justify-center animate-bounce">
                    <span className="text-xs">✨</span>
                  </div>
                </div>

                <h2 className="text-3xl mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                  More Designs Coming Soon
                </h2>
                
                <p className="text-gray-500 mb-8 leading-relaxed">
                  We're building an ever-growing gallery featuring every style from the Nail Check universe. 
                  Seasonal collections, community submissions, and exclusive member designs — all automatically synced from our curated WordPress galleries.
                </p>

                {/* What's Coming */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: "🌸", label: "Seasonal Vault" },
                    { icon: "🔥", label: "Fire Vault Picks" },
                    { icon: "👥", label: "Community Art" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF]">
                      <span className="text-2xl block mb-2">{item.icon}</span>
                      <span className="text-xs font-medium text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Notify Form */}
                {!subscribed ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      <Bell className="inline h-4 w-4 mr-1" />
                      Get notified when new collections drop
                    </p>
                    <div className="flex gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-[#9B5DE5] focus:ring-2 focus:ring-[#9B5DE5]/20 outline-none transition-all"
                      />
                      <Button
                        onClick={handleNotify}
                        className={cn("rounded-full px-6", PINK_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#FF6B9D]/30")}
                      >
                        Notify Me
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-gradient-to-r from-[#10B981]/10 via-[#00D9FF]/10 to-[#9B5DE5]/10 border border-[#10B981]/20 animate-success-pop">
                    <span className="text-4xl block mb-2 animate-float">🎉</span>
                    <p className="text-[#10B981] font-bold uppercase tracking-wider">You're on the list!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Want to see your work featured?</p>
            <a href="/subscribe">
              <Button variant="outline" className="rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white">
                Join the Community
              </Button>
            </a>
          </div>

        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => { setShowUpgradeModal(false); window.location.href = "/subscribe"; }}
      />

      {selectedItem && (
        <GalleryDetailModal
          item={selectedItem}
          allItems={filteredItems}
          onClose={() => setSelectedItem(null)}
          onSelect={(it) => setSelectedItem(it)}
          onDownload={(it) => handleDownload(it)}
          isPremium={isPremium}
        />
      )}
    </>
  );
}