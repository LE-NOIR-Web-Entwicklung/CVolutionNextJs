"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { trackFunnel } from "@/lib/funnel";
import {
  MEDIAN_MONTHLY_2024,
  calculatePayroll,
  formatChf,
  payrollConfig,
  selectablePayrollYears,
  type PayrollInput,
} from "@/lib/swiss-payroll";

const field =
  "w-full rounded-xl border border-[#d5e1ee] bg-white px-4 py-3 text-base text-[#101828] tabular-nums focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204878]";
const label = "mb-1.5 block text-sm font-semibold text-[#101828]";

function Segmented<T extends string | number>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="grid gap-1 rounded-xl bg-[#eef4fb] p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === option.value ? "bg-[#204878] text-white shadow-sm" : "text-[#40516a] hover:bg-white/70 hover:text-[#204878]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * `defaultYear` comes from the server render (the payroll year in force), so server and client
 * render the same numbers. The page revalidates, so it moves to the new year on 1 January.
 */
export function SalaryCalculator({ defaultYear }: { defaultYear: number }) {
  const id = useId();
  const [year, setYear] = useState(defaultYear);
  const [gross, setGross] = useState("6500");
  const [period, setPeriod] = useState<PayrollInput["period"]>("month");
  const [payments, setPayments] = useState<PayrollInput["payments"]>(13);
  const [workload, setWorkload] = useState("100");
  const [age, setAge] = useState("35");
  const [otherPercent, setOtherPercent] = useState("1.5");
  const [tracked, setTracked] = useState(false);

  const parse = (value: string) => Number(value.replace(/['’\s]/g, "").replace(",", "."));

  const result = useMemo(
    () =>
      calculatePayroll({
        gross: parse(gross),
        period,
        payments,
        workload: parse(workload) || 100,
        age: parse(age) || 35,
        otherPercent: Number.isFinite(parse(otherPercent)) ? parse(otherPercent) : 0,
        year,
      }),
    [gross, period, payments, workload, age, otherPercent, year]
  );

  const years = selectablePayrollYears(defaultYear);
  const nextYear = years.find((y) => y > year);
  const hasValue = result.annualGross > 0;
  const delta = result.medianDeltaPercent;
  const deltaText =
    Math.abs(delta) < 3
      ? "etwa beim Schweizer Medianlohn"
      : `${Math.abs(delta).toFixed(0)} % ${delta > 0 ? "über" : "unter"} dem Schweizer Medianlohn`;

  // Switching between monthly and yearly converts the amount, so the result stays the same.
  function changePeriod(next: PayrollInput["period"]) {
    if (next === period) return;
    const amount = parse(gross);
    if (Number.isFinite(amount) && amount > 0) {
      setGross(String(Math.round(next === "year" ? amount * payments : amount / payments)));
    }
    setPeriod(next);
  }

  function onInteract() {
    if (tracked) return;
    setTracked(true);
    trackFunnel({ name: "calculator_used" });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start" onChange={onInteract}>
      {/*
        Mobile order (via `order`): inputs, net result, breakdown, comparison.
        Desktop: inputs + breakdown on the left, results wrapper sticky on the right.
      */}
      <form className="order-1 rounded-3xl bg-white p-5 lg:col-start-1 lg:row-start-1 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef] sm:p-7" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-gross`} className={label}>
              Bruttolohn in CHF
            </label>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
              <input
                id={`${id}-gross`}
                inputMode="decimal"
                autoComplete="off"
                value={gross}
                onChange={(e) => setGross(e.target.value)}
                className={field}
                placeholder="z.B. 6500"
              />
              <Segmented
                name="Zeitraum"
                value={period}
                onChange={changePeriod}
                options={[
                  { value: "month", label: "pro Monat" },
                  { value: "year", label: "pro Jahr" },
                ]}
              />
            </div>
          </div>

          <div>
            <p className={label}>Anzahl Monatslöhne</p>
            <Segmented
              name="Anzahl Monatslöhne"
              value={payments}
              onChange={setPayments}
              options={[
                { value: 12, label: "12" },
                { value: 13, label: "13" },
              ]}
            />
          </div>

          <div>
            <label htmlFor={`${id}-workload`} className={label}>
              Pensum in %
            </label>
            <input id={`${id}-workload`} inputMode="numeric" value={workload} onChange={(e) => setWorkload(e.target.value)} className={field} />
          </div>

          <div>
            <label htmlFor={`${id}-age`} className={label}>
              Alter
            </label>
            <input id={`${id}-age`} inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} className={field} />
            <p className="mt-1 text-xs text-[#607089]">Bestimmt den Pensionskassenbeitrag.</p>
          </div>

          <div>
            <label htmlFor={`${id}-other`} className={label}>
              NBU / KTG in %
            </label>
            <input id={`${id}-other`} inputMode="decimal" value={otherPercent} onChange={(e) => setOtherPercent(e.target.value)} className={field} />
            <p className="mt-1 text-xs text-[#607089]">Steht auf Ihrer Lohnabrechnung, oft 1–2 %.</p>
          </div>

          {years.length > 1 ? (
            <div className="sm:col-span-2">
              <p className={label}>Lohnjahr</p>
              <Segmented
                name="Lohnjahr"
                value={year}
                onChange={setYear}
                options={years.map((y) => ({ value: y, label: String(y) }))}
              />
              <p className="mt-1 text-xs text-[#607089]">
                {nextYear
                  ? `Ab 1. Januar ${nextYear} gelten neue BVG-Grenzbeträge (Koordinationsabzug CHF ${payrollConfig(nextYear).bvg.coordinationDeduction.toLocaleString("de-CH")}).`
                  : `Beitragssätze und BVG-Grenzbeträge gültig ab 1. Januar ${year}.`}
              </p>
            </div>
          ) : null}
        </div>

      </form>

      <div className="contents lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-4">
        <div aria-live="polite" className="order-2 rounded-3xl bg-[#173d66] p-6 lg:order-none text-white shadow-xl shadow-[#173d66]/15">
          <p className="text-sm font-medium text-white/70">Nettolohn pro Monat · {result.year}</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums">{hasValue ? formatChf(result.netPerPayment) : "–"}</p>
          <p className="mt-1 text-sm text-white/70">
            × {payments} Monatslöhne = {hasValue ? formatChf(result.annualNet) : "–"} pro Jahr
          </p>
          {hasValue ? (
            <p className="mt-4 border-t border-white/15 pt-4 text-sm text-white/80">
              Abzüge total {formatChf(result.totalDeductions)} ({((result.totalDeductions / result.annualGross) * 100).toFixed(1)} %)
            </p>
          ) : null}
        </div>

        {hasValue ? (
          <div className="order-4 rounded-3xl bg-white p-6 ring-1 ring-[#dce5ef] lg:order-none">
            <p className="text-sm font-medium text-[#607089]">Im Vergleich zur Schweiz</p>
            <p className="mt-1 text-lg font-semibold text-[#101828] text-balance">Ihr Lohn liegt {deltaText}.</p>
            <p className="mt-2 text-xs leading-5 text-[#607089]">
              Hochgerechnet auf 100 %: {formatChf(result.fullTimeMonthly)} pro Monat. Median aller Berufe gemäss BFS 2024:{" "}
              {formatChf(MEDIAN_MONTHLY_2024)}.
            </p>
            <div className="mt-5 rounded-2xl bg-[#eef4fb] p-4">
              <p className="text-sm font-semibold text-[#101828]">Aber ist er fair für Ihren Beruf?</p>
              <p className="mt-1 text-sm leading-6 text-[#40516a]">
                Der Median gilt für alle Berufe. Wir vergleichen Ihren Lohn mit Ihrer Funktion, Branche und Ihrem Kanton.
              </p>
              <Link
                href="/service-salary"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#204878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173d66]"
              >
                Lohnanalyse ab CHF 69 <span aria-hidden="true" className="ml-1.5">→</span>
              </Link>
            </div>
          </div>
        ) : null}
      </div>

        {hasValue ? (
          <div className="order-3 rounded-3xl bg-white p-5 ring-1 ring-[#dce5ef] sm:p-7 lg:col-start-1 lg:row-start-2">
          <table className="w-full text-sm">
            <caption className="sr-only">Abzüge pro Jahr</caption>
            <thead>
              <tr className="border-b border-[#e6edf5] text-left text-xs uppercase tracking-wide text-[#607089]">
                <th className="py-2 font-semibold">Abzug</th>
                <th className="py-2 text-right font-semibold">pro Jahr</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e6edf5]">
                <td className="py-2.5 font-semibold text-[#101828]">Bruttolohn</td>
                <td className="py-2.5 text-right font-semibold tabular-nums text-[#101828]">{formatChf(result.annualGross)}</td>
              </tr>
              {result.lines.map((line) => (
                <tr key={line.label} className="border-b border-[#e6edf5]">
                  <td className="py-2.5 text-[#40516a]">
                    {line.label}
                    <span className="block text-xs text-[#8090a5]">{line.note}</span>
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-[#40516a]">− {formatChf(line.annual)}</td>
                </tr>
              ))}
              <tr>
                <td className="pt-3 font-semibold text-[#101828]">Nettolohn</td>
                <td className="pt-3 text-right font-semibold tabular-nums text-[#101828]">{formatChf(result.annualNet)}</td>
              </tr>
            </tbody>
          </table>
          </div>
        ) : null}
    </div>
  );
}
