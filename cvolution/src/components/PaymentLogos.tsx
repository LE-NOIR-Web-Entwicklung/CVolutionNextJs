import { SiAmericanexpress, SiApplepay, SiGooglepay, SiVisa } from "react-icons/si";
import type { ReactNode } from "react";

function Badge({ label, children, className = "bg-white" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <li
      title={label}
      className={`flex h-8 w-10 sm:w-12 items-center justify-center rounded-md border border-gray-200 ${className}`}
    >
      <span className="sr-only">{label}</span>
      {children}
    </li>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 32 20" className="h-5 w-8" aria-hidden="true">
      <circle cx="12" cy="10" r="8" fill="#EB001B" />
      <circle cx="20" cy="10" r="8" fill="#F79E1B" />
      <path d="M16 3.07a8 8 0 0 1 0 13.86 8 8 0 0 1 0-13.86Z" fill="#FF5F00" />
    </svg>
  );
}

// Wordmark badge. Replace with the official TWINT acceptance mark from the TWINT brand portal if available.
function TwintMark() {
  return (
    <svg viewBox="0 0 48 20" className="h-5 w-9 sm:w-11" aria-hidden="true">
      <text
        x="24"
        y="14.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="12"
        fontWeight="700"
        letterSpacing="0.5"
      >
        TWINT
      </text>
    </svg>
  );
}

export function PaymentLogos() {
  return (
    <ul aria-label="Akzeptierte Zahlungsmittel" className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      <Badge label="TWINT" className="bg-black border-black">
        <TwintMark />
      </Badge>
      <Badge label="Visa">
        <SiVisa className="h-6 w-9 text-[#1A1F71]" aria-hidden="true" />
      </Badge>
      <Badge label="Mastercard">
        <MastercardMark />
      </Badge>
      <Badge label="American Express" className="bg-[#2E77BC] border-[#2E77BC]">
        <SiAmericanexpress className="h-6 w-6 text-white" aria-hidden="true" />
      </Badge>
      <Badge label="Apple Pay">
        <SiApplepay className="h-7 w-9 text-black" aria-hidden="true" />
      </Badge>
      <Badge label="Google Pay">
        <SiGooglepay className="h-7 w-9 text-[#3C4043]" aria-hidden="true" />
      </Badge>
    </ul>
  );
}
