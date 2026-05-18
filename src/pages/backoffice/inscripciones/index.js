import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const statusLabel = {
  PENDING:   { text: 'Pendiente',  style: 'bg-yellow-50 text-yellow-700' },
  CONFIRMED: { text: 'Confirmada', style: 'bg-green-100 text-green-700' },
  CANCELLED: { text: 'Cancelada',  style: 'bg-red-100 text-red-600' },
  COMPLETED: { text: 'Completada', style: 'bg-gray-100 text-gray-600' },
};

const methodLabel = {
  TRANSFER: 'Transferencia',
  GATEWAY:  'Pasarela',
};

const filters = [
  { label: 'Todas',      value: '' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Confirmadas',value: 'CONFIRMED' },
  { label: 'Canceladas', value: 'CANCELLED' },
];

export default function InscripcionesPage({ enrollments, currentStatus }) {
  const router = useRouter();

  const applyFilter = (status) => {
    router.push({
      pathname: '/backoffice/inscripciones',
      query: status ? { status } : {},
    });
  };

  return (
    <BOLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Inscripciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">{enrollments.length} inscripciones</p>
        </div>
        <Link
          href="/backoffice/inscripciones/nueva"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Nueva inscripción
        </Link>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => applyFilter(f.value)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              currentStatus === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No hay inscripciones para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Alumno</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Método</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Monto</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enrollments.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => router.push(`/backoffice/inscripciones/${e.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{e.student.firstName} {e.student.lastName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.student.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">{e.course.title}</td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusLabel[e.status].style)}>
                      {statusLabel[e.status].text}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{methodLabel[e.paymentMethod]}</td>
                  <td className="px-4 py-3.5 text-gray-600">€{e.amountEUR.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    {new Date(e.enrolledAt).toLocaleDateString('es-VE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BOLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/backoffice/login', permanent: false } };
  }

  const { status = '' } = context.query;
  const { getEnrollments } = await import('@/application/enrollments/getEnrollments');
  const enrollments = await getEnrollments(status ? { status } : {});

  return {
    props: {
      enrollments:   JSON.parse(JSON.stringify(enrollments)),
      currentStatus: status,
    },
  };
}
