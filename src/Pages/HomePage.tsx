import React from "react";

// Define types for gallery items
type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  label: "Original" | "AI";
};

export type MediaGroup = {
  id: string;
  items: MediaItem[];
};

// Example imports (replace paths with actual assets)
import img1_ori from "/assets/img1_ori.jpg";
import img1_ai_1 from "/assets/img1_ai_1.jpg";
import img1_ai_2 from "/assets/img1_ai_2.jpg";

import img2_ori from "/assets/img2_ori.jpg";
import img2_ai_1 from "/assets/img2_ai_1.jpg";
import img2_ai_2 from "/assets/img2_ai_2.jpg";

import img3_ori from "/assets/img3_org.jpg";
import vid3_ai from "/assets/vid3_ai.mp4";

import img4_ori from "/assets/img4_ori.jpg";
import img4_ai from "/assets/img4_ai_1.jpg";
import vid4_ai from "/assets/vid4_ai.mp4";

import img5_ori from "/assets/img5_ori.jpg";
import img5_ai_1 from "/assets/img5_ai_1.jpg";
import vid5_ai from "/assets/vid5_ai.mp4";

import img6_ori from "/assets/img6_ori.jpg";
import img6_ai from "/assets/img6_ai-1.jpg";

import img7_ori from "/assets/img7_ori.jpg";
import img7_ai from "/assets/img7_ai.jpg";

import img8_ori from "/assets/img8_ori.jpg";
import img8_ai from "/assets/img8_ai.jpg";

import img9_ori from "/assets/img9_ori.jpg";
import img9_ai from "/assets/img9_ai.jpg";

import img10_ori from "/assets/img10_ori.jpg";
import img10_ai from "/assets/img10_ai.jpg";
import img10_ai_1 from "/assets/img10_ai_1.jpg";

import img11_ori from "/assets/img11_ori.jpg";
import img11_ai_1 from "/assets/img11_ai_1.jpg";
import img11_ai_2 from "/assets/img11_ai_2.jpg";

import img12_ori from "/assets/img12_ori.jpg";
import img12_ai_1 from "/assets/img12_ai_1.jpg";
import img12_ai_2 from "/assets/img12_ai_2.jpg";

import img13_ori from "/assets/img13_ori.jpg";
import img13_ai from "/assets/img13_ai.jpg";
import vid13 from "/assets/vid13_ai.mp4";

import img14_ori from "/assets/img14_ori.jpg";
import img14_ai from "/assets/img14_ai.png";

// Random videos
import r_vid_1 from "/assets/vid_1.mp4";
import r_vid_2 from "/assets/vid_2.mp4";
import r_vid_3 from "/assets/vid_3.mp4";
import r_vid_4 from "/assets/vid_4.mp4";
import r_vid_5 from "/assets/vid_5.mp4";

// Define the groups
const groups: MediaGroup[] = [
  {
    id: "1",
    items: [
      { id: "1", type: "image", src: img1_ori, label: "Original" },
      { id: "2", type: "image", src: img1_ai_1, label: "AI" },
      { id: "3", type: "image", src: img1_ai_2, label: "AI" },
    ],
  },
  {
    id: "2",
    items: [
      { id: "1", type: "image", src: img2_ori, label: "Original" },
      { id: "2", type: "image", src: img2_ai_1, label: "AI" },
      { id: "3", type: "image", src: img2_ai_2, label: "AI" },
    ],
  },
  {
    id: "3",
    items: [
      { id: "1", type: "image", src: img3_ori, label: "Original" },
      { id: "2", type: "video", src: vid3_ai, label: "AI" },
    ],
  },
  {
    id: "4",
    items: [
      { id: "1", type: "image", src: img4_ori, label: "Original" },
      { id: "2", type: "image", src: img4_ai, label: "AI" },
      { id: "3", type: "video", src: vid4_ai, label: "AI" },
    ],
  },
  {
    id: "5",
    items: [
      { id: "1", type: "image", src: img5_ori, label: "Original" },
      { id: "2", type: "image", src: img5_ai_1, label: "AI" },
      { id: "3", type: "video", src: vid5_ai, label: "AI" },
    ],
  },
  {
    id: "6",
    items: [
      { id: "1", type: "image", src: img6_ori, label: "Original" },
      { id: "2", type: "image", src: img6_ai, label: "AI" },
    ],
  },
  {
    id: "7",
    items: [
      { id: "1", type: "image", src: img7_ori, label: "Original" },
      { id: "2", type: "image", src: img7_ai, label: "AI" },
    ],
  },
  {
    id: "8",
    items: [
      { id: "1", type: "image", src: img8_ori, label: "Original" },
      { id: "2", type: "image", src: img8_ai, label: "AI" },
    ],
  },
  {
    id: "9",
    items: [
      { id: "1", type: "image", src: img9_ori, label: "Original" },
      { id: "2", type: "image", src: img9_ai, label: "AI" },
    ],
  },
  {
    id: "10",
    items: [
      { id: "1", type: "image", src: img10_ori, label: "Original" },
      { id: "2", type: "image", src: img10_ai, label: "AI" },
      { id: "3", type: "image", src: img10_ai_1, label: "AI" },
    ],
  },
  {
    id: "11",
    items: [
      { id: "1", type: "image", src: img11_ori, label: "Original" },
      { id: "2", type: "image", src: img11_ai_1, label: "AI" },
      { id: "3", type: "image", src: img11_ai_2, label: "AI" },
    ],
  },
  {
    id: "12",
    items: [
      { id: "1", type: "image", src: img12_ori, label: "Original" },
      { id: "2", type: "image", src: img12_ai_1, label: "AI" },
      { id: "3", type: "image", src: img12_ai_2, label: "AI" },
    ],
  },
  {
    id: "13",
    items: [
      { id: "1", type: "image", src: img13_ori, label: "Original" },
      { id: "2", type: "image", src: img13_ai, label: "AI" },
      { id: "3", type: "video", src: vid13, label: "AI" },
    ],
  },
  {
    id: "14",
    items: [
      { id: "1", type: "image", src: img14_ori, label: "Original" },
      { id: "2", type: "image", src: img14_ai, label: "AI" },
    ],
  },
  {
    id: "15",
    items: [
      { id: "1", type: "video", src: r_vid_1, label: "AI" },
      { id: "2", type: "video", src: r_vid_2, label: "AI" },
      { id: "3", type: "video", src: r_vid_3, label: "AI" },
      { id: "4", type: "video", src: r_vid_4, label: "AI" },
      { id: "5", type: "video", src: r_vid_5, label: "AI" },
    ],
  },
];

const Gallery: React.FC = () => {
  return (
    <div className="columns-2 p-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 [column-fill:_balance]">
      {groups.map((group) =>
        group.items.map((item) => (
          <div
            key={`${group.id}-${item.id}`}
            className="mb-4 break-inside-avoid relative group overflow-hidden rounded-xl shadow hover:shadow-lg transition-all duration-300"
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <video
                src={item.src}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="w-full h-auto object-cover rounded-xl"
              />
            )}
            <div className="absolute top-2 left-2">
              <span
                // variant={item.label === "Original" ? "default" : "secondary"}
                className="text-xs px-2 py-0.5 rounded-full shadow-sm backdrop-blur bg-white/70"
              >
                {item.label}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Gallery;
