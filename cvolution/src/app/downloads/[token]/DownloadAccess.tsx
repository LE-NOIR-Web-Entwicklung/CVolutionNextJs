"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Download, Loader2, Mail } from "lucide-react";

type DownloadItem = { id: string; label: string; format: string; remaining: number };
type AccessState = { maskedEmail: string; unlocked: boolean; items: DownloadItem[] };

const BUTTON = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#204878] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66] disabled:cursor-not-allowed disabled:opacity-50";

async function readError(response: Response) {
  const body = await response.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : "Das hat nicht geklappt. Bitte versuchen Sie es erneut.";
}

export function DownloadAccess({ token }: { token: string }) {
  const [access, setAccess] = useState<AccessState | null>(null);
  const [fatalError, setFatalError] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const baseUrl = `/api/service-downloads/${encodeURIComponent(token)}`;

  const refresh = useCallback(async () => {
    const response = await fetch(baseUrl, { cache: "no-store" });
    if (response.ok) setAccess(await response.json());
    else setFatalError(await readError(response));
  }, [baseUrl]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // The code is requested by a click, because mail scanners open links on their own.
  async function requestCode() {
    setBusy(true);
    setError("");
    const response = await fetch(`${baseUrl}/code`, { method: "POST" });
    if (response.ok) setCodeSent(true);
    else setError(await readError(response));
    setBusy(false);
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch(`${baseUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (response.ok) await refresh();
    else setError(await readError(response));
    setBusy(false);
  }

  return (
    <main className="min-h-[70vh] bg-[#f4f7fb] px-4 py-12 text-[#142033] sm:px-6">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-[0_1rem_2.75rem_rgba(15,37,65,0.06)] ring-1 ring-[#dce5ef] sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#101828]">Ihre Downloads</h1>

        {fatalError ? (
          <p className="mt-4 text-sm leading-6 text-[#607089]">
            {fatalError} Bei Fragen erreichen Sie uns unter{" "}
            <a href="mailto:info@cvolution.ch" className="text-[#204878] underline">info@cvolution.ch</a>.
          </p>
        ) : !access ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-[#607089]">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Wird geladen
          </p>
        ) : access.unlocked ? (
          <>
            <ul className="mt-6 divide-y divide-[#e6edf5]">
              {access.items.map((item) => (
                <li key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#101828]">{item.label}</p>
                    <p className="mt-1 text-sm text-[#607089]">{item.format} · noch {item.remaining}-mal</p>
                  </div>
                  {item.remaining > 0 ? (
                    <a
                      href={`${baseUrl}/file/${item.id}`}
                      onClick={() => window.setTimeout(() => void refresh(), 2000)}
                      className={BUTTON}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" /> Herunterladen
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-[#607089]">Limit erreicht</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-[#607089]">
              Die Dokumente sind auf Ihren Namen lizenziert und nur für den persönlichen Gebrauch bestimmt.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm leading-6 text-[#607089]">
              Zum Schutz Ihrer Dokumente senden wir einen Bestätigungscode an {access.maskedEmail}.
            </p>
            {codeSent ? (
              <form onSubmit={verifyCode} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-stelliger Code"
                  aria-label="Bestätigungscode"
                  className="min-h-11 flex-1 rounded-xl border border-[#d5e1ee] px-4 text-base tracking-widest text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#204878]"
                />
                <button type="submit" disabled={busy || code.length !== 6} className={BUTTON}>Bestätigen</button>
              </form>
            ) : (
              <button type="button" onClick={requestCode} disabled={busy} className={`${BUTTON} mt-5 w-full sm:w-auto`}>
                <Mail className="h-4 w-4" aria-hidden="true" /> Code per E-Mail senden
              </button>
            )}
            {codeSent && (
              <button type="button" onClick={requestCode} disabled={busy} className="mt-3 text-sm font-medium text-[#204878] underline disabled:opacity-50">
                Neuen Code senden
              </button>
            )}
          </>
        )}

        {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      </section>
    </main>
  );
}
