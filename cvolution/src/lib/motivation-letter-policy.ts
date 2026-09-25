const MAX_WORDS = 300;
const MAX_BULLETS = 3;
const MAX_BULLET_WORDS = 22;
const MAX_BULLET_CHARACTERS = 140;
const MAX_ESTIMATED_LINES = 48;
const ESTIMATED_LINE_WIDTH = 72;

export type MotivationLetterCheck =
  | { valid: true; reason: null }
  | { valid: false; reason: string };

function estimateWrappedLines(line: string) {
  let wrappedLines = 1;
  let currentLength = 0;

  for (const word of line.split(/\s+/u).filter(Boolean)) {
    const wordLength = Array.from(word).length;
    // A single long token may itself wrap at the page edge.
    if (wordLength > ESTIMATED_LINE_WIDTH) {
      if (currentLength > 0) {
        wrappedLines += 1;
        currentLength = 0;
      }
      wrappedLines += Math.ceil(wordLength / ESTIMATED_LINE_WIDTH) - 1;
      currentLength = wordLength % ESTIMATED_LINE_WIDTH;
      continue;
    }

    const nextLength = currentLength === 0 ? wordLength : currentLength + 1 + wordLength;
    if (nextLength > ESTIMATED_LINE_WIDTH) {
      wrappedLines += 1;
      currentLength = wordLength;
    } else {
      currentLength = nextLength;
    }
  }

  return wrappedLines;
}

export function checkMotivationLetter(letter: string): MotivationLetterCheck {
  if (!letter.trim()) {
    return { valid: false, reason: "Der AI-Service hat keinen Text zurückgegeben." };
  }

  const words = letter.trim().split(/\s+/u).filter(Boolean);
  if (words.length > MAX_WORDS) {
    return { valid: false, reason: `Das Schreiben überschreitet die Grenze von ${MAX_WORDS} Wörtern.` };
  }

  const lines = letter.split(/\r?\n/u);
  const bulletLines = lines.filter((line) => /^[-–•*]\s+/u.test(line));
  if (bulletLines.length > MAX_BULLETS) {
    return { valid: false, reason: `Das Schreiben enthält mehr als ${MAX_BULLETS} Aufzählungspunkte.` };
  }

  if (bulletLines.some((line) => Array.from(line).length > MAX_BULLET_CHARACTERS)) {
    return { valid: false, reason: `Ein Aufzählungspunkt überschreitet ${MAX_BULLET_CHARACTERS} Zeichen.` };
  }

  if (bulletLines.some((line) => line.replace(/^[-–•*]\s+/u, "").trim().split(/\s+/u).filter(Boolean).length > MAX_BULLET_WORDS)) {
    return { valid: false, reason: `Ein Aufzählungspunkt überschreitet ${MAX_BULLET_WORDS} Wörter.` };
  }

  const estimatedLines = lines.reduce((total, line) => {
    return total + (line.trim() ? estimateWrappedLines(line.trim()) : 1);
  }, 0);
  if (estimatedLines > MAX_ESTIMATED_LINES) {
    return { valid: false, reason: `Das Schreiben überschreitet die geschätzte Länge von ${MAX_ESTIMATED_LINES} Zeilen.` };
  }

  return { valid: true, reason: null };
}
