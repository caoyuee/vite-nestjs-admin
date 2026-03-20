import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { AuthQueryDto } from './dto/auth-query.dto';

@Injectable()
export class AuthPermissionService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async getAuthBtns(query: AuthQueryDto) {
    const { type } = query;

    let result: Auth[];
    if (type) {
      result = await this.authRepository.findBy({ type });
    } else {
      result = await this.authRepository.find();
    }

    if (!result || result.length === 0) {
      return {
        code: 200,
        message: '未找到权限数据',
        data: [],
      };
    }

    return {
      code: 200,
      message: '查询成功',
      data: result,
    };
  }
}
