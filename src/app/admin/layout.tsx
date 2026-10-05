import { AdminShell } from "@/components/admin/AdminShell";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authorized = await isAdminAuthenticated();
  return <AdminShell authorized={authorized}>{children}</AdminShell>;
}
