import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Loader2, Lock, ExternalLink, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const GOLD_TEXT = "text-[#B08D57]";
const GOLD_GRADIENT = "bg-gradient-to-r from-[#B08D57] via-[#D4AF37] to-[#B08D57]";

const CATEGORY_DEFINITIONS: Record<string, string> = {
  "Base Coat": "Applied first to the natural nail, base coats create adhesion for color polish, protect the nail plate from staining, and extend wear time.",
  "Top Coat": "Sealed over finished color to lock in design, add shine or matte finish, prevent chipping, and extend the life of the application.",
  "Color": "Nail polish or gel color in a full spectrum of shades and finishes. Available in regular, gel, dip, and builder formulations.",
  "Tool": "Hand tools used for shaping, detailing, and application — including files, buffers, brushes, dotting tools, and cuticle pushers.",
  "Equipment": "Powered or professional-grade equipment such as UV/LED lamps, e-files (electric drills), nail dust collectors, and sterilizers.",
  "Specialty": "Advanced products including gel builders, polygels, acrylics, dip powders, nail art supplies, and enhancement systems.",
  "Nail Care": "Products designed to strengthen, hydrate, and maintain the health of the natural nail — including cuticle oils, strengtheners, and nail serums.",
};

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
  createdAt: string;
}

const CATEGORIES = [
  { name: "All", value: "" },
  { name: "Base Coat", value: "Base Coat" },
  { name: "Top Coat", value: "Top Coat" },
  { name: "Colors", value: "Color" },
  { name: "Tools", value: "Tool" },
  { name: "Equipment", value: "Equipment" },
  { name: "Specialty", value: "Specialty" },
  { name: "Nail Care", value: "Nail Care" },
];

export default function SupplySuite() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [products, setProducts] = useState<SupplyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SupplyProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SupplyProduct | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/supplies");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  };

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, SupplyProduct[]>);

  if (isLoading) {
    return (
      
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className={cn("h-8 w-8 animate-spin", GOLD_TEXT)} />
        </div>
      
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Package className={cn("h-10 w-10", GOLD_TEXT)} />
            <h1 className="text-6xl font-serif tracking-widest uppercase text-black">Supply Suite</h1>
          </div>
          <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
            Curated professional-grade products, tools, and equipment for the Technical Hub
          </p>
          {!isAuthenticated && (
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              🔒 Member-only access • Join to unlock product links
            </p>
          )}
        </header>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-lg px-6 py-4">
          <p className="text-xs text-amber-800 leading-relaxed text-center">
            <strong>Disclaimer:</strong> Nail Check is not responsible for the misuse of any products or techniques shown. Always follow manufacturer instructions and consult a licensed professional if unsure. Product links are provided for informational purposes only.
          </p>
        </div>

        {/* Category Definitions */}
        <div className="max-w-4xl mx-auto space-y-3">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 text-center mb-4">Category Guide</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(CATEGORY_DEFINITIONS).map(([cat, def]) => (
              <div key={cat} className="flex gap-3 p-4 bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 w-1 bg-gradient-to-b from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] rounded-full" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-700 mb-1">{cat}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{def}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products, brands, or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-none border-gray-200 focus:border-[#B08D57]"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.value;
            return (
              <Button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "uppercase text-[10px] tracking-widest transition-all",
                  isSelected 
                    ? cn(GOLD_GRADIENT, "text-white border-transparent") 
                    : "border-gray-300 hover:border-[#B08D57]"
                )}
              >
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
          </p>
        </div>

        {/* Products Grid */}
        {selectedCategory || searchQuery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAuthenticated={isAuthenticated}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-20">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">{category}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#FF6B9D]/30 via-[#9B5DE5]/30 to-[#00D9FF]/30"></div>
                  <span className="text-sm text-gray-400">{categoryProducts.length}</span>
                </div>
                {CATEGORY_DEFINITIONS[category] && (
                  <p className="text-xs text-gray-400 italic -mt-4">{CATEGORY_DEFINITIONS[category]}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAuthenticated={isAuthenticated}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="aspect-square bg-gray-100">
                  {selectedProduct.imageUrl ? (
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-20 w-20 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-8 space-y-6">
                  <div>
                    {selectedProduct.featured && (
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 fill-[#B08D57] text-[#B08D57]" />
                        <span className="text-[9px] uppercase tracking-widest text-[#B08D57]">Featured</span>
                      </div>
                    )}
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-2xl font-serif uppercase tracking-wider mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">{selectedProduct.brand}</p>
                    {selectedProduct.price && (
                      <p className={cn("text-xl font-bold mt-2", GOLD_TEXT)}>{selectedProduct.price}</p>
                    )}
                  </div>

                  {selectedProduct.description && (
                    <p className="text-sm text-gray-600 italic">{selectedProduct.description}</p>
                  )}

                  {selectedProduct.utility && (
                    <div className="bg-gray-50 p-4 border-l-2 border-[#B08D57]">
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Utility</p>
                      <p className="text-sm text-gray-700">{selectedProduct.utility}</p>
                    </div>
                  )}

                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-gray-100 px-3 py-1 text-[9px] uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-100 space-y-3">
                    {selectedProduct.memberOnly && !isAuthenticated ? (
                      <div className="text-center py-4">
                        <Lock className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500 mb-4">Members-only product link</p>
                        <a href="/subscribe">
                          <Button className={cn("w-full uppercase text-[10px] tracking-widest", GOLD_GRADIENT, "text-white")}>
                            Subscribe
                          </Button>
                        </a>
                      </div>
                    ) : selectedProduct.productUrl && selectedProduct.productUrl !== "#" ? (
                      <a href={selectedProduct.productUrl} target="_blank" rel="noopener noreferrer">
                        <Button className={cn("w-full uppercase text-[10px] tracking-widest", GOLD_GRADIENT, "text-white")}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Get Product Link
                        </Button>
                      </a>
                    ) : null}
                    
                    <Button
                      onClick={() => setSelectedProduct(null)}
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

function ProductCard({ 
  product, 
  isAuthenticated, 
  onClick 
}: { 
  product: SupplyProduct; 
  isAuthenticated: boolean;
  onClick: () => void;
}) {
  const isLocked = product.memberOnly && !isAuthenticated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white border border-gray-200 overflow-hidden cursor-pointer hover:border-[#B08D57] transition-all"
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
              isLocked && "blur-sm opacity-50"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-300" />
          </div>
        )}
        
        {product.featured && (
          <div className="absolute top-2 right-2 bg-[#B08D57] text-white px-2 py-1 text-[8px] uppercase tracking-widest flex items-center gap-1">
            <Star className="h-3 w-3 fill-white" />
            Featured
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="h-12 w-12 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 truncate">
              {product.brand}
            </p>
            <h3 className="font-bold text-sm uppercase tracking-wide truncate">
              {product.name}
            </h3>
          </div>
          {product.price && (
            <span className={cn("text-sm font-bold whitespace-nowrap", GOLD_TEXT)}>
              {product.price}
            </span>
          )}
        </div>

        {product.utility && (
          <p className="text-[10px] text-gray-500 line-clamp-2 italic">
            {product.utility}
          </p>
        )}

        <div className="pt-2">
          {isLocked ? (
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-400">
              <Lock className="h-3 w-3" />
              Members Only
            </div>
          ) : (
            <span className="text-[9px] uppercase tracking-widest text-[#B08D57]">
              View Details →
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}