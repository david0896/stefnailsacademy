import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const studentSchema = z.object({
  firstName:       z.string().min(2, 'Mínimo 2 caracteres'),
  lastName:        z.string().min(2, 'Mínimo 2 caracteres'),
  email:           z.string().email('Email inválido'),
  phone:           z.string().min(7, 'Teléfono inválido'),
  idNumber:        z.string().min(4, 'Cédula inválida'),
  city:            z.string().min(2, 'Ciudad requerida'),
  state:           z.string().min(2, 'Estado requerido'),
  country:         z.string().min(2, 'País requerido'),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';
const inputReadOnlyClass = 'w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-default';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-xs text-red-500';

const levelLabel = {
  BEGINNER:     'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED:     'Avanzado',
};

export default function StudentForm({ defaultValues, onSubmit, isLoading, readOnly = false }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      country: 'Venezuela',
      experienceLevel: 'BEGINNER',
      ...defaultValues,
    },
  });

  const ic = readOnly ? inputReadOnlyClass : inputClass;

  return (
    <form
      onSubmit={readOnly ? (e) => e.preventDefault() : handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Nombre + Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <input {...register('firstName')} disabled={readOnly} className={ic} placeholder="Ej: María" />
          {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Apellido</label>
          <input {...register('lastName')} disabled={readOnly} className={ic} placeholder="Ej: González" />
          {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>Correo electrónico</label>
        <input {...register('email')} type="email" disabled={readOnly} className={ic} placeholder="ejemplo@correo.com" />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Teléfono + Cédula */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Teléfono</label>
          <input {...register('phone')} disabled={readOnly} className={ic} placeholder="Ej: 0414-1234567" />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Cédula</label>
          <input {...register('idNumber')} disabled={readOnly} className={ic} placeholder="Ej: V-12345678" />
          {errors.idNumber && <p className={errorClass}>{errors.idNumber.message}</p>}
        </div>
      </div>

      {/* Ciudad + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ciudad</label>
          <input {...register('city')} disabled={readOnly} className={ic} placeholder="Ej: Caracas" />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <input {...register('state')} disabled={readOnly} className={ic} placeholder="Ej: Miranda" />
          {errors.state && <p className={errorClass}>{errors.state.message}</p>}
        </div>
      </div>

      {/* País + Nivel */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>País</label>
          <input {...register('country')} disabled={readOnly} className={ic} placeholder="Venezuela" />
          {errors.country && <p className={errorClass}>{errors.country.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Nivel de experiencia</label>
          {readOnly ? (
            <p className={inputReadOnlyClass}>{levelLabel[watch('experienceLevel')] ?? watch('experienceLevel')}</p>
          ) : (
            <select {...register('experienceLevel')} className={inputClass}>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          )}
          {errors.experienceLevel && <p className={errorClass}>{errors.experienceLevel.message}</p>}
        </div>
      </div>

      {/* Botón */}
      {!readOnly && (
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar alumno'}
          </button>
        </div>
      )}
    </form>
  );
}
