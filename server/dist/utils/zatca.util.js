"use strict";
/**
 * ZATCA Phase 2 (Fatoora) Compliant TLV Base64 QR Code Generator
 * Tag 1: Seller Name
 * Tag 2: VAT Registration Number
 * Tag 3: Invoice Timestamp (ISO 8601)
 * Tag 4: Invoice Total Amount (inclusive of VAT)
 * Tag 5: VAT Total Amount
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZatcaQR = generateZatcaQR;
function toTLV(tag, value) {
    const valueBuffer = Buffer.from(value, 'utf-8');
    const tagBuffer = Buffer.from([tag]);
    const lengthBuffer = Buffer.from([valueBuffer.length]);
    return Buffer.concat([tagBuffer, lengthBuffer, valueBuffer]);
}
function generateZatcaQR(params) {
    const tlv1 = toTLV(1, params.sellerName);
    const tlv2 = toTLV(2, params.vatNumber);
    const tlv3 = toTLV(3, params.timestamp);
    const tlv4 = toTLV(4, params.totalWithVat);
    const tlv5 = toTLV(5, params.vatAmount);
    const combined = Buffer.concat([tlv1, tlv2, tlv3, tlv4, tlv5]);
    return combined.toString('base64');
}
