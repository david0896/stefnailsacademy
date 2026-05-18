-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('PRINCIPIANTE', 'MEDIO', 'AVANZADO', 'MASTER');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "diasDeClases" INTEGER,
ADD COLUMN     "horasAcademicas" INTEGER,
ADD COLUMN     "instructor" TEXT,
ADD COLUMN     "nivel" "CourseLevel";
