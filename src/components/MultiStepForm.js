import { useState } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

// Esquemas de validación
const step1Schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  cedula: z.string()
    .min(6, "Mínimo 6 caracteres")
    .max(10, "Máximo 10 caracteres")
    .regex(/^[VvEeJj]\d+$/, "La cédula debe comenzar con una letra (V-E-J)"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 caracteres")
});

const step2Schema = z.object({
  bancoEmisor: z.string().min(1, "Banco requerido"),
  referencia: z.string().min(1, "Referencia requerida"),
  monto: z.number({
    required_error: "Monto requerido",
    invalid_type_error: "Debe ser un número"
  }).positive("Monto debe ser positivo"),
  aceptoTerminos: z.literal(true, {
    errorMap: () => ({ message: "Debe aceptar los términos" })
  })
});

const MultiStepForm = ({ nombreCurso, precio }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    bancoEmisor: '',
    referencia: '',
    monto: '',
    aceptoTerminos: false
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/enviar-inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, nombreCurso, precio })
      });

      if (!response.ok) throw new Error('Error al enviar la inscripción');
      return response.json();
    },
    onSuccess: () => setCurrentStep(3),
    onError: (error) => setErrors({ form: error.message })
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = async (step) => {
    try {
      if (step === 1) {
        await step1Schema.parseAsync(formData);
      } else if (step === 2) {
        await step2Schema.parseAsync({
          ...formData,
          monto: Number(formData.monto)
        });
      }
      return true;
    } catch (error) {
      const newErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return false;
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateStep(2);
    if (isValid) mutation.mutate(formData);
  };

  const ProgressIndicator = () => (
    <div className="relative mb-5">
      <div className="flex justify-between max-w-2xl mx-auto px-20">
        {[1, 2, 3].map((step) => (
          <div key={step} className="relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${currentStep >= step ? 'bg-[#ff5a5f] text-white' : 'bg-gray-300'}`}>
              {step}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <ProgressIndicator />

      {currentStep === 1 && (
        <div className="px-5">
          <div className="flex flex-col gap-2">
            <div>
              <input
                name="nombre"
                type="text"
                placeholder="Escribe tu nombre"
                className={`w-full p-3 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.nombre}
              />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <input
                name="apellido"
                type="text"
                placeholder="Escribe tu apellido"
                className={`w-full p-3 border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.apellido}
              />
              {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
            </div>

            <div>
              <input
                name="cedula"
                type="text"
                placeholder="Escribe tu cédula"
                className={`w-full p-3 border ${errors.cedula ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.cedula}
              />
              {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Escribe tu dirección de correo"
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                name="telefono"
                type="tel"
                placeholder="Escribe tu número de teléfono"
                className={`w-full p-3 border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.telefono}
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 bg-[#ff5a5f] text-white rounded-md hover:bg-[#ff5a5f]/70 transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="px-5">
          <div className="mb-2 py-2 px-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-base font-semibold text-[#ff5a5f] mb-2">Datos para transferencia - Pago Móvil</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className=' space-y-3'>
                <p className="text-gray-600 text-sm">Bancamiga</p>
                <p className="text-gray-600 text-sm">C.I: 16670743</p>
              </div>
              <div className=' space-y-3'>
                <p className="text-gray-600 text-sm">0412 3692194</p>
                <p className="text-gray-600 text-sm">{precio} Bs.</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Por favor realice la transferencia a estos datos y complete la información a continuación
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <input
                name="bancoEmisor"
                type="text"
                placeholder="Banco desde el que transfiere"
                className={`w-full p-3 border ${errors.bancoEmisor ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.bancoEmisor}
              />
              {errors.bancoEmisor && <p className="text-red-500 text-sm mt-1">{errors.bancoEmisor}</p>}
            </div>

            <div>
              <input
                name="referencia"
                type="number"
                placeholder="Número de referencia de la transferencia"
                className={`w-full p-3 border ${errors.referencia ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.referencia}
              />
              {errors.referencia && <p className="text-red-500 text-sm mt-1">{errors.referencia}</p>}
            </div>

            <div>
              <input
                name="monto"
                type="number"
                placeholder="Monto transferido"
                className={`w-full p-3 border ${errors.monto ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]`}
                onChange={handleChange}
                value={formData.monto}
              />
              {errors.monto && <p className="text-red-500 text-sm mt-1">{errors.monto}</p>}
            </div>

            <div className="mt-2">
              <label className="flex items-center text-sm">
                <input
                  name="aceptoTerminos"
                  type="checkbox"
                  className={`mr-2 ${errors.aceptoTerminos ? 'border-red-500' : ''}`}
                  onChange={handleChange}
                  checked={formData.aceptoTerminos}
                />
                <span>
                  Acepto los <a href="/termAndConditions" target='blank' className="text-[#ff5a5f] underline">términos y condiciones</a>
                </span>
              </label>
              {errors.aceptoTerminos && (
                <p className="text-red-500 text-sm mt-1">{errors.aceptoTerminos}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Anterior
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`px-6 py-2 bg-[#ff5a5f] text-white rounded-md hover:bg-[#ff5a5f]/70 transition ${
                mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {mutation.isPending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
          
          {errors.form && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.form}
            </p>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center px-5 py-12">
          <h2 className="text-2xl font-semibold mb-4">¡Gracias por registrarte!</h2>
          <p className="text-gray-600">Pronto será contactado por nuestros asesores.</p>
        </div>
      )}
    </form>
  );
};

export default MultiStepForm;