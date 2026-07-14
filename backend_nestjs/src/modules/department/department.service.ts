/**
 * @file department.service.ts
 * @description 部门服务 - 处理部门管理业务逻辑
 */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentListQueryDto } from './dto/department-list-query.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

export type DepartmentTreeItem = {
  id: number;
  parentId: number;
  name: string;
  code: string;
  sort: number;
  leader: string | null;
  phone: string | null;
  email: string | null;
  status: boolean;
  remark: string | null;
  createTime: Date;
  updateTime: Date | null;
  deleteTime: Date | null;
  children?: DepartmentTreeItem[];
};

/**
 * 部门服务
 */
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * 获取部门树列表
   */
  async getDepartmentList(query: DepartmentListQueryDto) {
    const { pageNum = 1, pageSize = 10, ...filters } = query;
    const where: FindOptionsWhere<Department> = {};

    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters.code) {
      where.code = Like(`%${filters.code}%`);
    }
    if (filters.status !== undefined) {
      where.status = filters.status;
    }

    const [departments, total] = await this.departmentRepository.findAndCount({
      where,
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    return {
      code: 200,
      message: 'success',
      data: {
        list: this.buildDepartmentTree(departments),
        total,
        pageNum,
        pageSize,
      },
    };
  }

  /**
   * 获取部门详情
   */
  async getDepartmentDetail(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    return {
      code: 200,
      message: 'success',
      data: department,
    };
  }

  /**
   * 创建部门
   */
  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    await this.assertCodeAvailable(createDepartmentDto.code);

    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      parentId: createDepartmentDto.parentId ?? 0,
      sort: createDepartmentDto.sort ?? 0,
      leader: createDepartmentDto.leader ?? null,
      phone: createDepartmentDto.phone ?? null,
      email: createDepartmentDto.email ?? null,
      status: createDepartmentDto.status ?? true,
      remark: createDepartmentDto.remark ?? null,
    });

    await this.departmentRepository.save(department);

    return {
      code: 201,
      message: '创建成功',
      data: null,
    };
  }

  /**
   * 编辑部门
   */
  async updateDepartment(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    if (
      updateDepartmentDto.parentId !== undefined &&
      updateDepartmentDto.parentId === id
    ) {
      throw new BadRequestException('上级部门不能选择自身');
    }

    if (
      updateDepartmentDto.code !== undefined &&
      updateDepartmentDto.code !== department.code
    ) {
      await this.assertCodeAvailable(updateDepartmentDto.code, id);
    }

    const updateData: Partial<Department> = {};
    if (updateDepartmentDto.parentId !== undefined)
      updateData.parentId = updateDepartmentDto.parentId;
    if (updateDepartmentDto.name !== undefined)
      updateData.name = updateDepartmentDto.name;
    if (updateDepartmentDto.code !== undefined)
      updateData.code = updateDepartmentDto.code;
    if (updateDepartmentDto.sort !== undefined)
      updateData.sort = updateDepartmentDto.sort;
    if (updateDepartmentDto.leader !== undefined)
      updateData.leader = updateDepartmentDto.leader || null;
    if (updateDepartmentDto.phone !== undefined)
      updateData.phone = updateDepartmentDto.phone || null;
    if (updateDepartmentDto.email !== undefined)
      updateData.email = updateDepartmentDto.email || null;
    if (updateDepartmentDto.status !== undefined)
      updateData.status = updateDepartmentDto.status;
    if (updateDepartmentDto.remark !== undefined)
      updateData.remark = updateDepartmentDto.remark || null;

    const result = await this.departmentRepository.update({ id }, updateData);
    if (!result || result.affected === 0) {
      throw new BadRequestException('更新部门失败');
    }

    return {
      code: 200,
      message: '部门更新成功',
      data: null,
    };
  }

  /**
   * 删除部门
   */
  async deleteDepartment(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new BadRequestException('该部门不存在');
    }

    const child = await this.departmentRepository.findOne({
      where: { parentId: id },
    });

    if (child) {
      throw new BadRequestException('该部门下存在子部门，不能删除');
    }

    const result = await this.departmentRepository.softDelete({ id });
    if (!result || result.affected === 0) {
      throw new BadRequestException('删除部门失败');
    }

    return {
      code: 200,
      message: '部门删除成功',
      data: null,
    };
  }

  private buildDepartmentTree(departments: Department[]): DepartmentTreeItem[] {
    const map = new Map<number, DepartmentTreeItem>();
    const roots: DepartmentTreeItem[] = [];

    departments.forEach((item) => {
      map.set(item.id, { ...item });
    });

    departments.forEach((item) => {
      const node = map.get(item.id)!;
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const sortTree = (nodes: DepartmentTreeItem[]) => {
      nodes.sort((a, b) => a.sort - b.sort || a.id - b.id);
      nodes.forEach((node) => {
        if (node.children?.length) {
          sortTree(node.children);
        }
      });
    };
    sortTree(roots);

    return roots;
  }

  private async assertCodeAvailable(code: string, excludeId?: number) {
    const existing = await this.departmentRepository.findOne({
      where: { code },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('部门编码已存在');
    }
  }
}
