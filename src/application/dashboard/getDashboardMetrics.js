import prisma from '@/lib/prisma';

/**
 * getDashboardMetrics
 * Agrega en paralelo todas las métricas necesarias para el dashboard del BO.
 */
export const getDashboardMetrics = async () => {
  const [
    totalStudents,
    activeCourses,
    pendingEnrollments,
    confirmedEnrollments,
    cancelledEnrollments,
    revenueResult,
    recentEnrollments,
  ] = await Promise.all([
    // Total alumnos registrados (excluye eliminados)
    prisma.student.count({ where: { deletedAt: null } }),

    // Cursos activos (excluye eliminados)
    prisma.course.count({ where: { status: 'ACTIVE', deletedAt: null } }),

    // Inscripciones pendientes de confirmación
    prisma.enrollment.count({ where: { status: 'PENDING', deletedAt: null } }),

    // Inscripciones confirmadas
    prisma.enrollment.count({ where: { status: 'CONFIRMED', deletedAt: null } }),

    // Inscripciones canceladas
    prisma.enrollment.count({ where: { status: 'CANCELLED', deletedAt: null } }),

    // Ingresos confirmados (suma de amountEUR en inscripciones CONFIRMED)
    prisma.enrollment.aggregate({
      _sum: { amountEUR: true },
      where: { status: 'CONFIRMED', deletedAt: null },
    }),

    // Últimas 6 inscripciones (para la tabla de actividad reciente)
    prisma.enrollment.findMany({
      take: 6,
      where: { deletedAt: null },
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        course:  { select: { title: true } },
      },
    }),
  ]);

  return {
    totalStudents,
    activeCourses,
    pendingEnrollments,
    confirmedEnrollments,
    cancelledEnrollments,
    confirmedRevenueEUR: revenueResult._sum.amountEUR ?? 0,
    recentEnrollments,
  };
};
