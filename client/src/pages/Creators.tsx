import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { MapPin, Instagram, ExternalLink, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";

interface Creator {
  id: number;
  name: string;
  username: string;
  specialty: string;
  location: string;
  instagram?: string;
  linktree?: string;
  profileImage?: string;
  affiliateLink?: string;
}

export default function Creators() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaidMember, setIsPaidMember] = useState(false);

  useEffect(() => {
    fetchCreators();
    checkMembership();
  }, []);

  const checkMembership = async () => {
    try {
      const response = await fetch("/api/user/credits", { credentials: "include" });
      const data = await response.json();
      setIsPaidMember(data.isPaidMember);
    } catch (error) {
      console.error("Failed to check membership:", error);
    }
  };

  const fetchCreators = async () => {
    try {
      const response = await fetch("/api/creators");
      const data = await response.json();
      setCreators(data.creators || []);
    } catch (error) {
      console.error("Failed to fetch creators:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPaidMember) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center">
            <Lock className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
            Creators Profile Directory
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover talented nail techs, see their work, and connect directly. This feature is available to Nail Check members.
          </p>
          <a href="https://nail-check.com/membership/" target="_blank" rel="noopener noreferrer">
            <Button className={cn("h-12 px-8 rounded-full", PINK_GRADIENT, "text-white")}>
              <Crown className="mr-2 h-5 w-5" />
              Become a Member - $8.99/mo
            </Button>
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
            Creators Profile Directory
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover talented nail techs, explore their specialties, and connect with creators near you.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading creators...</p>
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No creators yet. Be the first!</p>
            <a href="/tech-register" className="inline-block mt-4">
              <Button className={cn("rounded-full", PINK_GRADIENT, "text-white")}>
                Join as a Creator
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Link key={creator.id} href={`/creators/${creator.username}`}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-[#FF6B9D]/10 transition-all cursor-pointer group">
                  {/* Profile Image */}
                  <div className="aspect-square bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] relative overflow-hidden">
                    {creator.profileImage ? (
                      <img 
                        src={creator.profileImage} 
                        alt={creator.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-serif text-[#9B5DE5]">
                          {creator.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-[#FF6B9D] transition-colors">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-[#9B5DE5] mb-3">@{creator.username}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Specialty:</span> {creator.specialty}
                      </p>
                      {creator.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{creator.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2">
                      {creator.instagram && (
                        <a 
                          href={`https://instagram.com/${creator.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#FF6B9D]/10 to-[#9B5DE5]/10 rounded-full text-sm text-[#9B5DE5] hover:from-[#FF6B9D]/20 hover:to-[#9B5DE5]/20 transition-all"
                        >
                          <Instagram className="h-4 w-4" />
                          <span>IG</span>
                        </a>
                      )}
                      {creator.linktree && (
                        <a 
                          href={creator.linktree}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#00D9FF]/10 to-[#9B5DE5]/10 rounded-full text-sm text-[#00D9FF] hover:from-[#00D9FF]/20 hover:to-[#9B5DE5]/20 transition-all"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Links</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
