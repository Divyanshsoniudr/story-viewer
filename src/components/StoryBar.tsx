import React, { useEffect } from "react";
import type { Story } from "../App";

interface Props {
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  onOpenViewer: (index: number) => void;
}

export const StoryBar: React.FC<Props> = ({ stories, setStories, onOpenViewer }) => {
  useEffect(() => {
    let saved: Story[] = [];
    const raw = localStorage.getItem("stories");

    if (raw) {
      try {
        saved = JSON.parse(raw);
      } catch {
        saved = [];
      }
    }

    const fresh = saved.filter(
      s => Date.now() - s.createdAt < 24 * 60 * 60 * 1000
    );
    setStories(fresh);
    localStorage.setItem("stories", JSON.stringify(fresh));
  }, [setStories]);

  const addStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const type = file.type.startsWith("video") ? "video" : "image";
      const newStory: Story = { file: reader.result as string, type, createdAt: Date.now() };
      const updated = [...stories, newStory];
      setStories(updated);
      localStorage.setItem("stories", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteStory = (index: number) => {
    const updated = stories.filter((_, i) => i !== index);
    setStories(updated);
    localStorage.setItem("stories", JSON.stringify(updated));
  };

  return (
    <div className="story-bar">
      <label className="add-story">
        +
        <input type="file" accept="image/*,video/*" onChange={addStory} hidden />
      </label>
      {stories.map((s, i) => (
        <div className="story-wrapper" key={s.createdAt}>
          {s.type === "image" ? (
            <img
              src={s.file}
              alt="story"
              className="story-thumb"
              onClick={() => onOpenViewer(i)}
            />
          ) : (
            <video
              src={s.file}
              className="story-thumb"
              onClick={() => onOpenViewer(i)}
            />
          )}
          <button className="delete-btn" onClick={() => deleteStory(i)}>✕</button>
        </div>
      ))}
    </div>
  );
};
