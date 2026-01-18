import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useCreateTutorial } from "@/hooks/use-tutorials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertTutorialSchema } from "@shared/schema";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

// Extended schema to handle comma-separated string input for tools
const formSchema = insertTutorialSchema.extend({
  toolsRequired: z.string().min(1, "At least one tool is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Upload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate, isPending } = useCreateTutorial();
  const { user, isLoading } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageSource: "",
      styleCategory: "",
      difficultyLevel: "Beginner",
      toolsRequired: "",
      tutorialContent: "",
      creatorCredit: user?.firstName || "",
    },
  });

  // No longer redirecting visitors
  // if (!isLoading && !user) {
  //   setLocation("/api/login");
  //   return null;
  // }

  const onSubmit = (values: FormValues) => {
    // Convert comma-separated string back to array for API
    const toolsArray = values.toolsRequired
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    mutate(
      {
        ...values,
        toolsRequired: toolsArray,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Tutorial has been uploaded successfully.",
          });
          setLocation("/");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold">Upload Tutorial</h1>
          <p className="text-muted-foreground mt-2">
            Share your nail art creation with the community.
          </p>
        </motion.div>

        <CardWrapper>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Sunset Ombre" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="styleCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. French, Abstract" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-background" />
                      </FormControl>
                    </div>
                    <FormDescription className="text-xs">
                      Paste a direct link to your image (Unsplash, Imgur, etc.)
                    </FormDescription>
                    <FormMessage />
                    
                    {/* Image Preview */}
                    {field.value && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-border h-48 w-full bg-muted/30 flex items-center justify-center relative">
                        <img 
                          src={field.value} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ""; 
                            (e.target as HTMLImageElement).style.display = 'none';
                          }} 
                          onLoad={(e) => {
                             (e.target as HTMLImageElement).style.display = 'block';
                          }}
                        />
                        <div className="absolute -z-10 flex flex-col items-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="text-xs">Image Preview</span>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toolsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tools Required</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Base coat, Red polish, Dotting tool..."
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormDescription>
                      Separate tools with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tutorialContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Step 1: Apply base coat..."
                        className="min-h-[150px] bg-background resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creatorCredit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creator Credit</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourhandle" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-4">
                 <Button type="button" variant="outline" onClick={() => setLocation("/")}>
                   Cancel
                 </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Tutorial"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardWrapper>
      </div>
    </Layout>
  );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
      {children}
    </div>
  );
}
