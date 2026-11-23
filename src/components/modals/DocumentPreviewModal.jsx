import {
  X,
  Download,
  Printer,
  FileText,
  Ship,
  ShieldCheck
} from 'lucide-react'

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  document: doc,
  onDownload
}) {
  if (!isOpen || !doc) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#011222]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-almarai"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[26px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-scale-in text-right relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          {/* Actions: Close, Download, Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="w-9 h-9 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              title="طباعة المستند"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDownload?.(doc)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#018FF8] hover:bg-[#007EE0] text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
              title="تحميل المستند"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل المستند</span>
            </button>
          </div>

          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="bg-[#EBF5FE] text-[#0284C7] font-bold text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                  {doc.type || doc.typeBadge || 'وثيقة رسمية'}
                </span>
                <h3 className="text-base font-black text-[#011222]">{doc.name}</h3>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                معرف الوثيقة: {doc.id} • الشحنة: {doc.shipment}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-[#FFF3EA] text-[#FB8731] flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Official Document Sheet Preview (A4 Paper Representation) */}
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner relative overflow-hidden text-right">
          {/* Watermark Logo in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <Ship className="w-80 h-80 text-[#011222]" />
          </div>

          {/* Sheet Top Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-5">
            <div className="text-left font-mono">
              <span className="text-[10px] text-gray-400 block">DOCUMENT REF</span>
              <span className="text-xs font-black text-[#011222]">
                {doc.refNo || 'REF-2026-884-BL'}
              </span>
              <span className="text-[10px] text-gray-400 block mt-1">DATE OF ISSUE</span>
              <span className="text-xs font-black text-[#011222]">{doc.date}</span>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm font-black text-[#011222]">منصة ميناء اللوجستية</span>
                <div className="w-7 h-7 rounded-lg bg-[#FB8731] flex items-center justify-center text-white">
                  <Ship className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-[#64748B] mt-1">Meyna Logistics Documentation & Customs Portal</p>
              <p className="text-[10px] text-gray-400">وثيقة جمركية معتمدة صادرة إلكترونياً</p>
            </div>
          </div>

          {/* Official Stamp & Status Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200/80">
            {/* Status Stamp */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#E6F9F0] text-[#009F65] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#009F65] block">
                  مستند مصادق عليه رسمياً (Verified)
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  AUTHENTICATED BY SAUDI CUSTOMS & PORTS AUTHORITY
                </span>
              </div>
            </div>

            {/* Simulated Stamp Badge */}
            <div className="border-2 border-dashed border-[#009F65] text-[#009F65] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider rotate-[-2deg]">
              معتمد ومفحوص ✓
            </div>
          </div>

          {/* Logistics Data Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200/70 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">المصدر / الشاحن (Shipper)</span>
              <p className="font-bold text-[#011222]">مجموعة الريادة للمقاولات والتوريدات العامة</p>
              <span className="text-[10px] text-gray-500 block">دبي، الإمارات العربية المتحدة</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/70 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">المستلم / المستورد (Consignee)</span>
              <p className="font-bold text-[#011222]">شركة الأفق للتجارة والاستيراد المحدودة</p>
              <span className="text-[10px] text-gray-500 block">الرياض، المملكة العربية السعودية</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/70 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">ميناء الشحن (Port of Loading)</span>
              <p className="font-bold text-[#011222]">ميناء هامبورغ - رصيف 4 (DEHAM)</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200/70 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">ميناء الوصول (Port of Discharge)</span>
              <p className="font-bold text-[#011222]">ميناء جبل علي - المحطة 2 (AEJEA)</p>
            </div>
          </div>

          {/* Goods Summary */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/70 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-gray-400 block">بيانات الشحنة والحمولة (Cargo Specification)</span>
            <div className="flex items-center justify-between font-mono font-bold text-[#011222] pt-1 border-t border-gray-100">
              <span>وزن الشحنة: 12,400 كغ</span>
              <span>الحاوية: 1x40' High Cube Container</span>
              <span>الحجم: {doc.size || '1.8 MB'}</span>
            </div>
          </div>

          {/* Verification Barcode Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-[10px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-mono">VERIFICATION HASH: 9a7b8c2d1e0f43</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[#64748B]">
              <span>منصة ميناء الإلكترونية الموحدة</span>
              <span>•</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            إغلاق المعاينة
          </button>

          <button
            type="button"
            onClick={() => onDownload?.(doc)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#018FF8] hover:bg-[#007EE0] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل هذا المستند الآن</span>
          </button>
        </div>
      </div>
    </div>
  )
}
