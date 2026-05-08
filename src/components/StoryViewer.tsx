import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import type { Story } from "../App";

interface Props {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<Props> = ({ stories, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentIndex(startIndex);
    setProgress(0);
  }, [startIndex]);

  useEffect(() => {
    if (!stories.length) return;
    if (currentIndex >= stories.length) {
      setCurrentIndex(stories.length - 1);
    }
  }, [stories.length, currentIndex]);

  useEffect(() => {
    if (!stories[currentIndex] || stories[currentIndex].type !== "image") {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          window.clearInterval(interval);
          nextStory();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [currentIndex, stories, onClose]);

  const nextStory = () => {
    setCurrentIndex(prev => {
      if (prev < stories.length - 1) {
        return prev + 1;
      }
      onClose();
      return prev;
    });
  };

  const prevStory = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextStory(),
    onSwipedRight: () => prevStory(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (stories.length === 0) {
    return null;
  }

  const activeIndex = Math.min(currentIndex, stories.length - 1);
  const activeStory = stories[activeIndex];

  return (
    <div className="viewer-overlay" {...handlers}>
      <div className="viewer-header">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="viewer-content">
        <AnimatePresence mode="wait">
          {activeStory.type === "image" ? (
            <motion.img
              key={activeIndex}
              src={activeStory.file}
              alt="story"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.video
              key={activeIndex}
              src={activeStory.file}
              controls
              autoPlay
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="viewer-controls">
        <button onClick={prevStory} disabled={activeIndex === 0}>◀</button>
        <button onClick={nextStory}>▶</button>
      </div>
    </div>
  );
};
