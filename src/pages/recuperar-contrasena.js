import Link from 'next/link';

export default function RecuperarContrasenaPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-[#383838] mb-3">Recuperar contraseña</h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-5 my-5 text-left">
          <p className="text-sm text-yellow-800 font-medium mb-1">Próximamente disponible</p>
          <p className="text-sm text-yellow-700">
            Estamos terminando de habilitar la recuperación automática por correo. Mientras tanto,
            si olvidaste tu contraseña, escríbenos por WhatsApp y te ayudamos a recuperarla.
          </p>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          <Link href="/login" className="text-[#ff5a5f] font-medium hover:underline">
            ← Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
