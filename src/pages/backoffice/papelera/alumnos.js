import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import BOLayout from '@/components/backoffice/BOLayout';

const fmt = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      .format(new Date(iso));
  } catch { return '—'; }
};

export default function AlumnosEliminadosPage({ students = [] }) {
  const router = useRouter();
  const [restoring, setRestoring] = useState(null);
  const [error, setError] = useState('');

  const handleRestore = async (id, name) => {
    if (!confirm(`¿Restaurar al alumno "${name}"? Volverá a la lista principal.`)) return;
    setRestoring(id);
    setError('');
    try {
      const res = await fetch(`/api/backoffice/alumnos/${id}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al restaurar el alumno');
        return;
      }
      router.replace(router.asPath);
    } catch {
      setError('Error de conexión al restaurar el alumno');
    } finally {
      setRestoring(null);
    }
  };

  return (
    <BOLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Papelera · Alumnos</h1>
        <p className="text-sm text-gray-500 mt-0.5">{students.length} alumnos eliminados</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">La papelera de alumnos está vacía.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Alumno</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Eliminado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{s.phone || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3.5 text-gray-500">{fmt(s.deletedAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleRestore(s.id, `${s.firstName} ${s.lastName}`)}
                      disabled={restoring === s.id}
                      className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50"
                    >
                      {restoring === s.id ? 'Restaurando...' : 'Restaurar'}
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
  const { getDeletedStudents } = await import('@/application/students/getDeletedStudents');
  const students = await getDeletedStudents();
  // Nunca exponer el hash de contraseña
  const safe = students.map(({ password, ...rest }) => rest);
  return { props: { students: JSON.parse(JSON.stringify(safe)) } };
}
