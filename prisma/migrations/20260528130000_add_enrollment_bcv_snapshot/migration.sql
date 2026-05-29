-- Fase 13.5: snapshot de tasa BCV EUR y monto en Bs al momento del pago.
-- Aditivo e idempotente.

ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "bcvEurRate" DOUBLE PRECISION;
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "amountBs"   DOUBLE PRECISION;
