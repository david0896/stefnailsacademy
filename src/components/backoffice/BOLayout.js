import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

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
  const [navigating, setNavigating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const start = () => setNavigating(true);
    const done  = () => {
      setNavigating(false);
      setSidebarOpen(false); // cerrar drawer en mobile al navegar
    };
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', done);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', done);
      router.events.off('routeChangeError', done);
    };
  }, [router.events]);

  // Bloquear scroll del body cuando el drawer está abierto en mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de progreso de navegación */}
      {navigating && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gray-200">
          <div className="h-full bg-gray-900 animate-pulse w-3/4" />
        </div>
      )}

      {/* Header mobile (solo visible <md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
          className="p-2 -ml-2 text-gray-700 hover:text-gray-900"
        >
          <HiMenu className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 leading-none">Stef Nails Academy</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Backoffice</p>
        </div>
        <div className="w-9" /> {/* spacer para balancear el botón */}
      </header>

      {/* Backdrop oscuro en mobile cuando el drawer está abierto */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: drawer en mobile, fijo en desktop */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 md:w-56 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300',
          'md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Stef Nails Academy</p>
            <p className="text-xs text-gray-400 mt-0.5">Backoffice</p>
          </div>
          {/* Botón cerrar drawer en mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
            className="md:hidden p-1 text-gray-500 hover:text-gray-900"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/backoffice'
              ? router.pathname === '/backoffice'
              : router.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block px-3 py-2.5 rounded-lg text-sm transition-colors',
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
      <main className="md:ml-56 pt-16 md:pt-0 p-4 sm:p-6 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
