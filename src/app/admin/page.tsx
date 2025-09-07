import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Server-side redirect to dashboard
  redirect('/admin/dashboard');
}
