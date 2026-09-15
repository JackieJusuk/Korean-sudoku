export const SIZE = 9;
export const BOX_SIZE = 3;
export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const JAMO_CHARACTERS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ'] as const;

export type Jamo = (typeof JAMO_CHARACTERS)[number];

export function digitToJamo(digit: number): string {
  return digit === 0 ? '' : JAMO_CHARACTERS[digit - 1];
}

export function jamoToDigit(jamo: string): number {
  const index = JAMO_CHARACTERS.indexOf(jamo as Jamo);
  return index === -1 ? 0 : index + 1;
}
