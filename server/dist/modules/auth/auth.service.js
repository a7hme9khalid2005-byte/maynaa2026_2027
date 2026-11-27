"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../../config/prisma.js");
const env_js_1 = require("../../config/env.js");
class AuthService {
    static async register(data) {
        const existing = await prisma_js_1.prisma.user.findFirst({
            where: {
                OR: [{ email: data.email.toLowerCase() }, { phone: data.phone }],
            },
        });
        if (existing) {
            // إذا كان المستخدم موجوداً مسبقاً، نقوم بتحديث بياناته وتسجيل دخوله مباشرة لضمان عدم تعطل تجربته
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = data.password ? await bcryptjs_1.default.hash(data.password, salt) : existing.passwordHash;
            const updatedUser = await prisma_js_1.prisma.user.update({
                where: { id: existing.id },
                data: {
                    fullName: data.fullName || existing.fullName,
                    phone: data.phone || existing.phone,
                    passwordHash,
                    role: data.role || existing.role,
                    status: 'ACTIVE',
                    companyProfile: data.companyName
                        ? {
                            upsert: {
                                create: {
                                    companyNameAr: data.companyName,
                                    crNumber: data.crNumber || '1010000000',
                                },
                                update: {
                                    companyNameAr: data.companyName,
                                    crNumber: data.crNumber || '1010000000',
                                },
                            },
                        }
                        : undefined,
                },
                include: {
                    companyProfile: true,
                },
            });
            const token = this.generateToken(updatedUser);
            return { user: updatedUser, token };
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        const user = await prisma_js_1.prisma.user.create({
            data: {
                fullName: data.fullName,
                email: data.email.toLowerCase(),
                phone: data.phone,
                passwordHash,
                role: data.role,
                status: 'ACTIVE',
                companyProfile: data.companyName
                    ? {
                        create: {
                            companyNameAr: data.companyName,
                            crNumber: data.crNumber || '1010000000',
                        },
                    }
                    : undefined,
            },
            include: {
                companyProfile: true,
            },
        });
        const token = this.generateToken(user);
        return { user, token };
    }
    static async login(usernameOrEmail, password) {
        const term = usernameOrEmail.trim().toLowerCase();
        // فحص المستخدم بالبريد أو رقم الهاتف أو الاسم
        const user = await prisma_js_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email: term },
                    { phone: term },
                    { fullName: { contains: term } },
                ],
            },
            include: {
                companyProfile: true,
            },
        });
        if (!user) {
            throw new Error('بيانات الدخول غير صحيحة، يرجى التأكد من البيانات');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('كلمة المرور غير صحيحة');
        }
        if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
            throw new Error('هذا الحساب موقوف، يرجى التواصل مع الدعم الفني');
        }
        const token = this.generateToken(user);
        return { user, token };
    }
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
        return {
            accessToken: jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_ACCESS_SECRET, {
                expiresIn: env_js_1.ENV.JWT_ACCESS_EXPIRY,
            }),
            refreshToken: jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_REFRESH_SECRET, {
                expiresIn: env_js_1.ENV.JWT_REFRESH_EXPIRY,
            }),
        };
    }
}
exports.AuthService = AuthService;
