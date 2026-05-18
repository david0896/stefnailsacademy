import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Convierte string vacío / null / undefined → null para campos numéricos opcionales
const nullableInt = z.preprocess(
  (v) => (v === '' || v == null) ? null : Number(v),
  z.number().int().positive().nullable().optional()
);

const courseSchema = z.object({
  title:           z.string().min(3, 'Mínimo 3 caracteres'),
  description:     z.string().min(10, 'Mínimo 10 caracteres'),
  type:            z.enum(['PRESENCIAL', 'ONLINE']),
  status:          z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
  priceEUR:        z.coerce.number().positive('Debe ser mayor a 0'),
  duration:        z.string().optional().nullable(),
  instructor:      z.string().optional().nullable(),
  nivel:           z.preprocess(
    (v) => (v === '' || v == null) ? null : v,
    z.enum(['PRINCIPIANTE', 'MEDIO', 'AVANZADO', 'MASTER']).nullable().optional()
  ),
  horasAcademicas: nullableInt,
  diasDeClases:    nullableInt,
  maxSpots:        nullableInt,
  date:            z.string().optional().nullable(),
  imageUrl:        z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
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
const inputReadOnlyClass = 'w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-default';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-xs text-red-500';

const nivelLabel = {
  PRINCIPIANTE: 'Principiante',
  MEDIO:        'Medio',
  AVANZADO:     'Avanzado',
  MASTER:       'Master',
};

const typeLabel = {
  PRESENCIAL: 'Presencial',
  ONLINE:     'Online',
};

const statusLabel = {
  DRAFT:    'Borrador',
  ACTIVE:   'Activo',
  INACTIVE: 'Inactivo',
};

export default function CourseForm({ defaultValues, onSubmit, isLoading, readOnly = false }) {
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
      nivel: null,
      instructor: '',
      ...defaultValues,
    },
  });

  const courseType = watch('type');
  // En modo lectura siempre se muestran los campos de fecha/cupos
  const showPresencialFields = readOnly ? true : courseType === 'PRESENCIAL';

  const ic = readOnly ? inputReadOnlyClass : inputClass;

  return (
    <form
      onSubmit={readOnly ? (e) => e.preventDefault() : handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Título */}
      <div>
        <label className={labelClass}>Título del curso</label>
        <input
          {...register('title')}
          disabled={readOnly}
          className={ic}
          placeholder="Ej: Curso de Uñas Gel Básico"
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          {...register('description')}
          disabled={readOnly}
          rows={3}
          className={ic}
          placeholder="Describe el contenido del curso..."
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      {/* Tipo + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tipo</label>
          {readOnly ? (
            <p className={inputReadOnlyClass}>{typeLabel[courseType] ?? courseType}</p>
          ) : (
            <select {...register('type')} className={inputClass}>
              <option value="PRESENCIAL">Presencial</option>
              <option value="ONLINE">Online</option>
            </select>
          )}
          {errors.type && <p className={errorClass}>{errors.type.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          {readOnly ? (
            <p className={inputReadOnlyClass}>{statusLabel[watch('status')] ?? watch('status')}</p>
          ) : (
            <select {...register('status')} className={inputClass}>
              <option value="DRAFT">Borrador</option>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          )}
        </div>
      </div>

      {/* Precio */}
      <div>
        <label className={labelClass}>Precio (EUR)</label>
        <input
          {...register('priceEUR')}
          type={readOnly ? 'text' : 'number'}
          step="0.01"
          disabled={readOnly}
          className={ic}
          placeholder="25.00"
        />
        {errors.priceEUR && <p className={errorClass}>{errors.priceEUR.message}</p>}
      </div>

      {/* Instructor + Nivel */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Instructor <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input
            {...register('instructor')}
            disabled={readOnly}
            className={ic}
            placeholder="Ej: Stefany Pérez"
          />
        </div>
        <div>
          <label className={labelClass}>Nivel <span className="text-gray-400 font-normal">(opcional)</span></label>
          {readOnly ? (
            <p className={inputReadOnlyClass}>
              {nivelLabel[watch('nivel')] ?? '— Sin especificar —'}
            </p>
          ) : (
            <select {...register('nivel')} className={inputClass}>
              <option value="">— Sin especificar —</option>
              <option value="PRINCIPIANTE">Principiante</option>
              <option value="MEDIO">Medio</option>
              <option value="AVANZADO">Avanzado</option>
              <option value="MASTER">Master</option>
            </select>
          )}
        </div>
      </div>

      {/* Horas académicas + Días de clases */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Horas académicas <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input
            {...register('horasAcademicas')}
            type={readOnly ? 'text' : 'number'}
            disabled={readOnly}
            className={ic}
            placeholder="Ej: 20"
          />
        </div>
        <div>
          <label className={labelClass}>Días de clases <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input
            {...register('diasDeClases')}
            type={readOnly ? 'text' : 'number'}
            disabled={readOnly}
            className={ic}
            placeholder="Ej: 5"
          />
        </div>
      </div>

      {/* Fecha + Cupos — siempre visible en readOnly, condicional en edición */}
      {showPresencialFields && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className={labelClass}>Fecha del curso</label>
            <input
              {...register('date')}
              type={readOnly ? 'text' : 'date'}
              disabled={readOnly}
              className={ic}
            />
            {errors.date && <p className={errorClass}>{errors.date.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Cupos disponibles</label>
            <input
              {...register('maxSpots')}
              type={readOnly ? 'text' : 'number'}
              disabled={readOnly}
              className={ic}
              placeholder="Ej: 15"
            />
            {errors.maxSpots && <p className={errorClass}>{errors.maxSpots.message}</p>}
          </div>
        </div>
      )}

      {/* Imagen */}
      <div>
        <label className={labelClass}>URL de imagen <span className="text-gray-400 font-normal">(opcional)</span></label>
        <input
          {...register('imageUrl')}
          disabled={readOnly}
          className={ic}
          placeholder="https://..."
        />
        {errors.imageUrl && <p className={errorClass}>{errors.imageUrl.message}</p>}
      </div>

      {/* Botón — oculto en modo lectura */}
      {!readOnly && (
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar curso'}
          </button>
        </div>
      )}
    </form>
  );
}
