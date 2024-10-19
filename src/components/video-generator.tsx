"use client";

import { useState, useRef, useTransition } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
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
import { Slider } from "@/components/ui/slider";
import { FileText, Play, Eraser, Undo, Redo } from "lucide-react";
import { testTextToImage } from "@/app/actions";
import Image from "next/image";

export default function VideoGenerator() {
  const [script, setScript] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleScriptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setScript(event.target.value);
  };

  const handleSubmit = async (inputType: "scribble" | "script") => {
    setIsGenerating(true);
    if (inputType === "scribble") {
      const canvas = canvasRef.current;
      if (canvas) {
        try {
          const imageData = await canvas.exportImage("png");
          console.log("Generating video from scribble:", imageData);
        } catch (error) {
          console.error("Error exporting canvas image:", error);
        }
      }
    } else {
      console.log("Generating video from script:", script);
      // livepeer to generate image from prompt
      startTransition(async () => {
        const result = await testTextToImage(script);
        if (result.success) {
          setImages((prevImages) => [...result.images, ...prevImages]);
        }
      });
    }
    // setTimeout(() => setIsGenerating(false), 2000); // Simulating API call
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
          <Tabs defaultValue="scribble" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scribble">Scribble Input</TabsTrigger>
              <TabsTrigger value="script">Script Input</TabsTrigger>
            </TabsList>
            <TabsContent value="scribble">
              <div className="space-y-4">
                <Label>Draw your scene</Label>
                <div className="border rounded-lg p-2">
                  <ReactSketchCanvas
                    ref={canvasRef}
                    width="100%"
                    height="300px"
                    strokeWidth={brushSize}
                    strokeColor={brushColor}
                    canvasColor="#ffffff"
                    className="w-full h-auto border rounded cursor-crosshair touch-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="brush-color">Color:</Label>
                    <Input
                      id="brush-color"
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="brush-size">Size:</Label>
                    <Slider
                      id="brush-size"
                      min={1}
                      max={20}
                      value={[brushSize]}
                      onValueChange={(value) => setBrushSize(value[0])}
                      className="w-32"
                    />
                  </div>
                  <Button
                    onClick={() => canvasRef.current?.undo()}
                    variant="outline"
                  >
                    <Undo className="mr-2 h-4 w-4" />
                    Undo
                  </Button>
                  <Button
                    onClick={() => canvasRef.current?.redo()}
                    variant="outline"
                  >
                    <Redo className="mr-2 h-4 w-4" />
                    Redo
                  </Button>
                  <Button
                    onClick={() => canvasRef.current?.clearCanvas()}
                    variant="outline"
                  >
                    <Eraser className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
                <Button
                  onClick={() => handleSubmit("scribble")}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate from Scribble"}
                </Button>
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
                  disabled={!script || isPending}
                >
                  {isPending ? "Generating..." : "Generate from Script"}
                  {!isPending && <FileText className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {/* <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center"> */}
          {/* <Play className="h-12 w-12 text-muted-foreground" />
            <span className="sr-only">Generated video will appear here</span> */}
          {/* </div> */}
          {images.length > 0 && (
            <div className="mt-8">
              {/* <h2 className="mb-4 text-xl font-semibold">Generated Images</h2> */}
              <div className="grid grid-cols-2 gap-4">
                {images.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    width={512}
                    height={512}
                    alt={`Generated Image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
