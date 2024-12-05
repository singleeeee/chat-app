/**
 * 统一响应处理工具
 * @param {number} code - HTTP状态码
 * @param {any} data - 响应数据
 * @param {string} message - 响应消息
 * @param {boolean} success - 是否成功
 */
export const createResponse = (code = 200, data = null, message = '', success = true) => {
  return {
    code,
    data,
    message,
    success: success
  }
}

/**
 * 成功响应
 * @param {any} data - 响应数据
 * @param {string} message - 响应消息
 */
export const successResponse = (data = null, message = '操作成功') => {
  return createResponse(200, data, message, true)
}

/**
 * 错误响应
 * @param {number} code - HTTP状态码
 * @param {string} message - 错误消息
 */
export const errorResponse = (code = 500, message = '服务器内部错误') => {
  return createResponse(code, null, message, false)
} 