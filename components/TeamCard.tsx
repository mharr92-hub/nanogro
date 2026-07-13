import Image from "next/image";
import Link from "next/link";
import { EvidenceSheet } from "@/components/ui";
import { initialsOf, type TeamMember } from "@/lib/team";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import { formatMessage } from "@/lib/i18n-shared";
import type { CaseStudy } from "@/lib/types";

/**
 * Ficha de un miembro del equipo tecnico.
 *
 * Lo importante no es la foto: son los informes que llevan su firma. Por eso debajo de las
 * credenciales van los CASOS que superviso, con su Ficha de Evidencia. Cualquiera puede
 * comprobar que el nombre que aparece aqui es el que aparece firmando el documento original,
 * que ademas es descargable desde cada caso.
 *
 * Si todavia no hay foto, se pinta un monograma con sus iniciales en vez de dejar un hueco
 * roto.
 */
export function TeamCard({
  member,
  cases,
  locale,
  messages,
  showCases = true
}: {
  member: TeamMember;
  cases: CaseStudy[];
  locale: Locale;
  messages: Messages;
  showCases?: boolean;
}) {
  const signed = cases.filter((item) => member.signedCaseIds.includes(item.id));

  return (
    <div>
      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 flex-none overflow-hidden rounded-card bg-accent">
          {member.photo ? (
            <Image
              alt={member.name}
              src={member.photo}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-h1 text-primary">
              {initialsOf(member)}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-label font-semibold uppercase tracking-wide text-data">
            {messages.team.roles[member.roleKey]}
          </p>
          <h2 className="mt-1 text-h2 text-foreground">{member.name}</h2>
          <ul className="mt-2 grid gap-0.5">
            {member.credentials.map((credential) => (
              <li key={credential} className="text-body text-muted-foreground">
                {credential}
              </li>
            ))}
          </ul>
          {signed.length ? (
            <p className="tabular mt-3 text-body text-foreground">
              {formatMessage(messages.team.signedCount, { count: signed.length })}
            </p>
          ) : null}
        </div>
      </div>

      {showCases && signed.length ? (
        <div className="mt-8">
          <h3 className="text-h3 text-foreground">{messages.team.signedTitle}</h3>
          <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.team.signedBody}</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {signed.map((item) => (
              <EvidenceSheet key={item.id} item={item} locale={locale} messages={messages} />
            ))}
          </div>
          <Link className="btn btn-secondary mt-6" href={localizedHref(locale, "/cases")}>
            {messages.homeSections.allCases}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
