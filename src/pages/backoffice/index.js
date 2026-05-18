import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const statusLabel = {
  PENDING:   { text: 'Pendiente',  style: 'bg-yellow-50 text-yellow-700' },
  CONFIRMED: { text: 'Confirmada', style: 'bg-green-100 text-green-700' },
  CANCELLED: { text: 'Cancelada',  style: 'bg-red-100 text-red-600' },
  COMPLETED: { text: 'Completada', style: 'bg-gray-100 text-gray-600' },
};

// ─── Tarjeta de métrica ───────────────────────────────────────────────────
function MetricCard({ label, value, sub, href, accent }) {
  const content = (
    <div className={clsx(
      'bg-white border rounded-xl px-5 py-4 transition-colors',
      href ? 'border-gray-100 hover:border-gray-300 cursor-pointer' : 'border-gray-100',
    )}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className={clsx('text-3xl font-semibold', accent ?? 'text-gray-900')}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ─── Página principal ─────────────────────────────────────────────────────
export default function BackofficeDashboard({ metrics }) {
  const {
    totalStudents,
    activeCourses,
    pendingEnrollments,
    confirmedEnrollments,
    cancelledEnrollments,
    confirmedRevenueEUR,
    recentEnrollments,
  } = metrics;

  return (
    <BOLayout>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        <MetricCard
          label="Alumnos"
          value={totalStudents}
          sub="registrados"
          href="/backoffice/alumnos"
        />
        <MetricCard
          label="Cursos activos"
          value={activeCourses}
          sub="publicados"
          href="/backoffice/cursos"
        />
        <MetricCard
          label="Inscripciones pendientes"
          value={pendingEnrollments}
          sub="por confirmar"
          href="/backoffice/inscripciones?status=PENDING"
          accent={pendingEnrollments > 0 ? 'text-yellow-600' : 'text-gray-900'}
        />
        <MetricCard
          label="Ingresos confirmados"
          value={`€${confirmedRevenueEUR.toFixed(2)}`}
          sub={`${confirmedEnrollments} inscripciones`}
        />
      </div>

      {/* Resumen de inscripciones por estado */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Confirmadas</p>
          <p className="text-2xl font-semibold text-green-600">{confirmedEnrollments}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pendientes</p>
          <p className="text-2xl font-semibold text-yellow-600">{pendingEnrollments}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Canceladas</p>
          <p className="text-2xl font-semibold text-red-500">{cancelledEnrollments}</p>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Inscripciones recientes</h2>
          <Link
            href="/backoffice/inscripciones"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {recentEnrollments.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">No hay inscripciones aún.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Alumno</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Curso</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEnrollments.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{e.student.firstName} {e.student.lastName}</p>
                    <p className="text-xs text-gray-400">{e.student.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{e.course.title}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusLabel[e.status].style)}>
                      {statusLabel[e.status].text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(e.enrolledAt).toLocaleDateString('es-VE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </BOLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/backoffice/login', permanent: false } };
  }

  const { getDashboardMetrics } = await import('@/application/dashboard/getDashboardMetrics');
  const metrics = await getDashboardMetrics();

  return {
    props: { metrics: JSON.parse(JSON.stringify(metrics)) },
  };
}
