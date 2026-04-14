import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Instagram, Globe, Calendar, Filter, ChevronDown, UserPlus, Phone, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

const GOOGLE_API_KEY = "AIzaSyC7gL4Q3YAcXmvE63F2Xq_ELd-O--kFB5o";

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

// Registered techs from your database (featured)
const REGISTERED_TECHS: any[] = [];

// Tech Card Component for Registered Techs
function TechCard({ tech, type }: { tech: any; type: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#FF6B9D]/10 transition-all duration-300 group border-2 border-[#FF6B9D]/20">
      <div className="flex">
        {/* Image */}
        <div className="w-1/3 relative">
          <img
            src={tech.profileImage || "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png"}
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
              {tech.skillLevel || "Pro"}
            </span>
          </div>
          {/* Featured Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white">
              ⭐ Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="w-2/3 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                {tech.name}
              </h3>
              {tech.businessName && (
                <p className="text-sm text-[#9B5DE5]">{tech.businessName}</p>
              )}
            </div>
            {tech.rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-[#FFC857] text-[#FFC857]" />
                <span className="font-bold">{(tech.rating / 10).toFixed(1)}</span>
                <span className="text-gray-400">({tech.reviewCount || 0})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="h-3 w-3" />
            {tech.city}, {tech.state}
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {tech.bio}
          </p>

          {/* Specialties */}
          {tech.specialties && tech.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tech.specialties.slice(0, 3).map((specialty: string, idx: number) => (
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
          )}

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
  );
}

// Google Place Card Component
function GooglePlaceCard({ place }: { place: any }) {
  const photoUrl = place.photos?.[0]?.photo_reference 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
    : "http://nail-check.com/wp-content/uploads/2026/02/Chrome.png";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#00D9FF]/10 transition-all duration-300 group">
      <div className="flex">
        {/* Image */}
        <div className="w-1/3 relative">
          <img
            src={photoUrl}
            alt={place.name}
            className="w-full h-full object-cover min-h-[180px]"
          />
        </div>

        {/* Content */}
        <div className="w-2/3 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                {place.name}
              </h3>
            </div>
            {place.rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-[#FFC857] text-[#FFC857]" />
                <span className="font-bold">{place.rating}</span>
                <span className="text-gray-400">({place.user_ratings_total || 0})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="h-3 w-3" />
            {place.vicinity || place.formatted_address}
          </div>

          {place.opening_hours && (
            <p className={cn(
              "text-xs mb-3",
              place.opening_hours.open_now ? "text-green-600" : "text-red-500"
            )}>
              {place.opening_hours.open_now ? "✓ Open Now" : "✗ Closed"}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <a 
              href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1"
            >
              <Button size="sm" variant="outline" className="w-full rounded-full text-xs border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-white">
                <ExternalLink className="h-3 w-3 mr-1" />
                View on Maps
              </Button>
            </a>
            {place.formatted_phone_number && (
              <a href={`tel:${place.formatted_phone_number}`}>
                <Button size="sm" variant="outline" className="rounded-full border-gray-200">
                  <Phone className="h-3 w-3" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindTech() {
  const [searchZip, setSearchZip] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [registeredTechs, setRegisteredTechs] = useState<any[]>([]);
  const [googlePlaces, setGooglePlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchByIG, setSearchByIG] = useState("");

  // Fetch registered techs from your database
  useEffect(() => {
    const fetchRegisteredTechs = async () => {
      try {
        const response = await fetch("/api/techs");
        if (response.ok) {
          const data = await response.json();
          setRegisteredTechs(data);
        }
      } catch (error) {
        console.error("Failed to fetch registered techs:", error);
      }
    };
    fetchRegisteredTechs();
  }, []);

  // Search Google Places for nail salons
  const searchGooglePlaces = async (zipCode: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // First, geocode the zip code to get lat/lng
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_API_KEY}`;
      const geocodeRes = await fetch(geocodeUrl);
      const geocodeData = await geocodeRes.json();
      
      if (geocodeData.results && geocodeData.results.length > 0) {
        const location = geocodeData.results[0].geometry.location;
        
        // Search for nail salons near this location using Places API
        // Note: For production, this should go through your backend to protect the API key
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=16093&type=beauty_salon&keyword=nail&key=${GOOGLE_API_KEY}`;
        
        // Due to CORS, we need to use a proxy or backend
        // For now, we'll use the Text Search which works better client-side
        const textSearchUrl = `/api/places/search?zip=${zipCode}`;
        
        try {
          const placesRes = await fetch(textSearchUrl);
          if (placesRes.ok) {
            const placesData = await placesRes.json();
            setGooglePlaces(placesData.results || []);
          }
        } catch (placesError) {
          // If API fails, show message but don't break
          console.log("Places API not configured yet");
          setGooglePlaces([]);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchZip.length >= 5) {
      searchGooglePlaces(searchZip);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter registered techs by zip and specialty
  const filteredRegisteredTechs = registeredTechs.filter(tech => {
    const zipMatch = !searchZip || tech.zipCode?.startsWith(searchZip.substring(0, 3));
    const specialtyMatch = selectedFilter === "All" || 
      tech.specialties?.some((s: string) => s.toLowerCase().includes(selectedFilter.toLowerCase()));
    return zipMatch && specialtyMatch;
  });

  // Search by Instagram handle
  const techsByInstagram = searchByIG 
    ? registeredTechs.filter(tech => 
        tech.instagram?.toLowerCase().includes(searchByIG.toLowerCase().replace('@', ''))
      )
    : [];

  return (
    
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBFC] to-[#FFF5F8]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="h-10 w-10 text-[#FF6B9D]" />
              <h1 className="text-4xl md:text-5xl uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Find a Tech
              </h1>
            </div>
            <p className="text-gray-500 max-w-md mx-auto">
              Discover talented nail technicians near you who specialize in the styles you love.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your zip code"
                  className="pl-12 h-14 rounded-full text-lg border-gray-200 focus:border-[#FF6B9D]"
                />
              </div>
              <Button 
                className={cn("h-14 px-8 rounded-full", PINK_GRADIENT, "text-white")}
                onClick={handleSearch}
                disabled={searchZip.length < 5 || isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Instagram Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchByIG}
                onChange={(e) => setSearchByIG(e.target.value)}
                placeholder="Search by Instagram handle (@username)"
                className="pl-12 h-12 rounded-full text-sm border-gray-200 focus:border-[#9B5DE5]"
              />
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
              {hasSearched && (
                <>
                  <span className="font-bold text-[#9B5DE5]">{filteredRegisteredTechs.length + googlePlaces.length}</span> results found
                  {searchZip && ` near ${searchZip}`}
                </>
              )}
              {searchByIG && techsByInstagram.length > 0 && (
                <>
                  <span className="font-bold text-[#9B5DE5]">{techsByInstagram.length}</span> techs found on Instagram
                </>
              )}
            </p>
            <a href="/tech-register">
              <Button variant="outline" className="rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Directory
              </Button>
            </a>
          </div>

          {/* Instagram Search Results */}
          {searchByIG && techsByInstagram.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                <Instagram className="h-5 w-5 inline mr-2 text-[#9B5DE5]" />
                Instagram Results
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {techsByInstagram.map((tech) => (
                  <TechCard key={tech.id} tech={tech} type="registered" />
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5] animate-spin" />
              <p className="text-gray-500">Searching for nail techs...</p>
            </div>
          )}

          {/* Registered Techs (Featured) */}
          {!isLoading && filteredRegisteredTechs.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg mb-4 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Featured Nail Techs
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRegisteredTechs.map((tech) => (
                  <TechCard key={tech.id} tech={tech} type="registered" />
                ))}
              </div>
            </div>
          )}

          {/* Google Places Results */}
          {!isLoading && googlePlaces.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg mb-4 flex items-center gap-2 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                <MapPin className="h-5 w-5 text-[#00D9FF] flex-shrink-0" />
                More Nail Salons Near You
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {googlePlaces.map((place, idx) => (
                  <GooglePlaceCard key={place.place_id || idx} place={place} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && hasSearched && filteredRegisteredTechs.length === 0 && googlePlaces.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">No Techs Found Yet</h3>
              <p className="text-gray-400 mb-6">Be the first nail tech in your area to join!</p>
              <a href="/tech-register">
                <Button className={cn("rounded-full", PURPLE_GRADIENT, "text-white")}>
                  Register as a Tech
                </Button>
              </a>
            </div>
          )}

          {/* Initial State - No Search Yet */}
          {!isLoading && !hasSearched && !searchByIG && (
            <div className="text-center py-16 bg-white rounded-3xl">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">Search for Nail Techs</h3>
              <p className="text-gray-400">Enter your zip code above to find talented nail artists near you</p>
            </div>
          )}

          {/* CTA for Techs */}
          <div className="mt-16 text-center bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-3xl p-10">
            <h2 className="text-2xl mb-3 uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
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
    
  );
}