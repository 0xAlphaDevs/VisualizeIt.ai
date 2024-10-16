"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Play } from "lucide-react";

export default function VideoGenerator() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleScriptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setScript(event.target.value);
  };

  const handleSubmit = (inputType: "image" | "script") => {
    setIsGenerating(true);
    // Here you would implement the AI generation logic
    console.log(
      `Generating video from ${inputType}:`,
      inputType === "image" ? imageFile : script
    );
    setTimeout(() => setIsGenerating(false), 2000); // Simulating API call
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>AI Video Generator</CardTitle>
          <CardDescription>
            Create visuals for your story using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">Image Input</TabsTrigger>
              <TabsTrigger value="script">Script Input</TabsTrigger>
            </TabsList>
            <TabsContent value="image">
              <div className="space-y-4">
                <Label htmlFor="image-upload">
                  Upload an image to generate a scene
                </Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSubmit("image")}
                    disabled={!imageFile || isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                    {!isGenerating && <Upload className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
                {imageFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {imageFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="script">
              <div className="space-y-4">
                <Label htmlFor="script-input">
                  Enter your script with scene description
                </Label>
                <Textarea
                  id="script-input"
                  placeholder="Enter your script here..."
                  value={script}
                  onChange={handleScriptChange}
                  rows={5}
                />
                <Button
                  onClick={() => handleSubmit("script")}
                  disabled={!script || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate"}
                  {!isGenerating && <FileText className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground" />
            <span className="sr-only">Generated video will appear here</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
