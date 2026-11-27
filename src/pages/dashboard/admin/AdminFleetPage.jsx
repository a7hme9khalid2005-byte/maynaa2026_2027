import { useState, useRef, useEffect } from 'react'
import AdminSidebar from '../../../components/dashboard/AdminSidebar'
import AdminHeader from '../../../components/dashboard/AdminHeader'
import RealFleetMap from '../../../components/dashboard/RealFleetMap'
import { useAuth } from '../../../context/AuthContext'
import authService from '../../../services/authService'
import api from '../../../services/api'
import {
  Truck,
  ShieldCheck,
  Hourglass,
  AlertTriangle,
  Thermometer,
  MapPin,
  ChevronLeft,
  Bell,
  X,
  Search,
  CheckCircle2,
  Phone,
  Check
} from 'lucide-react'

// Mock Fleet List matching screenshot 1:1
const initialFleet = [
  {
    id: 'SHN-2026-884',
    truckId: 'TRK-104',
    status: 'متحركة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    city: 'جدة',
    speed: 85,
    time: '12:46 PM',
    driver: 'محمد وليد',
    driverPhone: '+966 50 847 2291',
    route: 'ميناء جدة ➔ الرياض',
    coords: { x: 195, y: 350 },
    hasAlert: true,
    alertType: 'temp'
  },
  {
    id: 'SHN-2026-966',
    truckId: 'TRK-315',
    status: 'بانتظار التفتيش الجمركي',
    statusBg: '#FFF7ED',
    statusColor: '#FB8731',
    city: 'دبي',
    speed: 0,
    time: '12:35 PM',
    driver: 'سامي المنصوري',
    driverPhone: '+971 50 994 3821',
    route: 'ميناء جبل علي ➔ منفذ البطحاء',
    coords: { x: 530, y: 320 },
    hasAlert: false
  },
  {
    id: 'SHN-2026-756',
    truckId: 'TRK-208',
    status: 'استراحة نظامية',
    statusBg: '#E0F2FE',
    statusColor: '#0284C7',
    city: 'مكة',
    speed: 0,
    time: '12:30 PM',
    driver: 'أحمد فهد العتيبي',
    driverPhone: '+966 55 120 4930',
    route: 'ميناء جدة الإسلامي ➔ مكة المكرمة',
    coords: { x: 230, y: 360 },
    hasAlert: false
  },
  {
    id: 'SHN-2026-825',
    truckId: 'TRK-519',
    status: 'معطلة',
    statusBg: '#FEE2E2',
    statusColor: '#DC2626',
    city: 'الرياض',
    speed: 0,
    time: '12:20 PM',
    driver: 'سلطان الحربي',
    driverPhone: '+966 56 771 0029',
    route: 'الميناء الجاف بالرياض ➔ وادي الدواسر',
    coords: { x: 300, y: 400 },
    hasAlert: true,
    alertType: 'breakdown'
  },
  {
    id: 'SHN-2026-912',
    truckId: 'TRK-220',
    status: 'استراحة نظامية',
    statusBg: '#E0F2FE',
    statusColor: '#0284C7',
    city: 'الدمام',
    speed: 0,
    time: '12:15 PM',
    driver: 'علي السعيد',
    driverPhone: '+966 54 987 6543',
    route: 'جبل علي ➔ الرياض',
    coords: { x: 490, y: 280 },
    hasAlert: false
  },
  {
    id: 'SHN-2026-867',
    truckId: 'TRK-408',
    status: 'معطلة',
    statusBg: '#FEE2E2',
    statusColor: '#DC2626',
    city: 'المدينة المنورة',
    speed: 0,
    time: '11:50 AM',
    driver: 'سالم حسن',
    driverPhone: '+966 56 345 6789',
    route: 'ميلانو ➔ الدمام',
    coords: { x: 200, y: 260 },
    hasAlert: true,
    alertType: 'breakdown'
  },
  {
    id: 'SHN-2026-901',
    truckId: 'TRK-198',
    status: 'متحركة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    city: 'الجبيل',
    speed: 78,
    time: '11:35 AM',
    driver: 'ناصر الحربي',
    driverPhone: '+966 53 234 5678',
    route: 'شنغهاي ➔ أبو ظبي',
    coords: { x: 480, y: 240 },
    hasAlert: false
  },
  {
    id: 'SHN-2026-903',
    truckId: 'TRK-614',
    status: 'استراحة نظامية',
    statusBg: '#E0F2FE',
    statusColor: '#0284C7',
    city: 'الغويفات',
    speed: 0,
    time: '11:20 AM',
    driver: 'فهد العتيبي',
    driverPhone: '+966 58 765 4321',
    route: 'الرياض ➔ دبي',
    coords: { x: 510, y: 340 },
    hasAlert: false
  },
  {
    id: 'SHN-2026-812',
    truckId: 'TRK-702',
    status: 'متحركة',
    statusBg: '#E6F9F0',
    statusColor: '#009F65',
    city: 'البطحاء',
    speed: 82,
    time: '11:05 AM',
    driver: 'خالد الشمري',
    driverPhone: '+966 50 333 4444',
    route: 'عمان ➔ دبي',
    coords: { x: 470, y: 360 },
    hasAlert: false
  },
  {
    id: 'SHN-2026-902',
    truckId: 'TRK-902',
    status: 'معطلة',
    statusBg: '#FEE2E2',
    statusColor: '#DC2626',
    city: 'الرياض - جدة',
    speed: 0,
    time: '12:50 PM',
    driver: 'سلطان الحربي',
    driverPhone: '+966 56 771 0029',
    route: 'الرياض ➔ جدة',
    coords: { x: 260, y: 380 },
    hasAlert: true,
    alertType: 'route'
  },
  {
    id: 'SHN-2026-750',
    truckId: 'TRK-750',
    status: 'معطلة',
    statusBg: '#FEE2E2',
    statusColor: '#DC2626',
    city: 'الدمام - الرياض',
    speed: 0,
    time: '12:40 PM',
    driver: 'سالم حسن',
    driverPhone: '+966 56 345 6789',
    route: 'الدمام ➔ الرياض',
    coords: { x: 420, y: 300 },
    hasAlert: true,
    alertType: 'route'
  }
]

// Real-time Emergency Alerts matching screenshot 1:1 + Extended Fleet Alerts
const FULL_EMERGENCY_ALERTS = [
  {
    id: 1,
    truckIdRef: 'SHN-2026-902',
    type: 'route',
    typeTitle: 'تنبيه خروج عن المسار المخصص',
    shipment: 'شاحنة رقم: SHN-2026-902',
    truckNumber: 'TRK-902',
    location: 'الرياض - جدة',
    time: 'منذ 3 دقائق',
    severity: 'critical',
    severityLabel: 'حرج جداً',
    status: 'active',
    bg: '#FFF1F2',
    border: '#FDA4AF',
    textColor: '#DC2626',
    driver: 'سلطان الحربي',
    driverPhone: '+966 56 771 0029',
    description: 'انحرفت الشاحنة عن المسار المعتمد على طريق الرياض - الطائف بمقدار 14 كم دون إشعار مسبق من السائق.'
  },
  {
    id: 2,
    truckIdRef: 'SHN-2026-884',
    type: 'temp',
    typeTitle: 'ارتفاع حرارة الشاحنة',
    shipment: 'شاحنة رقم: SHN-2026-884',
    truckNumber: 'TRK-104',
    location: 'درجة الحرارة 76°C (تجاوز الحد المسموح)',
    time: 'منذ 7 دقائق',
    severity: 'warning',
    severityLabel: 'تحذير حرارة',
    status: 'active',
    bg: '#FFFBEB',
    border: '#FDE68A',
    textColor: '#D97706',
    driver: 'محمد وليد',
    driverPhone: '+966 50 847 2291',
    description: 'سجلت مجسات التبريد في الحاوية ارتفاعاً غير طبيعي في درجات الحرارة يهدد سلامة البضائع المبردة الحساسة.'
  },
  {
    id: 3,
    truckIdRef: 'SHN-2026-750',
    type: 'route',
    typeTitle: 'تنبيه خروج عن المسار المخصص',
    shipment: 'شاحنة رقم: SHN-2026-750',
    truckNumber: 'TRK-750',
    location: 'الدمام - الرياض',
    time: 'منذ 10 دقائق',
    severity: 'critical',
    severityLabel: 'حرج',
    status: 'active',
    bg: '#FFF1F2',
    border: '#FDA4AF',
    textColor: '#DC2626',
    driver: 'سالم حسن',
    driverPhone: '+966 56 345 6789',
    description: 'توقف مفاجئ وتغيير مسار قرب محطة الوزن على طريق الدمام السريع خارج النطاق المحدد.'
  },
  {
    id: 4,
    truckIdRef: 'SHN-2026-966',
    type: 'customs',
    typeTitle: 'تأخير في التفتيش الجمركي',
    shipment: 'شاحنة رقم: SHN-2026-966',
    truckNumber: 'TRK-315',
    location: 'دبي - منفذ البطحاء الجمركي',
    time: 'منذ 25 دقيقة',
    severity: 'warning',
    severityLabel: 'تأخير جمركي',
    status: 'active',
    bg: '#FFF7ED',
    border: '#FDBA74',
    textColor: '#EA580C',
    driver: 'سامي المنصوري',
    driverPhone: '+971 50 994 3821',
    description: 'تأخرت إجراءات المطابقة الجمركية في ساحة التفتيش رقم 4 عن الوقت القياسي المحدد بـ 45 دقيقة.'
  },
  {
    id: 5,
    truckIdRef: 'SHN-2026-812',
    type: 'speed',
    typeTitle: 'تجاوز السرعة المحددة (105 كم/س)',
    shipment: 'شاحنة رقم: SHN-2026-812',
    truckNumber: 'TRK-702',
    location: 'طريق حرض - البطحاء',
    time: 'منذ 40 دقيقة',
    severity: 'warning',
    severityLabel: 'سرعة زائدة',
    status: 'resolved',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    textColor: '#16A34A',
    driver: 'خالد الشمري',
    driverPhone: '+966 50 333 4444',
    description: 'تم إرسال إشعار فوري للسائق والتحقق من عودته للسرعة القانونية المحددة للشاحنات.'
  },
  {
    id: 6,
    truckIdRef: 'SHN-2026-756',
    type: 'rest',
    typeTitle: 'تجاوز ساعات القيادة المتواصلة',
    shipment: 'شاحنة رقم: SHN-2026-756',
    truckNumber: 'TRK-208',
    location: 'مكة المكرمة - طريق الحرمين',
    time: 'منذ ساعة',
    severity: 'info',
    severityLabel: 'استراحة نظامية',
    status: 'resolved',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    textColor: '#0284C7',
    driver: 'أحمد فهد العتيبي',
    driverPhone: '+966 55 120 4930',
    description: 'توجيه السائق إلى أقرب محطة استراحة نظامية معتمدة وفق لائحة الهيئة العامة للنقل.'
  },
  {
    id: 7,
    truckIdRef: 'SHN-2026-901',
    type: 'maintenance',
    typeTitle: 'انخفاض ضغط إطارات المحور الخلفي',
    shipment: 'شاحنة رقم: SHN-2026-901',
    truckNumber: 'TRK-198',
    location: 'الجبيل الصناعية - طريق الملك فهد',
    time: 'منذ ساعتين',
    severity: 'info',
    severityLabel: 'صيانة وقائية',
    status: 'resolved',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    textColor: '#16A34A',
    driver: 'ناصر الحربي',
    driverPhone: '+966 53 234 5678',
    description: 'تمت معالجة ضغط الهواء في مركز الصيانة المعتمد على الطريق واستئناف الرحلة بسلام.'
  }
]

export default function AdminFleetPage() {
  const { user: authUser } = useAuth() || {}
  const currentUser = authUser || authService.getCurrentUser()
  const isDemoAdmin = currentUser?.email === 'admin@meynaa.com'

  const [fleetList, setFleetList] = useState(() => (isDemoAdmin ? initialFleet : []))
  const [selectedTruck, setSelectedTruck] = useState(() => (isDemoAdmin ? initialFleet[0] : null))
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'متحركة' | 'بانتظار التفتيش الجمركي' | 'استراحة نظامية' | 'معطلة'
  const [searchTerm, setSearchTerm] = useState('')
  const mapSectionRef = useRef(null)

  // قراءة شاحنات الأسطول الحية من قاعدة بيانات Supabase
  useEffect(() => {
    api.get('/fleet/trucks')
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const mapped = res.data.map((t) => ({
            id: t.fleetCode || t.id,
            truckId: t.fleetCode || 'TRK-100',
            plateNumber: t.plateNumber || '1234 ABC',
            driver: t.driver?.fullName || 'سائق معتمد',
            city: t.currentCity || 'الرياض',
            status: t.status === 'ON_DUTY' ? 'متحركة' : t.status === 'REST' ? 'استراحة نظامية' : 'بانتظار التفتيش الجمركي',
            statusBg: '#E8FAF0',
            statusColor: '#009F65',
            lat: t.lastLatitude || 24.7136,
            lng: t.lastLongitude || 46.6753,
            speed: t.lastSpeed ? `${t.lastSpeed} كم/س` : '80 كم/س',
            temp: t.lastTemperature ? `${t.lastTemperature}°C` : '-18°C',
          }))
          setFleetList(mapped)
          setSelectedTruck((prev) => prev || mapped[0])
        }
      })
      .catch(() => {})
  }, [isDemoAdmin])

  // Emergency Alerts Management State
  const [alerts, setAlerts] = useState(FULL_EMERGENCY_ALERTS)
  const [showAlertsModal, setShowAlertsModal] = useState(false)
  const [alertsFilter, setAlertsFilter] = useState('all') // 'all' | 'active' | 'route' | 'temp' | 'resolved'
  const [alertsSearch, setAlertsSearch] = useState('')

  const activeAlerts = alerts.filter((a) => a.status === 'active')
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved')

  const toggleResolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === 'active' ? 'resolved' : 'active',
              severity: a.status === 'active' ? 'resolved' : 'warning',
              severityLabel: a.status === 'active' ? 'تم الحل' : 'تحذير نشط',
              bg: a.status === 'active' ? '#F0FDF4' : '#FFFBEB',
              border: a.status === 'active' ? '#BBF7D0' : '#FDE68A',
              textColor: a.status === 'active' ? '#16A34A' : '#D97706'
            }
          : a
      )
    )
    // حفظ حل التنبيه تلقائياً في قاعدة البيانات
    api.patch(`/fleet/alerts/${id}/resolve`).catch(() => {})
  }

  const markAllAlertsResolved = () => {
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'resolved',
        severity: 'resolved',
        severityLabel: 'تم الحل',
        bg: '#F0FDF4',
        border: '#BBF7D0',
        textColor: '#16A34A'
      }))
    )
    alerts.forEach((a) => {
      if (a.status === 'active') {
        api.patch(`/fleet/alerts/${a.id}/resolve`).catch(() => {})
      }
    })
  }

  // Scroll to map and trigger focus on target truck
  const handleViewOnMap = (truckOrId) => {
    const target =
      typeof truckOrId === 'string'
        ? fleetList.find((f) => f.id === truckOrId || f.truckId === truckOrId)
        : truckOrId

    if (target) {
      setSelectedTruck(target)
      setShowAlertsModal(false) // Smoothly close modal so map is visible
      if (mapSectionRef.current) {
        mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  // Filtered alerts for the modal view
  const modalFilteredAlerts = alerts.filter((alert) => {
    if (alertsFilter === 'active' && alert.status !== 'active') return false
    if (alertsFilter === 'resolved' && alert.status !== 'resolved') return false
    if (alertsFilter === 'route' && alert.type !== 'route') return false
    if (alertsFilter === 'temp' && alert.type !== 'temp') return false

    if (alertsSearch.trim()) {
      const q = alertsSearch.toLowerCase()
      const matchShipment = alert.shipment?.toLowerCase().includes(q)
      const matchTruck = alert.truckNumber?.toLowerCase().includes(q)
      const matchLocation = alert.location?.toLowerCase().includes(q)
      const matchDriver = alert.driver?.toLowerCase().includes(q)
      const matchTitle = alert.typeTitle?.toLowerCase().includes(q)
      const matchDesc = alert.description?.toLowerCase().includes(q)
      return matchShipment || matchTruck || matchLocation || matchDriver || matchTitle || matchDesc
    }

    return true
  })

  // Filter trucks on map and in table
  const visibleTrucks = fleetList.filter((t) => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchSearch = searchTerm === '' || t.id.includes(searchTerm) || t.city.includes(searchTerm) || t.driver.includes(searchTerm)
    return matchStatus && matchSearch
  })

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] relative overflow-hidden font-almarai" dir="rtl">
      {/* Right Fixed Admin Sidebar */}
      <AdminSidebar activePath="/admin/fleet" />

      {/* Main Content Area */}
      <main className="flex-1 mr-[280px] flex flex-col min-h-screen select-none overflow-x-hidden">
        
        {/* Top Header Bar pinned edge-to-edge */}
        <AdminHeader searchValue={searchTerm} onSearch={setSearchTerm} />

        {/* Inner Content Area */}
        <div className="p-6 lg:p-8 space-y-6">
          
          {/* Subheader: غرفة القيادة و التحكم بأسطول الشاحنات المباشر */}
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-black text-[#011222] tracking-tight">
              غرفة القيادة و التحكم بأسطول الشاحنات المباشر
            </h1>
          </div>

          {/* 1. TOP 4 METRIC CARDS ROW with Harmonious Translucent Tinted Backgrounds */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Card 1 (Far Right in RTL): متحركة (Translucent Emerald Green Tint) */}
            <div className="bg-[#ECFDF5]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#A7F3D0]/70 hover:border-[#10B981]/50 shadow-[0_2px_12px_rgba(16,185,129,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#065F46] block mb-1">متحركة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {isDemoAdmin ? 248 : fleetList.filter((f) => f.status === 'متحركة').length}
                </div>
                <span className="text-xs font-bold text-[#009F65] font-mono block mt-2">
                  {isDemoAdmin ? '12%' : 'شاحنات نشطة'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#A7F3D0] text-[#009F65] flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 2 (2nd from Right): بانتظار التفتيش الجمركي (Translucent Meynaa Orange Tint) */}
            <div className="bg-[#FFF7ED]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FED7AA]/70 hover:border-[#FB8731]/50 shadow-[0_2px_12px_rgba(251,135,49,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#9A3412] block mb-1">بانتظار التفتيش الجمركي</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {isDemoAdmin ? 46 : fleetList.filter((f) => f.status === 'بانتظار التفتيش الجمركي').length}
                </div>
                <span className="text-xs font-bold text-[#009F65] font-mono block mt-2">
                  {isDemoAdmin ? '6%' : 'في المنافذ'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#FED7AA] text-[#FB8731] flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 3 (3rd from Right): شاحنات في استراحة نظامية (Translucent Sky Blue Tint) */}
            <div className="bg-[#F0F9FF]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#BAE6FD]/70 hover:border-[#0284C7]/50 shadow-[0_2px_12px_rgba(2,132,199,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#0369A1] block mb-1">شاحنات في استراحة نظامية</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {isDemoAdmin ? 72 : fleetList.filter((f) => f.status === 'استراحة نظامية').length}
                </div>
                <span className="text-xs font-bold text-[#009F65] font-mono block mt-2">
                  {isDemoAdmin ? '8%' : 'استراحة معتمدة'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
                <Hourglass className="w-6 h-6 stroke-[2]" />
              </div>
            </div>

            {/* Card 4 (Far Left in RTL): الشاحنات المعطلة (Translucent Rose Red Tint) */}
            <div className="bg-[#FFF1F2]/80 backdrop-blur-xs rounded-3xl p-5 border border-[#FECDD3]/70 hover:border-[#F43F5E]/50 shadow-[0_2px_12px_rgba(244,63,94,0.04)] hover:shadow-md transition-all flex items-center justify-between text-right">
              <div>
                <span className="text-xs font-bold text-[#9F1239] block mb-1">الشاحنات المعطلة</span>
                <div className="text-2xl sm:text-3xl font-black text-[#011222] font-mono leading-none">
                  {isDemoAdmin ? 18 : fleetList.filter((f) => f.status === 'معطلة').length}
                </div>
                <span className="text-xs font-bold text-[#DC2626] font-mono block mt-2">
                  {isDemoAdmin ? '5%' : 'تحت الصيانة'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#FECDD3] text-[#DC2626] flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
          </section>

          {/* 2. MIDDLE ROW: SATELLITE FLEET MAP ON LEFT + EMERGENCY ALERTS ON RIGHT */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* RIGHT COLUMN (in RTL): Emergency Alerts Panel matching screenshot */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3.5 text-right">
              
              {/* Header: التنبيهات المباشرة للطوارئ */}
              <div
                onClick={() => setShowAlertsModal(true)}
                className="flex items-center justify-between pb-3 border-b border-gray-100 cursor-pointer group"
                title="فتح مركز التنبيهات الشامل"
              >
                <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-black flex items-center justify-center font-mono animate-pulse shadow-xs">
                  {activeAlerts.length}
                </span>

                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-[#DC2626] group-hover:underline">
                    التنبيهات المباشرة للطوارئ
                  </h3>
                  <Bell className="w-4 h-4 text-[#DC2626]" />
                </div>
              </div>

              {/* Alerts List matching screenshot */}
              <div className="space-y-3">
                {activeAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      const match = fleetList.find((f) => f.id === alert.truckIdRef)
                      if (match) handleViewOnMap(match)
                    }}
                    className="p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 text-right cursor-pointer hover:shadow-md hover:scale-[1.01]"
                    style={{ backgroundColor: alert.bg, borderColor: alert.border }}
                    title="انقر لتحديد موقع الشاحنة ومتابعتها على الخريطة"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono font-medium">
                        {alert.time}
                      </span>
                      <div className="flex items-center gap-1.5 font-black" style={{ color: alert.textColor }}>
                        <span>{alert.typeTitle}</span>
                        {alert.type === 'temp' ? (
                          <Thermometer className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                        )}
                      </div>
                    </div>

                    <div className="font-black text-[#011222] font-mono text-xs">
                      {alert.shipment}
                    </div>

                    <div className="text-[11px] text-gray-600 flex items-center justify-start gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Link: عرض جميع التنبيهات */}
              <div className="pt-2 text-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAlertsModal(true)}
                  className="text-xs font-bold text-[#0284C7] hover:text-[#011222] inline-flex items-center gap-1.5 transition-colors cursor-pointer group py-1 px-3 rounded-lg hover:bg-sky-50"
                  title="عرض كافة تنبيهات الأسطول وحالات الطوارئ"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>عرض جميع التنبيهات ({alerts.length})</span>
                </button>
              </div>
            </div>

            {/* LEFT COLUMN (in RTL): Fleet Satellite Real Interactive GPS Map */}
            <div ref={mapSectionRef} className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative scroll-mt-24">
              <RealFleetMap
                selectedTruckId={selectedTruck?.id}
                onSelectTruck={(truckData) => {
                  const match = fleetList.find((f) => f.id === truckData.id)
                  if (match) setSelectedTruck(match)
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>
          </section>

          {/* 3. BOTTOM SECTION: LIVE FLEET TABLE (FULL WIDTH) */}
          <section className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 text-right">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  إجمالي الشاحنات في الأسطول:{' '}
                  <strong className="text-[#011222] font-black">{visibleTrucks.length}</strong>
                </span>
                {statusFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className="text-[11px] font-bold text-[#FB8731] hover:underline cursor-pointer"
                  >
                    (إلغاء التصفية)
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-[#011222]">
                  قائمة الشاحنات على الخريطة
                </h3>
                <Truck className="w-4 h-4 text-[#011222]" />
              </div>
            </div>

            {/* Table matching screenshot */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold pb-3">
                      <th className="pb-3 pr-2 text-right">رقم الشاحنة</th>
                      <th className="pb-3 text-center">الحالة</th>
                      <th className="pb-3 text-center">الموقع الحالي</th>
                      <th className="pb-3 text-center font-mono">الوقت</th>
                      <th className="pb-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {visibleTrucks.map((truck) => {
                      const isSelected = selectedTruck?.id === truck.id

                      return (
                        <tr
                          key={truck.id}
                          onClick={() => handleViewOnMap(truck)}
                          className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#FFF7ED]/70 font-bold' : ''
                          }`}
                        >
                          {/* رقم الشاحنة */}
                          <td className="py-3.5 pr-2">
                            <div className="flex items-center gap-2 text-[#011222] font-black font-mono">
                              <Truck className="w-4 h-4 text-[#011222]" />
                              <span>{truck.id}</span>
                            </div>
                          </td>

                          {/* الحالة */}
                          <td className="py-3.5 text-center">
                            <span
                              className="px-3.5 py-1 rounded-full text-[11px] font-bold inline-block min-w-[80px]"
                              style={{ backgroundColor: truck.statusBg, color: truck.statusColor }}
                            >
                              {truck.status}
                            </span>
                          </td>

                          {/* الموقع الحالي والسرعة */}
                          <td className="py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                              <span className="font-bold text-[#0284C7]">{truck.city}</span>
                              <span className="font-mono text-xs">{truck.speed} كم / ساعة</span>
                            </div>
                          </td>

                          {/* الوقت */}
                          <td className="py-3.5 text-center font-mono text-gray-500">
                            {truck.time}
                          </td>

                          {/* الإجراءات: عرض على الخريطة */}
                          <td className="py-3.5 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewOnMap(truck)
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                                isSelected
                                  ? 'bg-[#FB8731] text-white ring-2 ring-[#FB8731]/40 shadow-sm'
                                  : 'bg-[#011222] hover:bg-[#02182E] text-white'
                              }`}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>عرض على الخريطة</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
          </section>
        </div>
      </main>

      {/* 4. MODAL: ALL EMERGENCY ALERTS & LIVE FLEET INCIDENTS */}
      {showAlertsModal && (
        <div
          className="fixed inset-0 z-50 bg-[#011222]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
          dir="rtl"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAlertsModal(false)
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-right">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-red-100 text-[#DC2626] flex items-center justify-center shadow-xs shrink-0">
                  <Bell className="w-5 h-5 animate-bounce" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-[#011222]">
                      سجل كافة تنبيهات الأسطول وحالات الطوارئ
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-black bg-red-500 text-white">
                      {activeAlerts.length} نشطة
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    متابعة فورية للمسارات، درجات حرارة الحاويات، التفتيش الجمركي، وحالات التوقف الطارئة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAlertsModal(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills & Live Search Bar */}
            <div className="p-4 border-b border-gray-100 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={alertsSearch}
                    onChange={(e) => setAlertsSearch(e.target.value)}
                    placeholder="ابحث برقم الشاحنة، الشحنة، السائق، الموقع أو وصف التنبيه..."
                    className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FB8731] focus:ring-2 focus:ring-[#FB8731]/20 transition-all text-right"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {alertsSearch && (
                    <button
                      type="button"
                      onClick={() => setAlertsSearch('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Mark All Resolved Quick Button */}
                {activeAlerts.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllAlertsResolved}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تأكيد معالجة كافة التنبيهات ({activeAlerts.length})</span>
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { key: 'all', label: `كافة التنبيهات (${alerts.length})` },
                  { key: 'active', label: `النشطة والطارئة (${activeAlerts.length})` },
                  { key: 'route', label: 'المسار والملاحة' },
                  { key: 'temp', label: 'الحرارة والتبريد' },
                  { key: 'resolved', label: `تمت المعالجة (${resolvedAlerts.length})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setAlertsFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      alertsFilter === tab.key
                        ? 'bg-[#011222] text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 max-h-[55vh]">
              {modalFilteredAlerts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-700">لا توجد تنبيهات مطابقة لهذا البحث</h4>
                  <p className="text-xs text-gray-400">جميع الشاحنات تسير بانتظام وسلامة وفق الخطط المجدولة</p>
                </div>
              ) : (
                modalFilteredAlerts.map((alert) => {
                  const isResolved = alert.status === 'resolved'

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border transition-all text-right space-y-3 ${
                        isResolved
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : 'bg-white hover:shadow-md'
                      }`}
                      style={{
                        borderColor: isResolved ? '#BBF7D0' : alert.border,
                        backgroundColor: isResolved ? '#F0FDF4' : alert.bg
                      }}
                    >
                      {/* Top Bar of Alert Card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold"
                            style={{
                              backgroundColor: isResolved ? '#DCFCE7' : alert.bg,
                              color: isResolved ? '#16A34A' : alert.textColor
                            }}
                          >
                            {isResolved ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : alert.type === 'temp' ? (
                              <Thermometer className="w-4 h-4" />
                            ) : (
                              <AlertTriangle className="w-4 h-4" />
                            )}
                          </span>

                          <div>
                            <h4
                              className="text-xs sm:text-sm font-black"
                              style={{ color: isResolved ? '#16A34A' : alert.textColor }}
                            >
                              {alert.typeTitle}
                            </h4>
                            <span className="text-[11px] font-mono font-black text-[#011222]">
                              {alert.shipment}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : alert.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isResolved ? '✓ تمت المعالجة' : alert.severityLabel}
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono font-medium">
                            {alert.time}
                          </span>
                        </div>
                      </div>

                      {/* Description & Location */}
                      <div className="space-y-1 text-xs text-gray-700">
                        <p className="font-medium text-gray-800 leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-1">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                            <strong className="text-gray-700">{alert.location}</strong>
                          </span>
                          {alert.driver && (
                            <span className="inline-flex items-center gap-1 font-medium">
                              <span className="text-gray-400">السائق:</span>
                              <strong className="text-gray-800">{alert.driver}</strong>
                            </span>
                          )}
                          {alert.driverPhone && (
                            <span className="inline-flex items-center gap-1 font-mono text-gray-600">
                              <Phone className="w-3 h-3 text-[#FB8731]" />
                              <span>{alert.driverPhone}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100/60">
                        <div className="flex items-center gap-2">
                          {/* View on Map */}
                          <button
                            type="button"
                            onClick={() => handleViewOnMap(alert.truckIdRef)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#011222] hover:bg-[#02182E] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#FB8731]" />
                            <span>عرض وتتبع على الخريطة</span>
                          </button>

                          {/* Quick Call */}
                          {alert.driverPhone && (
                            <a
                              href={`tel:${alert.driverPhone.replace(/\s+/g, '')}`}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-gray-500" />
                              <span>اتصال بالسائق</span>
                            </a>
                          )}
                        </div>

                        {/* Toggle Resolved */}
                        <button
                          type="button"
                          onClick={() => toggleResolveAlert(alert.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isResolved
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {isResolved ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>إعادة فتح التنبيه</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تأكيد المعالجة والحل</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>عرض {modalFilteredAlerts.length} من أصل {alerts.length} تنبيه مسجل</span>
              <button
                type="button"
                onClick={() => setShowAlertsModal(false)}
                className="px-5 py-2 rounded-xl bg-[#011222] hover:bg-[#02182E] text-white font-bold transition-colors cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
