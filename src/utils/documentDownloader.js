/**
 * Document Downloader Utility
 * Generates an official shipping document file and triggers browser download
 */
export async function downloadShippingDocument(doc, { simulateError = false } = {}) {
  // Simulate 600ms network delay for realistic experience
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (simulateError) {
    throw new Error('فشل الاتصال بخادم المستندات الجمركية (خطأ في الشبكة)')
  }

  const content = `======================================================================
MEYNA LOGISTICS - DOCUMENTATION PORTAL
وثيقة شحن وتخليص جمركي معتمدة
======================================================================
اسم المستند: ${doc.name}
معرف الوثيقة: ${doc.id}
الرقم المرجعي: ${doc.refNo || 'REF-2026-884-BL'}
رقم الشحنة المرتبطة: ${doc.shipment}
نوع المستند: ${doc.type || doc.typeBadge || 'B/L'}
تاريخ الإصدار والرفع: ${doc.date}
حجم الملف: ${doc.size || '1.8 MB'}
حالة التدقيق الجمركي: ${doc.status}
المصدر: مجموعة الريادة للمقاولات والتوريدات العامة
المستورد: شركة الأفق للتجارة والاستيراد
ميناء الشحن: ميناء هامبورغ (DEHAM)
ميناء الوصول: ميناء جبل علي (AEJEA)
======================================================================
تم التحقق والاعتماد الرقمي من خلال منصة ميناء للخدمات اللوجستية 2026.
كافة الحقوق محفوظة © Meyna Logistics.
======================================================================
`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const cleanName = (doc.name || 'document').replace(/[\\/:*?"<>|]/g, '_')
  a.href = url
  a.download = `${cleanName}_${doc.id}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return true
}
