import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    service = new AuthService();
  });
  it('should generate a token for a new email', () => {
    const { token } = service.getToken('tictactrip@example.com');
    expect(token).toBeDefined();
  });
  it('should return the same token for th same email', () => {
    const first = service.getToken('tictactrip@example.com');
    const second = service.getToken('tictactrip@example.com');
    expect(first.token).toBe(second.token);
  });
  it('should validate existing token', () => {
    const { token } = service.getToken('tictactrip@example.com');
    expect(service.isValidToken(token)).toBe(true);
  });
  it('should initialize quota on first usage', () => {
    const { token } = service.getToken('tictactrip@example.com');
    service.checkAndConsumeQuota(token, 100);
    const usage = service.getUserUsage(token);
    expect(usage?.count).toBe(100);
  });
  it('should throw when quota is exceeded', () => {
    const { token } = service.getToken('tictactrip@example.com');
    expect(() => {
      service.checkAndConsumeQuota(token, 80001);
    }).toThrow();
  });
});
