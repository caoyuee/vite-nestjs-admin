import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password: _password, ...userInfo } = user;
    return {
      code: 200,
      message: 'success',
      data: userInfo,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户已存在，请直接登录');
    }

    const user = new User();
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.status = createUserDto.status ?? true;
    user.email = createUserDto.email ?? null;
    user.phone = createUserDto.phone ?? null;
    user.avatar = createUserDto.avatar ?? null;
    user.roles =
      createUserDto.roles && createUserDto.roles.length > 0
        ? createUserDto.roles.map((id) => String(id))
        : [];

    const saltRounds = process.env.BCRYPT_SALT
      ? parseInt(process.env.BCRYPT_SALT)
      : 10;
    user.password = bcrypt.hashSync(createUserDto.password, saltRounds);

    const result = await this.userRepository.save(user);
    if (!result) {
      throw new BadRequestException('创建用户失败');
    }

    return {
      code: 201,
      message: '创建成功,请登陆',
      data: null,
    };
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: Number(updateUserDto.id) },
    });

    if (!userToUpdate) {
      throw new NotFoundException('用户不存在');
    }

    const updateData: Partial<User> = {};
    if (updateUserDto.name !== undefined) updateData.name = updateUserDto.name;
    if (updateUserDto.username !== undefined)
      updateData.username = updateUserDto.username;
    if (updateUserDto.roles !== undefined)
      updateData.roles = updateUserDto.roles.map((id) => String(id));
    if (updateUserDto.status !== undefined)
      updateData.status = updateUserDto.status;
    if (updateUserDto.email !== undefined)
      updateData.email = updateUserDto.email;
    if (updateUserDto.phone !== undefined)
      updateData.phone = updateUserDto.phone;
    if (updateUserDto.avatar !== undefined)
      updateData.avatar = updateUserDto.avatar;

    const result = await this.userRepository.update(
      { id: Number(updateUserDto.id) },
      updateData,
    );
    if (!result || result.affected === 0) {
      throw new BadRequestException('更新用户信息失败');
    }

    return {
      code: 200,
      message: '用户信息更新成功',
      data: null,
    };
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new BadRequestException('该用户不存在');
    }

    const result = await this.userRepository.softDelete({ id: Number(id) });
    if (!result) {
      throw new BadRequestException('删除用户失败');
    }

    return {
      code: 200,
      message: '用户删除成功',
      data: null,
    };
  }

  async getUserList(query: UserListQueryDto) {
    const { pageNum = 1, pageSize = 10, ...filters } = query;

    const where: any = {};
    if (filters.username) where.username = filters.username;
    if (filters.name) where.name = filters.name;
    if (filters.email) where.email = filters.email;
    if (filters.phone) where.phone = filters.phone;
    if (filters.status !== undefined) where.status = filters.status;

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { createTime: 'DESC' },
    });

    const userList = users.map((user) => {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      code: 200,
      message: 'success',
      data: { list: userList, total },
    };
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!userToUpdate) {
      throw new NotFoundException('用户不存在');
    }

    const passwordMatch = bcrypt.compareSync(
      resetPasswordDto.oldPassword,
      userToUpdate.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('原密码错误');
    }

    const saltRounds = process.env.BCRYPT_SALT
      ? parseInt(process.env.BCRYPT_SALT)
      : 10;
    const hash = bcrypt.hashSync(resetPasswordDto.newPassword, saltRounds);

    const result = await this.userRepository.update(
      { id: Number(userId) },
      { password: hash },
    );
    if (result.affected === 0) {
      throw new BadRequestException('密码重置失败');
    }

    return {
      code: 200,
      message: '密码重置成功',
      data: null,
    };
  }
}
