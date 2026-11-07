# Hermes Agent — Ayu Theme & Lexical Syntax Highlighting

[![Hermes Agent](https://img.shields.io/badge/Hermes_Agent-v0.23+-orange.svg)](https://github.com/NousResearch/hermes-agent)
[![Ayu Dark](https://img.shields.io/badge/Theme-Ayu_Dark-F07178.svg)](#ayu-color-palette)
[![Syntax Highlighting](https://img.shields.io/badge/Syntax-10+_Languages-AAD94C.svg)](#supported-languages)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS_%7C_Linux-lightgrey.svg)](#requirements)

A complete modernization of the [Hermes Agent](https://github.com/NousResearch/hermes-agent) Terminal User Interface (React Ink TUI), bringing the renowned **Ayu Dark** theme (inspired by Ayu in OpenCode / VSCode) together with **true lexical syntax highlighting** for C/C++, Python, TypeScript/JavaScript, Bash, SQL, JSON, YAML, HTML/CSS, Diffs, and more.

---

## 📸 Overview

Out of the box, Hermes Agent's TUI rendered fenced code blocks (especially C and C++) in largely unstyled, monochrome text. The existing tokenizer recognized only 3 basic tokens (strings, numbers, and basic keywords), missing comments, function declarations, type annotations, constants, operators, and preprocessor directives.

This project delivers:
1. **Ayu Hermes Skin (`ayu-hermes.yaml`)**: Full palette implementation mapping authentic Ayu Dark tones to every TUI role (headings, code blocks, tool calls, user/agent bubbles, status bar, and selection menus).
2. **True Lexical Syntax Engine**: Fast, zero-dependency tokenization engine inside `ui-tui/src/lib/syntax.ts` that distinguishes **10 distinct syntactic token roles**.
3. **TrueColor ANSI Output**: Seamless 24-bit color rendering in React Ink with zero ANSI sequence leakage into clipboard selections.
4. **Token Run Consolidation**: Optimizes React Ink rendering performance by merging consecutive tokens of identical colors to minimize DOM-like element node count.
5. **Streaming & Session Resilience**: Full support for real-time LLM token streaming and saved session reloads.

---

## 🎨 Ayu Color Palette

The theme strictly adheres to the authentic **Ayu Dark** specification:

| Role | Color Name | Hex Code | Visual Preview |
|---|---|---|:---:|
| **Background (Editor / App)** | `ui_background` | `#0B0E14` | ![#0B0E14](https://via.placeholder.com/15/0B0E14/000000?text=+) |
| **Code Block Background** | `ui_code_bg` | `#11151C` | ![#11151C](https://via.placeholder.com/15/11151C/000000?text=+) |
| **Primary Text** | `ui_foreground` | `#D9DEE8` | ![#D9DEE8](https://via.placeholder.com/15/D9DEE8/000000?text=+) |
| **Secondary / Subdued Text** | `ui_secondary` | `#8A91A5` | ![#8A91A5](https://via.placeholder.com/15/8A91A5/000000?text=+) |
| **Markdown Headings** | `ui_heading` | `#C792EA` | ![#C792EA](https://via.placeholder.com/15/C792EA/000000?text=+) |
| **Keywords & Control Flow** | `syntax_keyword` | `#FF8F40` | ![#FF8F40](https://via.placeholder.com/15/FF8F40/000000?text=+) |
| **Strings & Literals** | `syntax_string` | `#AAD94C` | ![#AAD94C](https://via.placeholder.com/15/AAD94C/000000?text=+) |
| **Numbers & Numerics** | `syntax_number` | `#D2A6FF` | ![#D2A6FF](https://via.placeholder.com/15/D2A6FF/000000?text=+) |
| **Functions & Methods** | `syntax_function` | `#FFD580` | ![#FFD580](https://via.placeholder.com/15/FFD580/000000?text=+) |
| **Types, Classes & Structs** | `syntax_type` | `#73D0FF` | ![#73D0FF](https://via.placeholder.com/15/73D0FF/000000?text=+) |
| **Comments & Docstrings** | `syntax_comment` | `#6B7280` | ![#6B7280](https://via.placeholder.com/15/6B7280/000000?text=+) |
| **Constants & Booleans** | `syntax_constant` | `#DFBFFF` | ![#DFBFFF](https://via.placeholder.com/15/DFBFFF/000000?text=+) |
| **Operators & Macros** | `syntax_operator` | `#F29E74` | ![#F29E74](https://via.placeholder.com/15/F29E74/000000?text=+) |
| **Punctuation & Delimiters** | `syntax_punctuation` | `#8A91A5` | ![#8A91A5](https://via.placeholder.com/15/8A91A5/000000?text=+) |
| **Success / Status OK** | `ui_success` | `#AAD94C` | ![#AAD94C](https://via.placeholder.com/15/AAD94C/000000?text=+) |
| **Errors & Deletions** | `ui_error` | `#F07178` | ![#F07178](https://via.placeholder.com/15/F07178/000000?text=+) |
| **Warnings & Highlights** | `ui_warning` | `#FFB454` | ![#FFB454](https://via.placeholder.com/15/FFB454/000000?text=+) |
| **Borders & Dividers** | `ui_border` | `#343A46` | ![#343A46](https://via.placeholder.com/15/343A46/000000?text=+) |

---

## 🚀 Supported Languages & Syntax Tokenization

The tokenizer in `ui-tui/src/lib/syntax.ts` includes dedicated grammars for:

- **C & C++ (`c`, `cpp`, `cxx`, `h`, `hpp`)**:
  - Preprocessor macros (`#include <iostream>`, `#define`, `#pragma`)
  - Types (`int`, `uint32_t`, `double`, `std::vector`, `std::string`, `unique_ptr`)
  - Functions & methods (`main()`, `emplace_back()`, `std::cout`)
  - Keywords (`template`, `typename`, `constexpr`, `auto`, `class`, `struct`, `virtual`)
  - Line (`//`) and block (`/* ... */`) comments, strings, numbers (hex `0xFF`, binary `0b101`, floats)
- **Python (`python`, `py`)**:
  - Decorators (`@functools.wraps`, `@dataclass`)
  - Function declarations & calls (`def process_data(...)`)
  - Built-in types & keywords (`async`, `await`, `yield`, `class`, `self`, `None`, `True`, `False`)
  - Strings (single, double, f-strings, multiline docstrings)
- **TypeScript & JavaScript (`typescript`, `ts`, `javascript`, `js`, `jsx`, `tsx`)**:
  - ESNext keywords (`async`, `await`, `export`, `import`, `from`, `const`, `let`)
  - Built-in types (`string`, `number`, `boolean`, `Record`, `Promise`)
  - Arrow functions and invocation patterns
  - Template literals (`` `Hello ${name}` ``)
- **Bash & Shell (`bash`, `sh`, `zsh`)**:
  - Variable expansion (`$VAR`, `${VAR}`, `$@`, `$?`)
  - Commands, flags, strings, comments (`#`), control structures (`if`, `then`, `fi`, `for`, `in`, `do`, `done`)
- **SQL (`sql`, `mysql`, `pgsql`)**:
  - Clauses and statements (`SELECT`, `FROM`, `JOIN`, `WHERE`, `GROUP BY`, `ORDER BY`, `LIMIT`)
  - Functions (`COUNT`, `AVG`, `COALESCE`, `SUM`)
  - Standard types (`VARCHAR`, `INTEGER`, `TIMESTAMP`, `BOOLEAN`)
- **JSON & YAML (`json`, `yaml`, `yml`)**:
  - Object keys, YAML property keys (`key:`)
  - Primitives (`true`, `false`, `null`), numbers, strings
- **HTML & CSS (`html`, `xml`, `css`, `scss`)**:
  - HTML tags (`<div>`, `<span className="...">`), attributes
  - CSS selectors, property declarations (`color:`, `display:`), pixel/rem units, hex colors
- **Unified Diffs (`diff`, `patch`)**:
  - Additions (`+ line`) rendered in `#AAD94C`
  - Deletions (`- line`) rendered in `#F07178`
  - Chunk headers (`@@ -1,4 +1,4 @@`) rendered in `#73D0FF`
- **Fallback / Generic**:
  - Safe universal lexer handling numbers, strings, comments, and identifiers without breaking terminal layouts.

---

## 📦 Repository Structure

```
hermes-agent-ayu/
├── skins/
│   └── ayu-hermes.yaml                  # Complete Hermes YAML skin configuration
├── patches/
│   └── ayu-syntax-highlighting.patch    # Comprehensive git patch for hermes-agent checkout
├── src/
│   └── syntax.ts                        # Full TypeScript lexical tokenizer source
├── tests/
│   ├── syntax.test.ts                   # Vitest unit test suite (14 test suites, all passing)
│   └── markdownCodeHighlight.test.tsx   # React Ink component TrueColor ANSI integration test
├── install.sh                           # Automated 1-click installation script
├── LICENSE                              # MIT License
└── README.md                            # Complete documentation
```

---

## ⚡ Quick Start (1-Click Installation)

Clone this repository and run the automated installer:

```bash
git clone https://github.com/zarmih/hermes-agent-ayu.git
cd hermes-agent-ayu
chmod +x install.sh
./install.sh
```

The installer will automatically:
1. Copy `skins/ayu-hermes.yaml` to `~/.hermes/skins/ayu-hermes.yaml`.
2. Apply `patches/ayu-syntax-highlighting.patch` to your Hermes repository (`~/.hermes/hermes-agent`).
3. Rebuild the React Ink TUI bundle (`npm run build` in `ui-tui`).
4. Activate `skin: ayu-hermes` in `~/.hermes/config.yaml` while preserving all model, provider, reasoning, and session settings.
5. Gracefully restart the Hermes background gateway service (`hermes gateway restart`).

---

## 🛠 Manual Installation & Build

If you prefer to install step-by-step:

### 1. Install the Skin File

```bash
mkdir -p ~/.hermes/skins
cp skins/ayu-hermes.yaml ~/.hermes/skins/ayu-hermes.yaml
```

Verify that Hermes recognizes the skin:

```bash
hermes skin list
# Expected output contains:
#   ayu-hermes            user
```

### 2. Apply the Syntax Highlighting Patch

Navigate to your Hermes repository (typically `~/.hermes/hermes-agent`):

```bash
cd ~/.hermes/hermes-agent

# Apply the patch
git apply /path/to/hermes-agent-ayu/patches/ayu-syntax-highlighting.patch
```

### 3. Rebuild the React Ink TUI

```bash
cd ~/.hermes/hermes-agent/ui-tui

# Build the Ink engine and the main entry bundle
npm run build:ink
npm run build
```

This updates `ui-tui/dist/entry.js`, which is executed when `hermes` launches in TUI mode.

### 4. Activate the Theme in `config.yaml`

In `~/.hermes/config.yaml`, ensure the `display` section has:

```yaml
display:
  interface: tui
  skin: ayu-hermes
```

*(All other settings like `model: nvidia/nemotron-3.5-super-vl:free`, API keys, and MCP tools remain untouched).*

### 5. Restart the Hermes Gateway Daemon

```bash
hermes gateway restart
```

---

## 🧪 Verification & Automated Testing

This repository includes exhaustive automated test suites covering tokenizer correctness and React Ink ANSI TrueColor rendering.

To execute the tests inside the Hermes repository:

```bash
cd ~/.hermes/hermes-agent/ui-tui

# Run syntax tokenizer unit tests
npx vitest run src/__tests__/syntax.test.ts

# Run React Ink ANSI TrueColor integration tests
npx vitest run src/__tests__/markdownCodeHighlight.test.tsx
```

### Test Coverage Highlights:
- **Test A (C++ Language)**: Verified `#include`, `std::vector`, `std::cout`, keywords, numbers, strings, and operators each receive correct Ayu hex tokens.
- **Test B (Python Language)**: Verified `def`, `async`, `class`, decorators, docstrings, and literals.
- **Test C (TypeScript / JavaScript)**: Verified interfaces, `const`, arrow functions, types, and JSX.
- **Test D (Unified Diff)**: Verified added lines (`+`), deleted lines (`-`), and hunk headers (`@@`).
- **Test E (Non-trivial C++ Snippet)**: Full complex snippet verification (`template <typename T>`, lambda expressions, structured bindings).
- **Ink ANSI Rendering**: Confirms that rendered terminal output contains exact 24-bit TrueColor ANSI escape sequences (`\x1b[38;2;...m`) corresponding to Ayu palette colors without escaping errors.

---

## 🏛 Architecture & Technical Deep-Dive

### Why Code Appeared Monochrome Before
In standard Hermes Agent:
1. `LANGS` in `ui-tui/src/lib/syntax.ts` did not define mappings or aliases for `cpp`, `c`, `cxx`, `h`, or `hpp`. When a fenced code block with ` ```cpp ` was received, the lexer fell back to unhighlighted plain text.
2. The tokenizer only produced three token classes: `keyword`, `string`, and `number`.
3. `ThemeColors` and `SKIN_COLOR_TOKENS` lacked definitions for function names, type names, constants, operators, and punctuation.

### The Solution Implemented
1. **Token Definitions (`apps/shared/src/skin.ts`)**:
   Added `syntax_function`, `syntax_type`, `syntax_constant`, `syntax_operator`, `syntax_punctuation`, and `ui_heading` to the core schema.
2. **Palette Mapping (`ui-tui/src/theme.ts`)**:
   Mapped the new tokens in `ThemeColors`, `buildPalette()`, and `fromSkin()` with sensible fallbacks to ensure backwards compatibility with older skins.
3. **Markdown Heading Integration (`ui-tui/src/components/markdown.tsx`)**:
   Connected headings (`#`, `##`, `###`) directly to `t.color.heading ?? t.color.accent` (`#C792EA`).
4. **Lexer Rewrite (`ui-tui/src/lib/syntax.ts`)**:
   - Implemented stateful lexical tokenizer with keyword tables, type tables, and regex matchers for C/C++, Python, JS/TS, Bash, SQL, JSON, YAML, HTML, CSS, and Diffs.
   - Built a **token merging optimizer** (`mergeTokens()`) that concatenates contiguous tokens sharing identical styles before returning to React Ink, drastically cutting down React component allocations in long code blocks.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Credits

- **Hermes Agent** by [Nous Research](https://github.com/NousResearch/hermes-agent).
- **Ayu Color Theme** originally created by Ike Ku.
- Authored & maintained by [Mikhail (zarmih)](https://github.com/zarmih).
