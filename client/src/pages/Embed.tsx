import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Embed() {
  const [prompt, setPrompt] = useState("");
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCanvasImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe your nail design",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt,
          canvasImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      toast({
        title: "✨ Design Generated!",
        description: "Your nail design is ready",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#FFFFFF",
      fontFamily: "'Inter', sans-serif",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ 
            fontSize: "10px", 
            letterSpacing: "4px", 
            color: "#B08D57", 
            textTransform: "uppercase",
            display: "block",
            marginBottom: "12px"
          }}>
            The Design Lab
          </span>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "32px", 
            fontWeight: "400",
            color: "#1A1A1A",
            margin: "0"
          }}>
            AI-Powered Nail Design
          </h1>
        </div>

        {/* Canvas Upload */}
        <div style={{ 
          background: "#FAFAFA", 
          border: "2px dashed #E0E0E0",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "30px",
          position: "relative"
        }}>
          {canvasImage ? (
            <div style={{ position: "relative" }}>
              <img 
                src={canvasImage} 
                alt="Canvas" 
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "300px",
                  borderRadius: "8px"
                }}
              />
              <label 
                htmlFor="canvas-upload"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#B08D57",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                Change Image
              </label>
            </div>
          ) : (
            <label 
              htmlFor="canvas-upload"
              style={{ cursor: "pointer", display: "block" }}
            >
              <Upload 
                style={{ 
                  width: "48px", 
                  height: "48px", 
                  color: "#B08D57",
                  margin: "0 auto 16px"
                }}
              />
              <p style={{ 
                fontSize: "16px", 
                color: "#333",
                marginBottom: "8px"
              }}>
                Upload Your Canvas
              </p>
              <p style={{ 
                fontSize: "12px", 
                color: "#999"
              }}>
                Hand, silicone prop, or nail stand
              </p>
            </label>
          )}
          <input
            id="canvas-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Prompt */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{
            display: "block",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#666",
            marginBottom: "12px"
          }}>
            Describe Your Design
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Chrome french tips with gold accent, glossy finish..."
            style={{
              minHeight: "120px",
              fontSize: "15px",
              lineHeight: "1.6",
              border: "1px solid #E0E0E0",
              borderRadius: "8px",
              padding: "16px",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          style={{
            width: "100%",
            height: "56px",
            background: "linear-gradient(to right, #B08D57, #D4AF37, #B08D57)",
            color: "white",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: isGenerating || !prompt.trim() ? "not-allowed" : "pointer",
            opacity: isGenerating || !prompt.trim() ? 0.6 : 1
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 style={{ marginRight: "8px" }} />
              Generate Design
            </>
          )}
        </Button>

        {/* Generated Result */}
        {generatedImage && (
          <div style={{ 
            marginTop: "40px",
            background: "#FAFAFA",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "10px",
              letterSpacing: "3px",
              color: "#B08D57",
              textTransform: "uppercase",
              marginBottom: "20px"
            }}>
              Your Design
            </p>
            <img 
              src={generatedImage} 
              alt="Generated nail design"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
              }}
            />
            <p style={{
              fontSize: "11px",
              color: "#999",
              marginTop: "20px",
              fontStyle: "italic"
            }}>
              Become a Founder Member to save designs and unlock unlimited generations
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div style={{
          marginTop: "40px",
          padding: "20px",
          background: "#FFF8DC",
          borderLeft: "3px solid #B08D57",
          fontSize: "12px",
          color: "#666",
          lineHeight: "1.6"
        }}>
          <strong style={{ color: "#B08D57" }}>Guest Access:</strong> Try 1 free generation. 
          <a 
            href="https://nail-check.com/membership/" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: "#B08D57", 
              textDecoration: "underline",
              marginLeft: "4px"
            }}
          >
            Become a member
          </a> for unlimited AI generations, Fire Vault, and exclusive features.
        </div>
      </div>
    </div>
  );
}