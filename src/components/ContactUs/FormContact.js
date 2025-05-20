import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

// Esquema de validación
const formSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Asunto requerido'),
  message: z.string().min(10, 'Mínimo 10 caracteres')
});

const FormContact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error en el envío');
      return response.json();
    },
    onSuccess: () => reset()
  });

  return (
    <div>
      <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tu nombre
            </label>
            <input
              {...register('name')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4 ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="John Trangelo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Tu correo
            </label>
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4 ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="hello@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Asunto
          </label>
          <input
            {...register('subject')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4 ${
              errors.subject ? 'border-red-500' : ''
            }`}
            placeholder="Solicitud de inscripción"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Mensaje
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4 ${
              errors.message ? 'border-red-500' : ''
            }`}
            placeholder="Escribe aqui tu mensaje"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#ff5a5f] text-white py-2 px-4 rounded-md hover:bg-[#bb3d41] focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Enviando...' : 'Enviar Mensaje'}
        </button>

        {isSuccess && (
          <p className="text-green-600 text-center mt-4">¡Mensaje enviado con éxito!</p>
        )}
        
        {isError && (
          <p className="text-red-500 text-center mt-4">Error al enviar el mensaje</p>
        )}
      </form>
    </div>
  );
};

export default FormContact;