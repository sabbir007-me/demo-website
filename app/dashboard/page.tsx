import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { WorksDashboard } from "@/components/dashboard/works-dashboard";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = { title: "Dashboard" };

const navLink = buttonVariants({
  variant: "ghost",
  className: "h-11 gap-2 px-4 text-muted-foreground",
});

export default function DashboardPage() {
  return (
    <main className="relative h-svh overflow-hidden bg-background text-foreground">
      <h1 className="sr-only">Your works</h1>
      <WorksDashboard />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-20 items-center justify-between bg-gradient-to-b from-background to-transparent px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Corridor home"
          className="pointer-events-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Logo />
        </Link>
        <nav aria-label="Account" className="pointer-events-auto flex items-center gap-1">
          <ThemeToggle className="size-11" />
          <Link href="/" className={navLink}>
            View site
          </Link>
          {/* No session exists yet, so signing out is just leaving. */}
          <Link href="/login" className={navLink}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Link>
        </nav>
      </header>
    </main>
  );
}
