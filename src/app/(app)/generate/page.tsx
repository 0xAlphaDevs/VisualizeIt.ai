import { Toaster } from "@/components/ui/toaster";
import VideoGenerator from "@/components/video-generator";
import React from "react";

const Generate = () => {
  return (
    <div>
      <VideoGenerator />
      <Toaster />
    </div>
  );
};

export default Generate;
