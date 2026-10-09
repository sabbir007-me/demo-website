import type { WorksWheelItem } from "@/components/ui/works-wheel";

// Landscape crops at the wheel's 1.45:1 card ratio, sized for 2x screens.
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&h=828&q=80`;

export type Work = WorksWheelItem & {
  medium: string;
  /** ISO date of the last edit. */
  updated: string;
  views: number;
  saves: number;
  status: "Published" | "Draft";
};

// Placeholder portfolio and stats until works come from a real source.
// Ordered so neighbouring cards on the ring contrast in colour. Every image
// ID was checked to resolve on images.unsplash.com.
export const WORKS: Work[] = [
  {
    id: "bubble-nebula",
    title: "Bubble Nebula",
    image: unsplash("photo-1462331940025-496dfbfc7564"),
    medium: "Astrophotography",
    updated: "2026-09-28",
    views: 18420,
    saves: 1204,
    status: "Published",
  },
  {
    id: "molten-current",
    title: "Molten Current",
    image: unsplash("photo-1604871000636-074fa5117945"),
    medium: "Acrylic pour",
    updated: "2026-09-21",
    views: 9310,
    saves: 688,
    status: "Published",
  },
  {
    id: "soft-fold",
    title: "Soft Fold",
    image: unsplash("photo-1618005182384-a83a8bd57fbe"),
    medium: "3D render",
    updated: "2026-10-02",
    views: 22740,
    saves: 2016,
    status: "Published",
  },
  {
    id: "orion-veil",
    title: "Orion Veil",
    image: unsplash("photo-1608178398319-48f814d0750c"),
    medium: "Astrophotography",
    updated: "2026-08-30",
    views: 14105,
    saves: 973,
    status: "Published",
  },
  {
    id: "ringed-giant",
    title: "Ringed Giant",
    image: unsplash("photo-1614732414444-096e5f1122d5"),
    medium: "Digital render",
    updated: "2026-10-06",
    views: 3280,
    saves: 241,
    status: "Draft",
  },
  {
    id: "ink-bloom",
    title: "Ink Bloom",
    image: unsplash("photo-1541701494587-cb58502866ab"),
    medium: "Ink photography",
    updated: "2026-09-12",
    views: 11860,
    saves: 1032,
    status: "Published",
  },
  {
    id: "galactic-core",
    title: "Galactic Core",
    image: unsplash("photo-1502134249126-9f3755a50d78"),
    medium: "Night sky",
    updated: "2026-07-19",
    views: 26930,
    saves: 2471,
    status: "Published",
  },
  {
    id: "candy-marble",
    title: "Candy Marble",
    image: unsplash("photo-1557672172-298e090bd0f1"),
    medium: "Fluid art",
    updated: "2026-09-05",
    views: 7645,
    saves: 512,
    status: "Published",
  },
  {
    id: "afterglow",
    title: "Afterglow",
    image: unsplash("photo-1620641788421-7a1c342ea42e"),
    medium: "3D render",
    updated: "2026-10-08",
    views: 1190,
    saves: 86,
    status: "Draft",
  },
];
