-- Fase 10: soporte de imágenes optimizadas (variantes WebP responsive)
-- Campo JSON opcional con { base, width, height, sizes: {400,800,1200,1600} }.
-- Aditivo: imageUrl se mantiene para imágenes externas (modo híbrido URL/upload).
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "imageVariants" JSONB;
