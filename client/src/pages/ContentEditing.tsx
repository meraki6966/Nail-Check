import { useState } from "react";
import { Layout } from "@/components/Layout";
import { AIToolsNav } from "@/components/AIToolsNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Wand2, Download, Heart, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { downloadWithWatermark } from "@/lib/watermark";

const EDIT_OPTIONS = [
  {
    id: "add-props",
    label: "Add Props",
    description: "Add objects to your photo",
    examples: ["vase with flowers", "coffee cup", "jewelry", "hand holding phone"]
  },
  {
    id: "change-background",
    label: "Change Background",
    description: "Replace the background scene",
    examples: ["beach sunset", "marble countertop", "pink gradient", "cafe interior"]
  },
  {
    id: "change-color",
    label: "Change Nail Color",
    description: "Recolor your existing nails",
    examples: ["chrome silver", "deep red", "pastel pink", "black matte"]
  }
];

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

export default function ContentEditing() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!uploadedImage || !editPrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload an image and describe your edit",
        variant: "destructive"
      });
      return;
    }

    setIsEditing(true);
    setEditedImage(null);

    try {
      const response = await fetch("/api/image/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          image: uploadedImage,
          prompt: editPrompt
        }),
      });

      if (!response.ok) throw new Error("Failed to edit image");

      const data = await response.json();
      const imageUrl = `data:${data.mimeType};base64,${data.b64_json}`;
      setEditedImage(imageUrl);

      toast({
        title: "Edit complete!",
        description: "Your image has been edited"
      });
    } catch (error) {
      console.error("Edit error:", error);
      toast({
        title: "Edit failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!editedImage) return;
    setIsSaving(true);
    
    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user?.id || "guest",
          imageUrl: editedImage,
          prompt: editPrompt,
          canvasImageUrl: uploadedImage,
          tags: ["content-editing"]
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Saved!",
          description: "View it in your saved designs"
        });
      }
    } catch (error) {
      toast({
        title: "Save failed",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!editedImage) return;
    try {
      await downloadWithWatermark(editedImage, 'nail-check-edit.png');
      toast({
        title: "Download complete",
        description: "Your edited design has been saved"
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const selectExample = (example: string) => {
    setEditPrompt(example);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        <AIToolsNav />

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Left: Upload & Instructions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#00D9FF] to-[#9B5DE5] bg-clip-text text-transparent">
                1. Upload Your Photo
              </h3>
              <div className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                uploadedImage ? "border-[#00D9FF] bg-[#F0FFFF]" : "border-gray-300 hover:border-[#9B5DE5] hover:bg-[#F8F0FF]"
              )}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-xl" />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-[#00D9FF]" />
                      <p className="text-gray-600">Click to upload your nail photo</p>
                      <p className="text-sm text-gray-400 mt-2">Best results with clear, well-lit photos</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Edit Options */}
            <div>
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] bg-clip-text text-transparent">
                2. Choose Your Edit
              </h3>
              
              <div className="space-y-3">
                {EDIT_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all",
                      selectedOption === option.id
                        ? "border-[#9B5DE5] bg-[#F8F0FF]"
                        : "border-gray-200 hover:border-[#9B5DE5]"
                    )}
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">{option.label}</h4>
                    <p className="text-sm text-gray-500 mb-2">{option.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.examples.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectExample(example);
                            setSelectedOption(option.id);
                          }}
                          className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-[#9B5DE5] hover:bg-[#F8F0FF] transition-all"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] bg-clip-text text-transparent">
                3. Describe Your Edit
              </h3>
              <Textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe what you want to change... (e.g., 'add a vase with pink roses in the background' or 'change nail color to chrome silver')"
                className="min-h-[120px] resize-none rounded-xl border-gray-200 focus:border-[#9B5DE5]"
              />
            </div>

            <Button
              onClick={handleEdit}
              disabled={isEditing || !uploadedImage || !editPrompt.trim()}
              className={cn(
                "w-full h-14 text-sm uppercase tracking-widest rounded-full",
                PURPLE_GRADIENT,
                "text-white hover:shadow-lg transition-all"
              )}
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Editing Your Photo...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Apply Edit
                </>
              )}
            </Button>
          </div>

          {/* Right: Result */}
          <div>
            <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-[#FF6B9D] to-[#00D9FF] bg-clip-text text-transparent">
              4. Your Edited Photo
            </h3>
            
            <div className="bg-gradient-to-br from-[#FFF5F8] to-[#F8F0FF] rounded-2xl min-h-[500px] flex items-center justify-center p-8">
              {editedImage ? (
                <div className="space-y-4 w-full">
                  <img src={editedImage} alt="Edited result" className="w-full rounded-2xl shadow-xl" />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveToVault}
                      disabled={isSaving}
                      variant="outline"
                      className="flex-1 rounded-full border-[#FF6B9D] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="mr-2 h-4 w-4" />
                      )}
                      Save to Vault
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1 rounded-full border-[#9B5DE5] text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-[#9B5DE5]/30" />
                  <p>Your edited photo will appear here</p>
                  {uploadedImage && (
                    <p className="text-sm mt-2">Describe your edit and click "Apply Edit"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
