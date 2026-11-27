import { Router } from 'express'
import { AuthController } from './auth.controller.js'
import { validate } from '../../middlewares/validation.middleware.js'
import {
  RegisterSchema,
  LoginSchema,
  VerifyOtpSchema,
  ForgotPasswordSchema,
} from './auth.validation.js'
import { authenticate } from '../../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', validate(RegisterSchema), AuthController.register)
router.post('/login', validate(LoginSchema), AuthController.login)
router.post('/send-otp', AuthController.sendOtp)
router.post('/verify-otp', validate(VerifyOtpSchema), AuthController.verifyOtp)
router.post('/forgot-password', validate(ForgotPasswordSchema), AuthController.forgotPassword)
router.get('/me', authenticate, AuthController.me)
router.get('/profile', authenticate, AuthController.me)
router.put('/profile', authenticate, AuthController.updateProfile)
router.put('/me', authenticate, AuthController.updateProfile)

export default router
