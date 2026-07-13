/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * @file response.interceptor.ts
 * @description 响应拦截器 - 统一处理响应数据格式
 *
 * 拦截器概念说明：
 * - 拦截器（Interceptor）可以在请求处理前后执行额外逻辑
 * - 类似于 Axios 的请求/响应拦截器
 * - 可以修改请求数据或响应数据
 *
 * 类比前端：
 * - 类似于 Axios 的响应拦截器 axios.interceptors.response.use()
 * - 在数据返回给前端之前，统一包装成标准格式
 * - 类似于 Vue 的全局 mixin，对所有组件生效
 *
 * 执行顺序：
 * 1. 请求进入
 * 2. 中间件处理
 * 3. 守卫判断
 * 4. 拦截器前置处理（before）
 * 5. Controller 处理
 * 6. 拦截器后置处理（after）- 当前文件的作用位置
 * 7. 返回响应
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 响应拦截器
 *
 * @class ResponseInterceptor
 * @implements {NestInterceptor}
 * @template T - 原始响应数据类型
 *
 * @description
 * 将所有响应数据包装成统一格式：
 * {
 *   code: 200,      // HTTP 状态码
 *   message: 'success',  // 响应消息
 *   data: { ... }   // 实际数据
 * }
 *
 * 这样前端就可以用统一的方式处理响应，不用每个接口都判断格式
 */
@Injectable() // @Injectable() 表示这是一个可以被依赖注入的服务
export class ResponseInterceptor<T> implements NestInterceptor<
  T, // 原始数据类型
  ApiResponse<T> // 转换后的响应类型
> {
  /**
   * 拦截器核心方法
   *
   * @param {ExecutionContext} context - 执行上下文
   * @param {CallHandler} next - 下一个处理器的调用句柄
   * @returns {Observable<ApiResponse<T>>} 包装后的响应流
   *
   * @description
   * 使用 RxJS 的 pipe 和 map 操作符处理响应数据
   * RxJS 是一个响应式编程库，类似于前端的 Observable
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // next.handle() 返回一个 Observable，包含 Controller 返回的数据
    // pipe() 用于对 Observable 进行链式操作
    // map() 类似于数组的 map 方法，转换数据
    return next.handle().pipe(
      map((data) => {
        // 如果数据已经是标准格式（有 code 字段），直接返回
        // 这样可以兼容 Service 层已经处理好的响应
        if (data && typeof data === 'object' && 'code' in data) {
          return data;
        }

        // 否则包装成标准格式
        return {
          code: 200, // HTTP 状态码，200 表示成功
          message: 'success', // 响应消息
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: data ?? null, // 实际数据，如果是 undefined 则返回 null
        };
      }),
    );
  }
}
