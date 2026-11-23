import { z } from 'zod'

export const RegisterSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يحتوي على 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(9, 'رقم الجوال غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  role: z.enum(['IMPORTER', 'PROVIDER', 'DRIVER']).default('IMPORTER'),
  companyName: z.string().optional(),
  crNumber: z.string().optional(),
})

export const LoginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني'),
  password: z.string().min(1, 'يرجى إدخال كلمة المرور'),
})

export const VerifyOtpSchema = z.object({
  email: z.string().optional(),
  phoneOrEmail: z.string().optional(),
  otpCode: z.string().min(4).max(6, 'رمز التحقق غير صحيح'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صالح'),
})
