import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', '256257282931'),
  signOptions: {
    expiresIn: '7d',
  },
});

export const JWT_SECRET = process.env.JWT_SECRET || '256257282931';
