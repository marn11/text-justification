import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    guard = new AuthGuard(authService);
  });
  it('should throw if authorization header is missing', () => {
    // we're moking the execution context
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          body: 'TicTacTrip sont les meilleurs',
        }),
      }),
    } as ExecutionContext;
    expect(() => guard.canActivate(context)).toThrow();
  });
  it('should allow request with valid token and quota', () => {
    const { token } = authService.getToken('tictactrip@example.com');
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: `Bearer ${token}` },
          body: 'TicTacTrip sont les meilleurs',
        }),
      }),
    } as ExecutionContext;
    expect(guard.canActivate(context)).toBe(true);
  });
  it('should block the request when quota is exceeded', () => {
    const { token } = authService.getToken('tictactrip@example.com');
    authService.checkAndConsumeQuota(token, 80000);
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: `Bearer ${token}` },
          body: 'tictactrip',
        }),
      }),
    } as ExecutionContext;
    expect(() => guard.canActivate(context)).toThrow();
  });
});
