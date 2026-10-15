"use client";

import * as React from "react";
import Link from "next/link";
import { MotionConfig, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Full-screen video hero: a giant pull-up headline bottom left, copy and a
 * CTA bottom right, and the nav hanging from the top edge as a notch.
 * Adapted from the Prisma hero. The video is decorative, so the hero keeps
 * fixed light-on-dark colours whatever the site theme is. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={cn("inline-flex flex-wrap", className)} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span aria-hidden className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={cn("inline-flex flex-wrap justify-center", className)} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          className={cn("inline-block", w.className)}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
export type PrismaHeroLink = { label: string; href: string };

export interface PrismaHeroProps {
  title?: string;
  description?: React.ReactNode;
  cta?: PrismaHeroLink;
  navItems?: PrismaHeroLink[];
  /** Extra controls at the end of the notch, e.g. a theme switch. */
  navActions?: React.ReactNode;
  videoSrc?: string;
  /** Headline size; the default suits a word of about six letters. */
  titleClassName?: string;
  className?: string;
}

const DEFAULT_NAV: PrismaHeroLink[] = ["Our story", "Collective", "Workshops", "Programs", "Inquiries"].map(
  (label) => ({ label, href: "#" }),
);

const CREAM = "#E1E0CC";

function NavLink({ label, href }: PrismaHeroLink) {
  const className =
    "rounded-sm text-[10px] text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E1E0CC] sm:text-xs md:text-sm";
  // In-page anchors stay plain links; routes get client-side navigation.
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

export function PrismaHero({
  title = "Prisma",
  description = "Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives.",
  cta = { label: "Join the lab", href: "#" },
  navItems = DEFAULT_NAV,
  navActions,
  videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4",
  titleClassName = "text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]",
  className,
}: PrismaHeroProps) {
  return (
    // "user": entrance animations collapse to fades under reduced motion.
    <MotionConfig reducedMotion="user">
      <section className={cn("h-svh w-full", className)}>
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black md:rounded-[2rem]">
          {/* Background video (decorative) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            src={videoSrc}
          />

          {/* Noise overlay */}
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          {/* Navbar */}
          <nav aria-label="Main" className="absolute top-0 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 whitespace-nowrap sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
              {navItems.map((item) => (
                <NavLink key={item.label} {...item} />
              ))}
              {navActions}
            </div>
          </nav>

          {/* Hero content */}
          <div className="absolute right-0 bottom-0 left-0 px-4 pb-2 sm:px-6 md:px-10">
            <div className="grid grid-cols-12 items-end gap-4">
              <div className="col-span-12 lg:col-span-8">
                <h1
                  className={cn("leading-[0.85] font-medium tracking-[-0.07em]", titleClassName)}
                  style={{ color: CREAM }}
                >
                  <WordsPullUp text={title} showAsterisk />
                </h1>
              </div>

              <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                  className="text-xs text-[#E1E0CC]/70 sm:text-sm md:text-base"
                  style={{ lineHeight: 1.2 }}
                >
                  {description}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                  className="self-start"
                >
                  <Link
                    href={cta.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-[#E1E0CC] py-1 pr-1 pl-5 text-sm font-medium text-black transition-all hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E1E0CC] sm:text-base"
                  >
                    {cta.label}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                      <ArrowRight className="h-4 w-4" style={{ color: CREAM }} aria-hidden />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
