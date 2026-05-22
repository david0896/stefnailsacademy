import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const statusLabel = {
  PENDING:   { text: 'Pendiente',  style: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { text: 'Confirmada', style: 'bg-green-100 text-green-700' },
  CANCELLED: { text: 'Cancelada',  style: 'bg-red-100 text-red-600' },
  COMPLETED: { text: 'Completada', style: 'bg-blue-100 text-blue-700' },
};

const fmt = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      .format(new Date(iso));
  } catch { return '—'; }
};

export default function InscripcionesEliminadasPage({ enrollments = [] }) {
  const router = useRouter();
  const [restoring, setRestoring] = useState(null);
  const [error, setError] = useState('');

  const handleRestore = async (id) => {
    if (!confirm('¿Restaurar esta inscripción? Volverá a la lista principal.')) return;
    setRestoring(id);
    setError('');
    try {
      const res = await fetch(`/api/backoffice/inscripciones/${id}/restaurar`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al restaurar la inscripción');
        return;
      }
      router.replace(router.asPath);
    } catch {
      setError('Error de conexión al restaurar la inscripción');
    } finally {
      setRestoring(null);
    }
  };

  return (
    <BOLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Papelera · Inscripciones</h1>
        <p className="text-sm text-gray-500 mt-0.5">{enrollments.length} inscripciones eliminadas</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">La papelera de inscripciones está vacía.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Alumno</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Eliminada</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{e.student?.firstName} {e.student?.lastName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.student?.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{e.course?.title ?? '—'}</td>
                  <td className="px-4 py-3.5">
                    {statusLabel[e.status] ? (
                      <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusLabel[e.status].style)}>
                        {statusLabel[e.status].text}
                      </span>
                    ) : <span className="text-xs text-gray-400">{e.status}</span>}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{fmt(e.deletedAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleRestore(e.id)}
                      disabled={restoring === e.id}
                      className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50"
                    >
                      {restoring === e.id ? 'Restaurando...' : 'Restaurar'}
                    </button>
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
  const { getDeletedEnrollments } = await import('@/application/enrollments/getDeletedEnrollments');
  const raw = await getDeletedEnrollments();
  const enrollments = raw.map((e) => ({
    id: e.id,
    status: e.status,
    deletedAt: e.deletedAt,
    student: e.student ? { firstName: e.student.firstName, lastName: e.student.lastName, email: e.student.email } : null,
    course:  e.course  ? { title: e.course.title } : null,
  }));
  return { props: { enrollments: JSON.parse(JSON.stringify(enrollments)) } };
}
