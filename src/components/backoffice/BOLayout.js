import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { clsx } from 'clsx';

const navItems = [
  { label: 'Dashboard',      href: '/backoffice' },
  { label: 'Cursos',         href: '/backoffice/cursos' },
  { label: 'Inscripciones',  href: '/backoffice/inscripciones' },
  { label: 'Alumnos',        href: '/backoffice/alumnos' },
  { label: 'Contenido',      href: '/backoffice/contenido' },
];

export default function BOLayout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Stef Nails Academy</p>
          <p className="text-xs text-gray-400 mt-0.5">Backoffice</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.href === '/backoffice'
              ? router.pathname === '/backoffice'
              : router.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 truncate mb-2">{session?.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/backoffice/login' })}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  );
}
