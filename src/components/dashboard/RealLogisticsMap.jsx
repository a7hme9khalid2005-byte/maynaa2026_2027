import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Plus,
  Minus,
  Activity,
  Anchor,
  Truck,
  Building2,
  Navigation
} from 'lucide-react'

// Hub locations with real GPS coordinates matching user's screenshot
const HUBS = [
  {
    id: 'jeddah',
    name: 'جدة',
    fullName: 'ميناء جدة الإسلامي',
    type: 'sea',
    coords: [21.4858, 39.1925],
    badgeOffset: [-10, -35],
    dotColor: '#EF4444',
    heatRadius: 110000,
    activeShipments: 3820,
    density: '94%',
    throughput: '4.2 مليون طن/شهر',
    status: 'ذروة تشغيلية عالية',
    icon: Anchor
  },
  {
    id: 'dammam',
    name: 'الدمام',
    fullName: 'ميناء الملك عبدالعزيز بالدمام',
    type: 'sea',
    coords: [26.4344, 50.1033],
    badgeOffset: [-10, 35],
    dotColor: '#F97316',
    heatRadius: 95000,
    activeShipments: 2410,
    density: '88%',
    throughput: '3.1 مليون طن/شهر',
    status: 'حركة شحن مكثفة',
    icon: Anchor
  },
  {
    id: 'kacst',
    name: 'مدينة الملك عبدالعزيز',
    fullName: 'الميناء الجاف والمركز اللوجستي بالرياض',
    type: 'dry',
    coords: [24.7136, 46.6753],
    badgeOffset: [-10, -50],
    dotColor: '#F59E0B',
    heatRadius: 85000,
    activeShipments: 1940,
    density: '81%',
    throughput: '1.8 مليون طن/شهر',
    status: 'مركز توزيع إقليمي نشط',
    icon: Building2
  },
  {
    id: 'jouf',
    name: 'منطقة الجوف',
    fullName: 'منفذ الحديثة اللوجستي البري',
    type: 'land',
    coords: [29.9539, 40.1970],
    badgeOffset: [-10, -40],
    dotColor: '#FB8731',
    heatRadius: 75000,
    activeShipments: 890,
    density: '68%',
    throughput: '750 ألف طن/شهر',
    status: 'منفذ بري حيوي مفتوح 24/7',
    icon: Truck
  }
]

// Real logistics trade corridors connecting the hubs
const CORRIDORS = [
  { from: [21.4858, 39.1925], to: [24.7136, 46.6753], color: '#FB8731', name: 'ممر جدة - الرياض' },
  { from: [26.4344, 50.1033], to: [24.7136, 46.6753], color: '#009F65', name: 'ممر الدمام - الرياض' },
  { from: [29.9539, 40.1970], to: [24.7136, 46.6753], color: '#0284C7', name: 'ممر الجوف - الرياض' },
  { from: [21.4858, 39.1925], to: [26.4344, 50.1033], color: '#8B5CF6', name: 'الخط العابر بين الموانئ' }
]

const MAP_THEMES = {
  dark: {
    label: 'ليلي',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
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

export default function RealLogisticsMap() {
  const rootRef = useRef(null)
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isExpandedFallback, setIsExpandedFallback] = useState(false)
  const [selectedHub, setSelectedHub] = useState(null)
  const [showCorridors, setShowCorridors] = useState(true)

  // Listen to native fullscreen changes (via API or ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(fs)
      if (!fs) {
        setIsExpandedFallback(false)
      }
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

  // Listen to ESC key when fallback expansion is used
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

    // Prevent re-initialization error with React StrictMode
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      center: [24.8, 44.8],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false
    })

    // Tile layer
    const tileLayer = L.tileLayer(MAP_THEMES[currentTheme].url, {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map)

    tileLayerRef.current = tileLayer

    // Draw Heatmap Thermal Circles for each hub
    HUBS.forEach((hub) => {
      // 1. Outer translucent heat dissipation ring
      L.circle(hub.coords, {
        radius: hub.heatRadius * 1.5,
        color: 'transparent',
        fillColor: hub.dotColor,
        fillOpacity: 0.12,
        interactive: false
      }).addTo(map)

      // 2. Middle thermal gradient ring
      L.circle(hub.coords, {
        radius: hub.heatRadius,
        color: hub.dotColor,
        weight: 1,
        opacity: 0.35,
        fillColor: hub.dotColor,
        fillOpacity: 0.28,
        interactive: false
      }).addTo(map)

      // 3. Inner high-intensity core
      L.circle(hub.coords, {
        radius: hub.heatRadius * 0.45,
        color: '#FFFFFF',
        weight: 1,
        opacity: 0.5,
        fillColor: hub.dotColor,
        fillOpacity: 0.65,
        interactive: false
      }).addTo(map)

      // 4. Custom Pin & Label matching user's screenshot
      const markerHtml = `
        <div class="group relative cursor-pointer select-none" style="transform: translate(-50%, -50%);">
          <!-- Pulse Ping Indicator -->
          <div class="relative flex items-center justify-center">
            <span class="w-6 h-6 rounded-full absolute animate-ping opacity-75" style="background-color: ${hub.dotColor};"></span>
            <span class="w-3.5 h-3.5 rounded-full relative z-10 border-2 border-white shadow-lg" style="background-color: ${hub.dotColor};"></span>
          </div>
          <!-- Dark Tag Matching Screenshot -->
          <div class="absolute whitespace-nowrap bg-[#011222]/95 text-white font-black text-[11px] px-2.5 py-1 rounded-lg border border-white/25 shadow-xl transition-transform duration-200 group-hover:scale-110 flex items-center gap-1.5"
               style="top: ${hub.badgeOffset[0]}px; ${hub.badgeOffset[1] >= 0 ? `left: ${hub.badgeOffset[1]}px;` : `right: ${Math.abs(hub.badgeOffset[1])}px;`}">
            <span>${hub.name}</span>
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        className: 'custom-hub-marker',
        html: markerHtml,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })

      const marker = L.marker(hub.coords, { icon: customIcon }).addTo(map)
      marker.on('click', () => {
        setSelectedHub(hub)
      })
    })

    // Draw connecting shipping corridors
    if (showCorridors) {
      CORRIDORS.forEach((corridor) => {
        L.polyline([corridor.from, corridor.to], {
          color: corridor.color,
          weight: 2,
          opacity: 0.5,
          dashArray: '4, 8'
        }).addTo(map)
      })
    }

    mapInstanceRef.current = map

    // Fix map container size on render
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
  }, [currentTheme, showCorridors])

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut()
  }

  const handleReset = () => {
    mapInstanceRef.current?.setView([24.8, 44.8], 5)
    setSelectedHub(null)
  }

  // Robust Fullscreen Handler: tries native Fullscreen API first, falls back to full window
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
      // Enter Fullscreen
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
        console.warn('Native requestFullscreen denied or unavailable, using expanded fallback:', err)
        setIsExpandedFallback(true)
      }
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150)
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 350)
    } else {
      // Exit Fullscreen
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

  const isAnyFullscreen = isFullscreen || isExpandedFallback

  return (
    <div
      ref={rootRef}
      id="meynaa-real-map-container"
      className={`relative w-full overflow-hidden select-none font-almarai transition-all duration-200 ${
        isAnyFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-[#081829] rounded-none border-none shadow-none'
          : 'h-64 sm:h-72 rounded-2xl border border-gray-100 shadow-sm'
      }`}
    >
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#081829]" />

      {/* Top Controls Bar (Layer switch, live badge, fullscreen) */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none" dir="rtl">
        {/* Live Operational Ticker Badge */}
        <div className="bg-[#011222]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-bold">بث مباشر للأقمار والمنافذ</span>
        </div>

        {/* Map Layers & Reset Controls */}
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

          {/* Toggle Corridors */}
          <button
            type="button"
            onClick={() => setShowCorridors(!showCorridors)}
            className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
              showCorridors ? 'text-[#FB8731]' : 'text-gray-400 hover:text-white'
            }`}
            title="إظهار/إخفاء ممرات الشحن"
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

      {/* Hub Detail Drawer / Overlay when clicked */}
      {selectedHub && (
        <div
          className="absolute bottom-3 left-3 right-12 z-20 bg-[#011222]/95 backdrop-blur-md rounded-xl p-3 border border-white/15 text-white text-right shadow-2xl animate-fade-in flex items-center justify-between gap-3 pointer-events-auto"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#FB8731] border border-orange-500/30 flex items-center justify-center shrink-0">
              <selectedHub.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black">{selectedHub.name}</h4>
                <span className="text-[10px] text-gray-300 font-medium">({selectedHub.fullName})</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedHub.status}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                حجم الحركة: <span className="font-bold text-white">{selectedHub.activeShipments} شحنة نشطة</span> • الكثافة: <span className="font-bold text-[#FB8731]">{selectedHub.density}</span> • السعة: <span className="font-bold text-gray-300">{selectedHub.throughput}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedHub(null)}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Bottom Summary Bar if no hub selected */}
      {!selectedHub && (
        <div className="absolute bottom-2 left-3 z-10 pointer-events-none" dir="rtl">
          <div className="bg-[#011222]/85 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-lg border border-white/10 text-[10px] font-medium flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#FB8731]" />
            <span>انقر على أي منفذ أو ميناء لعرض تفاصيل الحركة اللحظية</span>
          </div>
        </div>
      )}
    </div>
  )
}
