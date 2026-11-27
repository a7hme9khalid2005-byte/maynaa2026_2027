"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const response_util_js_1 = require("../utils/response.util.js");
function validate(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return (0, response_util_js_1.sendError)(res, 'خطأ في التحقق من صحة البيانات المدخلة', 422, formattedErrors);
            }
            return (0, response_util_js_1.sendError)(res, 'خطأ في معالجة المدخلات', 400);
        }
    };
}
