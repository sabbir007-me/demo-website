import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { WorksDashboard } from "@/components/dashboard/works-dashboard";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Dashboard" };

const navLink =
  "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground";

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
