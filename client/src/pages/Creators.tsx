import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MapPin, Instagram, ExternalLink, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Creator {
  id: number;
  name: string;
  username: string;
  specialty?: string;
  specialties?: string[];
  city: string;
  state: string;
  profileImage?: string;
  instagram?: string;
  linktree?: string;
}

export default function Creators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const response = await fetch("/api/creators");
      if (!response.ok) {
        throw new Error("Failed to fetch creators");
      }
      const data = await response.json();
      setCreators(data.creators || []);
    } catch (err) {
      console.error("Error fetching creators:", err);
      setError("Failed to load creators");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B9D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] mb-6">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent mb-4">
          Creators Profile Directory
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover talented nail techs, see their work, and connect directly.
        </p>
      </div>

      {/* Creators Grid */}
      {creators.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No creators in the directory yet.</p>
          <p className="text-sm text-muted-foreground">Check back soon for featured nail artists!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <Link key={creator.id} href={`/creators/${creator.username}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#FF6B9D]">
                <CardContent className="p-6">
                  {/* Profile Image */}
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#FF6B9D]/20 to-[#9B5DE5]/20">
                      {creator.profileImage ? (
                        <img
                          src={creator.profileImage}
                          alt={creator.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Crown className="h-16 w-16 text-[#FF6B9D]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-[#FF6B9D] transition-colors">
                      {creator.name}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{creator.city}, {creator.state}</span>
                    </div>

                    {/* Specialties */}
                    {(creator.specialties || creator.specialty) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(creator.specialties || [creator.specialty]).filter(Boolean).map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B9D]/10 to-[#9B5DE5]/10 text-[#9B5DE5] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      {creator.instagram && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(`https://instagram.com/${creator.instagram.replace('@', '')}`, '_blank');
                          }}
                        >
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </Button>
                      )}
                      {creator.linktree && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(creator.linktree, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Links
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}