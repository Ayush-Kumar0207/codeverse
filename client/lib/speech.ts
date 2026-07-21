const DEFAULT_NARRATION_LANGUAGE = "en-US";
const DEFAULT_NARRATION_RATE = 0.9;
const MIN_CLEAR_RATE = 0.82;
const MAX_CLEAR_RATE = 0.94;

const preferredFemaleVoiceNames = [
  "microsoft aria",
  "microsoft jenny",
  "microsoft ava",
  "microsoft emma",
  "microsoft michelle",
  "microsoft sonia",
  "microsoft libby",
  "microsoft natasha",
  "google uk english female",
  "google us english",
  "samantha",
  "zira",
  "serena",
  "hazel",
  "joanna",
  "salli",
  "karen",
  "moira",
  "tessa",
  "fiona",
  "veena",
  "allison",
];

const knownMaleVoiceNames = [
  "david",
  "mark",
  "guy",
  "ryan",
  "eric",
  "andrew",
  "christopher",
  "william",
  "george",
  "james",
  "richard",
  "thomas",
  "daniel",
  "matthew",
  "aaron",
  "liam",
  "brian",
  "sean",
  "oliver",
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const includesAny = (value: string, candidates: string[]) =>
  candidates.some((candidate) => value.includes(candidate));

const preferredFemaleRank = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  return preferredFemaleVoiceNames.findIndex((candidate) => name.includes(candidate));
};

const voiceScore = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  const language = voice.lang.toLowerCase();
  const preferredRank = preferredFemaleRank(voice);
  let score = language === "en-us" ? 180 : language === "en-gb" ? 160 : language.startsWith("en") ? 130 : 0;

  if (preferredRank >= 0) score += 2400 - preferredRank * 25;
  if (/female|woman/.test(name)) score += 1200;
  if (/natural|neural|enhanced|online/.test(name)) score += 90;
  if (voice.default) score += 10;
  if (includesAny(name, knownMaleVoiceNames)) score -= 3000;

  return score;
};

const isPreferredFemaleVoice = (voice: SpeechSynthesisVoice | null) =>
  Boolean(voice && (preferredFemaleRank(voice) >= 0 || /female|woman/i.test(voice.name)));

export const isNarrationSupported = () =>
  typeof window !== "undefined" &&
  typeof window.speechSynthesis !== "undefined" &&
  typeof window.SpeechSynthesisUtterance !== "undefined";

/** Selects the same highest-quality female English voice everywhere narration is used. */
export function selectNarrationVoice(voices: SpeechSynthesisVoice[]) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const nonMaleEnglishVoices = englishVoices.filter(
    (voice) => !includesAny(voice.name.toLowerCase(), knownMaleVoiceNames)
  );
  const candidates = nonMaleEnglishVoices.length > 0 ? nonMaleEnglishVoices : englishVoices;

  return [...candidates].sort(
    (left, right) => voiceScore(right) - voiceScore(left) || left.name.localeCompare(right.name)
  )[0] || voices[0] || null;
}

/** Waits briefly for Chromium to expose its full voice list instead of accepting an early default voice. */
export function resolveNarrationVoice(
  synthesis: SpeechSynthesis,
  timeoutMs = 900
): Promise<SpeechSynthesisVoice | null> {
  const currentVoice = selectNarrationVoice(synthesis.getVoices());
  if (isPreferredFemaleVoice(currentVoice)) return Promise.resolve(currentVoice);

  return new Promise((resolve) => {
    let settled = false;
    let timer = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      synthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      window.clearTimeout(timer);
      resolve(selectNarrationVoice(synthesis.getVoices()));
    };
    const handleVoicesChanged = () => {
      const voice = selectNarrationVoice(synthesis.getVoices());
      if (isPreferredFemaleVoice(voice) || synthesis.getVoices().length > 0) finish();
    };

    timer = window.setTimeout(finish, timeoutMs);
    synthesis.addEventListener("voiceschanged", handleVoicesChanged);
  });
}

/** Applies one natural pitch and a narrow, intelligible speaking-rate range project-wide. */
export function applyClearNarrationVoice(
  utterance: SpeechSynthesisUtterance,
  voice: SpeechSynthesisVoice | null,
  rate = DEFAULT_NARRATION_RATE
) {
  utterance.lang = voice?.lang || DEFAULT_NARRATION_LANGUAGE;
  utterance.rate = clamp(rate, MIN_CLEAR_RATE, MAX_CLEAR_RATE);
  utterance.pitch = 1;
  utterance.volume = 1;
  if (voice) utterance.voice = voice;
}
