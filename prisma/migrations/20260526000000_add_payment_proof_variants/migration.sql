-- Fase 12.1: comprobante de pago optimizado (WebP responsive).
-- Guarda paths del bucket privado 'comprobantes' como JSONB.
-- Aditiva e idempotente.

ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "paymentProofVariants" JSONB;
