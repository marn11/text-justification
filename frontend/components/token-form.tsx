"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";

import { MotionFade } from "@/components/motion-fade";

const TOKEN_STORAGE_KEY = "justifier-token";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

type TokenResponse = {
  token: string;
};

export function TokenForm() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCopied(false);

    startTransition(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error(
            response.status === 400
              ? "Please enter a valid email address."
              : "Could not create a token right now.",
          );
        }

        const data = (await response.json()) as TokenResponse;
        setToken(data.token);
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong while requesting your token.",
        );
      }
    });
  };

  const copyToken = async () => {
    if (!token) {
      return;
    }

    await navigator.clipboard.writeText(token);
    setCopied(true);
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <MotionFade className="surface-card p-8 sm:p-10" delay={0.04}>
        <div className="flex max-w-xl flex-col gap-4">
          <span className="eyebrow">Step 1</span>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)] sm:text-5xl">
            Ask for a token once, reuse it whenever you need to justify text.
          </h1>
          <p className="text-lg leading-8 text-[var(--ink-muted)]">
            The backend returns the same token for the same email, so this page
            acts like a clean client-side onboarding step.
          </p>
        </div>

        <form className="mt-10 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-[var(--ink-strong)]">
            Email address
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </label>

          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? "Requesting token..." : "Generate token"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-surface)] px-4 py-3 text-sm text-[var(--danger-ink)]">
            {error}
          </p>
        ) : null}

        <div className="mt-8 rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--ink-muted)]">
                Current token
              </p>
              <p className="mt-2 break-all font-mono text-sm leading-7 text-[var(--ink-strong)]">
                {token || "Your token will appear here after a successful request."}
              </p>
            </div>

            <button
              type="button"
              onClick={copyToken}
              disabled={!token}
              className="secondary-button"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </MotionFade>

      <MotionFade
        className="surface-card flex flex-col justify-between gap-6 p-8"
        delay={0.12}
      >
        <div className="grid gap-5">
          <span className="eyebrow">How it works</span>
          <div className="grid gap-4">
            <div className="info-row">
              <span>1</span>
              <p>Submit a valid email to `POST /api/token`.</p>
            </div>
            <div className="info-row">
              <span>2</span>
              <p>Save the returned token locally in this browser.</p>
            </div>
            <div className="info-row">
              <span>3</span>
              <p>Use that token from the workspace to justify plain text.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-[var(--surface-highlight)] p-5">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            Default API base
          </p>
          <p className="mt-2 text-base font-medium text-[var(--ink-strong)]">
            {API_BASE_URL}
          </p>
        </div>
      </MotionFade>
    </section>
  );
}
