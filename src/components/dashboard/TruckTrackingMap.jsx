/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Truck,
  Radio,
  Gauge,
  Thermometer,
  Fuel,
  Navigation,
  Search,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Layers,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react'

// Live Fleet Real-World Geographic GPS Data (Saudi Arabia & GCC Corridors)
export const mockTrucks = [
  {
    id: 'TRK-104',
    plate: 'أ ب د 1048',
    driver: 'خالد بن ناصر الشمري',
    driverPhone: '+966 50 847 2291',
    model: 'مرسيدس أكتروس Actros 2025',
    route: 'ميناء الملك عبدالعزيز (الدمام) ➔ مستودعات الرياض الكبرى',
    origin: 'الدمام (ميناء الملك عبدالعزيز)',
    destination: 'مستودعات السلي (الرياض)',
    lat: 25.4215,
    lng: 48.5230, // Route 40 near Judah / Khurais
    originCoords: [26.4344, 50.1033],
    destCoords: [24.7136, 46.6753],
    routePath: [
      [26.4344, 50.1033],
      [26.2800, 49.9500],
      [25.9200, 49.3100],
      [25.4215, 48.5230],
      [25.1300, 47.7800],
      [24.7136, 46.6753]
    ],
    cargo: 'أجهزة إلكترونية ومعدات تبريد (FCL)',
    weight: '24.5 طن',
    speed: 84,
    temp: 4, // 4°C
    fuel: 78,
    status: 'moving',
    statusLabel: 'في الطريق (متحركة)',
    statusColor: '#009F65',
    progress: 68,
    distanceTotal: '412 كم',
    distanceRemaining: '132 كم',
    eta: 'اليوم، 05:45 م',
    lastUpdate: 'منذ دقيقة',
    linkedShipment: 'SHN-2026-884'
  },
  {
    id: 'TRK-208',
    plate: 'ر ص ق 3920',
    driver: 'أحمد بن فهد العتيبي',
    driverPhone: '+966 55 120 4930',
    model: 'فولفو FH16 Globetrotter',
    route: 'ميناء جدة الإسلامي ➔ المستودع المركزي (المدينة المنورة)',
    origin: 'ميناء جدة الإسلامي',
    destination: 'المستودع المركزي (المدينة المنورة)',
    lat: 22.8120,
    lng: 39.0250, // Highway 15 near Rabigh
    originCoords: [21.4858, 39.1925],
    destCoords: [24.4672, 39.6111],
    routePath: [
      [21.4858, 39.1925],
      [21.8200, 39.1800],
      [22.4000, 39.0800],
      [22.8120, 39.0250],
      [23.4500, 39.2500],
      [24.0100, 39.4200],
      [24.4672, 39.6111]
    ],
    cargo: 'منتجات غذائية ومجمدات بحرية',
    weight: '19.8 طن',
    speed: 76,
    temp: -18, // -18°C Deep Freeze
    fuel: 62,
    status: 'moving',
    statusLabel: 'في الطريق (متحركة)',
    statusColor: '#009F65',
    progress: 74,
    distanceTotal: '420 كم',
    distanceRemaining: '110 كم',
    eta: 'اليوم، 07:15 م',
    lastUpdate: 'منذ ثانيتين',
    linkedShipment: 'SHN-2026-756'
  },
  {
    id: 'TRK-315',
    plate: 'د ب ي 8831',
    driver: 'سامي المنصوري',
    driverPhone: '+971 50 994 3821',
    model: 'مان TGX 26.540 Individual',
    route: 'ميناء جبل علي (دبي) ➔ منفذ البطحاء ➔ الرياض',
    origin: 'ميناء جبل علي (دبي)',
    destination: 'الميناء الجاف (الرياض)',
    lat: 24.1264,
    lng: 51.5891, // Batha Border
    originCoords: [25.0113, 55.0612],
    destCoords: [24.7136, 46.6753],
    routePath: [
      [25.0113, 55.0612],
      [24.4539, 54.3773],
      [24.1264, 51.5891],
      [24.3500, 49.5000],
      [24.6200, 48.0000],
      [24.7136, 46.6753]
    ],
    cargo: 'قطع غيار توربينات ومعدات صناعية ثقيلة',
    weight: '32.0 طن',
    speed: 0,
    temp: 22,
    fuel: 85,
    status: 'customs',
    statusLabel: 'في نقطة التفتيش والجمارك (منفذ البطحاء)',
    statusColor: '#FB8731',
    progress: 42,
    distanceTotal: '980 كم',
    distanceRemaining: '568 كم',
    eta: 'غداً، 11:30 ص',
    lastUpdate: 'منذ 4 دقائق',
    linkedShipment: 'SHN-2026-901'
  },
  {
    id: 'TRK-402',
    plate: 'ع س ك 4022',
    driver: 'فيصل بن عبدالله السبيعي',
    driverPhone: '+966 54 330 1884',
    model: 'رينو T-High 520 Turbo',
    route: 'ميناء الجبيل التجاري ➔ المدينة الصناعية الثانية (الرياض)',
    origin: 'ميناء الجبيل التجاري',
    destination: 'المدينة الصناعية الثانية (الرياض)',
    lat: 25.5600,
    lng: 47.1800, // Near Rumah
    originCoords: [27.0046, 49.6582],
    destCoords: [24.5800, 46.8500],
    routePath: [
      [27.0046, 49.6582],
      [26.6500, 48.9500],
      [26.0200, 47.9800],
      [25.5600, 47.1800],
      [24.5800, 46.8500]
    ],
    cargo: 'مواد كيميائية وبوليمرات صناعية معبأة',
    weight: '28.0 طن',
    speed: 88,
    temp: 18,
    fuel: 54,
    status: 'moving',
    statusLabel: 'في الطريق (متحركة)',
    statusColor: '#009F65',
    progress: 58,
    distanceTotal: '480 كم',
    distanceRemaining: '201 كم',
    eta: 'اليوم، 09:00 م',
    lastUpdate: 'منذ لحظات',
    linkedShipment: 'SHN-2026-867'
  },
  {
    id: 'TRK-519',
    plate: 'ق ل م 5502',
    driver: 'سلطان الحربي',
    driverPhone: '+966 56 771 0029',
    model: 'سكانيا R500 V8',
    route: 'الميناء الجاف (الرياض) ➔ مستودعات خميس مشيط',
    origin: 'الميناء الجاف (الرياض)',
    destination: 'مستودعات خميس مشيط',
    lat: 20.4500,
    lng: 44.8200, // Wadi Ad-Dawasir Rest Area
    originCoords: [24.7136, 46.6753],
    destCoords: [18.3064, 42.7339],
    routePath: [
      [24.7136, 46.6753],
      [23.2800, 46.0500],
      [21.8400, 45.3200],
      [20.4500, 44.8200],
      [19.2500, 43.8500],
      [18.3064, 42.7339]
    ],
    cargo: 'بضائع تجزئة وسلع استهلاكية سريعة',
    weight: '16.5 طن',
    speed: 0,
    temp: 6,
    fuel: 91,
    status: 'resting',
    statusLabel: 'استراحة نظامية للسائق (محطة وادي الدواسر)',
    statusColor: '#0284C7',
    progress: 35,
    distanceTotal: '850 كم',
    distanceRemaining: '552 كم',
    eta: 'غداً، 03:00 م',
    lastUpdate: 'منذ 8 دقائق',
    linkedShipment: 'SHN-2026-923'
  }
]

// Map Tile Layer Providers
const MAP_TILES = {
  voyager: {
    name: 'خريطة الملاحة الحيوية',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  },
  satellite: {
    name: 'القمر الصناعي الواقعي',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri & Maxar',
    maxZoom: 18
  },
  dark: {
    name: 'النمط الليلي الفاخر',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }
}

// Helper function to create HTML marker icon (module level)
function createTruckIcon(truck, isSelected) {
  return L.divIcon({
    className: 'custom-truck-div-icon',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${
          isSelected
            ? `<span style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(251, 135, 49, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
            : ''
        }
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: ${isSelected ? '#FB8731' : '#011222'};
          border: 2.5px solid ${isSelected ? '#ffffff' : truck.statusColor};
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.2s ease;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
            <circle cx="17" cy="18.5" r="2.5"></circle>
            <circle cx="7" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -16px;
          background: #011222;
          color: ${isSelected ? '#FB8731' : '#ffffff'};
          border: 1px solid ${isSelected ? '#FB8731' : 'rgba(255,255,255,0.2)'};
          border-radius: 6px;
          font-size: 10px;
          font-family: monospace;
          font-weight: bold;
          padding: 1px 6px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        ">
          ${truck.id}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  })
}

export default function TruckTrackingMap({ initialSelectedId = 'TRK-104', isCompact = false, onClose = null }) {
  const resolveTruckId = (idOrShipment) => {
    const found = mockTrucks.find((t) => t.id === idOrShipment || t.linkedShipment === idOrShipment)
    return found ? found.id : 'TRK-104'
  }

  const [activeTruckId, setActiveTruckId] = useState(null)
  const [prevPropId, setPrevPropId] = useState(initialSelectedId)

  if (initialSelectedId !== prevPropId) {
    setPrevPropId(initialSelectedId)
    setActiveTruckId(resolveTruckId(initialSelectedId))
  }

  const selectedTruckId = activeTruckId ?? resolveTruckId(initialSelectedId)
  const setSelectedTruckId = setActiveTruckId

  // Search & Filter State
  const [truckSearchQuery, setTruckSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'moving' | 'resting' | 'customs'
  const [tileMode, setTileMode] = useState('voyager') // 'voyager' | 'satellite' | 'dark'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshedTime, setLastRefreshedTime] = useState('الآن')

  // DOM Refs for Leaflet Map
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const markersRef = useRef({})
  const polylinesRef = useRef({})

  const selectedTruck = mockTrucks.find((t) => t.id === selectedTruckId) || mockTrucks[0]

  // Filter trucks matching search input (by truck ID, plate, driver, shipment, route)
  const searchResults = mockTrucks.filter((truck) => {
    if (!truckSearchQuery.trim()) return false
    const q = truckSearchQuery.toLowerCase().trim()
    return (
      truck.id.toLowerCase().includes(q) ||
      truck.plate.includes(q) ||
      truck.driver.includes(q) ||
      truck.linkedShipment.toLowerCase().includes(q) ||
      truck.route.includes(q) ||
      truck.origin.includes(q) ||
      truck.destination.includes(q)
    )
  })

  // Filter trucks for side list
  const filteredTrucks = mockTrucks.filter((truck) => {
    const matchesStatus = statusFilter === 'all' || truck.status === statusFilter
    const q = truckSearchQuery.toLowerCase().trim()
    if (!q) return matchesStatus
    const matchesSearch =
      truck.id.toLowerCase().includes(q) ||
      truck.plate.includes(q) ||
      truck.driver.includes(q) ||
      truck.linkedShipment.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  // 1. Initialize Real Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [24.7136, 46.6753],
        zoom: 6,
        zoomControl: false,
        attributionControl: false
      })

      const defaultTile = MAP_TILES.voyager
      const tileLayer = L.tileLayer(defaultTile.url, {
        maxZoom: defaultTile.maxZoom,
        subdomains: defaultTile.subdomains || 'abc'
      }).addTo(map)

      tileLayerRef.current = tileLayer

      // Create initial polylines & markers
      mockTrucks.forEach((truck) => {
        const isSelected = truck.id === selectedTruckId
        const poly = L.polyline(truck.routePath, {
          color: isSelected ? '#FB8731' : '#64748B',
          weight: isSelected ? 4.5 : 2.5,
          opacity: isSelected ? 0.95 : 0.45,
          dashArray: isSelected ? null : '6, 6'
        }).addTo(map)
        polylinesRef.current[truck.id] = poly

        const icon = createTruckIcon(truck, isSelected)
        const marker = L.marker([truck.lat, truck.lng], { icon, title: `${truck.id} - ${truck.plate}` }).addTo(map)

        const popupHtml = `
          <div style="direction: rtl; text-align: right; font-family: 'Almarai', sans-serif; font-size: 12px; color: #011222; min-width: 210px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 6px;">
              <span style="font-weight: 800; color: #FB8731; font-family: monospace; font-size: 13px;">${truck.id}</span>
              <span style="background: ${truck.statusColor}; color: white; border-radius: 9999px; padding: 2px 8px; font-size: 10px; font-weight: bold;">
                ${truck.status === 'moving' ? 'متحركة' : truck.status === 'customs' ? 'جمارك' : 'استراحة'}
              </span>
            </div>
            <div style="font-weight: bold; font-size: 11px; margin-bottom: 4px;">🚚 ${truck.model}</div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 3px;">👤 السائق: <strong>${truck.driver}</strong></div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 3px;">📍 اللوحة: <strong style="font-family: monospace;">${truck.plate}</strong></div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">⚡ السرعة: <strong style="color: #009F65; font-family: monospace;">${truck.speed} كم/س</strong> | ❄️ <strong style="font-family: monospace;">${truck.temp}°C</strong></div>
            <div style="background: #FFF7ED; border: 1px solid rgba(251, 135, 49, 0.3); border-radius: 8px; padding: 6px; font-size: 10px; color: #9A3412;">
              📦 شحنة: <strong style="font-family: monospace;">${truck.linkedShipment}</strong>
            </div>
          </div>
        `
        marker.bindPopup(popupHtml)
        marker.on('click', () => {
          setSelectedTruckId(truck.id)
        })

        markersRef.current[truck.id] = marker
      })

      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Update Map Tiles when tileMode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return
    const currentTile = MAP_TILES[tileMode]
    mapInstanceRef.current.removeLayer(tileLayerRef.current)

    const newLayer = L.tileLayer(currentTile.url, {
      maxZoom: currentTile.maxZoom,
      subdomains: currentTile.subdomains || 'abc'
    }).addTo(mapInstanceRef.current)

    tileLayerRef.current = newLayer
  }, [tileMode])

  // 3. Pan / Fly to selected truck when selectedTruckId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    // Update marker icons and line styles
    mockTrucks.forEach((truck) => {
      const isSelected = truck.id === selectedTruckId
      const marker = markersRef.current[truck.id]
      const poly = polylinesRef.current[truck.id]

      if (marker) {
        marker.setIcon(createTruckIcon(truck, isSelected))
        if (isSelected) {
          marker.openPopup()
        }
      }

      if (poly) {
        poly.setStyle({
          color: isSelected ? '#FB8731' : '#64748B',
          weight: isSelected ? 4.5 : 2.5,
          opacity: isSelected ? 0.95 : 0.45,
          dashArray: isSelected ? null : '6, 6'
        })
      }
    })

    // Smooth Fly-to Animation
    if (selectedTruck) {
      map.flyTo([selectedTruck.lat, selectedTruck.lng], 11, {
        animate: true,
        duration: 1.2
      })
    }
  }, [selectedTruckId, selectedTruck])

  // Center on all trucks
  const handleFitAllTrucks = () => {
    if (!mapInstanceRef.current) return
    const bounds = L.latLngBounds(mockTrucks.map((t) => [t.lat, t.lng]))
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true })
  }

  // Zoom In / Out
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastRefreshedTime('الآن')
      if (mapInstanceRef.current && selectedTruck) {
        mapInstanceRef.current.flyTo([selectedTruck.lat, selectedTruck.lng], 11)
      }
    }, 600)
  }

  const handleSelectTruckFromSearch = (truckId) => {
    setSelectedTruckId(truckId)
    setTruckSearchQuery('')
    setIsSearchFocused(false)
  }

  return (
    <div
      className={`bg-[#011222] rounded-3xl overflow-hidden border border-white/10 shadow-2xl font-almarai text-white relative transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : 'w-full'
      }`}
      dir="rtl"
    >
      {/* 1. TOP HEADER & PROMINENT SEARCH BAR SPECIFICALLY FOR TRUCK NUMBER */}
      <div className="bg-[#02182E] border-b border-white/10 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Right: Title & Pulse Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#FB8731]/15 border border-[#FB8731]/40 flex items-center justify-center text-[#FB8731] shrink-0 shadow-xs">
            <Truck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                خريطة التتبع المباشر لأسطول الشاحنات
              </h3>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#009F65]/20 text-[#00E591] border border-[#009F65]/40 animate-pulse">
                <Radio className="w-3 h-3 animate-ping" />
                <span>GPS حي وواقعي</span>
              </span>
            </div>
            <p className="text-xs text-white/60 font-medium mt-0.5">
              خريطة جغرافية حقيقية للطرق السريعة والموانئ بالمملكة والخليج العربي
            </p>
          </div>
        </div>

        {/* Center: Dedicated Prominent Search for Truck Number */}
        <div className="relative flex-1 max-w-xl mx-0 lg:mx-4 z-30">
          <div className="relative flex items-center">
            <input
              type="text"
              value={truckSearchQuery}
              onChange={(e) => setTruckSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="🔍 ابحث برقم الشاحنة (مثال: TRK-104، أ ب د 1048، أو رقم الشحنة)..."
              className="w-full bg-[#011427] border-2 border-[#FB8731]/50 focus:border-[#FB8731] rounded-2xl py-2.5 pr-11 pl-10 text-xs sm:text-sm font-bold text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-[#FB8731]/20 transition-all shadow-inner text-right"
            />
            <div className="absolute right-3.5 pointer-events-none text-[#FB8731]">
              <Search className="w-4 h-4" />
            </div>
            {truckSearchQuery && (
              <button
                type="button"
                onClick={() => setTruckSearchQuery('')}
                className="absolute left-3 text-white/50 hover:text-white transition-colors cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete / Instant Dropdown for Searched Trucks */}
          {isSearchFocused && truckSearchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#02182E] border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 text-right animate-fade-in divide-y divide-white/10">
              <div className="px-4 py-2 bg-[#011427] text-[11px] font-bold text-white/60 flex items-center justify-between">
                <span>نتائج البحث عن الشاحنة ({searchResults.length})</span>
                <span>انقر للانتقال لموقعها مباشرة</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((truck) => (
                    <div
                      key={truck.id}
                      onClick={() => handleSelectTruckFromSearch(truck.id)}
                      className="p-3 hover:bg-[#FB8731]/15 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-white shrink-0 text-xs shadow-xs"
                          style={{ backgroundColor: truck.id === selectedTruckId ? '#FB8731' : '#011427', border: `1.5px solid ${truck.statusColor}` }}
                        >
                          {truck.id.replace('TRK-', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#FB8731] text-xs">{truck.id}</span>
                            <span className="text-[11px] text-white/70 font-mono">({truck.plate})</span>
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                              style={{ backgroundColor: truck.statusColor }}
                            >
                              {truck.status === 'moving' ? 'متحركة' : truck.status === 'customs' ? 'جمارك' : 'استراحة'}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/80 mt-0.5 font-medium">{truck.route}</div>
                          <div className="text-[10px] text-white/40 mt-0.5">👤 {truck.driver} • 📦 شحنة: {truck.linkedShipment}</div>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-[11px] font-mono font-bold text-[#00E591] block">
                          {truck.speed > 0 ? `${truck.speed} كم/س` : 'متوقفة'}
                        </span>
                        <span className="text-[10px] text-white/50">{truck.distanceRemaining} متبقية</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-white/50 font-bold">
                  لم يتم العثور على شاحنة تطابق &quot;{truckSearchQuery}&quot;
                </div>
              )}
            </div>
          )}

          {/* Quick-Access Pills for All Trucks */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-[10px] text-white/40 font-bold shrink-0">وصول سريع:</span>
            {mockTrucks.map((truck) => (
              <button
                key={truck.id}
                type="button"
                onClick={() => setSelectedTruckId(truck.id)}
                className={`px-2.5 py-0.5 rounded-lg font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  truck.id === selectedTruckId
                    ? 'bg-[#FB8731] text-white shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: truck.statusColor }}
                />
                <span>{truck.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Left: Tile Layers, Refresh & Window Controls */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {/* Map Tile Layer Selector */}
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setTileMode('voyager')}
              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                tileMode === 'voyager' ? 'bg-[#FB8731] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
              title="خريطة شوارع وملاحة حيوية واضحة"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>ملاحة</span>
            </button>
            <button
              type="button"
              onClick={() => setTileMode('satellite')}
              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                tileMode === 'satellite' ? 'bg-[#FB8731] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
              title="صور أقمار صناعية حقيقية"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>أقمار صناعية</span>
            </button>
            <button
              type="button"
              onClick={() => setTileMode('dark')}
              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                tileMode === 'dark' ? 'bg-[#FB8731] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
              title="النمط الليلي الفاخر"
            >
              <span>ليلي</span>
            </button>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="تحديث البيانات وإعادة التمركز"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FB8731]' : ''}`} />
            <span className="hidden sm:inline">{lastRefreshedTime}</span>
          </button>

          {/* Fit All Trucks */}
          <button
            type="button"
            onClick={handleFitAllTrucks}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer text-xs font-bold"
            title="عرض جميع الشاحنات في المملكة"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#FB8731] hover:bg-[#e07525] text-white transition-all cursor-pointer shadow-md"
              title="إغلاق الخريطة"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN GRID: REAL MAP CONTAINER + LIVE TELEMETRY DASHBOARD */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 ${isFullscreen ? 'flex-1 overflow-hidden' : ''}`}>
        
        {/* Left/Main Area: Real Leaflet Map View */}
        <div className={`lg:col-span-8 relative bg-[#011427] ${isCompact ? 'min-h-[400px]' : 'min-h-[480px] sm:min-h-[560px]'} flex items-stretch overflow-hidden border-b lg:border-b-0 lg:border-l border-white/10`}>
          
          {/* Leaflet DOM Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[400px] z-10"
            style={{ background: '#02182E' }}
          />

          {/* Floating Map Controls on Top-Right of Map Canvas */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="bg-[#02182E]/90 backdrop-blur-md border border-white/15 rounded-2xl p-1 shadow-xl flex flex-col">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-xl font-bold text-lg cursor-pointer transition-colors"
                title="تكبير الخريطة"
              >
                +
              </button>
              <div className="w-6 h-[1px] bg-white/10 mx-auto" />
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-xl font-bold text-lg cursor-pointer transition-colors"
                title="تصغير الخريطة"
              >
                −
              </button>
            </div>

            <button
              type="button"
              onClick={handleFitAllTrucks}
              className="p-2.5 rounded-2xl bg-[#02182E]/90 backdrop-blur-md border border-white/15 text-white hover:text-[#FB8731] shadow-xl transition-colors cursor-pointer text-center"
              title="إعادة التمركز على أسطول المملكة والخليج"
            >
              <Compass className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {/* Map Legend Overlay on Bottom-Right */}
          <div className="absolute bottom-4 right-4 bg-[#02182E]/95 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-[11px] space-y-1.5 shadow-2xl z-20 hidden sm:block">
            <div className="font-bold text-white/90 pb-1 border-b border-white/10 flex items-center justify-between gap-4">
              <span>دليل خريطة الأسطول</span>
              <span className="text-[10px] text-[#FB8731] font-mono">5 شاحنات نشطة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009F65]" />
              <span className="text-white/80">شاحنة متحركة (GPS نشط)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]" />
              <span className="text-white/80">نقطة تفتيش جمركية (منفذ البطحاء)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
              <span className="text-white/80">استراحة نظامية للسائق</span>
            </div>
          </div>
        </div>

        {/* Right/Side Area: Telemetry Sensor Center & Fleet Selector */}
        <div className="lg:col-span-4 bg-[#02182E] p-5 flex flex-col justify-between space-y-5 overflow-y-auto">
          
          {/* Active Truck Detailed Telemetry Card */}
          <div className="space-y-4">
            
            {/* Header: Truck ID, Model & Plate */}
            <div className="bg-[#011427] border border-white/10 rounded-2xl p-4 relative overflow-hidden shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FB8731] font-mono bg-[#FB8731]/15 px-2.5 py-0.5 rounded-md border border-[#FB8731]/40">
                      {selectedTruck.id}
                    </span>
                    <span className="text-xs text-white/60 font-mono font-bold">
                      {selectedTruck.plate}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mt-1.5">
                    {selectedTruck.model}
                  </h4>
                </div>
                
                {/* Status Badge */}
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold text-white shrink-0 shadow-xs flex items-center gap-1"
                  style={{ backgroundColor: selectedTruck.statusColor }}
                >
                  {selectedTruck.status === 'moving' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>متحركة</span>
                    </>
                  ) : selectedTruck.status === 'customs' ? (
                    <>
                      <AlertTriangle className="w-3 h-3" />
                      <span>جمارك</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>استراحة</span>
                    </>
                  )}
                </span>
              </div>

              {/* Driver info */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FB8731]/20 border border-[#FB8731]/40 flex items-center justify-center font-bold text-[#FB8731] text-[11px]">
                    {selectedTruck.driver.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{selectedTruck.driver}</div>
                    <div className="text-[10px] text-white/40 font-mono" dir="ltr">{selectedTruck.driverPhone}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40">شحنة مرتبطة:</div>
                  <div className="font-bold text-[#0284C7] font-mono">{selectedTruck.linkedShipment}</div>
                </div>
              </div>
            </div>

            {/* Route & Progress Bar */}
            <div className="bg-[#011427] border border-white/10 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white/60">خط سير الشاحنة المباشر</span>
                <span className="text-[#00E591] font-mono">{selectedTruck.progress}% منجز</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <Navigation className="w-4 h-4 text-[#FB8731] shrink-0 mt-0.5" />
                <span className="font-bold leading-relaxed text-white">
                  {selectedTruck.route}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FB8731] to-[#00E591] h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedTruck.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>المسافة المتبقية: <strong className="text-white font-mono">{selectedTruck.distanceRemaining}</strong></span>
                <span>الوصول المتوقع: <strong className="text-white font-mono">{selectedTruck.eta}</strong></span>
              </div>
            </div>

            {/* Live Telemetry Sensors: Speed, Temp, Fuel */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Gauge 1: Speed */}
              <div className="bg-[#011427] border border-white/10 rounded-xl p-3 text-center shadow-xs">
                <Gauge className="w-5 h-5 text-[#00E591] mx-auto mb-1 stroke-[2]" />
                <span className="text-[10px] text-white/50 block">السرعة الحالية</span>
                <span className="text-sm sm:text-base font-black text-white font-mono">
                  {selectedTruck.speed} <span className="text-[10px] text-white/60">كم/س</span>
                </span>
              </div>

              {/* Gauge 2: Temperature */}
              <div className="bg-[#011427] border border-white/10 rounded-xl p-3 text-center shadow-xs">
                <Thermometer className="w-5 h-5 text-[#0284C7] mx-auto mb-1 stroke-[2]" />
                <span className="text-[10px] text-white/50 block">حرارة المقطورة</span>
                <span className="text-sm sm:text-base font-black text-white font-mono" dir="ltr">
                  {selectedTruck.temp}°C
                </span>
              </div>

              {/* Gauge 3: Fuel */}
              <div className="bg-[#011427] border border-white/10 rounded-xl p-3 text-center shadow-xs">
                <Fuel className="w-5 h-5 text-[#FB8731] mx-auto mb-1 stroke-[2]" />
                <span className="text-[10px] text-white/50 block">مستوى الوقود</span>
                <span className="text-sm sm:text-base font-black text-white font-mono">
                  {selectedTruck.fuel}%
                </span>
              </div>
            </div>

            {/* Cargo description */}
            <div className="bg-[#011427] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-white/50">نوع الحمولة والوزن:</span>
              <span className="font-bold text-white text-right max-w-[210px] truncate">
                {selectedTruck.cargo} ({selectedTruck.weight})
              </span>
            </div>
          </div>

          {/* Fleet Quick Selector Drawer */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white/80">قائمة الشاحنات المتاحة ({filteredTrucks.length})</span>
              {/* Quick Status Filter Buttons */}
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'moving', label: 'متحركة' },
                  { id: 'customs', label: 'جمارك' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-[#FB8731] text-white shadow-xs'
                        : 'text-white/50 hover:text-white bg-white/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Scrollable List with Direct FlyTo */}
            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {filteredTrucks.map((truck) => (
                <div
                  key={truck.id}
                  onClick={() => setSelectedTruckId(truck.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    truck.id === selectedTruckId
                      ? 'bg-[#FB8731]/20 border-[#FB8731] text-white shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: truck.statusColor }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">{truck.id}</span>
                        <span className="text-[10px] text-white/50">({truck.plate})</span>
                      </div>
                      <div className="text-[10px] text-white/60 truncate max-w-[150px]">{truck.origin} ➔ {truck.destination}</div>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-[11px] font-mono font-bold text-white/80 block">
                      {truck.speed > 0 ? `${truck.speed} كم/س` : 'متوقفة'}
                    </span>
                    <span className="text-[9px] text-[#00E591] font-bold font-mono">{truck.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
