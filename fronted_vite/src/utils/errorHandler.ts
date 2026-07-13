import { ElNotification } from "element-plus";

/**
 * @description 全局代码错误捕捉
 * */
const errorHandler = (error: unknown) => {
  // 过滤 HTTP 请求错误
  if (typeof error === "object" && error !== null && "status" in error) return false;
  const errorMap: { [key: string]: string } = {
    InternalError: "Javascript引擎内部错误",
    ReferenceError: "未找到对象",
    TypeError: "使用了错误的类型或对象",
    RangeError: "使用内置对象时，参数超范围",
    SyntaxError: "语法错误",
    EvalError: "错误的使用了Eval",
    URIError: "URI错误"
  };
  const errorName = error instanceof Error ? errorMap[error.name] || "未知错误" : "未知错误";
  ElNotification({
    title: errorName,
    message: error instanceof Error ? error.message : String(error),
    type: "error",
    duration: 3000
  });
};

export default errorHandler;
