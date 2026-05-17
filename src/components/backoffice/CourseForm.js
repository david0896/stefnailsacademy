import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';

const courseSchema = z.object({
  title:       z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  type:        z.enum(['PRESENCIAL', 'ONLINE']),
  status:      z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
  priceEUR:    z.coerce.number().positive('Debe ser mayor a 0'),
  duration:    z.string().min(1, 'Requerido'),
  maxSpots:    z.coerce.number().int().positive().optional().nullable(),
  date:        z.string().optional().nullable(),
  imageUrl:    z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
}).refine((data) => {
  if (data.type === 'PRESENCIAL') {
    return !!data.date && !!data.maxSpots;
  }
  return true;
}, {
  message: 'Los cursos presenciales requieren fecha y cupos',
  path: ['type'],
});

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-xs text-red-500';

export default function CourseForm({ defaultValues, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: 'DRAFT',
      type: 'PRESENCIAL',
      ...defaultValues,
    },
  });

  const courseType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Título */}
      <div>
        <label className={labelClass}>Título del curso</label>
        <input {...register('title')} className={inputClass} placeholder="Ej: Curso de Uñas Gel Básico" />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea {...register('description')} rows={3} className={inputClass} placeholder="Describe el contenido del curso..." />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      {/* Tipo + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tipo</label>
          <select {...register('type')} className={inputClass}>
            <option value="PRESENCIAL">Presencial</option>
            <option value="ONLINE">Online</option>
          </select>
          {errors.type && <p className={errorClass}>{errors.type.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select {...register('status')} className={inputClass}>
            <option value="DRAFT">Borrador</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Precio + Duración */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio (EUR)</label>
          <input {...register('priceEUR')} type="number" step="0.01" className={inputClass} placeholder="25.00" />
          {errors.priceEUR && <p className={errorClass}>{errors.priceEUR.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Duración</label>
          <input {...register('duration')} className={inputClass} placeholder="Ej: 20 horas" />
          {errors.duration && <p className={errorClass}>{errors.duration.message}</p>}
        </div>
      </div>

      {/* Campos solo para PRESENCIAL */}
      {courseType === 'PRESENCIAL' && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className={labelClass}>Fecha del curso</label>
            <input {...register('date')} type="date" className={inputClass} />
            {errors.date && <p className={errorClass}>{errors.date.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Cupos disponibles</label>
            <input {...register('maxSpots')} type="number" className={inputClass} placeholder="Ej: 15" />
            {errors.maxSpots && <p className={errorClass}>{errors.maxSpots.message}</p>}
          </div>
        </div>
      )}

      {/* Imagen */}
      <div>
        <label className={labelClass}>URL de imagen <span className="text-gray-400 font-normal">(opcional)</span></label>
        <input {...register('imageUrl')} className={inputClass} placeholder="https://..." />
        {errors.imageUrl && <p className={errorClass}>{errors.imageUrl.message}</p>}
      </div>

      {/* Botón */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Guardando...' : 'Guardar curso'}
        </button>
      </div>
    </form>
  );
}
