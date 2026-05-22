import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import PasswordInput from '@/components/PasswordInput';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('student-credentials', {
      redirect: false,
      email:    form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      setError('Correo o contraseña incorrectos');
      return;
    }

    const callback = router.query.callbackUrl || '/Courses';
    router.push(typeof callback === 'string' ? callback : '/Courses');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24 sm:pt-32 pb-16 sm:pb-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#383838] mb-1">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 mb-6">Accede a tu cuenta de alumno</p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="text-right mt-1">
              <Link href="/recuperar-contrasena" className="text-xs text-[#ff5a5f] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff5a5f] text-white py-2.5 rounded-[25px] text-sm font-medium hover:bg-[#ff3b3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          ¿No tienes cuenta?{' '}
          <Link
            href={{
              pathname: '/registro',
              query: router.query.callbackUrl ? { callbackUrl: router.query.callbackUrl } : {},
            }}
            className="text-[#ff5a5f] font-medium hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

// Si ya hay sesión, redirige a /Courses
export async function getServerSideProps(context) {
  const session = await getSession(context);
  // Solo redirigimos si ya hay sesión de ALUMNO. Una sesión admin (del BO)
  // no debe impedir que un alumno acceda al login público.
  if (session?.user?.role === 'STUDENT') {
    return { redirect: { destination: '/Courses', permanent: false } };
  }
  return { props: {} };
}
