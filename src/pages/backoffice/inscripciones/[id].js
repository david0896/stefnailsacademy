import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const statusLabel = {
  PENDING:   { text: 'Pendiente',  style: 'bg-yellow-50 text-yellow-700' },
  CONFIRMED: { text: 'Confirmada', style: 'bg-green-100 text-green-700' },
  CANCELLED: { text: 'Cancelada',  style: 'bg-red-100 text-red-600' },
  COMPLETED: { text: 'Completada', style: 'bg-gray-100 text-gray-600' },
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm text-gray-900">{value || '—'}</p>
  </div>
);

export default function InscripcionPage({ enrollment }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(null); // 'confirmar' | 'cancelar'
  const [error, setError] = useState('');

  const handleAction = async (action) => {
    const msg = action === 'confirmar'
      ? '¿Confirmar esta inscripción? Se enviará un email al alumno.'
      : '¿Cancelar esta inscripción? Se enviará un email al alumno.';

    if (!confirm(msg)) return;

    setIsLoading(action);
    setError('');

    try {
      const res = await fetch(`/api/backoffice/inscripciones/${enrollment.id}/${action}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Error al ${action} la inscripción`);
        return;
      }

      router.replace(router.asPath);
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(null);
    }
  };

  const isPending = enrollment.status === 'PENDING';
  const s = statusLabel[enrollment.status];

  return (
    <BOLayout>
      <div className="max-w-2xl">

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/backoffice/inscripciones" className="hover:text-gray-700 transition-colors">Inscripciones</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{enrollment.student.firstName} {enrollment.student.lastName}</span>
        </div>

        {/* Cabecera con estado y acciones */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Detalle de inscripción</h1>
            <span className={clsx('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', s.style)}>
              {s.text}
            </span>
          </div>

          {isPending && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('confirmar')}
                disabled={!!isLoading}
                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading === 'confirmar' ? 'Confirmando...' : '✓ Confirmar'}
              </button>
              <button
                onClick={() => handleAction('cancelar')}
                disabled={!!isLoading}
                className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading === 'cancelar' ? 'Cancelando...' : '✕ Cancelar'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">

          {/* Alumno */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Alumno</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre" value={`${enrollment.student.firstName} ${enrollment.student.lastName}`} />
              <Field label="Email" value={enrollment.student.email} />
              <Field label="Teléfono" value={enrollment.student.phone} />
              <Field label="Cédula" value={enrollment.student.idNumber} />
            </div>
          </div>

          {/* Curso */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Curso</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Título" value={enrollment.course.title} />
              <Field label="Tipo" value={enrollment.course.type === 'PRESENCIAL' ? 'Presencial' : 'Online'} />
              <Field label="Monto pagado" value={`€${enrollment.amountEUR.toFixed(2)}`} />
              {enrollment.confirmedAt && (
                <Field label="Confirmada el" value={new Date(enrollment.confirmedAt).toLocaleDateString('es-VE')} />
              )}
            </div>
          </div>

          {/* Pago */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos de pago</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Método" value={enrollment.paymentMethod === 'TRANSFER' ? 'Transferencia bancaria' : 'Pasarela de pago'} />
              <Field label="Estado del pago" value={enrollment.paymentStatus === 'PAID' ? 'Pagado' : enrollment.paymentStatus === 'REFUNDED' ? 'Reembolsado' : 'Pendiente'} />
              {enrollment.bankName      && <Field label="Banco" value={enrollment.bankName} />}
              {enrollment.referenceNumber && <Field label="N° referencia" value={enrollment.referenceNumber} />}
            </div>
            {enrollment.notes && (
              <div className="mt-4">
                <Field label="Notas" value={enrollment.notes} />
              </div>
            )}
          </div>

          {/* Fechas */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Fechas</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Inscripto el" value={new Date(enrollment.enrolledAt).toLocaleDateString('es-VE')} />
              <Field label="Última actualización" value={new Date(enrollment.updatedAt).toLocaleDateString('es-VE')} />
            </div>
          </div>

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
    const { getEnrollmentById } = await import('@/application/enrollments/getEnrollmentById');
    const enrollment = await getEnrollmentById(id);
    return {
      props: { enrollment: JSON.parse(JSON.stringify(enrollment)) },
    };
  } catch {
    return { notFound: true };
  }
}
