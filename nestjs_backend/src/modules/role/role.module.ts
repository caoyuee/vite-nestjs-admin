import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { Auth } from '../../entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Auth])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
