import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Sparkles, Star, Instagram, Globe, Calendar, Filter, ChevronDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

// Filter categories
const SPECIALTY_FILTERS = [
  "All",
  "Chrome",
  "3D / Character",
  "Junk Nails",
  "Coffin",
  "Stiletto",
  "Bridal",
  "Competition Level",
];

// Mock data - will be replaced with API call
const MOCK_TECHS = [
  {
    id: 1,
    name: "Jessica Martinez",
    businessName: "Luxe Nails Studio",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    bio: "Specializing in luxury chrome and 3D nail art. 8 years of experience creating stunning, one-of-a-kind designs.",
    profileImage: "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png",
    bookingUrl: "https://calendly.com/luxenails",
    instagram: "@luxenailshtx",
    skillLevel: "Advanced",
    specialties: ["Chrome", "3D / Character", "Coffin", "Stiletto"],
    rating: 4.9,
    reviewCount: 127,
  },
  {
    id: 2,
    name: "Tiffany Chen",
    businessName: "Nail Artistry by Tiff",
    city: "Houston",
    state: "TX",
    zipCode: "77004",
    bio: "Competition-winning nail artist. Known for intricate junk nails and editorial designs that push boundaries.",
    profileImage: "http://nail-check.com/wp-content/uploads/2026/02/Junk.png",
    bookingUrl: "https://booknow.com/tiffnails",
    instagram: "@tiffnailart",
    skillLevel: "Competition Level",
    specialties: ["Junk Nails", "Editorial", "3D / Character", "Birthday Sets"],
    rating: 5.0,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Keisha Williams",
    businessName: "Glamour Touch",
    city: "Sugar Land",
    state: "TX",
    zipCode: "77478",
    bio: "Bridal specialist with a passion for elegant, timeless designs. Let me make your special day even more beautiful.",
    profileImage: "http://nail-check.com/wp-content/uploads/2026/02/Bridal-1.png",
    bookingUrl: "https://glamourtouch.as.me",
    instagram: "@glamourtouchnails",
    skillLevel: "Advanced",
    specialties: ["Bridal Nails", "Classy / Minimal", "Almond", "Glass Nails"],
    rating: 4.8,
    reviewCount: 203,
  },
  {
    id: 4,
    name: "Maria Santos",
    businessName: "Nails by Maria",
    city: "Katy",
    state: "TX",
    zipCode: "77494",
    bio: "Cat eye and chrome queen! Creating mesmerizing, eye-catching nails that turn heads everywhere you go.",
    profileImage: "http://nail-check.com/wp-content/uploads/2026/02/Cat-eye.png",
    bookingUrl: "https://square.site/book/maria",
    instagram: "@nailsbymaria_tx",
    skillLevel: "Intermediate",
    specialties: ["Cat Eye / Velvet", "Chrome", "Coffin", "Vacation Nails"],
    rating: 4.7,
    reviewCount: 64,
  },
];

export default function FindTech() {
  const [searchZip, setSearchZip] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [techs, setTechs] = useState(MOCK_TECHS);
  const [filteredTechs, setFilteredTechs] = useState(MOCK_TECHS);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter techs based on search and specialty
  useEffect(() => {
    let results = techs;

    // Filter by zip code area (first 3 digits)
    if (searchZip.length >= 3) {
      const zipPrefix = searchZip.substring(0, 3);
      results = results.filter(tech => tech.zipCode.startsWith(zipPrefix));
    }

    // Filter by specialty
    if (selectedFilter !== "All") {
      results = results.filter(tech => 
        tech.specialties.some(s => s.toLowerCase().includes(selectedFilter.toLowerCase()))
      );
    }

    setFilteredTechs(results);
  }, [searchZip, selectedFilter, techs]);

  // Fetch techs from API (will replace mock data)
  useEffect(() => {
    const fetchTechs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/techs");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setTechs(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch techs:", error);
        // Keep mock data on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechs();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="h-10 w-10 text-[#FF6B9D]" />
              <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Find a Tech
              </h1>
            </div>
            <p className="text-gray-500 max-w-md mx-auto">
              Discover talented nail technicians near you who specialize in the styles you love.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  placeholder="Enter your zip code"
                  className="pl-12 h-14 rounded-full text-lg border-gray-200 focus:border-[#FF6B9D]"
                />
              </div>
              <Button 
                className={cn("h-14 px-8 rounded-full", PINK_GRADIENT, "text-white")}
                onClick={() => {}}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 mx-auto text-sm text-[#9B5DE5] font-medium mb-4"
            >
              <Filter className="h-4 w-4" />
              Filter by Specialty
              <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
            </button>
            
            {showFilters && (
              <div className="flex flex-wrap justify-center gap-2">
                {SPECIALTY_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      selectedFilter === filter
                        ? "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white shadow-lg"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-[#FF6B9D]"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500">
              <span className="font-bold text-[#9B5DE5]">{filteredTechs.length}</span> nail techs found
              {searchZip && ` near ${searchZip}`}
            </p>
            <a href="/tech-register">
              <Button variant="outline" className="rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Directory
              </Button>
            </a>
          </div>

          {/* Tech Cards Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5] animate-pulse" />
              <p className="text-gray-500">Loading nail techs...</p>
            </div>
          ) : filteredTechs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-serif mb-2 text-gray-600">No Techs Found</h3>
              <p className="text-gray-400 mb-6">Try a different zip code or filter</p>
              <a href="/tech-register">
                <Button className={cn("rounded-full", PURPLE_GRADIENT, "text-white")}>
                  Be the First in Your Area
                </Button>
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTechs.map((tech) => (
                <div 
                  key={tech.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#FF6B9D]/10 transition-all duration-300 group"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-1/3 relative">
                      <img
                        src={tech.profileImage}
                        alt={tech.name}
                        className="w-full h-full object-cover min-h-[200px]"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold text-white",
                          tech.skillLevel === "Competition Level" && "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]",
                          tech.skillLevel === "Advanced" && "bg-gradient-to-r from-[#EF4444] to-[#F87171]",
                          tech.skillLevel === "Intermediate" && "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]",
                          tech.skillLevel === "Beginner" && "bg-gradient-to-r from-[#10B981] to-[#34D399]",
                        )}>
                          {tech.skillLevel}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-2/3 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-gray-800 group-hover:text-[#FF6B9D] transition-colors">
                            {tech.name}
                          </h3>
                          {tech.businessName && (
                            <p className="text-sm text-[#9B5DE5]">{tech.businessName}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-[#FFC857] text-[#FFC857]" />
                          <span className="font-bold">{tech.rating}</span>
                          <span className="text-gray-400">({tech.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="h-3 w-3" />
                        {tech.city}, {tech.state}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {tech.bio}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tech.specialties.slice(0, 3).map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-[#FFF5F8] text-[#FF6B9D] text-[10px] rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {tech.specialties.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">
                            +{tech.specialties.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {tech.bookingUrl && (
                          <a href={tech.bookingUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" className={cn("w-full rounded-full text-xs", PINK_GRADIENT, "text-white")}>
                              <Calendar className="h-3 w-3 mr-1" />
                              Book Now
                            </Button>
                          </a>
                        )}
                        {tech.instagram && (
                          <a href={`https://instagram.com/${tech.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="rounded-full border-gray-200">
                              <Instagram className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA for Techs */}
          <div className="mt-16 text-center bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-3xl p-10">
            <Sparkles className="h-10 w-10 mx-auto mb-4 text-[#9B5DE5]" />
            <h2 className="text-2xl font-serif mb-3 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
              Are You a Nail Tech?
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Get discovered by clients searching for your exact skills. Join our growing directory of talented nail artists.
            </p>
            <a href="/tech-register">
              <Button className={cn("rounded-full px-8 h-12", PURPLE_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#9B5DE5]/30")}>
                <UserPlus className="h-5 w-5 mr-2" />
                Register as a Tech
              </Button>
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
}