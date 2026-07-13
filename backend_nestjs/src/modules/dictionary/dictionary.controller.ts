/**
 * @file dictionary.controller.ts
 * @description 字典控制器 - 处理字典管理相关的 HTTP 请求
 *
 * 控制器职责说明：
 * - 获取字典列表
 * - 按类型获取字典选项
 * - 创建字典项
 * - 编辑字典项
 * - 删除字典项
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryListQueryDto } from './dto/dictionary-list-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * 字典控制器
 *
 * @class DictionaryController
 *
 * @description
 * 处理字典管理相关的所有 HTTP 请求
 * 路由前缀：/api/system/dictionary
 *
 * 所有接口需要 JWT 认证
 */
@ApiTags('字典')
@Controller('api/system/dictionary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DictionaryController {
  /**
   * 构造函数 - 依赖注入 DictionaryService
   */
  constructor(private readonly dictionaryService: DictionaryService) {}

  /**
   * 获取字典列表
   *
   * @description
   * GET /api/system/dictionary/list
   * 分页查询字典列表，支持按类型、名称筛选
   *
   * @param query - 查询参数（分页、筛选条件）
   */
  @Get('list')
  @ApiOperation({ summary: '获取字典列表' })
  async getDictionaryList(@Query() query: DictionaryListQueryDto) {
    return this.dictionaryService.getDictionaryList(query);
  }

  /**
   * 按字典类型获取字典选项
   *
   * @description
   * GET /api/system/dictionary/type/:dictType
   * 获取指定类型下的所有字典选项
   * 用于前端下拉框、状态标签等场景
   *
   * @param dictType - 字典类型
   */
  @Get('type/:dictType')
  @ApiOperation({ summary: '按类型获取字典选项' })
  async getDictionaryByType(@Param('dictType') dictType: string) {
    return this.dictionaryService.getDictionaryByType(dictType);
  }

  /**
   * 创建字典项
   *
   * @description
   * POST /api/system/dictionary/add
   * 创建新的字典项
   *
   * @param createDictionaryDto - 字典创建参数
   */
  @Post('add')
  @ApiOperation({ summary: '创建字典项' })
  async createDictionary(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionaryService.createDictionary(createDictionaryDto);
  }

  /**
   * 编辑字典项
   *
   * @description
   * PUT /api/system/dictionary/edit
   * 更新字典项信息
   *
   * @param updateDictionaryDto - 字典更新参数
   */
  @Put('edit')
  @ApiOperation({ summary: '编辑字典项' })
  async updateDictionary(@Body() updateDictionaryDto: UpdateDictionaryDto) {
    return this.dictionaryService.updateDictionary(updateDictionaryDto);
  }

  /**
   * 删除字典项
   *
   * @description
   * DELETE /api/system/dictionary/delete/:id
   * 软删除字典项（不会真正删除记录，只是标记为已删除）
   *
   * @param id - 字典 ID（从 URL 路径参数获取）
   */
  @Delete('delete/:id')
  @ApiOperation({ summary: '删除字典项' })
  async deleteDictionary(@Param('id') id: string) {
    return this.dictionaryService.deleteDictionary(Number(id));
  }
}

/**
 * 语义化字典控制器
 *
 * @class SystemDictionaryController
 * @description 按统一接口契约暴露 `/api/system/dictionaries` 字典资源接口。
 */
@ApiTags('字典')
@Controller('api/system/dictionaries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SystemDictionaryController {
  /**
   * 构造函数
   *
   * @param dictionaryService - 字典业务服务
   */
  constructor(private readonly dictionaryService: DictionaryService) {}

  /**
   * 获取字典列表
   */
  @Get()
  @ApiOperation({ summary: '获取字典列表' })
  async getDictionaryList(@Query() query: DictionaryListQueryDto) {
    return this.dictionaryService.getDictionaryList(query);
  }

  /**
   * 按字典类型获取字典选项
   */
  @Get('type/:dictType')
  @ApiOperation({ summary: '按类型获取字典选项' })
  async getDictionaryByType(@Param('dictType') dictType: string) {
    return this.dictionaryService.getDictionaryByType(dictType);
  }

  /**
   * 创建字典项
   */
  @Post()
  @ApiOperation({ summary: '创建字典项' })
  async createDictionary(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionaryService.createDictionary(createDictionaryDto);
  }

  /**
   * 编辑字典项
   */
  @Put(':id')
  @ApiOperation({ summary: '编辑字典项' })
  async updateDictionary(
    @Param('id') id: string,
    @Body() updateDictionaryDto: Omit<UpdateDictionaryDto, 'id'>,
  ) {
    return this.dictionaryService.updateDictionary({
      ...updateDictionaryDto,
      id: Number(id),
    });
  }

  /**
   * 删除字典项
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除字典项' })
  async deleteDictionary(@Param('id') id: string) {
    return this.dictionaryService.deleteDictionary(Number(id));
  }
}
