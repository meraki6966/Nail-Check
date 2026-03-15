import { useState } from "react";
import { Layout } from "@/components/Layout";
import { AIToolsNav } from "@/components/AIToolsNav";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

export default function AICritique() {
  const { toast } = useToast();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [critique, setCritique] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setCritique(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload a photo of your nails",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setCritique(null);

    try {
      const response = await fetch("/api/image/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ image: uploadedImage }),
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const data = await response.json();
      setCritique(data.critique);

      toast({
        title: "Analysis complete!",
        description: "Your professional nail critique is ready"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        <AIToolsNav />

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Left: Upload */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] bg-clip-text text-transparent">
                Upload Your Nails
              </h3>
              <div className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                uploadedImage ? "border-[#9B5DE5] bg-[#F8F0FF]" : "border-gray-300 hover:border-[#9B5DE5] hover:bg-[#F8F0FF]"
              )}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="nail-upload"
                />
                <label htmlFor="nail-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded nails" className="max-h-64 mx-auto rounded-xl" />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-[#9B5DE5]" />
                      <p className="text-gray-600">Click to upload a photo of your nails</p>
                      <p className="text-sm text-gray-400 mt-2">Best results with clear, well-lit photos</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !uploadedImage}
              className={cn(
                "w-full h-14 text-sm uppercase tracking-widest rounded-full",
                PURPLE_GRADIENT,
                "text-white hover:shadow-lg transition-all"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Nails...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get AI Critique
                </>
              )}
            </Button>
          </div>

          {/* Right: Critique */}
          <div>
            <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
              Professional Analysis
            </h3>
            
            <div className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] rounded-2xl min-h-[500px] flex items-center justify-center p-8">
              {critique ? (
                <div className="space-y-6 w-full">
                  {/* Overall Score */}
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] bg-clip-text text-transparent mb-2">
                      {critique.overallScore}/10
                    </div>
                    <p className="text-sm text-gray-500">Overall Quality</p>
                  </div>

                  {/* Analysis Sections */}
                  <div className="space-y-4">
                    {critique.sections?.map((section: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-xl p-5">
                        <div className="flex items-start gap-3 mb-3">
                          {section.score >= 8 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{section.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{section.feedback}</p>
                            {section.suggestions && (
                              <p className="text-sm text-[#9B5DE5] mt-2">💡 {section.suggestions}</p>
                            )}
                          </div>
                          <span className="text-sm font-bold text-[#9B5DE5]">{section.score}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Product Recommendations */}
                  {critique.recommendations && (
                    <div className="bg-white rounded-xl p-5">
                      <h4 className="font-semibold text-gray-800 mb-3">Recommended Products</h4>
                      <ul className="space-y-2">
                        {critique.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-[#FF6B9D]">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-[#9B5DE5]/30" />
                  <p>Upload a photo to get your professional nail critique</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
