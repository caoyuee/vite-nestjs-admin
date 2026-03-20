import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPermissionController } from './auth-permission.controller';
import { AuthPermissionService } from './auth-permission.service';
import { Auth } from '../../entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [AuthPermissionController],
  providers: [AuthPermissionService],
  exports: [AuthPermissionService],
})
export class AuthPermissionModule {}
