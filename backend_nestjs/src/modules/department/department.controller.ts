/**
 * @file department.controller.ts
 * @description 部门控制器
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentListQueryDto } from './dto/department-list-query.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentService } from './department.service';

/**
 * 部门控制器
 */
@ApiTags('部门')
@Controller('api/system/departments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: '获取部门列表' })
  getDepartmentList(@Query() query: DepartmentListQueryDto) {
    return this.departmentService.getDepartmentList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取部门详情' })
  getDepartmentDetail(@Param('id') id: string) {
    return this.departmentService.getDepartmentDetail(Number(id));
  }

  @Post()
  @ApiOperation({ summary: '创建部门' })
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑部门' })
  updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartment(
      Number(id),
      updateDepartmentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(Number(id));
  }
}
