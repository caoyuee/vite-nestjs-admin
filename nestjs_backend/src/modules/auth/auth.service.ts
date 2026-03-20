import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../common/interfaces/response.interface';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../../config/redis.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new NotFoundException('用户不存在，请先注册');
    }

    const passwordMatch = bcrypt.compareSync(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('密码错误');
    }

    const payload: JwtPayload = {
      sub: String(user.id),
      username: user.username,
      roles: user.roles || [],
    };

    const token = this.jwtService.sign(payload);

    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    await this.redis.set(`token_${user.id}`, token, 'EX', sevenDaysInSeconds);

    return {
      code: 200,
      message: 'success',
      data: { token },
    };
  }

  async logout(userId: string) {
    await this.redis.del(`token_${userId}`);
    return {
      code: 200,
      message: '退出成功',
      data: null,
    };
  }

  async validateToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redis.get(`token_${userId}`);
    return storedToken === token;
  }
}
