import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const statusLabel = {
  DRAFT:    { text: 'Borrador',  style: 'bg-gray-100 text-gray-600' },
  ACTIVE:   { text: 'Activo',    style: 'bg-green-100 text-green-700' },
  INACTIVE: { text: 'Inactivo',  style: 'bg-red-100 text-red-600' },
};

const typeLabel = { PRESENCIAL: 'Presencial', ONLINE: 'Online' };

const fmt = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      .format(new Date(iso));
  } catch { return '—'; }
};

export default function CursosEliminadosPage({ courses = [] }) {
  const router = useRouter();
  const [restoring, setRestoring] = useState(null);
  const [error, setError] = useState('');

  const handleRestore = async (id, title) => {
    if (!confirm(`¿Restaurar el curso "${title}"? Volverá a la lista principal.`)) return;
    setRestoring(id);
    setError('');
    try {
      const res = await fetch(`/api/backoffice/cursos/${id}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al restaurar el curso');
        return;
      }
      router.replace(router.asPath);
    } catch {
      setError('Error de conexión al restaurar el curso');
    } finally {
      setRestoring(null);
    }
  };

  return (
    <BOLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Papelera · Cursos</h1>
        <p className="text-sm text-gray-500 mt-0.5">{courses.length} cursos eliminados</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">La papelera de cursos está vacía.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Eliminado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{course.description}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{typeLabel[course.type] ?? course.type}</td>
                  <td className="px-4 py-3.5">
                    {statusLabel[course.status] ? (
                      <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusLabel[course.status].style)}>
                        {statusLabel[course.status].text}
                      </span>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{fmt(course.deletedAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleRestore(course.id, course.title)}
                      disabled={restoring === course.id}
                      className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50"
                    >
                      {restoring === course.id ? 'Restaurando...' : 'Restaurar'}
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
  const { getDeletedCourses } = await import('@/application/courses/getDeletedCourses');
  const courses = await getDeletedCourses();
  return { props: { courses: JSON.parse(JSON.stringify(courses)) } };
}
