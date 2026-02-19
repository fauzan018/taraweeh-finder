import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (token !== 'authenticated') {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 mb-20 md:mb-0">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
