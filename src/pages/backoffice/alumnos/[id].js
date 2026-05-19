import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import BOLayout from '@/components/backoffice/BOLayout';
import StudentForm from '@/components/backoffice/StudentForm';

export default function AlumnoPage({ student }) {
  const router = useRouter();
  const isViewMode = !!router.query.ver;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/backoffice/alumnos/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error?.formErrors?.[0] || result.error || 'Error al actualizar el alumno');
        return;
      }

      router.push('/backoffice/alumnos');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BOLayout>
      <div className="max-w-2xl">

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/backoffice/alumnos" className="hover:text-gray-700 transition-colors">Alumnos</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{student.firstName} {student.lastName}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {isViewMode ? 'Detalle del alumno' : 'Editar alumno'}
          </h1>
          {isViewMode && (
            <Link
              href={`/backoffice/alumnos/${student.id}`}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Editar
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <StudentForm
            defaultValues={student}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            readOnly={isViewMode}
            isEdit
          />
        </div>

      </div>
    </BOLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/backoffice/login', permanent: false } };
  }

  const { id } = context.params;

  try {
    const { getStudentById } = await import('@/application/students/getStudentById');
    const student = await getStudentById(id);
    // Por seguridad, nunca pasamos el hash de la contraseña al cliente
    if (student && student.password) delete student.password;
    return {
      props: { student: JSON.parse(JSON.stringify(student)) },
    };
  } catch {
    return { notFound: true };
  }
}
