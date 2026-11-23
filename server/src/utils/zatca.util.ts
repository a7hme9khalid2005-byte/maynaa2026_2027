/**
 * ZATCA Phase 2 (Fatoora) Compliant TLV Base64 QR Code Generator
 * Tag 1: Seller Name
 * Tag 2: VAT Registration Number
 * Tag 3: Invoice Timestamp (ISO 8601)
 * Tag 4: Invoice Total Amount (inclusive of VAT)
 * Tag 5: VAT Total Amount
 */

function toTLV(tag: number, value: string): Buffer {
  const valueBuffer = Buffer.from(value, 'utf-8')
  const tagBuffer = Buffer.from([tag])
  const lengthBuffer = Buffer.from([valueBuffer.length])
  return Buffer.concat([tagBuffer, lengthBuffer, valueBuffer])
}

export function generateZatcaQR(params: {
  sellerName: string
  vatNumber: string
  timestamp: string // e.g. 2026-11-16T15:00:00Z
  totalWithVat: string // e.g. "11500.00"
  vatAmount: string // e.g. "1500.00"
}): string {
  const tlv1 = toTLV(1, params.sellerName)
  const tlv2 = toTLV(2, params.vatNumber)
  const tlv3 = toTLV(3, params.timestamp)
  const tlv4 = toTLV(4, params.totalWithVat)
  const tlv5 = toTLV(5, params.vatAmount)

  const combined = Buffer.concat([tlv1, tlv2, tlv3, tlv4, tlv5])
  return combined.toString('base64')
}
