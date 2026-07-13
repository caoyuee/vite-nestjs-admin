import { randomUUID } from 'node:crypto';
import {
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';

export interface CaptchaResponse {
  captchaId: string;
  svg: string;
}

interface CaptchaRecord {
  code: string;
  expiresAt: number;
}

type CaptchaCodeFactory = () => string;

export const CAPTCHA_CODE_FACTORY = 'CAPTCHA_CODE_FACTORY';
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

/**
 * 验证码服务
 *
 * @description 生成 SVG 验证码并在服务内存中保存短期答案。
 */
@Injectable()
export class CaptchaService {
  private readonly store = new Map<string, CaptchaRecord>();

  constructor(
    @Optional()
    @Inject(CAPTCHA_CODE_FACTORY)
    private readonly codeFactory: CaptchaCodeFactory = createCode,
  ) {}

  /**
   * 生成 SVG 验证码
   *
   * @returns 验证码 ID 和 SVG 字符串
   */
  generateCaptcha(): CaptchaResponse {
    this.cleanupExpired();

    const captchaId = randomUUID();
    const code = this.codeFactory();
    this.store.set(captchaId, {
      code: code.toLowerCase(),
      expiresAt: Date.now() + CAPTCHA_TTL_MS,
    });

    return {
      captchaId,
      svg: createSvg(code),
    };
  }

  /**
   * 校验验证码
   *
   * @description 验证码无论成功或失败都会失效，避免重复提交。
   * @param captchaId - 验证码 ID
   * @param captchaCode - 用户输入的验证码
   * @returns 是否校验通过
   */
  validateCaptcha(captchaId: string, captchaCode: string): boolean {
    this.cleanupExpired();

    const record = this.store.get(captchaId);
    if (!record) return false;

    this.store.delete(captchaId);
    return record.code === captchaCode.trim().toLowerCase();
  }

  /**
   * 断言验证码有效
   *
   * @throws UnauthorizedException 验证码错误或过期
   */
  assertCaptcha(captchaId: string, captchaCode: string) {
    if (
      !captchaId ||
      !captchaCode ||
      !this.validateCaptcha(captchaId, captchaCode)
    ) {
      throw new UnauthorizedException('验证码错误或已过期');
    }
  }

  /**
   * 清理过期验证码
   */
  private cleanupExpired() {
    const now = Date.now();
    for (const [captchaId, record] of this.store.entries()) {
      if (record.expiresAt <= now) {
        this.store.delete(captchaId);
      }
    }
  }
}

/**
 * 创建随机验证码文本
 */
function createCode() {
  return Array.from({ length: 4 }, () =>
    CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length)),
  ).join('');
}

/**
 * 创建 SVG 图片字符串
 */
function createSvg(code: string) {
  const chars = code.split('');
  const text = chars
    .map((char, index) => {
      const x = 18 + index * 24;
      const y = 34 + Math.round(Math.random() * 8);
      const rotate = Math.round(Math.random() * 24 - 12);
      return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    })
    .join('');
  const lines = Array.from({ length: 4 }, () => {
    const x1 = Math.round(Math.random() * 120);
    const y1 = Math.round(Math.random() * 44);
    const x2 = Math.round(Math.random() * 120);
    const y2 = Math.round(Math.random() * 44);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44" role="img" aria-label="captcha">
  <rect width="120" height="44" rx="6" fill="#f5f7fa"/>
  <g stroke="#9ca3af" stroke-width="1" opacity="0.45">${lines}</g>
  <g fill="#1f2937" font-size="24" font-family="Arial, sans-serif" font-weight="700" letter-spacing="2">${text}</g>
</svg>`;
}
