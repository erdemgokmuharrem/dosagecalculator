import { lightTheme, darkTheme } from '../contexts/ThemeContext';

/**
 * WCAG contrast for every text/background pairing the dose UI relies on.
 *
 * A dose warning nobody can read is a warning nobody sees. This caught a real
 * regression: the result panel's limit banners used theme-aware text colours on
 * hardcoded light backgrounds, so in dark mode the "dose limit exceeded" banner
 * rendered light-pink text on pale yellow. Every pair below must meet WCAG AA
 * for normal text (4.5:1) in both themes.
 */

type Palette = typeof lightTheme.colors;
type Token = keyof Palette;

const channel = (value: number): number => {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const raw = hex.replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map(c => c + c)
          .join('')
      : raw;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const WCAG_AA = 4.5;

/** [foreground, background, where it is used]. '#FFFFFF' is a literal colour. */
const PAIRS: Array<[Token | '#FFFFFF', Token, string]> = [
  ['text', 'background', 'body text'],
  ['text', 'surface', 'card text'],
  ['textSecondary', 'surface', 'secondary labels on cards'],
  ['textSecondary', 'background', 'secondary labels on the screen'],
  ['critical', 'surface', 'inline field errors'],
  ['critical', 'background', 'inline field errors'],
  [
    'criticalText',
    'criticalLight',
    'critical dose warnings, blocked card, limit-exceeded banner',
  ],
  ['warningText', 'warningSurface', 'dose warnings'],
  ['infoText', 'infoSurface', 'informational dose notes'],
  ['safeText', 'safeSurface', 'within-limits banner'],
  ['text', 'criticalLight', 'UNVERIFIED provenance badge'],
  ['text', 'safeSurface', 'REVIEWED provenance badge'],
  ['#FFFFFF', 'primaryDark', 'dose result header'],
];

const resolve = (palette: Palette, token: Token | '#FFFFFF'): string =>
  token === '#FFFFFF' ? token : (palette[token] as string);

describe.each([
  ['light', lightTheme.colors],
  ['dark', darkTheme.colors],
])('%s theme', (_name, palette) => {
  it.each(PAIRS)('%s on %s meets WCAG AA (%s)', (fg, bg) => {
    const ratio = contrast(resolve(palette, fg), resolve(palette, bg));
    expect(Math.round(ratio * 100) / 100).toBeGreaterThanOrEqual(WCAG_AA);
  });
});

describe('contrast helper', () => {
  it('matches the reference values', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('flags the regression this suite exists for', () => {
    // Dark-mode safe text on the old hardcoded light-green banner background.
    expect(contrast(darkTheme.colors.safeText, '#D1FAE5')).toBeLessThan(2);
    // Dark-mode critical text on the old hardcoded pale-yellow background.
    expect(contrast(darkTheme.colors.criticalText, '#FEF3C7')).toBeLessThan(2);
  });
});
