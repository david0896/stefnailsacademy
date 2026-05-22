import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import PasswordInput from '@/components/PasswordInput';

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

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    confirm:   '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/registro', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          password:  form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(extractApiError(data.error, 'Error al registrarte'));
        setLoading(false);
        return;
      }

      // Destino tras registro: preservamos la intención (curso a inscribir)
      const callbackUrl = typeof router.query.callbackUrl === 'string'
        ? router.query.callbackUrl
        : '/Courses';

      // Auto-login tras registro exitoso
      const loginRes = await signIn('student-credentials', {
        redirect: false,
        email:    form.email,
        password: form.password,
      });

      if (loginRes?.error) {
        // Registro exitoso pero auto-login falló: al login manual conservando el destino
        router.push({ pathname: '/login', query: { callbackUrl } });
        return;
      }

      router.push(callbackUrl);
    } catch {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24 sm:pt-32 pb-16 sm:pb-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#383838] mb-1">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mb-6">Regístrate para inscribirte a nuestros cursos</p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <PasswordInput
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              showStrength
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <PasswordInput
              required
              minLength={8}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff5a5f] text-white py-2.5 rounded-[25px] text-sm font-medium hover:bg-[#ff3b3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link
            href={{
              pathname: '/login',
              query: router.query.callbackUrl ? { callbackUrl: router.query.callbackUrl } : {},
            }}
            className="text-[#ff5a5f] font-medium hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session?.user?.role === 'STUDENT') {
    return { redirect: { destination: '/Courses', permanent: false } };
  }
  return { props: {} };
}
