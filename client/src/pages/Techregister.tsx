import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Sparkles, CheckCircle, Upload, Instagram, Globe, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

// All style specialties from the Style Builder
const SPECIALTIES = {
  shapes: ["Square", "Coffin", "Almond", "Stiletto", "Duck / Flare", "Cat Claw"],
  enhancements: ["Acrylic", "Hard Gel", "Poly Gel", "Gel-X / Tips", "Builder / BIAB"],
  designs: ["Classy / Minimal", "Junk Nails", "3D / Character", "Editorial"],
  effects: ["Chrome", "Cat Eye / Velvet", "Glass Nails", "Matte & Sugar"],
  themes: ["Bridal Nails", "Birthday Sets", "Vacation Nails", "Matching Sets"],
};

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Competition Level"];

export default function TechRegister() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",
    profileImage: "",
    bookingUrl: "",
    instagram: "",
    website: "",
    skillLevel: "",
    specialties: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/techs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Application Submitted! 🎉",
          description: "We'll review your profile and get back to you soon.",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-[#F8F0FF] to-[#F0FFFF] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#10B981] to-[#00D9FF] flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
              You're In!
            </h1>
            <p className="text-gray-600 mb-6">
              Your application has been submitted. We'll review your profile and notify you once you're live in the directory.
            </p>
            <a href="/">
              <Button className={cn("rounded-full", PINK_GRADIENT, "text-white")}>
                Back to Home
              </Button>
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-[#F8F0FF] to-[#F0FFFF]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="h-10 w-10 text-[#FF6B9D]" />
              <h1 className="text-4xl font-serif uppercase tracking-wider bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent">
                Join the Directory
              </h1>
            </div>
            <p className="text-gray-500 max-w-md mx-auto">
              Get discovered by clients looking for your exact skills. Register as a Nail Tech and grow your business.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl space-y-8">
            
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-[#9B5DE5]">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your salon or brand name"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-[#9B5DE5]">
                <MapPin className="inline h-5 w-5 mr-2" />
                Location
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Houston"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="TX"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="77001"
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-[#9B5DE5]">About You</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell clients about yourself, your experience, and what makes your work special..."
                required
                className="rounded-xl min-h-[120px]"
              />
            </div>

            {/* Skill Level */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-[#9B5DE5]">Skill Level</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, skillLevel: level }))}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium transition-all",
                      formData.skillLevel === level
                        ? "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-[#9B5DE5]">
                <Sparkles className="inline h-5 w-5 mr-2" />
                Specialties
              </h2>
              <p className="text-sm text-gray-500 mb-4">Select all styles you specialize in:</p>
              
              {Object.entries(SPECIALTIES).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSpecialty(item)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          formData.specialties.includes(item)
                            ? "bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Links */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-[#9B5DE5]">Links & Booking</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Booking URL
                  </label>
                  <Input
                    name="bookingUrl"
                    value={formData.bookingUrl}
                    onChange={handleInputChange}
                    placeholder="https://calendly.com/yourname or booking site"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Instagram className="inline h-4 w-4 mr-1" />
                    Instagram
                  </label>
                  <Input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@yourusername"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Website
                  </label>
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn("w-full h-14 rounded-full text-lg", PINK_GRADIENT, "text-white hover:shadow-lg hover:shadow-[#FF6B9D]/30")}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <p className="text-xs text-gray-400 text-center mt-4">
                By submitting, you agree to our terms of service and privacy policy.
              </p>
            </div>

          </form>

        </div>
      </div>
    </Layout>
  );
}