import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const statusLabel = {
  DRAFT:    { text: 'Borrador',  style: 'bg-gray-100 text-gray-600' },
  ACTIVE:   { text: 'Activo',    style: 'bg-green-100 text-green-700' },
  INACTIVE: { text: 'Inactivo',  style: 'bg-red-100 text-red-600' },
};

const typeLabel = {
  PRESENCIAL: 'Presencial',
  ONLINE:     'Online',
};

export default function CursosPage({ courses = [], loadError }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(loadError || '');

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Mover el curso "${title}" a la papelera? Podrás restaurarlo después.`)) return;

    setDeleting(id);
    setError('');

    try {
      const res = await fetch(`/api/backoffice/cursos/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al eliminar el curso');
        return;
      }

      router.replace(router.asPath);
    } catch {
      setError('Error de conexión al eliminar el curso');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <BOLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cursos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} cursos en total</p>
        </div>
        <Link
          href="/backoffice/cursos/nuevo"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Nuevo curso
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No hay cursos creados aún.</p>
          <Link
            href="/backoffice/cursos/nuevo"
            className="inline-block mt-3 text-sm text-gray-900 underline"
          >
            Crear el primer curso
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Precio (EUR)</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Días de clases</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  onClick={() => router.push(`/backoffice/cursos/${course.id}?ver=1`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{course.description}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {typeLabel[course.type]}
                  </td>
                  <td className="px-4 py-3.5">
                    {statusLabel[course.status] ? (
                      <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusLabel[course.status].style)}>
                        {statusLabel[course.status].text}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    €{Number(course.priceEUR ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {course.diasDeClases ? `${course.diasDeClases} días` : '—'}
                  </td>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/backoffice/cursos/${course.id}`}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={deleting === course.id}
                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleting === course.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
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

  try {
    const { getCourses } = await import('@/application/courses/getCourses');
    const courses = await getCourses();
    return {
      props: {
        courses: JSON.parse(JSON.stringify(courses)),
      },
    };
  } catch (err) {
    console.error('[backoffice/cursos] getServerSideProps error:', err);
    return {
      props: {
        courses: [],
        loadError: err?.message || 'Error al cargar los cursos',
      },
    };
  }
}
