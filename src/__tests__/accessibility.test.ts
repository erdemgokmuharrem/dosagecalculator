import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every pressable control must declare an accessibility role.
 *
 * React Native derives a touchable's spoken label from its child text, but not
 * its role: without `accessibilityRole`, VoiceOver and TalkBack never announce
 * "button" or "selected", so a screen-reader user cannot tell a dose toggle
 * from static text. App Review looks for this in medical apps. When this was
 * first measured, 38 of 38 touchables lacked a role.
 */

const SRC = join(__dirname, '..');
const TOUCHABLE =
  /<(TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Pressable)\b/g;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : walk(full);
    }
    return entry.endsWith('.tsx') ? [full] : [];
  });

/**
 * Returns the attribute text of the JSX opening tag starting at `start`.
 *
 * A naive `[^>]*` stops at the `>` of an arrow function inside `onPress={() =>
 * …}` and misreads every attribute after it. Arrows only occur inside braces,
 * so the tag closes at the first `>` seen at brace depth 0.
 */
const openingTag = (source: string, start: number): string => {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === '>' && depth === 0) return source.slice(start, i + 1);
  }
  return source.slice(start);
};

const findTouchables = () => {
  const found: Array<{ file: string; line: number; tag: string }> = [];
  for (const file of walk(SRC)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(TOUCHABLE)) {
      const start = match.index ?? 0;
      found.push({
        file: file.replace(`${SRC}/`, ''),
        line: source.slice(0, start).split('\n').length,
        tag: openingTag(source, start),
      });
    }
  }
  return found;
};

describe('accessibility', () => {
  const touchables = findTouchables();

  it('finds touchables to check', () => {
    // Guards the scanner: a broken pattern would make the next test vacuous.
    expect(touchables.length).toBeGreaterThan(30);
  });

  it('gives every touchable an accessibilityRole', () => {
    const missing = touchables
      .filter(({ tag }) => !/\baccessibilityRole\b/.test(tag))
      .map(({ file, line }) => `${file}:${line}`);
    expect(missing).toEqual([]);
  });

  it('labels touchables whose only content is an icon glyph', () => {
    // A control rendering just "✕" or "☆" has no readable text to derive a
    // label from; it must name its action explicitly.
    const ICON_ONLY = /^[\s✕×☆⭐←→↑↓⋯…•·\u{1F300}-\u{1FAFF}]+$/u;
    const unlabeled: string[] = [];

    for (const file of walk(SRC)) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(TOUCHABLE)) {
        const start = match.index ?? 0;
        const tag = openingTag(source, start);
        const close = source.indexOf(`</${match[1]}>`, start);
        if (close === -1) continue;
        const inner = source.slice(start + tag.length, close);
        // Visible text. A `{t('…')}` call renders a translated label, so it
        // counts as readable text — "💾 {t('calculation.saveCalculation')}" is
        // labelled, not glyph-only. Other expressions are dropped.
        const text = inner
          .replace(/\{\s*t\([^{}]*\)\s*\}/g, ' LABEL ')
          .replace(/\{[^{}]*\}/g, ' ')
          .replace(/<[^>]*>/g, ' ')
          .trim();
        const rendersOnlyGlyph = text.length > 0 && ICON_ONLY.test(text);
        const rendersOnlyIcon = text.length === 0 && /<Icon\b/.test(inner);
        if (
          (rendersOnlyGlyph || rendersOnlyIcon) &&
          !/\baccessibilityLabel\b/.test(tag)
        ) {
          unlabeled.push(
            `${file.replace(`${SRC}/`, '')}:${source.slice(0, start).split('\n').length}`
          );
        }
      }
    }

    expect(unlabeled).toEqual([]);
  });
});

describe('bottom tabs', () => {
  it('give every tab a title, so screen readers do not read the route name', () => {
    // Labels are drawn inside the icon (`tabBarShowLabel: false`), so the tab's
    // accessibility label falls back to `title`, then to the route name —
    // VoiceOver announced "CalculatorTab".
    const file = join(SRC, 'navigation/AppNavigator.tsx');
    const source = readFileSync(file, 'utf8');
    const tabs = [...source.matchAll(/<Tab\.Screen\b/g)].map(m =>
      openingTag(source, m.index ?? 0)
    );
    expect(tabs).toHaveLength(4);
    const untitled = tabs.filter(tag => !/\btitle:\s*t\(/.test(tag));
    expect(untitled).toEqual([]);
  });
});
