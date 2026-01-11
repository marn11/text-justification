import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  private countWords(text: string) {
    return text.trim().split(/\s+/).length;
  }
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid Authorization format');
    if (!this.authService.isValidToken(token))
      throw new UnauthorizedException('Invalid token');
    console.log('words: ', this.countWords(request.body));
    try {
      this.authService.checkAndConsumeQuota(
        token,
        this.countWords(request.body),
      );
    } catch (e) {
      if (e.message === 'QUOTA EXCEEDED')
        throw new HttpException(
          '80k words limit exceeded',
          HttpStatus.PAYMENT_REQUIRED,
        );
      throw e;
    }
    request.user = { token, email: this.authService.getEmailFromToken(token) };
    return true;
  }
}
