import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private emailToToken = new Map<string, string>();
  private TokenToEmail = new Map<string, string>();
  private userUsage = new Map<string, { count: number; windowStart: number }>();
  // we'll use a fixed window for simplicity
  // but we should be aware of other ways (token bucket)
  getToken(email: string): { token: string } {
    const existingToken = this.emailToToken.get(email);
    if (existingToken) return { token: existingToken };
    const token = randomUUID();
    this.emailToToken.set(email, token);
    this.TokenToEmail.set(token, email);
    return { token };
  }
  isValidToken(token: string): boolean {
    return this.TokenToEmail.has(token);
  }
  getEmailFromToken(token: string): string | undefined {
    return this.TokenToEmail.get(token);
  }
  getUserUsage(
    token: string,
  ): { count: number; windowStart: number } | undefined {
    return this.userUsage.get(token);
  }
  checkAndConsumeQuota(token: string, words: number): void {
    const MAX_LENGTH = 80000;
    const TIME_DURATION_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const usage = this.userUsage.get(token);
    if (!usage) {
      if (words > MAX_LENGTH) throw new Error('QUOTA EXCEEDED');
      this.userUsage.set(token, { count: words, windowStart: now });
      return;
    }
    if (now - usage.windowStart >= TIME_DURATION_MS) {
      this.userUsage.set(token, {
        count: words,
        windowStart: now,
      });
      return;
    }
    if (usage?.count + words > MAX_LENGTH) throw new Error('QUOTA EXCEEDED');
    usage.count += words;
  }
}

// For a technical test, I recommend defining "Daily"
// as 24 hours from the first request rather than a
//  specific timezone's midnight. It’s easier to demo
// because you don't have to wait until midnight to
// see the reset logic work—you can just set the TTL
//  (Time To Live) to a shorter duration (like 1 minute)
//  during your demonstration to prove it works.

// First request of the day → initialize counter

// New day → reset counter

// Empty body → 0 words (allowed)

// Missing token → 401

// Invalid token → 401

// Quota exceeded → 402 (important!)
