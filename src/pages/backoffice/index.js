import { getSession } from 'next-auth/react';
import BOLayout from '@/components/backoffice/BOLayout';

export default function BackofficeDashboard() {
  return (
    <BOLayout>
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Las métricas del negocio se implementarán en la Fase 7.
        </p>
      </div>
    </BOLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/backoffice/login', permanent: false } };
  }
  return { props: {} };
}
