import Link from "next/link";

import { MotionFade } from "@/components/motion-fade";
import { SiteShell } from "@/components/site-shell";

const features = [
  {
    title: "Quiet interface",
    body: "Light-only surfaces, strong OKLCH contrast, and deliberate spacing keep the tool calm and readable.",
  },
  {
    title: "Real backend flow",
    body: "The frontend maps directly to the existing API: one route to request a token and one route to justify raw text.",
  },
  {
    title: "Built for output",
    body: "The workspace emphasizes plain text handling, paragraph preservation, and a clean preview of the justified response.",
  },
];

const steps = [
  "Request a token with an email address.",
  "Paste or reuse that token in the workspace.",
  "Send plain text and receive justified output at 80 columns.",
];

export default function Home() {
  return (
    <SiteShell currentPath="/">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <MotionFade className="surface-card p-8 sm:p-10 lg:p-12" delay={0.05}>
          <span className="eyebrow">Minimal frontend for the API</span>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-[var(--ink-strong)] sm:text-6xl">
            justifier turns a backend technical test into a clean, usable
            writing tool.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">
            The goal here is straightforward: keep the interface light,
            editorial, and calm while making the API feel approachable for a
            recruiter, reviewer, or teammate testing the product for the first
            time.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/workspace" className="primary-button">
              Open workspace
            </Link>
            <Link href="/token" className="secondary-button">
              Generate token
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="metric-card">
              <span>Input</span>
              <strong>Plain text</strong>
            </div>
            <div className="metric-card">
              <span>Auth</span>
              <strong>Bearer token</strong>
            </div>
            <div className="metric-card">
              <span>Output</span>
              <strong>80-char lines</strong>
            </div>
          </div>
        </MotionFade>

        <MotionFade className="grid gap-6" delay={0.12}>
          <div className="surface-card p-7">
            <span className="eyebrow">Flow</span>
            <ol className="mt-4 grid gap-4">
              {steps.map((step, index) => (
                <li key={step} className="info-row">
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="surface-card p-7">
            <span className="eyebrow">Brand direction</span>
            <p className="mt-4 text-base leading-7 text-[var(--ink-muted)]">
              A restrained sans serif, warm paper-like tones, and soft shadows
              keep the product modern without drifting into a futuristic or
              decorative aesthetic.
            </p>
          </div>
        </MotionFade>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <MotionFade
            key={feature.title}
            className="surface-card p-7"
            delay={0.18}
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
              {feature.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--ink-muted)]">
              {feature.body}
            </p>
          </MotionFade>
        ))}
      </section>
    </SiteShell>
  );
}
