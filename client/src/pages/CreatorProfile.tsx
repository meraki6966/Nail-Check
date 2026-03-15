import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useRoute } from "wouter";
import { MapPin, Instagram, ExternalLink, Mail, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";

interface CreatorProfile {
  id: number;
  name: string;
  username: string;
  specialty: string;
  location: string;
  bio?: string;
  instagram?: string;
  linktree?: string;
  email?: string;
  profileImage?: string;
  affiliateLink?: string;
  portfolioImages?: string[];
}

export default function CreatorProfile() {
  const [, params] = useRoute("/creators/:username");
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.username) {
      fetchCreator(params.username);
    }
  }, [params?.username]);

  const fetchCreator = async (username: string) => {
    try {
      const response = await fetch(`/api/creators/${username}`);
      if (response.ok) {
        const data = await response.json();
        setCreator(data.creator);
      }
    } catch (error) {
      console.error("Failed to fetch creator:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!creator) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-serif mb-4 text-gray-800">Creator Not Found</h1>
          <p className="text-gray-500 mb-8">This profile doesn't exist or has been removed.</p>
          <Link href="/creators">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/creators">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg mb-8">
          <div className="grid md:grid-cols-3 gap-8 p-8">
            {/* Profile Image */}
            <div className="md:col-span-1">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] overflow-hidden">
                {creator.profileImage ? (
                  <img 
                    src={creator.profileImage} 
                    alt={creator.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl font-serif text-[#9B5DE5]">
                      {creator.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-serif mb-2 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
                {creator.name}
              </h1>
              <p className="text-lg text-[#9B5DE5] mb-4">@{creator.username}</p>

              {creator.bio && (
                <p className="text-gray-600 mb-6">{creator.bio}</p>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Sparkles className="h-5 w-5 text-[#FF6B9D]" />
                  <span className="font-medium">Specialty:</span>
                  <span>{creator.specialty}</span>
                </div>
                {creator.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-[#9B5DE5]" />
                    <span>{creator.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {creator.instagram && (
                  <a 
                    href={`https://instagram.com/${creator.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] rounded-full text-white hover:shadow-lg transition-all"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>@{creator.instagram}</span>
                  </a>
                )}
                {creator.linktree && (
                  <a 
                    href={creator.linktree}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5] rounded-full text-white hover:shadow-lg transition-all"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>All Links</span>
                  </a>
                )}
                {creator.email && (
                  <a 
                    href={`mailto:${creator.email}`}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#9B5DE5] text-[#9B5DE5] rounded-full hover:bg-[#9B5DE5] hover:text-white transition-all"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Contact</span>
                  </a>
                )}
              </div>

              {/* Affiliate Link */}
              {creator.affiliateLink && (
                <div className="mt-6 p-4 bg-gradient-to-r from-[#FFF5F8] to-[#F8F0FF] rounded-xl border border-[#FF6B9D]/20">
                  <p className="text-sm text-gray-600 mb-2">Support this creator:</p>
                  <a 
                    href={creator.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B9D] hover:text-[#9B5DE5] font-medium"
                  >
                    Shop their affiliate link →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio */}
        {creator.portfolioImages && creator.portfolioImages.length > 0 && (
          <div>
            <h2 className="text-3xl font-serif mb-6 bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
              Portfolio
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {creator.portfolioImages.map((image, idx) => (
                <div 
                  key={idx}
                  className="aspect-square rounded-2xl overflow-hidden bg-gray-100 hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={image} 
                    alt={`${creator.name} work ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
