import React, { useState } from "react";
import { StoryBar } from "./components/StoryBar";
import { StoryViewer } from "./components/StoryViewer";
import "./styles/stories.css";

export interface Story {
  file: string;       // Base64 string
  type: "image" | "video";
  createdAt: number;
}

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  return (
    <div className="App">
      <StoryBar
        stories={stories}
        setStories={setStories}
        onOpenViewer={(index) => {
          setViewerIndex(index);
          setViewerOpen(true);
        }}
      />

      {viewerOpen && (
        <StoryViewer
          stories={stories}
          startIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
