import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions = {
  providers: [
    // ── Provider para administradores del backoffice ──
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin',
      credentials: {
        email:    { label: 'Email',      type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });
        if (!admin) return null;

        const ok = await bcrypt.compare(credentials.password, admin.password);
        if (!ok) return null;

        return {
          id:    admin.id,
          email: admin.email,
          name:  admin.name,
          role:  'ADMIN',
        };
      },
    }),

    // ── Provider para alumnos del sitio público ──
    CredentialsProvider({
      id: 'student-credentials',
      name: 'Student',
      credentials: {
        email:    { label: 'Email',      type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const student = await prisma.student.findUnique({
          where: { email: credentials.email },
        });
        if (!student || !student.password) return null;

        const ok = await bcrypt.compare(credentials.password, student.password);
        if (!ok) return null;

        return {
          id:    student.id,
          email: student.email,
          name:  `${student.firstName} ${student.lastName}`.trim(),
          role:  'STUDENT',
        };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/backoffice/login', // default; las páginas públicas llaman a signIn() directamente
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
