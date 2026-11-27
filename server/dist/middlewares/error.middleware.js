"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_util_js_1 = require("../utils/logger.util.js");
const response_util_js_1 = require("../utils/response.util.js");
function errorHandler(err, _req, res, _next) {
    logger_util_js_1.logger.error('Unhandled Server Error:', err);
    if (err instanceof Error && err.name === 'MulterError') {
        return (0, response_util_js_1.sendError)(res, `خطأ في رفع الملف: ${err.message}`, 400);
    }
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'حدث خطأ داخلي في الخادم';
    return (0, response_util_js_1.sendError)(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}
