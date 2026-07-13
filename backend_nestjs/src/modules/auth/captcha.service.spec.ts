import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';

describe('CaptchaService', () => {
  it('can be instantiated by Nest without a captcha code factory provider', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CaptchaService],
    }).compile();

    const service = moduleRef.get(CaptchaService);
    expect(service.generateCaptcha().svg).toContain('<svg');
  });

  it('generates an svg captcha and validates the code case-insensitively once', () => {
    const service = new CaptchaService(() => 'Ab3D');

    const captcha = service.generateCaptcha();

    expect(captcha.captchaId).toBeTruthy();
    expect(captcha.svg).toContain('<svg');
    expect(captcha.svg).toContain('</svg>');
    expect(service.validateCaptcha(captcha.captchaId, 'ab3d')).toBe(true);
    expect(service.validateCaptcha(captcha.captchaId, 'ab3d')).toBe(false);
  });

  it('throws a clear unauthorized exception for wrong or missing captcha values', () => {
    const service = new CaptchaService(() => 'K9P2');
    const captcha = service.generateCaptcha();

    expect(() => service.assertCaptcha(captcha.captchaId, '0000')).toThrow(
      new UnauthorizedException('验证码错误或已过期'),
    );
    expect(() => service.assertCaptcha('', '')).toThrow(
      new UnauthorizedException('验证码错误或已过期'),
    );
  });
});
