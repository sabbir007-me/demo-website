import type { StreamImage } from "@/components/ui/image-stream-hero";

// Language cards in public/code-art: an editor window with a short idiomatic
// snippet over a glow in the language's brand colours. SVGs at the corridor's
// 18:25 card ratio, so they stay sharp however close a card flies.
const art = (slug: string) => `/code-art/${slug}.svg`;

// Ordered so neighbouring cards contrast in colour.
export const STREAM_IMAGES: StreamImage[] = [
  { src: art("python"), alt: "Python generator for Fibonacci numbers" },
  { src: art("java"), alt: "Java hello-world main class" },
  { src: art("cpp"), alt: "C++ program printing a vector" },
  { src: art("javascript"), alt: "JavaScript arrow function setting a heading" },
  { src: art("rust"), alt: "Rust loop printing words with println!" },
  { src: art("go"), alt: "Go goroutine sending over a channel" },
  { src: art("kotlin"), alt: "Kotlin data class copied with a new value" },
  { src: art("typescript"), alt: "TypeScript User type and typed function" },
  { src: art("swift"), alt: "Swift struct with string interpolation" },
  { src: art("csharp"), alt: "C# foreach loop with interpolated strings" },
  { src: art("ruby"), alt: "Ruby blocks capitalising words" },
  { src: art("php"), alt: "PHP foreach loop echoing a greeting" },
];
