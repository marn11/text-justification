import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private emails = new Map<string, string>();
  //   another map will be needed soon for usage data
  newToken(email: string) {
    if (this.emails.has(email)) return { token: this.emails.get(email) };
    const token = randomUUID();
    this.emails.set(email, token);
    return { token };
  }
}
