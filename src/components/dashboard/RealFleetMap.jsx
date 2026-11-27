import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Plus,
  Minus,
  Truck,
  AlertTriangle,
  Radio,
  Navigation,
  Phone,
  User,
  Gauge
} from 'lucide-react'

// Real GPS Coords for Fleet Trucks across Saudi Arabia and the Gulf
const FLEET_MARKERS = [
  {
    id: 'SHN-2026-884',
    truckId: 'TRK-104',
    status: 'متحركة',
    statusColor: '#009F65',
    city: 'جدة - ميناء جدة الإسلامي',
    coords: [21.5433, 39.1728],
    speed: 85,
    driver: 'محمد وليد',
    driverPhone: '+966 50 847 2291',
    route: 'ميناء جدة ➔ الرياض',
    hasAlert: true,
    alertText: 'تنبيه حرارة الحاوية (+4°C)'
  },
  {
    id: 'SHN-2026-966',
    truckId: 'TRK-315',
    status: 'بانتظار التفتيش الجمركي',
    statusColor: '#FB8731',
    city: 'دبي - ميناء جبل علي',
    coords: [25.0113, 55.0611],
    speed: 0,
    driver: 'سامي المنصوري',
    driverPhone: '+971 50 994 3821',
    route: 'ميناء جبل علي ➔ منفذ البطحاء',
    hasAlert: false
  },
  {
    id: 'SHN-2026-756',
    truckId: 'TRK-208',
    status: 'استراحة نظامية',
    statusColor: '#0284C7',
    city: 'مكة المكرمة - طريق الحرمين',
    coords: [21.4225, 39.8262],
    speed: 0,
    driver: 'أحمد فهد العتيبي',
    driverPhone: '+966 55 120 4930',
    route: 'ميناء جدة الإسلامي ➔ مكة المكرمة',
    hasAlert: false
  },
  {
    id: 'SHN-2026-825',
    truckId: 'TRK-519',
    status: 'معطلة',
    statusColor: '#DC2626',
    city: 'الرياض - الميناء الجاف',
    coords: [24.7136, 46.6753],
    speed: 0,
    driver: 'سلطان الحربي',
    driverPhone: '+966 56 771 0029',
    route: 'الميناء الجاف بالرياض ➔ وادي الدواسر',
    hasAlert: true,
    alertText: 'عطل ميكانيكي في المحرك'
  },
  {
    id: 'SHN-2026-912',
    truckId: 'TRK-220',
    status: 'استراحة نظامية',
    statusColor: '#0284C7',
    city: 'الدمام - محطة طريق الدمام السريع',
    coords: [26.4344, 50.1033],
    speed: 0,
    driver: 'علي السعيد',
    driverPhone: '+966 54 987 6543',
    route: 'جبل علي ➔ الرياض',
    hasAlert: false
  },
  {
    id: 'SHN-2026-867',
    truckId: 'TRK-408',
    status: 'معطلة',
    statusColor: '#DC2626',
    city: 'المدينة المنورة - طريق الهجرة',
    coords: [24.5247, 39.5692],
    speed: 0,
    driver: 'سالم حسن',
    driverPhone: '+966 56 345 6789',
    route: 'ميلانو ➔ الدمام',
    hasAlert: true,
    alertText: 'عطل في نظام التبريد'
  },
  {
    id: 'SHN-2026-901',
    truckId: 'TRK-198',
    status: 'متحركة',
    statusColor: '#009F65',
    city: 'الجبيل الصناعية - طريق الملك فهد',
    coords: [27.0046, 49.6592],
    speed: 78,
    driver: 'ناصر الحربي',
    driverPhone: '+966 53 234 5678',
    route: 'شنغهاي ➔ أبو ظبي',
    hasAlert: false
  },
  {
    id: 'SHN-2026-903',
    truckId: 'TRK-614',
    status: 'استراحة نظامية',
    statusColor: '#0284C7',
    city: 'منفذ الغويفات اللوجستي',
    coords: [24.1302, 51.6247],
    speed: 0,
    driver: 'فهد العتيبي',
    driverPhone: '+966 58 765 4321',
    route: 'الرياض ➔ دبي',
    hasAlert: false
  },
  {
    id: 'SHN-2026-812',
    truckId: 'TRK-702',
    status: 'متحركة',
    statusColor: '#009F65',
    city: 'طريق حرض - البطحاء',
    coords: [24.0622, 49.0718],
    speed: 82,
    driver: 'خالد الشمري',
    driverPhone: '+966 50 333 4444',
    route: 'عمان ➔ دبي',
    hasAlert: false
  },
  {
    id: 'SHN-2026-902',
    truckId: 'TRK-902',
    status: 'معطلة',
    statusColor: '#DC2626',
    city: 'طريق الرياض - جدة السريع',
    coords: [23.8539, 43.1970],
    speed: 0,
    driver: 'سلطان الحربي',
    driverPhone: '+966 56 771 0029',
    route: 'الرياض ➔ جدة',
    hasAlert: true,
    alertText: 'خروج عن المسار المخصص (14 كم)'
  },
  {
    id: 'SHN-2026-750',
    truckId: 'TRK-750',
    status: 'معطلة',
    statusColor: '#DC2626',
    city: 'طريق الدمام - الرياض السريع',
    coords: [25.7500, 48.3000],
    speed: 0,
    driver: 'سالم حسن',
    driverPhone: '+966 56 345 6789',
    route: 'الدمام ➔ الرياض',
    hasAlert: true,
    alertText: 'خروج عن المسار المخصص'
  }
]

// Highway Corridors between cities
const HIGHWAY_CORRIDORS = [
  { from: [21.5433, 39.1728], to: [24.7136, 46.6753], color: '#00E5FF' }, // Jeddah - Riyadh
  { from: [24.7136, 46.6753], to: [26.4344, 50.1033], color: '#00E5FF' }, // Riyadh - Dammam
  { from: [24.7136, 46.6753], to: [29.9539, 40.1970], color: '#00E5FF' }, // Riyadh - Al Jouf
  { from: [21.5433, 39.1728], to: [24.5247, 39.5692], color: '#00E5FF' }, // Jeddah - Medina
  { from: [26.4344, 50.1033], to: [24.1302, 51.6247], color: '#00E5FF' }, // Dammam - UAE Border
  { from: [24.7136, 46.6753], to: [24.0622, 49.0718], color: '#00E5FF' }  // Riyadh - Haradh
]

const MAP_THEMES = {
  dark: {
    label: 'ليلي',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  satellite: {
    label: 'قمر صناعي',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery'
  },
  voyager: {
    label: 'طرق',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }
}

export default function RealFleetMap({
  selectedTruckId,
  onSelectTruck,
  statusFilter: externalStatusFilter,
  onStatusFilterChange
}) {
  const rootRef = useRef(null)
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [internalStatusFilter, setInternalStatusFilter] = useState('all')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isExpandedFallback, setIsExpandedFallback] = useState(false)
  const [internalSelectedId, setInternalSelectedId] = useState(null)
  const [showHighways, setShowHighways] = useState(true)

  const effectiveTruckId = selectedTruckId !== undefined ? selectedTruckId : internalSelectedId
  const activeTruck = FLEET_MARKERS.find(
    (t) => t.id === effectiveTruckId || t.truckId === effectiveTruckId
  )

  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : internalStatusFilter
  const handleStatusFilterChange = (filterVal) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(filterVal)
    }
    setInternalStatusFilter(filterVal)
  }

  // Listen to native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(fs)
      if (!fs) setIsExpandedFallback(false)
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150)
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 350)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Handle ESC key for fallback mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpandedFallback) {
        setIsExpandedFallback(false)
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpandedFallback])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      center: [25.0, 45.2],
      zoom: 5.5,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    })

    // Tile layer
    L.tileLayer(MAP_THEMES[currentTheme].url, {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map)

    // Highway Corridor Polylines
    if (showHighways) {
      HIGHWAY_CORRIDORS.forEach((corridor) => {
        L.polyline([corridor.from, corridor.to], {
          color: corridor.color,
          weight: 2,
          opacity: 0.65,
          dashArray: '5, 6'
        }).addTo(map)
      })
    }

    // Layer group for dynamic markers
    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer

    mapInstanceRef.current = map

    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [currentTheme, showHighways])

  // Update Markers when filter or selectedTruckId changes
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return

    markersLayerRef.current.clearLayers()

    const filtered = FLEET_MARKERS.filter((truck) => {
      if (statusFilter === 'all') return true
      return truck.status === statusFilter
    })

    filtered.forEach((truck) => {
      const isSelected = selectedTruckId === truck.id
      const isBreakdown = truck.status === 'معطلة'
      const isMoving = truck.status === 'متحركة'

      const markerHtml = `
        <div class="relative cursor-pointer select-none group" style="transform: translate(-50%, -50%);">
          <!-- Ping pulse for moving or breakdown trucks -->
          ${
            isBreakdown
              ? `<span class="w-10 h-10 rounded-full absolute -top-1 -left-1 animate-ping opacity-60 bg-red-500"></span>`
              : isMoving
              ? `<span class="w-8 h-8 rounded-full absolute top-0 left-0 animate-ping opacity-40 bg-emerald-500"></span>`
              : ''
          }

          <!-- Truck Circle Node -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-xl transition-transform duration-200 group-hover:scale-125 ${
            isSelected ? 'scale-125 ring-4 ring-white ring-offset-2 ring-offset-[#011222]' : ''
          }" style="background-color: ${truck.statusColor}; border-color: #FFFFFF;">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
              <path d="M15 18H9"></path>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"></path>
              <circle cx="17" cy="18.5" r="2.5"></circle>
              <circle cx="7" cy="18.5" r="2.5"></circle>
            </svg>
          </div>

          <!-- Alert Badge if any -->
          ${
            truck.hasAlert
              ? `<div class="absolute -top-2 -right-1 w-4 h-4 bg-amber-400 border border-white rounded-full flex items-center justify-center text-[9px] font-black text-red-900 shadow-sm animate-bounce">!</div>`
              : ''
          }

          <!-- Floating Truck Code Tag -->
          <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#011222]/95 text-white font-mono font-black text-[9px] px-2 py-0.5 rounded-md border border-white/20 shadow-md group-hover:scale-110 transition-transform">
            ${truck.truckId}
          </div>
        </div>
      `

      const icon = L.divIcon({
        className: 'custom-fleet-truck-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      const marker = L.marker(truck.coords, { icon })
      marker.on('click', () => {
        setInternalSelectedId(truck.id)
        if (onSelectTruck) {
          onSelectTruck(truck)
        }
      })

      marker.addTo(markersLayerRef.current)
    })
  }, [statusFilter, selectedTruckId, onSelectTruck])

  // Fly to target truck whenever selectedTruckId changes (e.g. from "عرض على الخريطة" click in table)
  useEffect(() => {
    if (!selectedTruckId || !mapInstanceRef.current) return

    const target = FLEET_MARKERS.find(
      (t) => t.id === selectedTruckId || t.truckId === selectedTruckId
    )
    if (target) {
      mapInstanceRef.current.flyTo(target.coords, 9, {
        duration: 1.2,
        easeLinearity: 0.25
      })
    }
  }, [selectedTruckId])

  // Robust Fullscreen Handler
  const handleToggleFullscreen = async () => {
    const elem = rootRef.current
    if (!elem) return

    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )

    if (!isCurrentlyFullscreen && !isExpandedFallback) {
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen()
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen()
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen()
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen()
        } else {
          setIsExpandedFallback(true)
        }
      } catch (err) {
        console.warn('Native requestFullscreen denied, falling back to window expansion:', err)
        setIsExpandedFallback(true)
      }
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150)
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 350)
    } else {
      if (isCurrentlyFullscreen) {
        try {
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            await document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            await document.msExitFullscreen()
          }
        } catch (err) {
          console.warn('Error exiting fullscreen:', err)
        }
      }
      setIsExpandedFallback(false)
      setIsFullscreen(false)
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150)
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 350)
    }
  }

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleReset = () => {
    mapInstanceRef.current?.setView([25.0, 45.2], 5.5)
    setHoveredTruck(null)
  }

  const isAnyFullscreen = isFullscreen || isExpandedFallback

  return (
    <div
      ref={rootRef}
      id="meynaa-real-fleet-map-container"
      className={`relative w-full overflow-hidden select-none font-almarai transition-all duration-200 ${
        isAnyFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-[#081829] rounded-none border-none shadow-none'
          : 'h-[380px] sm:h-[420px] rounded-2xl border border-gray-100 shadow-sm'
      }`}
    >
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#0A2540]" />

      {/* Top Controls Bar */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none" dir="rtl">
        {/* Live Tracking Header Badge */}
        <div className="bg-[#011222]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2 pointer-events-auto">
          <Radio className="w-3.5 h-3.5 text-[#009F65] animate-pulse" />
          <span className="text-[11px] font-bold">التتبع المباشر لأسطول الشاحنات GPS</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Theme, Highway & Fullscreen Controls */}
        <div className="flex items-center gap-1.5 bg-[#011222]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg pointer-events-auto">
          {Object.entries(MAP_THEMES).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCurrentTheme(key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentTheme === key
                  ? 'bg-[#FB8731] text-white shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {theme.label}
            </button>
          ))}

          <div className="w-[1px] h-3.5 bg-white/20 mx-0.5"></div>

          {/* Toggle Highway Corridors */}
          <button
            type="button"
            onClick={() => setShowHighways(!showHighways)}
            className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
              showHighways ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'
            }`}
            title="إظهار/إخفاء خطوط شبكة الطرق السريعة"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
            title="إعادة ضبط زاوية الخريطة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
            title={isAnyFullscreen ? 'تصغير الشاشة (ESC)' : 'تكبير ملء الشاشة'}
          >
            {isAnyFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#FB8731]" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating Map Filter Card (Top Right inside map) matching user's design */}
      <div className="absolute top-14 right-3 z-10 bg-[#011222]/90 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-right text-xs shadow-xl min-w-[155px] pointer-events-auto" dir="rtl">
        <div className="font-black text-white pb-1.5 border-b border-white/10 mb-2 flex items-center justify-between">
          <span>فلترة الشاحنات</span>
          <span className="text-[10px] text-gray-400 font-mono">({FLEET_MARKERS.length})</span>
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handleStatusFilterChange('all')}
            className={`w-full flex items-center justify-between p-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px]">جميع الشاحنات</span>
            <span className="w-2 h-2 rounded-full bg-white/70" />
          </button>

          <button
            type="button"
            onClick={() => handleStatusFilterChange(statusFilter === 'متحركة' ? 'all' : 'متحركة')}
            className={`w-full flex items-center justify-between p-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'متحركة' ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px]">متحركة (248)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#009F65]" />
          </button>

          <button
            type="button"
            onClick={() => handleStatusFilterChange(statusFilter === 'بانتظار التفتيش الجمركي' ? 'all' : 'بانتظار التفتيش الجمركي')}
            className={`w-full flex items-center justify-between p-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'بانتظار التفتيش الجمركي' ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px]">تفتيش جمركي (46)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8731]" />
          </button>

          <button
            type="button"
            onClick={() => handleStatusFilterChange(statusFilter === 'استراحة نظامية' ? 'all' : 'استراحة نظامية')}
            className={`w-full flex items-center justify-between p-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'استراحة نظامية' ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px]">استراحة نظامية (72)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
          </button>

          <button
            type="button"
            onClick={() => handleStatusFilterChange(statusFilter === 'معطلة' ? 'all' : 'معطلة')}
            className={`w-full flex items-center justify-between p-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'معطلة' ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px]">معطلة (18)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
          </button>
        </div>
      </div>

      {/* Floating Zoom Controls (+ / -) */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-lg bg-[#011222]/90 hover:bg-[#011222] text-white flex items-center justify-center border border-white/10 shadow-md text-xs cursor-pointer active:scale-95 transition-transform"
          title="تكبير الخريطة"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-lg bg-[#011222]/90 hover:bg-[#011222] text-white flex items-center justify-center border border-white/10 shadow-md text-xs cursor-pointer active:scale-95 transition-transform"
          title="تصغير الخريطة"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selected Truck Floating Info Card */}
      {activeTruck && (
        <div
          className="absolute bottom-3 left-3 right-12 z-20 bg-[#011222]/95 backdrop-blur-md rounded-xl p-3 border border-white/15 text-white text-right shadow-2xl animate-fade-in flex items-center justify-between gap-3 pointer-events-auto"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: activeTruck.statusColor }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black font-mono">{activeTruck.truckId}</h4>
                <span className="text-[10px] text-gray-300 font-mono">({activeTruck.id})</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    backgroundColor: `${activeTruck.statusColor}25`,
                    color: activeTruck.statusColor
                  }}
                >
                  {activeTruck.status}
                </span>
                {activeTruck.hasAlert && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{activeTruck.alertText}</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#FB8731]" />
                  <span className="text-white font-medium">{activeTruck.driver}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-sky-400" />
                  <span className="font-mono text-gray-300">{activeTruck.driverPhone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" />
                  <span className="font-mono text-white">{activeTruck.speed} كم/ساعة</span>
                </span>
                <span>المسار: <strong className="text-white">{activeTruck.route}</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setInternalSelectedId(null)
              if (onSelectTruck) onSelectTruck(null)
            }}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  )
}
