import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha.service';
import { User } from '../../entities/user.entity';

describe('AuthService captcha login', () => {
  const createService = () => {
    const userRepository = {
      findOne: jest.fn(),
    } satisfies Pick<Repository<User>, 'findOne'>;
    const jwtService = {
      sign: jest.fn(() => 'token-value'),
    } satisfies Pick<JwtService, 'sign'>;
    const redis = {
      set: jest.fn(),
      del: jest.fn(),
      get: jest.fn(),
    };
    const captchaService = new CaptchaService(() => 'A7K9');
    const service = new AuthService(
      userRepository as unknown as Repository<User>,
      jwtService as unknown as JwtService,
      redis as unknown as Redis,
      captchaService,
    );

    return { service, userRepository, jwtService, redis, captchaService };
  };

  it('rejects login before querying user when captcha is invalid', async () => {
    const { service, userRepository } = createService();

    await expect(
      service.login({
        username: 'admin',
        password: '123456',
        captchaId: 'missing',
        captchaCode: 'wrong',
      }),
    ).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findOne).not.toHaveBeenCalled();
  });

  it('logs in with a valid captcha and invalidates the captcha after use', async () => {
    const { service, userRepository, jwtService, redis, captchaService } =
      createService();
    const captcha = captchaService.generateCaptcha();
    userRepository.findOne.mockResolvedValue({
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('123456', 10),
      roles: ['1'],
    });

    const result = await service.login({
      username: 'admin',
      password: '123456',
      captchaId: captcha.captchaId,
      captchaCode: 'a7k9',
    });

    expect(result.data.token).toBe('token-value');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: '1',
      username: 'admin',
      roles: ['1'],
    });
    expect(redis.set).toHaveBeenCalledWith(
      'token_1',
      'token-value',
      'EX',
      604800,
    );
    await expect(
      service.login({
        username: 'admin',
        password: '123456',
        captchaId: captcha.captchaId,
        captchaCode: 'a7k9',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
