import { describe, expect, it } from 'vitest'

import { highlightLine, isHighlightable } from '../lib/syntax.js'
import { DEFAULT_THEME, fromSkin } from '../theme.js'

const t = DEFAULT_THEME

const ayuSkin = {
  background: '#0B0E14',
  ui_primary: '#C792EA',
  ui_accent: '#FF8F40',
  ui_text: '#D9DEE8',
  ui_heading: '#C792EA',
  banner_dim: '#8A91A5',
  syntax_keyword: '#FF8F40',
  syntax_string: '#AAD94C',
  syntax_number: '#D2A6FF',
  syntax_function: '#FFD580',
  syntax_type: '#73D0FF',
  syntax_comment: '#6B7280',
  syntax_constant: '#DFBFFF',
  syntax_operator: '#F29668',
  syntax_punctuation: '#8A91A5',
  diff_added: '#16261E',
  diff_removed: '#32181E',
  diff_added_word: '#AAD94C',
  diff_removed_word: '#F07178'
}

const ayuTheme = fromSkin(ayuSkin, { agent_name: 'Ayu Hermes Agent' })

describe('syntax highlighter', () => {
  it('recognizes supported langs and aliases', () => {
    expect(isHighlightable('ts')).toBe(true)
    expect(isHighlightable('js')).toBe(true)
    expect(isHighlightable('python')).toBe(true)
    expect(isHighlightable('py')).toBe(true)
    expect(isHighlightable('cpp')).toBe(true)
    expect(isHighlightable('c++')).toBe(true)
    expect(isHighlightable('c')).toBe(true)
    expect(isHighlightable('json')).toBe(true)
    expect(isHighlightable('yaml')).toBe(true)
    expect(isHighlightable('sql')).toBe(true)
    expect(isHighlightable('html')).toBe(true)
    expect(isHighlightable('css')).toBe(true)
    expect(isHighlightable('rs')).toBe(true)
    expect(isHighlightable('bash')).toBe(true)
    expect(isHighlightable('sh')).toBe(true)
    expect(isHighlightable('whatever')).toBe(false)
    expect(isHighlightable('')).toBe(false)
  })

  it('paints a whole-line comment dim', () => {
    const tokens = highlightLine('// hello', 'ts', t)
    expect(tokens).toEqual([[t.color.muted, '// hello']])
  })

  it('paints keywords, strings, and numbers in a ts line', () => {
    const tokens = highlightLine(`const x = 'hi' + 42`, 'ts', t)
    const colors = tokens.map(tok => tok[0])

    expect(colors).toContain(t.color.border) // const
    expect(colors).toContain(t.color.accent) // 'hi'
    expect(colors).toContain(t.color.text) // 42
  })

  it('falls through unchanged for unknown langs', () => {
    const tokens = highlightLine(`const x = 1`, 'zzz', t)
    expect(tokens).toEqual([['', 'const x = 1']])
  })

  it('treats `#` as a python comment, not a selector', () => {
    const tokens = highlightLine('# comment', 'py', t)
    expect(tokens).toEqual([[t.color.muted, '# comment']])
  })

  // ── Test A: Python ────────────────────────────────────────────────
  it('Test A: highlights Python with Ayu theme colors', () => {
    const lines = [
      'import json',
      'def calculate_total(items: list[int]) -> int:',
      '    """Calculate the total."""',
      '    return sum(items) + 42',
      'print(calculate_total([1, 2, 3]))'
    ]

    for (const line of lines) {
      const tokens = highlightLine(line, 'python', ayuTheme)
      // Character preservation invariant: never drop characters
      expect(tokens.map(x => x[1]).join('')).toBe(line)
    }

    // Line 1: import json
    const l1 = highlightLine(lines[0]!, 'python', ayuTheme)
    expect(l1.find(x => x[1] === 'import')?.[0]).toBe(ayuTheme.color.syntaxKeyword)

    // Line 2: def calculate_total(items: list[int]) -> int:
    const l2 = highlightLine(lines[1]!, 'python', ayuTheme)
    expect(l2.find(x => x[1] === 'def')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l2.find(x => x[1] === 'calculate_total')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(l2.find(x => x[1] === 'list')?.[0]).toBe(ayuTheme.color.syntaxType)
    expect(l2.find(x => x[1] === 'int')?.[0]).toBe(ayuTheme.color.syntaxType)
    expect(l2.find(x => x[1] === '->')?.[0]).toBe(ayuTheme.color.syntaxOperator)

    // Line 3: docstring
    const l3 = highlightLine(lines[2]!, 'python', ayuTheme)
    expect(l3.find(x => x[1].includes('Calculate the total.'))?.[0]).toBe(ayuTheme.color.syntaxString)

    // Line 4: return sum(items) + 42
    const l4 = highlightLine(lines[3]!, 'python', ayuTheme)
    expect(l4.find(x => x[1] === 'return')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l4.find(x => x[1] === 'sum')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(l4.find(x => x[1] === '+')?.[0]).toBe(ayuTheme.color.syntaxOperator)
    expect(l4.find(x => x[1] === '42')?.[0]).toBe(ayuTheme.color.syntaxNumber)

    // Line 5: print(calculate_total([1, 2, 3]))
    const l5 = highlightLine(lines[4]!, 'python', ayuTheme)
    expect(l5.find(x => x[1] === 'print')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(l5.find(x => x[1] === 'calculate_total')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(l5.find(x => x[1] === '1')?.[0]).toBe(ayuTheme.color.syntaxNumber)
  })

  // ── Test B: C++ ───────────────────────────────────────────────────
  it('Test B: highlights C++ with Ayu theme colors', () => {
    const lines = [
      '#include <iostream>',
      '#include <vector>',
      'int main() {',
      '    std::vector<int> values = {10, 20, 30};',
      '    // Print the result',
      '    for (int value : values) {',
      '        std::cout << value << std::endl;',
      '    }',
      '    return 0;',
      '}'
    ]

    for (const line of lines) {
      const tokens = highlightLine(line, 'cpp', ayuTheme)
      expect(tokens.map(x => x[1]).join('')).toBe(line)
    }

    // Line 1: #include <iostream>
    const l1 = highlightLine(lines[0]!, 'cpp', ayuTheme)
    expect(l1.find(x => x[1] === '#include')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l1.find(x => x[1] === '<iostream>')?.[0]).toBe(ayuTheme.color.syntaxString)

    // Line 3: int main() {
    const l3 = highlightLine(lines[2]!, 'cpp', ayuTheme)
    expect(l3.find(x => x[1] === 'int')?.[0]).toBe(ayuTheme.color.syntaxType)
    expect(l3.find(x => x[1] === 'main')?.[0]).toBe(ayuTheme.color.syntaxFunction)

    // Line 4: std::vector<int> values = {10, 20, 30};
    const l4 = highlightLine(lines[3]!, 'cpp', ayuTheme)
    expect(l4.find(x => x[1] === 'std')?.[0]).toBe(ayuTheme.color.syntaxConstant)
    expect(l4.find(x => x[1] === '::')?.[0]).toBe(ayuTheme.color.syntaxOperator)
    expect(l4.find(x => x[1] === 'vector')?.[0]).toBe(ayuTheme.color.syntaxType)
    expect(l4.find(x => x[1] === 'int')?.[0]).toBe(ayuTheme.color.syntaxType)
    expect(l4.find(x => x[1] === '=')?.[0]).toBe(ayuTheme.color.syntaxOperator)
    expect(l4.find(x => x[1] === '10')?.[0]).toBe(ayuTheme.color.syntaxNumber)

    // Line 5: // Print the result
    const l5 = highlightLine(lines[4]!, 'cpp', ayuTheme)
    expect(l5.find(x => x[1].includes('Print the result'))?.[0]).toBe(ayuTheme.color.syntaxComment)

    // Line 6: for (int value : values) {
    const l6 = highlightLine(lines[5]!, 'cpp', ayuTheme)
    expect(l6.find(x => x[1] === 'for')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l6.find(x => x[1] === 'int')?.[0]).toBe(ayuTheme.color.syntaxType)

    // Line 7: std::cout << value << std::endl;
    const l7 = highlightLine(lines[6]!, 'cpp', ayuTheme)
    expect(l7.find(x => x[1] === 'cout')?.[0]).toBe(ayuTheme.color.syntaxConstant)
    expect(l7.find(x => x[1] === '<<')?.[0]).toBe(ayuTheme.color.syntaxOperator)
    expect(l7.find(x => x[1] === 'endl')?.[0]).toBe(ayuTheme.color.syntaxConstant)

    // Line 9: return 0;
    const l9 = highlightLine(lines[8]!, 'cpp', ayuTheme)
    expect(l9.find(x => x[1] === 'return')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l9.find(x => x[1] === '0')?.[0]).toBe(ayuTheme.color.syntaxNumber)
  })

  // ── Test C: JavaScript ────────────────────────────────────────────
  it('Test C: highlights JavaScript with Ayu theme colors', () => {
    const lines = [
      'const fetchData = async (url) => {',
      '    const response = await fetch(url);',
      '    return response.json();',
      '};'
    ]

    for (const line of lines) {
      const tokens = highlightLine(line, 'javascript', ayuTheme)
      expect(tokens.map(x => x[1]).join('')).toBe(line)
    }

    const l1 = highlightLine(lines[0]!, 'javascript', ayuTheme)
    expect(l1.find(x => x[1] === 'const')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l1.find(x => x[1] === 'async')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l1.find(x => x[1] === '=>')?.[0]).toBe(ayuTheme.color.syntaxOperator)

    const l2 = highlightLine(lines[1]!, 'javascript', ayuTheme)
    expect(l2.find(x => x[1] === 'await')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l2.find(x => x[1] === 'fetch')?.[0]).toBe(ayuTheme.color.syntaxFunction)

    const l3 = highlightLine(lines[2]!, 'javascript', ayuTheme)
    expect(l3.find(x => x[1] === 'return')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(l3.find(x => x[1] === 'json')?.[0]).toBe(ayuTheme.color.syntaxFunction)
  })

  // ── Test D: JSON ──────────────────────────────────────────────────
  it('Test D: highlights JSON with Ayu theme colors', () => {
    const lines = [
      '{',
      '    "name": "Hermes",',
      '    "theme": "ayu-hermes",',
      '    "highlighting": true,',
      '    "version": 1',
      '}'
    ]

    for (const line of lines) {
      const tokens = highlightLine(line, 'json', ayuTheme)
      expect(tokens.map(x => x[1]).join('')).toBe(line)
    }

    const l2 = highlightLine(lines[1]!, 'json', ayuTheme)
    expect(l2.find(x => x[1] === '"name"')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(l2.find(x => x[1] === '"Hermes"')?.[0]).toBe(ayuTheme.color.syntaxString)

    const l4 = highlightLine(lines[3]!, 'json', ayuTheme)
    expect(l4.find(x => x[1] === 'true')?.[0]).toBe(ayuTheme.color.syntaxConstant)

    const l5 = highlightLine(lines[4]!, 'json', ayuTheme)
    expect(l5.find(x => x[1] === '1')?.[0]).toBe(ayuTheme.color.syntaxNumber)
  })

  // ── Test E: Diff ──────────────────────────────────────────────────
  it('Test E: validates Diff palette and styles in theme', () => {
    expect(ayuTheme.color.diffAddedWord).toBe('#AAD94C')
    expect(ayuTheme.color.diffRemovedWord).toBe('#F07178')
    expect(ayuTheme.color.diffAdded).toBe('#16261E')
    expect(ayuTheme.color.diffRemoved).toBe('#32181E')
  })

  // ── Unicode & Cyrillic ────────────────────────────────────────────
  it('handles Unicode and Cyrillic text safely', () => {
    const pyLine = 'def привет_мир(значение: int) -> str: # функция'
    const tokens = highlightLine(pyLine, 'python', ayuTheme)

    expect(tokens.map(x => x[1]).join('')).toBe(pyLine)
    expect(tokens.find(x => x[1] === 'def')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(tokens.find(x => x[1].includes('# функция'))?.[0]).toBe(ayuTheme.color.syntaxComment)

    const cppLine = 'std::string текст = "Привет, мир!"; // комментарий'
    const cppTokens = highlightLine(cppLine, 'cpp', ayuTheme)

    expect(cppTokens.map(x => x[1]).join('')).toBe(cppLine)
    expect(cppTokens.find(x => x[1] === 'std')?.[0]).toBe(ayuTheme.color.syntaxConstant)
    expect(cppTokens.find(x => x[1] === 'string')?.[0]).toBe(ayuTheme.color.syntaxType)
    expect(cppTokens.find(x => x[1] === '"Привет, мир!"')?.[0]).toBe(ayuTheme.color.syntaxString)
    expect(cppTokens.find(x => x[1] === '// комментарий')?.[0]).toBe(ayuTheme.color.syntaxComment)
  })

  // ── Long line & performance ───────────────────────────────────────
  it('tokenizes long lines quickly without dropping characters', () => {
    const longLine = 'const longVal = [' + '123, '.repeat(500) + '456];'
    const start = performance.now()
    const tokens = highlightLine(longLine, 'javascript', ayuTheme)
    const elapsed = performance.now() - start

    expect(tokens.map(x => x[1]).join('')).toBe(longLine)
    expect(elapsed).toBeLessThan(50) // takes < 50ms (typically ~1-2ms)
  })

  // ── Shell / Bash ──────────────────────────────────────────────────
  it('highlights Shell/Bash variables and commands', () => {
    const line = 'echo "Target: $USER" && cd /tmp'
    const tokens = highlightLine(line, 'bash', ayuTheme)

    expect(tokens.map(x => x[1]).join('')).toBe(line)
    expect(tokens.find(x => x[1] === 'echo')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(tokens.find(x => x[1] === 'cd')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(tokens.find(x => x[1] === '&&')?.[0]).toBe(ayuTheme.color.syntaxOperator)
  })

  // ── SQL ───────────────────────────────────────────────────────────
  it('highlights SQL queries case-insensitively', () => {
    const line = 'SELECT id, count(*) FROM users WHERE active = true;'
    const tokens = highlightLine(line, 'sql', ayuTheme)

    expect(tokens.map(x => x[1]).join('')).toBe(line)
    expect(tokens.find(x => x[1] === 'SELECT')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(tokens.find(x => x[1] === 'FROM')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(tokens.find(x => x[1] === 'WHERE')?.[0]).toBe(ayuTheme.color.syntaxKeyword)
    expect(tokens.find(x => x[1] === 'count')?.[0]).toBe(ayuTheme.color.syntaxFunction)
    expect(tokens.find(x => x[1] === 'true')?.[0]).toBe(ayuTheme.color.syntaxConstant)
  })
})
