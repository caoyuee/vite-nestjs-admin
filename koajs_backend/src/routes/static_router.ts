import Router from "@koa/router";
import type { RouterContext } from '@koa/router';
import { koaBody } from "koa-body";
import { uploadConfig } from '../config/STATIC.config.ts'
import Response from "../config/responseManage.conf.ts";
import type { ResponseFile } from '../types/Upload.d.ts'

/**
 * 获取路径的最后 N 个部分
 * @param filePath 完整路径
 * @param count 要获取的部分数量，默认为4
 * @param separator 路径分隔符，默认自动检测
 */
export function getLastPathParts(
  filePath: string,
  count: number = 4,
  separator?: string
): string {
  // 确定分隔符
  const sep = separator || (filePath.includes('\\') ? '\\' : '/');

  // 分割路径
  const parts = filePath.split(sep).filter(part => part.trim() !== '');

  // 获取最后 count 个部分
  if (parts.length <= count) {
    return parts.join('/');
  }

  return parts.slice(-count).join('/');
}
//处理文件上传后的返回路径
const handlerStaticFile = (ctx: RouterContext) => {
  try {
    const { file } = ctx.request.files;   // 获取上传文件
    if (file instanceof Array) {
      let data: ResponseFile[] = []
      file.map(item => {
        const filepath = getLastPathParts(item.filepath)
        data.push({ fileUrl: filepath })
      })
      return ctx.body = Response(data, '上传成功', 200);
    } else {
      const filepath = getLastPathParts(file.filepath)// 获取上传文件扩展名
      return ctx.body = Response({ fileUrl: filepath }, '上传成功', 200);
    }
  } catch (error) {
    return ctx.body = Response(null, `${error}`, 500);
  }

}
/**
 * 静态资源路由
 *
 * @type {*}
 */
const staticRouter = new Router({
  prefix: "/api/upload",
});
staticRouter.use(koaBody(uploadConfig))

staticRouter.post("/images/avatar", handlerStaticFile);
export default staticRouter;
