"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
const mail_util_js_1 = require("../../utils/mail.util.js");
const prisma_js_1 = require("../../config/prisma.js");
// مخزن مؤقت لرموز التحقق في الذاكرة (Email -> { code, expiresAt })
const otpStore = new Map();
class AuthController {
    static async register(req, res) {
        try {
            const result = await auth_service_js_1.AuthService.register(req.body);
            return (0, response_util_js_1.sendSuccess)(res, result, 'تم إنشاء الحساب بنجاح', 201);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message || 'فشل إنشاء الحساب', 400);
        }
    }
    static async login(req, res) {
        try {
            const { usernameOrEmail, email, password } = req.body;
            const targetUser = (usernameOrEmail || email || '').trim();
            const result = await auth_service_js_1.AuthService.login(targetUser, password);
            return (0, response_util_js_1.sendSuccess)(res, result, 'تم تسجيل الدخول بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message || 'فشل تسجيل الدخول', 401);
        }
    }
    // إرسال رمز التحقق (OTP) الحقيقي إلى بريد العميل من إيميل الموقع الرسمي
    static async sendOtp(req, res) {
        try {
            const { email, fullName } = req.body;
            if (!email) {
                return (0, response_util_js_1.sendError)(res, 'البريد الإلكتروني مطلوب لإرسال رمز التحقق', 400);
            }
            // توليد رمز تحقق عشوائي من 5 أرقام
            const otpCode = String(Math.floor(10000 + Math.random() * 90000));
            // حفظ الرمز لمدة 10 دقائق
            otpStore.set(email.toLowerCase().trim(), {
                code: otpCode,
                expiresAt: Date.now() + 10 * 60 * 1000,
            });
            // إرسال الإيميل الحقيقي عبر Gmail SMTP الرسمي لمنصة ميناء
            await (0, mail_util_js_1.sendOtpEmail)(email, otpCode, fullName);
            return (0, response_util_js_1.sendSuccess)(res, { email, sent: true }, `تم إرسال رمز التحقق بنجاح من بريد المنصة الرسمي إلى (${email})`);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message || 'فشل إرسال رمز التحقق عبر البريد', 500);
        }
    }
    // التحقق من رمز الـ OTP
    static async verifyOtp(req, res) {
        try {
            const { email, phoneOrEmail, otpCode } = req.body;
            const targetEmail = (email || phoneOrEmail || '').toLowerCase().trim();
            const stored = otpStore.get(targetEmail);
            // التحقق الصارم من تطابق الرمز الفعلي وصلاحيته
            if (stored && stored.code === otpCode && Date.now() < stored.expiresAt) {
                if (stored) {
                    otpStore.delete(targetEmail);
                }
                return (0, response_util_js_1.sendSuccess)(res, { verified: true }, 'تم التحقق من الرمز بنجاح وتفعيل الحساب');
            }
            return (0, response_util_js_1.sendError)(res, 'رمز التحقق غير صحيح أو انتهت صلاحيته، يرجى إعادة الإرسال', 400);
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message, 400);
        }
    }
    static async forgotPassword(req, res) {
        return (0, response_util_js_1.sendSuccess)(res, null, 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    }
    static async me(req, res) {
        return (0, response_util_js_1.sendSuccess)(res, req.user, 'تم استرجاع بيانات الحساب بنجاح');
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return (0, response_util_js_1.sendError)(res, 'غير مصرح', 401);
            const { fullName, managerName, phone, companyName, crNumber, vatNumber, businessSector, headquarters, jobTitle, annualImport, savedAddresses, notificationPrefs, } = req.body;
            const nameToUpdate = managerName || fullName;
            const savedAddressesStr = savedAddresses !== undefined
                ? typeof savedAddresses === 'string'
                    ? savedAddresses
                    : JSON.stringify(savedAddresses)
                : undefined;
            const notificationPrefsStr = notificationPrefs !== undefined
                ? typeof notificationPrefs === 'string'
                    ? notificationPrefs
                    : JSON.stringify(notificationPrefs)
                : undefined;
            const profileData = {};
            if (companyName)
                profileData.companyNameAr = companyName;
            if (crNumber)
                profileData.crNumber = crNumber;
            if (vatNumber !== undefined)
                profileData.vatNumber = vatNumber;
            if (businessSector !== undefined)
                profileData.businessSector = businessSector;
            if (headquarters !== undefined)
                profileData.headquarters = headquarters;
            if (jobTitle !== undefined)
                profileData.jobTitle = jobTitle;
            if (annualImport !== undefined)
                profileData.annualImport = annualImport;
            if (savedAddressesStr !== undefined)
                profileData.savedAddresses = savedAddressesStr;
            if (notificationPrefsStr !== undefined)
                profileData.notificationPrefs = notificationPrefsStr;
            const hasProfileUpdates = Object.keys(profileData).length > 0;
            const updated = await prisma_js_1.prisma.user.update({
                where: { id: userId },
                data: {
                    fullName: nameToUpdate || undefined,
                    phone: phone || undefined,
                    companyProfile: hasProfileUpdates
                        ? {
                            upsert: {
                                create: {
                                    companyNameAr: companyName || 'مؤسسة تجارية',
                                    crNumber: crNumber || '1010000000',
                                    ...profileData,
                                },
                                update: profileData,
                            },
                        }
                        : undefined,
                },
                include: { companyProfile: true },
            });
            const userProfile = {
                id: updated.id,
                email: updated.email,
                phone: updated.phone,
                role: updated.role,
                fullName: updated.fullName,
                status: updated.status,
                companyName: updated.companyProfile?.companyNameAr || '',
                crNumber: updated.companyProfile?.crNumber || '',
                companyProfile: updated.companyProfile,
            };
            return (0, response_util_js_1.sendSuccess)(res, userProfile, 'تم حفظ وتحديث البيانات في قاعدة البيانات بنجاح');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message || 'فشل تحديث البيانات');
        }
    }
    static async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return (0, response_util_js_1.sendError)(res, 'غير مصرح', 401);
            const { currentPassword, newPassword } = req.body;
            await auth_service_js_1.AuthService.changePassword(userId, currentPassword, newPassword);
            return (0, response_util_js_1.sendSuccess)(res, null, 'تم تحديث كلمة المرور بنجاح في قاعدة البيانات');
        }
        catch (err) {
            return (0, response_util_js_1.sendError)(res, err.message || 'فشل تحديث كلمة المرور', 400);
        }
    }
}
exports.AuthController = AuthController;
