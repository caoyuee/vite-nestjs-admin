/**
 * @file update-department.dto.ts
 * @description 编辑部门 DTO
 */

import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';

/**
 * 编辑部门参数
 */
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
