import { PassThrough } from 'stream'

import { Box, renderSync } from '@hermes/ink'
import chalk from 'chalk'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { Md } from '../components/markdown.js'
import { fromSkin } from '../theme.js'

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

const ESC = '\u001B'

function renderMdToTrueColors(text: string): string[] {
  const savedLevel = chalk.level
  chalk.level = 3

  const stdout = new PassThrough()
  const stdin = new PassThrough()
  const stderr = new PassThrough()
  let output = ''

  Object.assign(stdout, { columns: 100, isTTY: true, rows: 40 })
  Object.assign(stdin, { isTTY: false })
  Object.assign(stderr, { isTTY: false })
  stdout.on('data', chunk => {
    output += chunk.toString()
  })

  const instance = renderSync(
    React.createElement(Box, { width: 90 }, React.createElement(Md, { cols: 88, t: ayuTheme, text })),
    {
      patchConsole: false,
      stderr: stderr as NodeJS.WriteStream,
      stdin: stdin as NodeJS.ReadStream,
      stdout: stdout as NodeJS.WriteStream
    }
  )

  instance.unmount()
  instance.cleanup()
  chalk.level = savedLevel

  return [...output.matchAll(new RegExp(`${ESC}\\[38;2;(\\d+);(\\d+);(\\d+)m`, 'g'))].map(
    m =>
      '#' +
      m
        .slice(1, 4)
        .map(v => Number(v).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
  )
}

describe('Markdown Code Highlighting in React Ink with Ayu theme', () => {
  it('renders Python code block with truecolor syntax highlighting', () => {
    const md = [
      '```python',
      'import json',
      'def calculate_total(items: list[int]) -> int:',
      '    """Calculate the total."""',
      '    return sum(items) + 42',
      'print(calculate_total([1, 2, 3]))',
      '```'
    ].join('\n')

    const colors = renderMdToTrueColors(md)

    expect(colors).toContain('#FF8F40') // keyword (import, def, return)
    expect(colors).toContain('#FFD580') // function (calculate_total, sum, print)
    expect(colors).toContain('#73D0FF') // type (list, int)
    expect(colors).toContain('#AAD94C') // string (docstring)
    expect(colors).toContain('#D2A6FF') // number (42, 1, 2, 3)
  })

  it('renders C++ code block with truecolor syntax highlighting', () => {
    const md = [
      '```cpp',
      '#include <iostream>',
      '#include <vector>',
      'int main() {',
      '    std::vector<int> values = {10, 20, 30};',
      '    // Print the result',
      '    for (int value : values) {',
      '        std::cout << value << std::endl;',
      '    }',
      '    return 0;',
      '}',
      '```'
    ].join('\n')

    const colors = renderMdToTrueColors(md)

    expect(colors).toContain('#FF8F40') // #include, for, return
    expect(colors).toContain('#AAD94C') // <iostream>, <vector>
    expect(colors).toContain('#73D0FF') // int, vector
    expect(colors).toContain('#FFD580') // main
    expect(colors).toContain('#DFBFFF') // std, endl
    expect(colors).toContain('#6B7280') // // Print the result
    expect(colors).toContain('#D2A6FF') // 10, 20, 30, 0
  })

  it('renders Diff with additions and deletions', () => {
    const md = ['```diff', '- const theme = "poseidon";', '+ const theme = "ayu-hermes";', '```'].join('\n')

    const colors = renderMdToTrueColors(md)

    expect(colors).toContain('#F07178') // diffRemovedWord
    expect(colors).toContain('#AAD94C') // diffAddedWord
  })

  it('renders Markdown heading with Ayu heading color', () => {
    const md = '# Header title\nSome prose text'
    const colors = renderMdToTrueColors(md)

    expect(colors).toContain('#C792EA') // ui_heading / primary
  })
})
