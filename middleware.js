import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // No body needed: la verificación va en el callback `authorized`
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Solo proteger /backoffice/*
        if (req.nextUrl.pathname.startsWith('/backoffice')) {
          return token?.role === 'ADMIN';
        }
        return true;
      },
    },
    pages: {
      signIn: '/backoffice/login',
    },
  }
);

export const config = {
  matcher: ['/backoffice/:path*'],
};
