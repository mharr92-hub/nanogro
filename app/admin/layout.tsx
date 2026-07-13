import { AdminNav } from "@/components/AdminNav";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  return (
    <main className={authenticated ? "grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[230px_minmax(0,1fr)]" : "min-h-[calc(100vh-64px)]"}>
      {authenticated ? <AdminNav /> : null}
      <div className={authenticated ? "min-w-0 p-4 md:p-6" : "min-w-0"}>{children}</div>
    </main>
  );
}

