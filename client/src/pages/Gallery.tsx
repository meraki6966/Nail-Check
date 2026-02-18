import { Layout } from "@/components/Layout";
import { Image, Sparkles, Lock, Bell, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
];

const CATEGORIES = ["All", "Nail Shapes", "Effects", "Design Styles", "Themes"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredItems = selectedCategory === "All" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const handleNotify = () => {
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image className="h-10 w-10 text-[#FF6B9D]" />
              <h1 className="text-5xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
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
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:shadow-[#FF6B9D]/15 transition-all duration-500 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[10px] uppercase tracking-widest text-[#FF6B9D] mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-serif text-lg">{item.name}</h3>
                </div>

                {/* Corner badge */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-[#9B5DE5]" />
                  </div>
                </div>
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

                <h2 className="text-3xl font-serif mb-4">
                  <span className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
                    More Designs
                  </span>
                  {" "}Coming Soon
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
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#10B981]/10 to-[#00D9FF]/10 border border-[#10B981]/20">
                    <span className="text-2xl block mb-2">🎉</span>
                    <p className="text-[#10B981] font-medium">You're on the list!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Want to see your work featured?</p>
            <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white">
                Join the Community
              </Button>
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
}