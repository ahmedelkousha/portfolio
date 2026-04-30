/**
 * Converts Western (Latin) numerals to Eastern Arabic-Indic numerals.
 * Only converts when lang === "ar".
 * Examples: toArabicNumerals(45, "ar") → "٤٥"
 */
export const toArabicNumerals = (value: number | string, lang: string): string => {
  if (lang !== "ar") return String(value);
  return String(value).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
};
