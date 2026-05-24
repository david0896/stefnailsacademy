-- Fase 11: soft delete (borrado lógico) en cursos, alumnos e inscripciones.
-- deletedAt NULL = activo; con fecha = en papelera (oculto de listas principales).
ALTER TABLE "courses"     ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "students"    ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
