"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";

import { MotionFade } from "@/components/motion-fade";

const TOKEN_STORAGE_KEY = "justifier-token";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";
const DEMO_TEXT = `Typography in a product is most convincing when the tool disappears and the output feels effortlessly readable.

This small workspace sends plain text to the backend and renders the justified response without inventing extra formatting.`;

export function JustifyWorkspace() {
  const [token, setToken] = useState("");
  const [sourceText, setSourceText] = useState(DEMO_TEXT);
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const stats = useMemo(() => {
    const words = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
    const paragraphs = sourceText.trim()
      ? sourceText.trim().split(/\n\s*\n/).length
      : 0;

    return { words, paragraphs };
  }, [sourceText]);

  const resultStats = useMemo(() => {
    const lines = resultText ? resultText.split("\n").length : 0;
    const widestLine = resultText
      ? Math.max(...resultText.split("\n").map((line) => line.length))
      : 0;

    return { lines, widestLine };
  }, [resultText]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/justify`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: sourceText,
        });

        if (!response.ok) {
          const message =
            response.status === 401
              ? "The token is missing or invalid."
              : response.status === 402
                ? "The daily quota has been exceeded for this token."
                : response.status === 400
                  ? "Please enter some text before submitting."
                  : "The justification request failed.";

          throw new Error(message);
        }

        const text = await response.text();
        setResultText(text);
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong while justifying the text.",
        );
      }
    });
  };

  return (
    <section className="grid gap-8">
      <MotionFade className="surface-card grid gap-8 p-8 sm:p-10" delay={0.04}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow">Step 2</span>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)] sm:text-5xl">
              Submit raw text, keep paragraphs intact, and get an 80-column
              result back.
            </h1>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--ink-muted)]">
            <div className="stat-row">
              <span>Words</span>
              <strong>{stats.words}</strong>
            </div>
            <div className="stat-row">
              <span>Paragraphs</span>
              <strong>{stats.paragraphs}</strong>
            </div>
            <div className="stat-row">
              <span>API endpoint</span>
              <strong>/justify</strong>
            </div>
          </div>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-[var(--ink-strong)]">
            Bearer token
            <input
              required
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste the token returned by /api/token"
              className="input-field"
            />
          </label>

          <div className="grid gap-6 xl:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-[var(--ink-strong)]">
              Input text
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                className="editor-field"
              />
            </label>

            <div className="grid gap-2 text-sm font-medium text-[var(--ink-strong)]">
              <span>Justified output</span>
              <div className="editor-output">
                <pre>{resultText || "Your justified result will appear here."}</pre>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="primary-button" disabled={isPending}>
              {isPending ? "Justifying..." : "Justify text"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSourceText(DEMO_TEXT);
                setResultText("");
                setError("");
              }}
            >
              Reset example
            </button>
          </div>
        </form>

        {error ? (
          <p className="rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-surface)] px-4 py-3 text-sm text-[var(--danger-ink)]">
            {error}
          </p>
        ) : null}
      </MotionFade>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <MotionFade className="surface-card p-6" delay={0.12}>
          <span className="eyebrow">Response checks</span>
          <div className="mt-4 grid gap-3 text-sm text-[var(--ink-muted)]">
            <div className="stat-row">
              <span>Returned lines</span>
              <strong>{resultStats.lines}</strong>
            </div>
            <div className="stat-row">
              <span>Widest line</span>
              <strong>{resultStats.widestLine}</strong>
            </div>
            <div className="stat-row">
              <span>Quota handling</span>
              <strong>402 on limit</strong>
            </div>
          </div>
        </MotionFade>

        <MotionFade className="surface-card p-6" delay={0.18}>
          <span className="eyebrow">Request format</span>
          <pre className="code-panel mt-4">{`POST ${API_BASE_URL}/justify
Authorization: Bearer <token>
Content-Type: text/plain

Your raw text goes here.`}</pre>
        </MotionFade>
      </div>
    </section>
  );
}
