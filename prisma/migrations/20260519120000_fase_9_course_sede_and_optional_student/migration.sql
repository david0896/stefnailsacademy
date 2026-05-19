-- Fase 9: ajustes de schema para soporte de auth pública + sede en cursos
-- Idempotente: usa IF EXISTS / IF NOT EXISTS para que sea seguro re-aplicar.

-- ── Courses ──────────────────────────────────────────────────────────
-- Eliminar columna `duration` (ya no se usa: reemplazada por horasAcademicas + diasDeClases)
ALTER TABLE "courses" DROP COLUMN IF EXISTS "duration";

-- Agregar columna `sede` (opcional, solo aplica a cursos PRESENCIAL)
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "sede" TEXT;

-- ── Students ─────────────────────────────────────────────────────────
-- Hacer opcionales los campos de perfil que antes eran requeridos.
-- Esto permite el registro público mínimo (firstName, lastName, email, password)
-- y que los campos extra se completen luego desde /mi-perfil o al inscribirse.
ALTER TABLE "students" ALTER COLUMN "phone"           DROP NOT NULL;
ALTER TABLE "students" ALTER COLUMN "idNumber"        DROP NOT NULL;
ALTER TABLE "students" ALTER COLUMN "city"            DROP NOT NULL;
ALTER TABLE "students" ALTER COLUMN "state"           DROP NOT NULL;
ALTER TABLE "students" ALTER COLUMN "experienceLevel" DROP NOT NULL;
