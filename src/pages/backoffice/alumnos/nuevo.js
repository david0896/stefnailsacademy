import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import BOLayout from '@/components/backoffice/BOLayout';
import StudentForm from '@/components/backoffice/StudentForm';

export default function NuevoAlumnoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/backoffice/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error?.formErrors?.[0] || result.error || 'Error al registrar el alumno');
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
          <span className="text-gray-700">Nuevo alumno</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-6">Registrar nuevo alumno</h1>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <StudentForm onSubmit={handleSubmit} isLoading={isLoading} />
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
  return { props: {} };
}
