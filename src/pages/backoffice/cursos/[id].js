import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import BOLayout from '@/components/backoffice/BOLayout';
import CourseForm from '@/components/backoffice/CourseForm';

/** Extrae un string legible desde errores de Zod flatten o strings simples */
function extractApiError(error, fallback = 'Error desconocido') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error?.formErrors?.length > 0) return error.formErrors[0];
  if (error?.fieldErrors) {
    for (const msgs of Object.values(error.fieldErrors)) {
      if (msgs?.[0]) return msgs[0];
    }
  }
  return fallback;
}

export default function CursoPage({ course }) {
  const router = useRouter();
  const isViewMode = !!router.query.ver;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/backoffice/cursos/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(extractApiError(result.error, 'Error al actualizar el curso'));
        return;
      }

      router.push('/backoffice/cursos');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir campos legacy que RHF podría enviar como null al API
  // eslint-disable-next-line no-unused-vars
  const { duration: _dur, createdAt: _c, updatedAt: _u, id: _id, ...courseFields } = course;
  const defaultValues = {
    ...courseFields,
    date: course.date ? new Date(course.date).toISOString().split('T')[0] : null,
  };

  return (
    <BOLayout>
      <div className="max-w-2xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/backoffice/cursos" className="hover:text-gray-700 transition-colors">Cursos</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{course.title}</span>
        </div>

        {/* Cabecera con título y botón Editar en modo lectura */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {isViewMode ? 'Detalle del curso' : 'Editar curso'}
          </h1>
          {isViewMode && (
            <Link
              href={`/backoffice/cursos/${course.id}`}
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
          <CourseForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            readOnly={isViewMode}
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
    const { getCourseById } = await import('@/application/courses/getCourseById');
    const course = await getCourseById(id);
    return {
      props: { course: JSON.parse(JSON.stringify(course)) },
    };
  } catch {
    return { notFound: true };
  }
}
