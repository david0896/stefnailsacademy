import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const levelLabel = {
  BEGINNER:     { text: 'Principiante', style: 'bg-blue-50 text-blue-600' },
  INTERMEDIATE: { text: 'Intermedio',   style: 'bg-purple-50 text-purple-600' },
  ADVANCED:     { text: 'Avanzado',     style: 'bg-orange-50 text-orange-600' },
};

export default function AlumnosPage({ students }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar al alumno "${name}"? Esta acción no se puede deshacer.`)) return;

    setDeleting(id);
    setError('');

    try {
      const res = await fetch(`/api/backoffice/alumnos/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al eliminar el alumno');
        return;
      }

      router.replace(router.asPath);
    } catch {
      setError('Error de conexión al eliminar el alumno');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <BOLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Alumnos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{students.length} alumnos registrados</p>
        </div>
        <Link
          href="/backoffice/alumnos/nuevo"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Nuevo alumno
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No hay alumnos registrados aún.</p>
          <Link
            href="/backoffice/alumnos/nuevo"
            className="inline-block mt-3 text-sm text-gray-900 underline"
          >
            Registrar el primer alumno
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Alumno</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Ciudad / Estado</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Nivel</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => router.push(`/backoffice/alumnos/${student.id}?ver=1`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{student.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{student.phone}</td>
                  <td className="px-4 py-3.5 text-gray-600">{student.city}, {student.state}</td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', levelLabel[student.experienceLevel].style)}>
                      {levelLabel[student.experienceLevel].text}
                    </span>
                  </td>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/backoffice/alumnos/${student.id}`}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                        disabled={deleting === student.id}
                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleting === student.id ? 'Eliminando...' : 'Eliminar'}
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

  const { getStudents } = await import('@/application/students/getStudents');
  const students = await getStudents();

  return {
    props: { students: JSON.parse(JSON.stringify(students)) },
  };
}
