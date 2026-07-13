import Link from "next/link";
import { createDraftCasesFromImport, importCases } from "@/lib/actions";
import { getImportBatches } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";

export default async function ImportAdminPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const batches = await getImportBatches();
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.admin.bulkImport}</h1>
      <p className="mt-2 text-muted-foreground">
        {messages.admin.importDescription}
      </p>
      <form action={importCases} className="card mt-6 grid gap-3 p-5">
        <input className="input" name="file" type="file" accept=".csv,.xlsx" required />
        <button className="btn btn-primary" type="submit">{messages.admin.validateImport}</button>
      </form>
      <section className="card mt-8 overflow-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">{messages.admin.file}</th>
              <th className="p-3">{messages.admin.status}</th>
              <th className="p-3">{messages.admin.rows}</th>
              <th className="p-3">{messages.admin.valid}</th>
              <th className="p-3">{messages.admin.invalid}</th>
              <th className="p-3">{messages.admin.imported}</th>
              <th className="p-3">{messages.admin.skipped}</th>
              <th className="p-3">{messages.admin.actions}</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((item: ImportBatch) => {
              const rows = item.import_rows ?? [];
              const valid = item.valid_rows ?? rows.filter((row) => row.status === "valid").length;
              const invalid = item.error_rows ?? rows.filter((row) => row.status === "invalid").length;
              const imported = item.imported_rows ?? rows.filter((row) => row.status === "imported").length;
              const skipped = item.skipped_rows ?? rows.filter((row) => row.status === "skipped").length;
              const failedRows = rows.filter((row) => ["invalid", "skipped"].includes(row.status));
              return (
                <tr className="border-t border-border align-top" key={item.id}>
                  <td className="p-3 font-semibold">{item.file_name}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">{item.total_rows}</td>
                  <td className="p-3">{valid}</td>
                  <td className="p-3">{invalid}</td>
                  <td className="p-3">{imported}</td>
                  <td className="p-3">{skipped}</td>
                  <td className="p-3">
                    <div className="grid gap-2">
                      {valid > 0 ? (
                        <form action={createDraftCasesFromImport}>
                          <input type="hidden" name="batch_id" value={item.id} />
                          <button className="btn btn-primary w-full" type="submit">{messages.admin.createDraftCases}</button>
                        </form>
                      ) : null}
                      <Link className="btn btn-secondary" href={localizedHref(locale, "/admin/cases")}>{messages.admin.createdDrafts}</Link>
                      <Link className="btn btn-secondary" href={localizedHref(locale, "/admin/review")}>{messages.admin.reviewQueue}</Link>
                      {failedRows.length > 0 ? (
                        <details className="rounded border border-border bg-muted p-3">
                          <summary className="cursor-pointer font-bold">{messages.admin.failedRows}</summary>
                          <div className="mt-3 grid gap-2">
                            {failedRows.map((row) => (
                              <div className="rounded bg-card p-2" key={row.id}>
                                <p className="font-bold">Row {row.row_number}: {row.status}</p>
                                <p className="text-xs text-muted-foreground">{formatErrors(row.validation_errors, messages.errors.noErrorDetails)}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

type ImportBatch = {
  id: string;
  file_name: string;
  status: string;
  total_rows: number;
  valid_rows?: number;
  error_rows?: number;
  imported_rows?: number;
  skipped_rows?: number;
  import_rows?: Array<{
    id: string;
    row_number: number;
    status: string;
    validation_errors?: unknown;
  }>;
};

function formatErrors(errors: unknown, fallback: string) {
  if (Array.isArray(errors)) return errors.join(", ");
  if (typeof errors === "string") return errors;
  if (!errors) return fallback;
  return JSON.stringify(errors);
}

