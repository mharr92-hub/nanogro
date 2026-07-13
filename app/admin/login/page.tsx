import { loginAdmin } from "@/lib/actions";
import { getMessages } from "@/lib/i18n";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const messages = await getMessages();
  void searchParams;
  return (
    <section className="grid min-h-[calc(100vh-128px)] place-items-center bg-accent p-6">
      <form action={loginAdmin} className="card grid w-full max-w-sm gap-4 p-6">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-primary">{messages.admin.protected}</p>
          <h1 className="mt-1 text-3xl font-black">{messages.admin.loginTitle}</h1>
        </div>
        <input className="input" name="password" type="password" placeholder={messages.admin.password} required />
        <button className="btn btn-primary" type="submit">{messages.common.login}</button>
      </form>
    </section>
  );
}

