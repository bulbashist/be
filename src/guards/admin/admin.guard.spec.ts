import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  it('should be defined', () => {
    const service = new JwtService();
    expect(new AdminGuard(service)).toBeDefined();
  });
});
