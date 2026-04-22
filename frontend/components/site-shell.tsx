import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { MotionFade } from "@/components/motion-fade";

type SiteShellProps = {
  children: ReactNode;
  currentPath?: string;
};

export function SiteShell({ children, currentPath }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[var(--page-gradient)] text-[var(--ink-strong)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,oklch(0.97_0.03_85),transparent_55%)]" />
      <AppHeader currentPath={currentPath} />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <MotionFade>{children}</MotionFade>
      </main>
    </div>
  );
}
