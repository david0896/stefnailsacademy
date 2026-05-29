/**
 * Enrollment Entity — Dominio puro, sin dependencias externas
 * Representa una inscripción con sus reglas de negocio
 */
export class Enrollment {
  constructor({ id, courseId, studentId, status, paymentMethod, paymentStatus, amountEUR, bcvEurRate, amountBs, bankName, referenceNumber, proofImageUrl, paymentProofVariants, notes, enrolledAt, confirmedAt, updatedAt }) {
    this.id = id;
    this.courseId = courseId;
    this.studentId = studentId;
    this.status = status;               // PENDING | CONFIRMED | CANCELLED | COMPLETED
    this.paymentMethod = paymentMethod; // TRANSFER | GATEWAY
    this.paymentStatus = paymentStatus; // PENDING | PAID | REFUNDED
    this.amountEUR = amountEUR;
    // Snapshot histórico de tasa BCV EUR y monto en Bs al momento del pago
    this.bcvEurRate = bcvEurRate ?? null;
    this.amountBs = amountBs ?? null;
    this.bankName = bankName ?? null;
    this.referenceNumber = referenceNumber ?? null;
    this.proofImageUrl = proofImageUrl ?? null;
    // Comprobante optimizado (4 variantes WebP) — paths del bucket privado
    this.paymentProofVariants = paymentProofVariants ?? null;
    this.notes = notes ?? null;
    this.enrolledAt = enrolledAt;
    this.confirmedAt = confirmedAt ?? null;
    this.updatedAt = updatedAt;
  }

  // Regla de negocio: solo PENDING puede confirmarse
  canBeConfirmed() {
    return this.status === 'PENDING';
  }

  // Regla de negocio: solo PENDING puede cancelarse
  canBeCancelled() {
    return this.status === 'PENDING';
  }

  // Regla de negocio: solo CONFIRMED da acceso al contenido
  hasAccessToContent() {
    return this.status === 'CONFIRMED';
  }

  isPending() {
    return this.status === 'PENDING';
  }

  isConfirmed() {
    return this.status === 'CONFIRMED';
  }
}
