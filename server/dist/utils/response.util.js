"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'تمت العملية بنجاح', statusCode = 200, meta) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
    });
}
function sendError(res, message = 'حدث خطأ أثناء معالجة الطلب', statusCode = 400, errors) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
}
