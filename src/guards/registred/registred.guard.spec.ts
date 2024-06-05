import { JwtService } from '@nestjs/jwt';
import { RegistredGuard } from './registred.guard';

describe('RegistredGuard', () => {
  it('should be defined', () => {
    const service = new JwtService();
    expect(new RegistredGuard(service)).toBeDefined();
  });
});
