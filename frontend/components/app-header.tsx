import Link from "next/link";

type AppHeaderProps = {
  currentPath?: string;
};

const links = [
  { href: "/", label: "Overview" },
  { href: "/token", label: "Get token" },
  { href: "/workspace", label: "Workspace" },
];

export function AppHeader({ currentPath }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border-soft)] bg-[color:var(--surface-base)]/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-raised)] text-sm font-semibold tracking-[0.18em] text-[var(--ink-strong)] uppercase shadow-[var(--shadow-soft)]">
            J
          </span>
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              Text justification API
            </p>
            <p className="text-lg font-semibold text-[var(--ink-strong)]">
              justifier
            </p>
          </div>
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-2"
          aria-label="Primary navigation"
        >
          {links.map((link) => {
            const active = currentPath === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--shadow-soft)]"
                    : "text-[var(--ink-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--ink-strong)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
