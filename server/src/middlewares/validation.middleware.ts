import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { sendError } from '../utils/response.util.js'

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        return sendError(res, 'خطأ في التحقق من صحة البيانات المدخلة', 422, formattedErrors)
      }
      return sendError(res, 'خطأ في معالجة المدخلات', 400)
    }
  }
}
