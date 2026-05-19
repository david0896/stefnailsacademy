import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PasswordInput from '@/components/PasswordInput';

const nullishToUndef = (v) => (v === null || v === '' || v === undefined ? undefined : v);

const profileSchema = z.object({
  firstName:       z.string().min(2, 'Mínimo 2 caracteres'),
  lastName:        z.string().min(2, 'Mínimo 2 caracteres'),
  phone:           z.preprocess(nullishToUndef, z.string().min(7, 'Teléfono inválido').optional()),
  idNumber:        z.preprocess(nullishToUndef, z.string().min(4, 'Cédula inválida').optional()),
  city:            z.preprocess(nullishToUndef, z.string().min(2, 'Ciudad inválida').optional()),
  state:           z.preprocess(nullishToUndef, z.string().min(2, 'Estado inválido').optional()),
  country:         z.preprocess(nullishToUndef, z.string().optional()),
  experienceLevel: z.preprocess(nullishToUndef, z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional()),
  // Contraseña: opcional. Si la llena, debe ser ≥8 chars y matchear con confirmación.
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword:     z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (!data.newPassword) return;
  if (data.newPassword.length < 8) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['newPassword'], message: 'Mínimo 8 caracteres' });
  }
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'Las contraseñas no coinciden' });
  }
});

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

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent';
const inputDisabledClass = 'w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-xs text-red-500';

export default function MiPerfilPage({ student, hasPassword }) {
  const router = useRouter();
  const [serverError,  setServerError]  = useState('');
  const [successMsg,   setSuccessMsg]   = useState('');
  const [isLoading,    setIsLoading]    = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName:       student.firstName ?? '',
      lastName:        student.lastName  ?? '',
      phone:           student.phone     ?? '',
      idNumber:        student.idNumber  ?? '',
      city:            student.city      ?? '',
      state:           student.state     ?? '',
      country:         student.country   ?? 'Venezuela',
      experienceLevel: student.experienceLevel ?? '',
      currentPassword: '',
      newPassword:     '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');
    setIsLoading(true);

    const { confirmPassword: _c, ...rest } = data;
    const payload = { ...rest };
    // No mandamos newPassword vacío
    if (!payload.newPassword) {
      delete payload.newPassword;
      delete payload.currentPassword;
    }

    try {
      const res = await fetch('/api/auth/mi-perfil', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(extractApiError(json.error, 'No se pudieron guardar los cambios'));
        setIsLoading(false);
        return;
      }
      setSuccessMsg('Cambios guardados correctamente');
      // Reset solo los campos de password después de guardar
      reset({
        ...data,
        currentPassword: '',
        newPassword:     '',
        confirmPassword: '',
      });
      // Si el nombre cambió, recargamos la página para refrescar la sesión (navbar)
      if (rest.firstName !== student.firstName || rest.lastName !== student.lastName) {
        setTimeout(() => router.reload(), 800);
      }
    } catch {
      setServerError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] px-4 pt-28 pb-12">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/Courses" className="hover:text-gray-700 transition-colors">Mis cursos</Link>
          <span>/</span>
          <span className="text-gray-700">Mi perfil</span>
        </div>

        <h1 className="text-2xl xl:text-3xl font-bold text-[#383838] mb-1">Mi perfil</h1>
        <p className="text-sm text-gray-500 mb-6">
          Completa o actualiza tus datos. Los campos marcados como opcionales no son obligatorios.
        </p>

        {serverError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <p className="text-sm text-green-700">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">

          {/* Email — solo lectura */}
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input
              type="email"
              value={student.email}
              disabled
              className={inputDisabledClass}
            />
            <p className="text-xs text-gray-400 mt-1">Para cambiar tu correo, escríbenos por WhatsApp.</p>
          </div>

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input {...register('firstName')} className={inputClass} />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Apellido</label>
              <input {...register('lastName')} className={inputClass} />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Teléfono + Cédula */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input {...register('phone')} className={inputClass} placeholder="04141234567" />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Cédula <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input {...register('idNumber')} className={inputClass} placeholder="V12345678" />
              {errors.idNumber && <p className={errorClass}>{errors.idNumber.message}</p>}
            </div>
          </div>

          {/* Ciudad + Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Ciudad <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input {...register('city')} className={inputClass} placeholder="Caracas" />
              {errors.city && <p className={errorClass}>{errors.city.message}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Estado <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input {...register('state')} className={inputClass} placeholder="Miranda" />
              {errors.state && <p className={errorClass}>{errors.state.message}</p>}
            </div>
          </div>

          {/* País + Nivel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>País</label>
              <input {...register('country')} className={inputClass} />
              {errors.country && <p className={errorClass}>{errors.country.message}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Nivel de experiencia <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select {...register('experienceLevel')} className={inputClass}>
                <option value="">— Sin especificar —</option>
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzado</option>
              </select>
            </div>
          </div>

          {/* ───── Cambiar contraseña ───── */}
          <div className="border-t border-gray-100 pt-5 mt-2">
            <h3 className="text-sm font-semibold text-gray-900">Cambiar contraseña</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">
              {hasPassword
                ? 'Deja los campos vacíos si no quieres cambiarla.'
                : 'Aún no tienes contraseña. Crea una para acceder más rápido en futuros logins.'}
            </p>

            {hasPassword && (
              <div className="mb-3">
                <label className={labelClass}>Contraseña actual</label>
                <PasswordInput
                  {...register('currentPassword')}
                  autoComplete="current-password"
                  error={!!errors.currentPassword}
                />
                {errors.currentPassword && <p className={errorClass}>{errors.currentPassword.message}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nueva contraseña</label>
                <PasswordInput
                  {...register('newPassword')}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  showStrength
                  error={!!errors.newPassword}
                />
                {errors.newPassword && <p className={errorClass}>{errors.newPassword.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Confirmar</label>
                <PasswordInput
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                  placeholder="Repite la nueva contraseña"
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#ff5a5f] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#ff3b3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.role !== 'STUDENT') {
    return {
      redirect: {
        destination: '/login?callbackUrl=/mi-perfil',
        permanent:   false,
      },
    };
  }

  const { default: prisma } = await import('@/lib/prisma');
  const student = await prisma.student.findUnique({ where: { id: session.user.id } });
  if (!student) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const hasPassword = Boolean(student.password);
  delete student.password;

  return {
    props: {
      student: JSON.parse(JSON.stringify(student)),
      hasPassword,
    },
  };
}
