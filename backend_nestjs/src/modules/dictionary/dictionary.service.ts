/**
 * @file dictionary.service.ts
 * @description 字典服务 - 处理字典管理的业务逻辑
 *
 * Service 职责说明：
 * - 字典 CRUD 业务逻辑
 * - 数据验证和异常处理
 * - 分页查询处理
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

import { Dictionary } from '../../entities/dictionary.entity';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryListQueryDto } from './dto/dictionary-list-query.dto';

/**
 * 字典服务
 *
 * @class DictionaryService
 *
 * @description
 * 处理字典管理相关的所有业务逻辑：
 * - 获取字典列表
 * - 按类型获取字典选项
 * - 创建字典项
 * - 更新字典项
 * - 删除字典项（软删除）
 */
@Injectable()
export class DictionaryService {
  /**
   * 构造函数 - 依赖注入 DictionaryRepository
   *
   * @param {Repository<Dictionary>} dictionaryRepository - 字典数据仓库
   */
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  /**
   * 获取字典列表
   *
   * @description
   * 分页查询字典列表
   * 支持按字典类型、字典名称筛选
   *
   * @param {DictionaryListQueryDto} query - 查询参数
   * @returns 字典列表响应
   */
  async getDictionaryList(query: DictionaryListQueryDto) {
    // 解构分页参数和筛选条件
    const { pageNum = 1, pageSize = 10, ...filters } = query;

    // 构建查询条件
    const where: FindOptionsWhere<Dictionary> = {};

    // 字典类型筛选（模糊匹配）
    if (filters.dictType) {
      where.dictType = Like(`%${filters.dictType}%`) as unknown as string;
    }

    // 字典名称筛选（模糊匹配）
    if (filters.name) {
      where.name = Like(`%${filters.name}%`) as unknown as string;
    }

    // 执行分页查询
    // findAndCount 返回 [数据列表, 总数]
    const [list, total] = await this.dictionaryRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    return {
      code: 200,
      message: 'success',
      data: { list, total },
    };
  }

  /**
   * 按字典类型获取字典选项
   *
   * @description
   * 根据字典类型获取该类型下的所有字典选项
   * 用于前端下拉框、状态标签等场景
   *
   * @param {string} dictType - 字典类型
   * @returns 字典选项列表响应
   */
  async getDictionaryByType(dictType: string) {
    // 查询指定类型的所有字典项
    const list = await this.dictionaryRepository.find({
      where: { dictType },
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    return {
      code: 200,
      message: 'success',
      data: list,
    };
  }

  /**
   * 创建字典项
   *
   * @description
   * 创建新的字典项
   *
   * @param {CreateDictionaryDto} createDictionaryDto - 字典创建参数
   * @returns 创建结果响应
   * @throws {BadRequestException} 创建失败
   */
  async createDictionary(createDictionaryDto: CreateDictionaryDto) {
    // 创建字典实体
    const dictionary = new Dictionary();
    dictionary.name = createDictionaryDto.name;
    dictionary.dictType = createDictionaryDto.dictType;
    dictionary.label = createDictionaryDto.label;
    dictionary.value = createDictionaryDto.value;
    dictionary.tag = createDictionaryDto.tag;
    dictionary.sort = createDictionaryDto.sort ?? 0;

    // 保存到数据库
    const result = await this.dictionaryRepository.save(dictionary);
    if (!result) {
      throw new BadRequestException('创建字典失败');
    }

    return {
      code: 201,
      message: '创建成功',
      data: null,
    };
  }

  /**
   * 更新字典项
   *
   * @description
   * 更新字典项的部分信息
   * 只更新 DTO 中提供的字段
   *
   * @param {UpdateDictionaryDto} updateDictionaryDto - 字典更新参数
   * @returns 更新结果响应
   * @throws {NotFoundException} 字典不存在
   * @throws {BadRequestException} 更新失败
   */
  async updateDictionary(updateDictionaryDto: UpdateDictionaryDto) {
    // 先查询字典是否存在
    const dictionaryToUpdate = await this.dictionaryRepository.findOne({
      where: { id: updateDictionaryDto.id },
    });

    if (!dictionaryToUpdate) {
      throw new NotFoundException('字典不存在');
    }

    // 构建更新数据对象
    const updateData: Partial<Dictionary> = {};
    if (updateDictionaryDto.name !== undefined) {
      updateData.name = updateDictionaryDto.name;
    }
    if (updateDictionaryDto.dictType !== undefined) {
      updateData.dictType = updateDictionaryDto.dictType;
    }
    if (updateDictionaryDto.label !== undefined) {
      updateData.label = updateDictionaryDto.label;
    }
    if (updateDictionaryDto.value !== undefined) {
      updateData.value = updateDictionaryDto.value;
    }
    if (updateDictionaryDto.tag !== undefined) {
      updateData.tag = updateDictionaryDto.tag;
    }
    if (updateDictionaryDto.sort !== undefined) {
      updateData.sort = updateDictionaryDto.sort;
    }

    // 执行更新
    const result = await this.dictionaryRepository.update(
      { id: updateDictionaryDto.id },
      updateData,
    );
    if (!result || result.affected === 0) {
      throw new BadRequestException('更新字典失败');
    }

    return {
      code: 200,
      message: '字典更新成功',
      data: null,
    };
  }

  /**
   * 删除字典项
   *
   * @description
   * 软删除字典项（不会真正删除记录）
   * 软删除会将 deleteTime 字段设置为当前时间
   *
   * @param {number} id - 字典 ID
   * @returns 删除结果响应
   * @throws {BadRequestException} 字典不存在或删除失败
   */
  async deleteDictionary(id: number) {
    // 检查字典是否存在
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id },
    });
    if (!dictionary) {
      throw new BadRequestException('该字典不存在');
    }

    // 执行软删除
    const result = await this.dictionaryRepository.softDelete({ id });
    if (!result) {
      throw new BadRequestException('删除字典失败');
    }

    return {
      code: 200,
      message: '字典删除成功',
      data: null,
    };
  }
}
