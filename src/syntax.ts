import type { Theme } from '../theme.js'

export type Token = [string, string]

export type TokenCategory =
  'keyword' | 'string' | 'number' | 'comment' | 'function' | 'type' | 'constant' | 'operator' | 'punctuation' | 'plain'

interface LangSpec {
  lineComment?: string
  blockCommentStart?: string
  blockCommentEnd?: string
  keywords: Set<string>
  types: Set<string>
  constants: Set<string>
  builtins: Set<string>
  hasPreprocessor?: boolean
  hasShellVars?: boolean
  isJson?: boolean
  isYaml?: boolean
  isSql?: boolean
  isHtml?: boolean
  isCss?: boolean
}

const SET = (s: string) => new Set(s.split(/\s+/).filter(Boolean))

// ── C and C++ ────────────────────────────────────────────────────────
const C_CPP_KEYWORDS = SET(`
  alignas alignof asm auto break case catch class compl const const_cast constexpr
  continue decltype default delete do dynamic_cast else enum explicit export extern
  final for friend goto if inline mutable namespace new noexcept not not_eq
  operator or or_eq override private protected public register reinterpret_cast
  requires return sizeof static static_assert static_cast struct switch
  template throw try typedef typeid typename union using
  virtual volatile while xor xor_eq
  co_await co_return co_yield concept
`)

const C_CPP_TYPES = SET(`
  int char float double void bool short long signed unsigned wchar_t char8_t char16_t char32_t
  size_t ssize_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t
  uintptr_t intptr_t ptrdiff_t intmax_t uintmax_t
  string string_view wstring u16string u32string
  vector list deque array forward_list map set unordered_map unordered_set multimap multiset
  pair tuple unique_ptr shared_ptr weak_ptr optional variant any span
  ifstream ofstream fstream stringstream istringstream ostringstream ostream istream iostream
`)

const C_CPP_CONSTANTS = SET(`
  true false nullptr NULL std cin cout cerr clog endl EOF EXIT_SUCCESS EXIT_FAILURE
`)

// ── Python ──────────────────────────────────────────────────────────
const PY_KEYWORDS = SET(`
  and as assert async await break case class continue def del elif else except
  finally for from global if import in is lambda match nonlocal not or pass
  raise return try while with yield
`)

const PY_TYPES = SET(`
  int float str bool list dict set tuple bytes bytearray object type complex
  frozenset range slice memoryview Any Optional Union List Dict Set Tuple
  Callable Iterable Iterator Sequence Mapping Generator Literal Self ClassVar
`)

const PY_CONSTANTS = SET(`
  True False None Ellipsis NotImplemented self cls
  __name__ __doc__ __file__ __dict__ __module__ __package__
`)

const PY_BUILTINS = SET(`
  print sum len range enumerate zip min max abs open isinstance issubclass
  getattr setattr hasattr delattr id repr sorted all any input super help dir
  vars callable iter next hash chr ord hex oct bin format eval exec
`)

// ── JavaScript / TypeScript ─────────────────────────────────────────
const JS_TS_KEYWORDS = SET(`
  abstract as async await break case catch class const continue debugger default delete
  do else enum export extends false finally for from function get if implements import
  in infer instanceof interface is keyof let module namespace new null of package private
  protected public readonly return satisfies set static super switch this throw true try
  type typeof undefined var void while with yield declare override
`)

const JS_TS_TYPES = SET(`
  string number boolean symbol bigint any unknown never void null undefined object
  Array Record Promise Map Set WeakMap WeakSet Date RegExp Function Error
  Partial Required Readonly Pick Omit Exclude Extract NonNullable ReturnType
  InstanceType Parameters ConstructorParameters
`)

const JS_TS_CONSTANTS = SET(`
  true false null undefined NaN Infinity this globalThis window document process console
`)

const JS_TS_BUILTINS = SET(`
  fetch setTimeout setInterval clearTimeout clearInterval require parseInt parseFloat
  encodeURI decodeURI encodeURIComponent decodeURIComponent
`)

// ── Shell / Bash ────────────────────────────────────────────────────
const SH_KEYWORDS = SET(`
  if then else elif fi for in do done while until case esac function return break
  continue local export readonly declare typeset select time set unset shift
`)

const SH_BUILTINS = SET(`
  echo printf cd pwd ls cat grep sed awk find mkdir rm cp mv chmod chown curl
  wget git npm node python hermes source exec eval exit test sudo brew apt which
  head tail touch tar ssh scp
`)

const SH_CONSTANTS = SET(`
  true false
`)

// ── SQL ─────────────────────────────────────────────────────────────
const SQL_KEYWORDS = SET(`
  select from where and or not in is as by group order having limit offset
  insert into values update set delete create table view index drop alter add
  column primary key foreign references join left right inner outer cross full on
  union all distinct case when then else end with exists between like ilike cast
  over partition desc asc
`)

const SQL_TYPES = SET(`
  int integer bigint smallint varchar char text boolean bool timestamp date
  datetime time numeric decimal float double real json jsonb blob serial bigserial uuid
`)

const SQL_BUILTINS = SET(`
  count sum avg min max coalesce now concat substring trim lower upper length
  round date_trunc lead lag row_number rank dense_rank
`)

// ── Rust ────────────────────────────────────────────────────────────
const RUST_KEYWORDS = SET(`
  as async await break const continue crate dyn else enum extern false fn for if
  impl in let loop match mod move mut pub ref return self Self static struct super
  trait true type unsafe use where while yield
`)

const RUST_TYPES = SET(`
  i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str
  String Vec Option Result Some None Ok Err Box Rc Arc
`)

// ── Go ──────────────────────────────────────────────────────────────
const GO_KEYWORDS = SET(`
  break case chan const continue default defer else fallthrough for func go goto
  if import interface map package range return select struct switch type var
`)

const GO_TYPES = SET(`
  bool string int int8 int16 int32 int64 uint uint8 uint16 uint32 uint64 uintptr
  byte rune float32 float64 complex64 complex128 error
`)

const GO_CONSTANTS = SET(`
  nil true false iota
`)

// ── HTML / CSS ──────────────────────────────────────────────────────
const HTML_TAGS = SET(`
  html head body div span p a h1 h2 h3 h4 h5 h6 ul ol li table tr td th thead tbody
  form input button select option img script style meta link title header footer nav
  section main aside article pre code blockquote iframe svg path circle rect
`)

const HTML_ATTRS = SET(`
  class id href src alt title type value name style rel width height target placeholder
`)

const CSS_PROPERTIES = SET(`
  display position flex grid margin padding width height color background border
  font font-size font-family font-weight line-height text-align overflow z-index
  opacity transform transition animation box-shadow outline cursor justify-content
  align-items flex-direction gap top bottom left right
`)

const LANGS: Record<string, LangSpec> = {
  c: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: C_CPP_KEYWORDS,
    types: C_CPP_TYPES,
    constants: C_CPP_CONSTANTS,
    builtins: SET('printf scanf malloc free sizeof exit abort'),
    hasPreprocessor: true
  },
  cpp: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: C_CPP_KEYWORDS,
    types: C_CPP_TYPES,
    constants: C_CPP_CONSTANTS,
    builtins: SET('printf scanf malloc free sizeof make_unique make_shared make_pair make_tuple'),
    hasPreprocessor: true
  },
  py: {
    lineComment: '#',
    keywords: PY_KEYWORDS,
    types: PY_TYPES,
    constants: PY_CONSTANTS,
    builtins: PY_BUILTINS
  },
  js: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: JS_TS_KEYWORDS,
    types: JS_TS_TYPES,
    constants: JS_TS_CONSTANTS,
    builtins: JS_TS_BUILTINS
  },
  ts: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: JS_TS_KEYWORDS,
    types: JS_TS_TYPES,
    constants: JS_TS_CONSTANTS,
    builtins: JS_TS_BUILTINS
  },
  sh: {
    lineComment: '#',
    keywords: SH_KEYWORDS,
    types: new Set(),
    constants: SH_CONSTANTS,
    builtins: SH_BUILTINS,
    hasShellVars: true
  },
  json: {
    keywords: new Set(),
    types: new Set(),
    constants: SET('true false null'),
    builtins: new Set(),
    isJson: true
  },
  yaml: {
    lineComment: '#',
    keywords: new Set(),
    types: new Set(),
    constants: SET('true false null yes no on off ~'),
    builtins: new Set(),
    isYaml: true
  },
  sql: {
    lineComment: '--',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: SQL_KEYWORDS,
    types: SQL_TYPES,
    constants: SET('null true false'),
    builtins: SQL_BUILTINS,
    isSql: true
  },
  html: {
    blockCommentStart: '<!--',
    blockCommentEnd: '-->',
    keywords: HTML_TAGS,
    types: HTML_ATTRS,
    constants: new Set(),
    builtins: new Set(),
    isHtml: true
  },
  css: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: CSS_PROPERTIES,
    types: SET('px em rem vh vw percent deg s ms auto none initial inherit'),
    constants: new Set(),
    builtins: SET('rgb rgba hsl hsla url calc var min max clamp'),
    isCss: true
  },
  rust: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: RUST_KEYWORDS,
    types: RUST_TYPES,
    constants: SET('true false'),
    builtins: SET('println! print! format! panic! vec! assert! assert_eq!')
  },
  go: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    keywords: GO_KEYWORDS,
    types: GO_TYPES,
    constants: GO_CONSTANTS,
    builtins: SET('println print len cap make new append copy close delete panic recover')
  }
}

const ALIAS: Record<string, string> = {
  bash: 'sh',
  c: 'c',
  'c++': 'cpp',
  cc: 'cpp',
  cjs: 'js',
  cpp: 'cpp',
  cs: 'ts',
  csharp: 'ts',
  css: 'css',
  cxx: 'cpp',
  docker: 'sh',
  dockerfile: 'sh',
  go: 'go',
  golang: 'go',
  h: 'c',
  hpp: 'cpp',
  htm: 'html',
  html: 'html',
  hxx: 'cpp',
  java: 'ts',
  javascript: 'js',
  js: 'js',
  json: 'json',
  jsonc: 'json',
  jsx: 'js',
  kotlin: 'ts',
  kt: 'ts',
  less: 'css',
  lua: 'sh',
  mjs: 'js',
  mysql: 'sql',
  pgsql: 'sql',
  php: 'ts',
  postgres: 'sql',
  py: 'py',
  python: 'py',
  rb: 'py',
  rs: 'rust',
  ruby: 'py',
  rust: 'rust',
  scss: 'css',
  sh: 'sh',
  shell: 'sh',
  sql: 'sql',
  sqlite: 'sql',
  svg: 'html',
  swift: 'ts',
  toml: 'yaml',
  ts: 'ts',
  tsx: 'ts',
  typescript: 'ts',
  xml: 'html',
  yaml: 'yaml',
  yml: 'yaml',
  zsh: 'sh'
}

const resolve = (lang: string): LangSpec | null => {
  const norm = (lang || '').trim().toLowerCase()

  return LANGS[ALIAS[norm] ?? norm] ?? null
}

export const isHighlightable = (lang: string): boolean => resolve(lang) !== null

const PASCAL_CASE_RE = /^[A-Z][a-zA-Z0-9_]*$/

const ALL_CAPS_RE = /^[A-Z_][A-Z0-9_]+$/

const NUMBER_RE =
  /^(?:0x[0-9a-fA-F]+(?:_[0-9a-fA-F]+)*[uUlL]*|0b[01]+(?:_[01]+)*[uUlL]*|0o[0-7]+(?:_[0-7]+)*[uUlL]*|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFlLuU]*)/

const MULTI_CHAR_OPS = [
  '===',
  '!==',
  '==',
  '!=',
  '<=',
  '>=',
  '=>',
  '->',
  '::',
  '<<=',
  '>>=',
  '<<',
  '>>',
  '&&',
  '||',
  '++',
  '--',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '&=',
  '|=',
  '^=',
  '??',
  '?.',
  '**'
]

const SINGLE_CHAR_OPS = new Set(['+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '^', '~', '?'])
const PUNCTUATION = new Set(['(', ')', '[', ']', '{', '}', ',', ';', ':', '.'])

/**
 * High-performance lexical tokenizer.
 * Guarantees `tokenizeLine(line, lang).map(t => t[1]).join('') === line`.
 */
export function tokenizeLine(line: string, lang: string): Array<[TokenCategory, string]> {
  const spec = resolve(lang)

  if (!spec) {
    return [['plain', line]]
  }

  // Fast path: whole-line single-line comment (preserves existing test parity)
  const trimmedStart = line.trimStart()

  if (spec.lineComment && trimmedStart.startsWith(spec.lineComment)) {
    return [['comment', line]]
  }

  const tokens: Array<[TokenCategory, string]> = []
  const len = line.length
  let i = 0

  while (i < len) {
    const ch = line[i]!
    const rest = line.slice(i)

    // 1. Whitespace
    if (/\s/.test(ch)) {
      let j = i + 1

      while (j < len && /\s/.test(line[j]!)) {
        j++
      }

      tokens.push(['plain', line.slice(i, j)])
      i = j

      continue
    }

    // 2. Comments
    if (spec.lineComment && rest.startsWith(spec.lineComment)) {
      tokens.push(['comment', rest])
      i = len

      break
    }

    if (spec.blockCommentStart && rest.startsWith(spec.blockCommentStart)) {
      const endIdx = rest.indexOf(spec.blockCommentEnd ?? '*/', spec.blockCommentStart.length)

      if (endIdx !== -1) {
        const totalLen = endIdx + (spec.blockCommentEnd ?? '*/').length
        tokens.push(['comment', line.slice(i, i + totalLen)])
        i += totalLen
      } else {
        tokens.push(['comment', rest])
        i = len
      }

      continue
    }

    // 3. C/C++ Preprocessor directive (#include, #define, etc.)
    if (spec.hasPreprocessor && ch === '#') {
      const prepMatch = rest.match(/^#[a-zA-Z_]\w*/)

      if (prepMatch) {
        const directive = prepMatch[0]
        tokens.push(['keyword', directive])
        i += directive.length

        // On #include lines, match <header.h> or <vector> as string
        if (directive === '#include') {
          const afterInclude = line.slice(i)
          const angleMatch = afterInclude.match(/^\s*<[^>\n]+>/)

          if (angleMatch) {
            const leadingSpaces = angleMatch[0].match(/^\s*/)?.[0] ?? ''

            if (leadingSpaces) {
              tokens.push(['plain', leadingSpaces])
              i += leadingSpaces.length
            }

            const header = angleMatch[0].trimStart()
            tokens.push(['string', header])
            i += header.length
          }
        }

        continue
      }
    }

    // 4. Strings (triple quotes in Python, single/double/backticks)
    if (rest.startsWith('"""') || rest.startsWith("'''")) {
      const delim = rest.slice(0, 3)
      const closeIdx = rest.indexOf(delim, 3)

      if (closeIdx !== -1) {
        tokens.push(['string', line.slice(i, i + closeIdx + 3)])
        i += closeIdx + 3
      } else {
        tokens.push(['string', rest])
        i = len
      }

      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1
      let escaped = false

      while (j < len) {
        const cur = line[j]!

        if (escaped) {
          escaped = false
        } else if (cur === '\\') {
          escaped = true
        } else if (cur === ch) {
          j++

          break
        }

        j++
      }

      const strTok = line.slice(i, j)

      // In JSON, a string followed by a colon is an object property key!
      if (spec.isJson && ch === '"') {
        const afterStr = line.slice(j).trimStart()

        if (afterStr.startsWith(':')) {
          tokens.push(['function', strTok])
          i = j

          continue
        }
      }

      tokens.push(['string', strTok])
      i = j

      continue
    }

    // 5. Shell variables ($VAR, ${VAR}, $1, $?)
    if (spec.hasShellVars && ch === '$') {
      const varMatch = rest.match(/^\$(?:\{[^}\n]+\}|[a-zA-Z_]\w*|[@*#?$!0-9])/)

      if (varMatch) {
        tokens.push(['constant', varMatch[0]])
        i += varMatch[0].length

        continue
      }
    }

    // 6. Numbers
    if (/\d/.test(ch)) {
      const numMatch = rest.match(NUMBER_RE)

      if (numMatch) {
        tokens.push(['number', numMatch[0]])
        i += numMatch[0].length

        continue
      }
    }

    // 7. Multi-character operators
    let matchedOp = false

    for (const op of MULTI_CHAR_OPS) {
      if (rest.startsWith(op)) {
        tokens.push(['operator', op])
        i += op.length
        matchedOp = true

        break
      }
    }

    if (matchedOp) {
      continue
    }

    // 8. Single-character operators
    if (SINGLE_CHAR_OPS.has(ch)) {
      tokens.push(['operator', ch])
      i++

      continue
    }

    // 9. Punctuation
    if (PUNCTUATION.has(ch)) {
      tokens.push(['punctuation', ch])
      i++

      continue
    }

    // 10. Identifiers / Words
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i + 1

      while (j < len && /[\w$]/.test(line[j]!)) {
        j++
      }

      const word = line.slice(i, j)
      const lower = word.toLowerCase()
      const lookahead = line.slice(j).trimStart()

      // YAML key: word followed immediately by ':'
      if (spec.isYaml && lookahead.startsWith(':')) {
        tokens.push(['function', word])
        i = j

        continue
      }

      // Check keywords
      if (spec.keywords.has(word) || (spec.isSql && spec.keywords.has(lower))) {
        tokens.push(['keyword', word])
      } else if (spec.types.has(word) || (spec.isSql && spec.types.has(lower))) {
        tokens.push(['type', word])
      } else if (spec.constants.has(word) || (spec.isSql && spec.constants.has(lower))) {
        tokens.push(['constant', word])
      } else if (spec.builtins.has(word) || (spec.isSql && spec.builtins.has(lower))) {
        tokens.push(['function', word])
      } else if (lookahead.startsWith('(')) {
        // Identifier followed by '(' is a function call or definition
        tokens.push(['function', word])
      } else if (PASCAL_CASE_RE.test(word) && word.length > 1 && /[a-z]/.test(word)) {
        // PascalCase identifier (MyClass, Vector, SessionDB)
        tokens.push(['type', word])
      } else if (ALL_CAPS_RE.test(word) && word.length >= 2) {
        // ALL_CAPS identifier (MAX_BUFFER, PI)
        tokens.push(['constant', word])
      } else {
        tokens.push(['plain', word])
      }

      i = j

      continue
    }

    // 11. Fallback single character
    tokens.push(['plain', ch])
    i++
  }

  return tokens
}

function categoryToColor(cat: TokenCategory, t: Theme): string {
  switch (cat) {
    case 'keyword':
      return t.color.syntaxKeyword ?? t.color.border

    case 'string':
      return t.color.syntaxString ?? t.color.accent

    case 'number':
      return t.color.syntaxNumber ?? t.color.text

    case 'comment':
      return t.color.syntaxComment ?? t.color.muted

    case 'function':
      return t.color.syntaxFunction ?? t.color.primary

    case 'type':
      return t.color.syntaxType ?? t.color.accent

    case 'constant':
      return t.color.syntaxConstant ?? t.color.accent

    case 'operator':
      return t.color.syntaxOperator ?? t.color.border

    case 'punctuation':
      return t.color.syntaxPunctuation ?? t.color.muted

    case 'plain':

    default:
      return ''
  }
}

/**
 * Highlights a single line of code according to the requested language and theme palette.
 * Returns an array of `[color, text]` pairs suitable for terminal Ink rendering.
 */
export function highlightLine(line: string, lang: string, t: Theme): Token[] {
  const spec = resolve(lang)

  if (!spec) {
    return [['', line]]
  }

  const rawTokens = tokenizeLine(line, lang)
  const tokens: Token[] = []

  // Combine adjacent tokens that share the same color for optimal Ink rendering
  for (const [cat, text] of rawTokens) {
    const color = categoryToColor(cat, t)

    if (tokens.length > 0 && tokens[tokens.length - 1]![0] === color) {
      tokens[tokens.length - 1]![1] += text
    } else {
      tokens.push([color, text])
    }
  }

  return tokens
}
