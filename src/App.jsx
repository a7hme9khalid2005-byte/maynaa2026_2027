import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ServiceModalProvider } from './context/ServiceModalContext'
import { LegalModalProvider } from './context/LegalModalContext'
import HomePage from './pages/public/HomePage'
import ServicesPage from './pages/public/ServicesPage'
import PricingPage from './pages/public/PricingPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import OtpVerificationPage from './pages/auth/OtpVerificationPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsAndConditionsPage from './pages/public/TermsAndConditionsPage'
import HelpCenterPage from './pages/public/HelpCenterPage'
import Dashboard from './pages/dashboard/provider/Dashboard'
import ShipmentsPage from './pages/dashboard/provider/ShipmentsPage'
import RFQPage from './pages/dashboard/provider/RFQPage'
import PaymentsPage from './pages/dashboard/provider/PaymentsPage'
import DocumentsPage from './pages/dashboard/provider/DocumentsPage'
import ReviewsPage from './pages/dashboard/provider/ReviewsPage'
import SettingsPage from './pages/dashboard/provider/SettingsPage'
import WhyMeynaaPage from './pages/public/WhyMeynaaPage'

// Importer Pages (لوحة تحكم المستورد)
import ImporterDashboard from './pages/dashboard/importer/ImporterDashboard'
import ImporterShipmentsPage from './pages/dashboard/importer/ImporterShipmentsPage'
import ImporterRFQPage from './pages/dashboard/importer/ImporterRFQPage'
import ImporterDocumentsPage from './pages/dashboard/importer/ImporterDocumentsPage'
import ImporterPaymentsPage from './pages/dashboard/importer/ImporterPaymentsPage'
import ImporterSettingsPage from './pages/dashboard/importer/ImporterSettingsPage'

// Super Admin Dashboard (لوحة تحكم الإدارة العامة)
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import AdminUsersPage from './pages/dashboard/admin/AdminUsersPage'
import AdminFleetPage from './pages/dashboard/admin/AdminFleetPage'
import AdminShipmentsPage from './pages/dashboard/admin/AdminShipmentsPage'
import AdminFinancePage from './pages/dashboard/admin/AdminFinancePage'
import AdminSupportPage from './pages/dashboard/admin/AdminSupportPage'
import AdminSettingsPage from './pages/dashboard/admin/AdminSettingsPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ServiceModalProvider>
            <LegalModalProvider>
            <div className="font-almarai" dir="rtl">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/why-meynaa" element={<WhyMeynaaPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsAndConditionsPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
          
          {/* Auth Pages matching XD exactly */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/verify" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Service Provider Dashboard Pages (لوحة تحكم مزود الخدمة) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/shipments" element={<ShipmentsPage />} />
          <Route path="/dashboard/rfq" element={<RFQPage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          <Route path="/dashboard/documents" element={<DocumentsPage />} />
          <Route path="/dashboard/reviews" element={<ReviewsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* Importer Dashboard Pages (لوحة تحكم المستورد) */}
          <Route path="/importer" element={<ImporterDashboard />} />
          <Route path="/importer/dashboard" element={<ImporterDashboard />} />
          <Route path="/importer/shipments" element={<ImporterShipmentsPage />} />
          <Route path="/importer/rfq" element={<ImporterRFQPage />} />
          <Route path="/importer/documents" element={<ImporterDocumentsPage />} />
          <Route path="/importer/payments" element={<ImporterPaymentsPage />} />
          <Route path="/importer/settings" element={<ImporterSettingsPage />} />

          {/* Super Admin Dashboard Pages (لوحة تحكم الإدارة العامة) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/fleet" element={<AdminFleetPage />} />
          <Route path="/admin/shipments" element={<AdminShipmentsPage />} />
          <Route path="/admin/trucks" element={<AdminShipmentsPage />} />
          <Route path="/admin/finance" element={<AdminFinancePage />} />
          <Route path="/admin/financial" element={<AdminFinancePage />} />
          <Route path="/admin/support" element={<AdminSupportPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/settings/privacy" element={<AdminSettingsPage />} />
          <Route path="/admin/settings/faqs" element={<AdminSettingsPage />} />
          <Route path="/admin/settings/terms" element={<AdminSettingsPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      </LegalModalProvider>
      </ServiceModalProvider>
    </NotificationProvider>
    </AuthProvider>
  </Router>
)
}

export default App
