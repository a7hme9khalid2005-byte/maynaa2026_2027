"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordSchema = exports.VerifyOtpSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3, 'الاسم يجب أن يحتوي على 3 أحرف على الأقل'),
    email: zod_1.z.string().email('البريد الإلكتروني غير صحيح'),
    phone: zod_1.z.string().min(9, 'رقم الجوال غير صحيح'),
    password: zod_1.z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
    role: zod_1.z.enum(['IMPORTER', 'PROVIDER', 'DRIVER']).default('IMPORTER'),
    companyName: zod_1.z.string().optional(),
    crNumber: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    usernameOrEmail: zod_1.z.string().min(1, 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني'),
    password: zod_1.z.string().min(1, 'يرجى إدخال كلمة المرور'),
});
exports.VerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().optional(),
    phoneOrEmail: zod_1.z.string().optional(),
    otpCode: zod_1.z.string().min(4).max(6, 'رمز التحقق غير صحيح'),
});
exports.ForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('يرجى إدخال بريد إلكتروني صالح'),
});
