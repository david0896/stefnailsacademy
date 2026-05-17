import { getSession, signOut } from 'next-auth/react';

export default function BackofficeDashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">
          Stef Nails Academy — Backoffice
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/backoffice/login' })}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="p-6">
        <p className="text-gray-500 text-sm">
          Bienvenido, <span className="font-medium text-gray-900">{user.name}</span>.
          El dashboard de métricas se construirá en la Fase 7.
        </p>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { destination: '/backoffice/login', permanent: false } };
  }

  return {
    props: {
      user: {
        email: session.user.email,
        name: session.user.name,
      },
    },
  };
}
