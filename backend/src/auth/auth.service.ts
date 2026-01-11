import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private emailToToken = new Map<string, string>();
  private TokenToEmail = new Map<string, string>();
  //   another map will be needed soon for usage data
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
}
