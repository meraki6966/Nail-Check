import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Snowflake, Flower, Sun, Leaf, Calendar, Loader2, Lock, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

interface SeasonalDesign {
  id: number;
  title: string;
  imageUrl: string;
  season: string;
  category?: string;
  description?: string;
  tags?: string[];
  featured: boolean;
  createdAt: string;
}

const SEASONS = [
  { name: "All", value: "", icon: Calendar, color: "text-gray-600" },
  { name: "Winter", value: "Winter", icon: Snowflake, color: "text-blue-400" },
  { name: "Spring", value: "Spring", icon: Flower, color: "text-pink-400" },
  { name: "Summer", value: "Summer", icon: Sun, color: "text-yellow-400" },
  { name: "Fall", value: "Fall", icon: Leaf, color: "text-orange-400" },
  { name: "Holidays", value: "Holiday", icon: Calendar, color: "text-red-400" },
];

const SEASON_CARDS = [
  {
    name: "Fall",
    value: "Fall",
    Icon: Leaf,
    tagline: "Warm & cozy tones",
    iconColor: "text-orange-400",
    activeBg: "from-[#FF8A5B] to-[#D4AF37]",
    idleBg: "from-orange-50 to-amber-50",
    border: "border-orange-100",
  },
  {
    name: "Winter",
    value: "Winter",
    Icon: Snowflake,
    tagline: "Holiday glam & frost",
    iconColor: "text-blue-400",
    activeBg: "from-[#00D9FF] to-[#9B5DE5]",
    idleBg: "from-blue-50 to-cyan-50",
    border: "border-blue-100",
  },
  {
    name: "Spring",
    value: "Spring",
    Icon: Flower,
    tagline: "Florals & pastels",
    iconColor: "text-pink-400",
    activeBg: "from-[#FF6B9D] to-[#FF8A5B]",
    idleBg: "from-pink-50 to-rose-50",
    border: "border-pink-100",
  },
  {
    name: "Summer",
    value: "Summer",
    Icon: Sun,
    tagline: "Bright & bold vibes",
    iconColor: "text-yellow-400",
    activeBg: "from-[#FFC857] to-[#FF8A5B]",
    idleBg: "from-yellow-50 to-orange-50",
    border: "border-yellow-100",
  },
];

export default function SeasonalVault() {
  const [designs, setDesigns] = useState<SeasonalDesign[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<SeasonalDesign[]>([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SeasonalDesign | null>(null);
  
  // Get auth state for membership gating
  const { user, isLoading: authLoading } = useAuth();
  const isMember = user?.isPaidMember ?? false;

  useEffect(() => {
    fetchDesigns();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      setFilteredDesigns(designs.filter(d => d.season === selectedSeason));
    } else {
      setFilteredDesigns(designs);
    }
  }, [selectedSeason, designs]);

  const fetchDesigns = async () => {
    try {
      const response = await fetch("/api/seasonal");
      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
        setFilteredDesigns(data);
      }
    } catch (error) {
      console.error("Error fetching seasonal designs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedDesigns = filteredDesigns.reduce((acc, design) => {
    const season = design.season;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(design);
    return acc;
  }, {} as Record<string, SeasonalDesign[]>);

  if (isLoading || authLoading) {
    return (
      
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className={cn("h-8 w-8 animate-spin", GOLD_TEXT)} />
        </div>
      
    );
  }

  // If not a member, show locked state
  if (!isMember) {
    return (
      
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          {/* Header */}
          <header className="text-center space-y-4">
            <span className="text-[10px] tracking-[0.8em] text-gray-400 uppercase">The Curated Collections</span>
            <h1 className="text-6xl tracking-widest bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">Seasonal Vault</h1>
            <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
              Explore our expertly curated nail designs organized by season and special occasions
            </p>
          </header>

          {/* Locked Content Preview */}
          <div className="relative">
            {/* Blurred Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 blur-md pointer-events-none select-none opacity-50">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-200" />
              ))}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm p-12 text-center max-w-lg border border-gray-200">
                <div className={cn("w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center", GOLD_GRADIENT)}>
                  <Lock className="h-10 w-10 text-white" />
                </div>
                
                <span className="text-[10px] tracking-[0.5em] text-gray-400 uppercase block mb-2">
                  Members Only
                </span>
                
                <h2 className="text-3xl tracking-wider uppercase mb-4 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                  Unlock the Vault
                </h2>
                
                <p className="text-sm text-gray-500 italic mb-8">
                  Access {designs.length}+ curated seasonal designs, holiday collections, and trend-forward inspiration with a Nail Check membership.
                </p>

                <div className="space-y-3">
                  <Link href="/login">
                    <Button className={cn("w-full uppercase text-[10px] tracking-widest", GOLD_GRADIENT, "text-white")}>
                      <Crown className="h-4 w-4 mr-2" />
                      Become a Member
                    </Button>
                  </Link>
                  
                  <Link href="/subscribe">
                    <Button variant="outline" className="w-full uppercase text-[10px] tracking-widest border-[#B08D57] text-[#B08D57]">
                      View Plans
                    </Button>
                  </Link>
                </div>

                <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-wider">
                  Starting at $8.99/month
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-8">
            {SEASON_CARDS.map(({ name, Icon, tagline, iconColor, idleBg, border }) => (
              <div key={name} className={cn("text-center p-8 rounded-2xl border-2 bg-gradient-to-br", border, idleBg)}>
                <Icon className={cn("h-12 w-12 mx-auto mb-4", iconColor)} />
                <h3 className="text-xl tracking-widest uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                  {name}
                </h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">{tagline}</p>
              </div>
            ))}
          </div>
        </div>
      
    );
  }

  // Member view - full access
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <span className="text-[10px] tracking-[0.8em] text-gray-400 uppercase">The Curated Collections</span>
          <h1 className="text-6xl tracking-widest bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">Seasonal Vault</h1>
          <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
            Explore our expertly curated nail designs organized by season and special occasions
          </p>
        </header>

        {/* Season Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {SEASON_CARDS.map(({ name, value, Icon, tagline, iconColor, activeBg, idleBg, border }) => {
            const isActive = selectedSeason === value;
            return (
              <button
                key={value}
                onClick={() => setSelectedSeason(isActive ? "" : value)}
                className={cn(
                  "group relative p-8 rounded-2xl border-2 transition-all duration-300 text-center cursor-pointer",
                  isActive
                    ? `border-transparent bg-gradient-to-br ${activeBg} shadow-xl scale-[1.02]`
                    : `${border} bg-gradient-to-br ${idleBg} hover:shadow-lg hover:scale-[1.01]`
                )}
              >
                <Icon className={cn(
                  "h-12 w-12 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-white" : iconColor
                )} />
                <h3 className={cn(
                  "text-xl tracking-widest uppercase",
                  isActive
                    ? "text-white"
                    : "bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent"
                )}>
                  {name}
                </h3>
                <p className={cn(
                  "text-[10px] tracking-wider uppercase mt-2",
                  isActive ? "text-white/80" : "text-gray-400"
                )}>
                  {tagline}
                </p>
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✕</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Season Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {SEASONS.map((season) => {
            const Icon = season.icon;
            const isSelected = selectedSeason === season.value;
            return (
              <Button
                key={season.value}
                onClick={() => setSelectedSeason(season.value)}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "uppercase text-[10px] tracking-widest transition-all",
                  isSelected 
                    ? cn(GOLD_GRADIENT, "text-white border-transparent") 
                    : "border-gray-300 hover:border-[#B08D57]"
                )}
              >
                <Icon className={cn("h-4 w-4 mr-2", isSelected ? "text-white" : season.color)} />
                {season.name}
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            {filteredDesigns.length} Design{filteredDesigns.length !== 1 ? 's' : ''} Found
          </p>
        </div>

        {/* Designs Grid - Grouped by Season */}
        {selectedSeason ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onClick={() => setSelectedDesign(design)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-20">
            {Object.entries(groupedDesigns).map(([season, seasonDesigns]) => {
              const seasonData = SEASONS.find(s => s.value === season);
              const Icon = seasonData?.icon || Calendar;
              const color = seasonData?.color || "text-gray-600";
              
              return (
                <div key={season} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <Icon className={cn("h-6 w-6", color)} />
                    <h2 className="text-3xl uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">{season}</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {seasonDesigns.map((design) => (
                      <DesignCard 
                        key={design.id} 
                        design={design} 
                        onClick={() => setSelectedDesign(design)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No designs found for this season</p>
          </div>
        )}
      </div>

      {/* Design Detail Modal */}
      <AnimatePresence>
        {selectedDesign && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDesign(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="aspect-square">
                  <img 
                    src={selectedDesign.imageUrl} 
                    alt={selectedDesign.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-8 space-y-6">
                  <div>
                    <span className={cn("text-[9px] uppercase tracking-widest mb-2 block", GOLD_TEXT)}>
                      {selectedDesign.season} {selectedDesign.category && `• ${selectedDesign.category}`}
                    </span>
                    <h2 className="text-3xl uppercase tracking-wider mb-4 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                      {selectedDesign.title}
                    </h2>
                    {selectedDesign.description && (
                      <p className="text-sm text-gray-600 italic">{selectedDesign.description}</p>
                    )}
                  </div>

                  {selectedDesign.tags && selectedDesign.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedDesign.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-gray-100 px-3 py-1 text-[9px] uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-100">
                    <Button
                      onClick={() => setSelectedDesign(null)}
                      variant="outline"
                      className="w-full uppercase text-[10px] tracking-widest"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function DesignCard({ design, onClick }: { design: SeasonalDesign; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative aspect-square cursor-pointer overflow-hidden border border-gray-200"
      onClick={onClick}
    >
      <img 
        src={design.imageUrl} 
        alt={design.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {design.featured && (
        <div className="absolute top-2 right-2 bg-[#B08D57] text-white px-2 py-1 text-[8px] uppercase tracking-widest">
          Featured
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <span className="text-[8px] text-[#D4AF37] uppercase tracking-widest mb-1">
          {design.season}
        </span>
        <h3 className="text-white text-sm uppercase tracking-wider font-bold">
          {design.title}
        </h3>
        {design.category && (
          <p className="text-white/70 text-[9px] uppercase tracking-wide mt-1">
            {design.category}
          </p>
        )}
      </div>
    </motion.div>
  );
}