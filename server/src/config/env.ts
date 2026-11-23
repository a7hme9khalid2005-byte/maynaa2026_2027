import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'meynaa_access_secret_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'meynaa_refresh_secret_2026',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '1d',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  PLATFORM_COMPANY_NAME: process.env.PLATFORM_COMPANY_NAME || 'شركة ميناء للخدمات اللوجستية المحدودة',
  PLATFORM_VAT_NUMBER: process.env.PLATFORM_VAT_NUMBER || '310245678900003',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || 'maynaa26.27logistics@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'uwwklbhfnglwxjar',
}
