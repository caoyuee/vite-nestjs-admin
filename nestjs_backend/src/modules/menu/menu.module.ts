import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from '../../entities/menu.entity';
import { Role } from '../../entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
