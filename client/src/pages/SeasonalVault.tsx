import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Snowflake, Flower2, Sun, Leaf, Calendar, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  { name: "Spring", value: "Spring", icon: Flower2, color: "text-pink-400" },
  { name: "Summer", value: "Summer", icon: Sun, color: "text-yellow-400" },
  { name: "Fall", value: "Fall", icon: Leaf, color: "text-orange-400" },
  { name: "Holidays", value: "Holiday", icon: Calendar, color: "text-red-400" },
];

export default function SeasonalVault() {
  const [designs, setDesigns] = useState<SeasonalDesign[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<SeasonalDesign[]>([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SeasonalDesign | null>(null);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className={cn("h-8 w-8 animate-spin", GOLD_TEXT)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <span className="text-[10px] tracking-[0.8em] text-gray-400 uppercase">The Curated Collections</span>
          <h1 className="text-6xl font-serif tracking-widest uppercase text-black">Seasonal Vault</h1>
          <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
            Explore our expertly curated nail designs organized by season and special occasions
          </p>
        </header>

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
                    <h2 className="text-3xl font-serif uppercase tracking-wider">{season}</h2>
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
                    <h2 className="text-3xl font-serif uppercase tracking-wider mb-4">
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
    </Layout>
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