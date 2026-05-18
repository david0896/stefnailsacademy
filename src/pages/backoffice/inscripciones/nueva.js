import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import BOLayout from '@/components/backoffice/BOLayout';

const schema = z.object({
  studentId:       z.string().min(1, 'Seleccioná un alumno'),
  courseId:        z.string().min(1, 'Seleccioná un curso'),
  paymentMethod:   z.enum(['TRANSFER', 'GATEWAY']),
  bankName:        z.string().optional(),
  referenceNumber: z.string().optional(),
  notes:           z.string().optional(),
});

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-xs text-red-500';

export default function NuevaInscripcionPage({ students, courses }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'TRANSFER' },
  });

  const paymentMethod = watch('paymentMethod');
  const selectedCourse = courses.find((c) => c.id === watch('courseId'));

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/backoffice/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error?.formErrors?.[0] || result.error || 'Error al crear la inscripción');
        return;
      }

      router.push('/backoffice/inscripciones');
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
          <Link href="/backoffice/inscripciones" className="hover:text-gray-700 transition-colors">Inscripciones</Link>
          <span>/</span>
          <span className="text-gray-700">Nueva inscripción</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-6">Registrar inscripción</h1>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Alumno */}
            <div>
              <label className={labelClass}>Alumno</label>
              <select {...register('studentId')} className={inputClass}>
                <option value="">— Seleccioná un alumno —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} — {s.email}
                  </option>
                ))}
              </select>
              {errors.studentId && <p className={errorClass}>{errors.studentId.message}</p>}
            </div>

            {/* Curso */}
            <div>
              <label className={labelClass}>Curso</label>
              <select {...register('courseId')} className={inputClass}>
                <option value="">— Seleccioná un curso —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — €{c.priceEUR.toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className={errorClass}>{errors.courseId.message}</p>}
            </div>

            {/* Monto calculado automáticamente */}
            {selectedCourse && (
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Monto de la inscripción: <span className="font-semibold text-gray-900">€{selectedCourse.priceEUR.toFixed(2)}</span>
                </p>
              </div>
            )}

            {/* Método de pago */}
            <div>
              <label className={labelClass}>Método de pago</label>
              <select {...register('paymentMethod')} className={inputClass}>
                <option value="TRANSFER">Transferencia bancaria</option>
                <option value="GATEWAY">Pasarela de pago</option>
              </select>
            </div>

            {/* Datos de transferencia (condicional) */}
            {paymentMethod === 'TRANSFER' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className={labelClass}>Banco</label>
                  <input {...register('bankName')} className={inputClass} placeholder="Ej: Banesco" />
                </div>
                <div>
                  <label className={labelClass}>N° de referencia</label>
                  <input {...register('referenceNumber')} className={inputClass} placeholder="Ej: 00123456" />
                </div>
              </div>
            )}

            {/* Notas */}
            <div>
              <label className={labelClass}>Notas <span className="text-gray-400 font-normal">(opcional)</span></label>
              <textarea {...register('notes')} rows={2} className={inputClass} placeholder="Observaciones adicionales..." />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registrando...' : 'Registrar inscripción'}
              </button>
            </div>

          </form>
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

  const { getStudents } = await import('@/application/students/getStudents');
  const { getCourses }  = await import('@/application/courses/getCourses');

  const [students, allCourses] = await Promise.all([getStudents(), getCourses()]);
  const courses = allCourses.filter((c) => c.status === 'ACTIVE');

  return {
    props: {
      students: JSON.parse(JSON.stringify(students)),
      courses:  JSON.parse(JSON.stringify(courses)),
    },
  };
}
