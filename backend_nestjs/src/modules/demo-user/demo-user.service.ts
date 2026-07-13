/**
 * @file demo-user.service.ts
 * @description 演示用户服务 - 为前端 ProTable 和组件示例页提供稳定的演示数据
 */

import { Injectable } from '@nestjs/common';

/**
 * 演示用户查询参数
 */
export interface DemoUserQuery {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  gender?: number;
  status?: number;
  email?: string;
  address?: string;
}

/**
 * 演示用户数据结构
 */
export interface DemoUserItem {
  id: string;
  username: string;
  gender: number;
  user: { detail: { age: number } };
  idCard: string;
  email: string;
  address: string;
  createTime: string;
  status: number;
  avatar: string;
  photo: string[];
  children?: DemoUserItem[];
}

/**
 * 演示用户服务
 *
 * @class DemoUserService
 * @description 使用内存数据满足前端演示页面，不污染真实用户表。
 */
@Injectable()
export class DemoUserService {
  /**
   * 演示用户内存数据
   */
  private users: DemoUserItem[] = Array.from({ length: 36 }).map((_, index) => {
    const id = String(index + 1);
    const gender = index % 2;
    return {
      id,
      username: `demo_user_${id}`,
      gender,
      user: { detail: { age: 20 + (index % 18) } },
      idCard: `110101199${index % 10}0101${String(1000 + index)}`,
      email: `demo${id}@example.com`,
      address: index % 3 === 0 ? '北京' : index % 3 === 1 ? '上海' : '深圳',
      createTime: `2026-03-${String((index % 28) + 1).padStart(2, '0')}`,
      status: index % 4 === 0 ? 0 : 1,
      avatar: '',
      photo: [],
    };
  });

  /**
   * 获取演示用户列表
   *
   * @param query - 分页和筛选参数
   * @returns 分页后的演示用户数据
   */
  getUserList(query: DemoUserQuery) {
    const { pageNum = 1, pageSize = 10 } = query;
    let list = [...this.users];

    // 按用户名筛选
    if (query.username) {
      list = list.filter((item) => item.username.includes(query.username!));
    }

    // 按性别筛选
    if (query.gender !== undefined) {
      list = list.filter((item) => item.gender === Number(query.gender));
    }

    // 按状态筛选
    if (query.status !== undefined) {
      list = list.filter((item) => item.status === Number(query.status));
    }

    // 按邮箱筛选
    if (query.email) {
      list = list.filter((item) => item.email.includes(query.email!));
    }

    // 按地址筛选
    if (query.address) {
      list = list.filter((item) => item.address.includes(query.address!));
    }

    const total = list.length;
    const start = (pageNum - 1) * pageSize;
    const pageList = list.slice(start, start + pageSize);

    return {
      code: 200,
      message: 'success',
      data: { list: pageList, total, pageNum, pageSize },
    };
  }

  /**
   * 获取树形演示用户列表
   *
   * @param query - 分页和筛选参数
   * @returns 带 children 的演示用户数据
   */
  getUserTreeList(query: DemoUserQuery) {
    const result = this.getUserList(query);
    const list = result.data.list.map((item) => ({
      ...item,
      children: [
        {
          ...item,
          id: `${item.id}-child`,
          username: `${item.username}_child`,
        },
      ],
    }));

    return {
      ...result,
      data: { ...result.data, list },
    };
  }

  /**
   * 新增演示用户
   *
   * @param payload - 前端提交的演示用户数据
   * @returns 操作结果
   */
  createUser(payload: Partial<DemoUserItem>) {
    const nextId = String(this.users.length + 1);
    this.users.unshift({
      id: nextId,
      username: payload.username || `demo_user_${nextId}`,
      gender: payload.gender ?? 1,
      user: payload.user || { detail: { age: 28 } },
      idCard: payload.idCard || `11010119990101${nextId.padStart(4, '0')}`,
      email: payload.email || `demo${nextId}@example.com`,
      address: payload.address || '北京',
      createTime: new Date().toISOString().slice(0, 10),
      status: payload.status ?? 1,
      avatar: payload.avatar || '',
      photo: payload.photo || [],
    });

    return { code: 200, message: '新增成功', data: null };
  }

  /**
   * 编辑演示用户
   *
   * @param id - 演示用户 ID
   * @param payload - 更新数据
   * @returns 操作结果
   */
  updateUser(id: string, payload: Partial<DemoUserItem>) {
    this.users = this.users.map((item) =>
      item.id === id ? { ...item, ...payload, id } : item,
    );
    return { code: 200, message: '编辑成功', data: null };
  }

  /**
   * 删除演示用户
   *
   * @param ids - 演示用户 ID 列表
   * @returns 操作结果
   */
  deleteUsers(ids: string[]) {
    this.users = this.users.filter((item) => !ids.includes(item.id));
    return { code: 200, message: '删除成功', data: null };
  }

  /**
   * 切换演示用户状态
   *
   * @param id - 演示用户 ID
   * @param status - 用户状态
   * @returns 操作结果
   */
  changeStatus(id: string, status: number) {
    this.users = this.users.map((item) =>
      item.id === id ? { ...item, status } : item,
    );
    return { code: 200, message: '状态修改成功', data: null };
  }

  /**
   * 获取用户状态字典
   */
  getStatusOptions() {
    return {
      code: 200,
      message: 'success',
      data: [
        { userLabel: '禁用', userValue: 0 },
        { userLabel: '启用', userValue: 1 },
      ],
    };
  }

  /**
   * 获取性别字典
   */
  getGenderOptions() {
    return {
      code: 200,
      message: 'success',
      data: [
        { genderLabel: '女', genderValue: 0 },
        { genderLabel: '男', genderValue: 1 },
      ],
    };
  }

  /**
   * 获取部门树
   */
  getDepartments() {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          name: '研发部',
          children: [
            { id: '1-1', name: '前端组' },
            { id: '1-2', name: '后端组' },
          ],
        },
        {
          id: '2',
          name: '产品部',
          children: [{ id: '2-1', name: '体验组' }],
        },
      ],
    };
  }

  /**
   * 获取演示角色字典
   */
  getRoles() {
    return {
      code: 200,
      message: 'success',
      data: [
        { id: '1', name: '管理员' },
        { id: '2', name: '编辑员' },
        { id: '3', name: '访客' },
      ],
    };
  }

  /**
   * 批量导入演示用户
   */
  importUsers() {
    return { code: 200, message: '导入成功', data: null };
  }

  /**
   * 重置演示用户密码
   */
  resetPassword() {
    return { code: 200, message: '密码重置成功', data: null };
  }
}
