import type { StreamImage } from "@/components/ui/image-stream-hero";

// Portrait crops sized for the corridor cards (18:25) at their largest size.
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=720&h=1000&q=80`;

// Alternates photos with abstract/gradient pieces. Every ID was checked to
// resolve on images.unsplash.com.
export const STREAM_IMAGES: StreamImage[] = [
  {
    src: unsplash("photo-1506905925346-21bda4d32df4"),
    alt: "Mountain peaks rising above a sea of clouds",
  },
  {
    src: unsplash("photo-1557682250-33bd709cbe85"),
    alt: "Soft violet gradient wash",
  },
  {
    src: unsplash("photo-1519681393784-d120267933ba"),
    alt: "Snowy mountains under a starry night sky",
  },
  {
    src: unsplash("photo-1579546929518-9e396f3cc809"),
    alt: "Multi-tone pastel gradient",
  },
  {
    src: unsplash("photo-1470071459604-3b5ec3a7fe05"),
    alt: "Misty forested hills",
  },
  {
    src: unsplash("photo-1618005182384-a83a8bd57fbe"),
    alt: "Abstract 3D render with flowing colour",
  },
  {
    src: unsplash("photo-1501785888041-af3ef285b470"),
    alt: "Lake surrounded by mountains",
  },
  {
    src: unsplash("photo-1557683316-973673baf926"),
    alt: "Deep blue gradient",
  },
  {
    src: unsplash("photo-1441974231531-c6227db76b6e"),
    alt: "Sunlight filtering through a forest",
  },
  {
    src: unsplash("photo-1620641788421-7a1c342ea42e"),
    alt: "Abstract fluid shapes",
  },
  {
    src: unsplash("photo-1469474968028-56623f02e42e"),
    alt: "Sunlit valley landscape",
  },
  {
    src: unsplash("photo-1550684376-efcbd6e3f031"),
    alt: "Neon light gradient",
  },
];
