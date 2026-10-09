// Generates the language cards in public/code-art: an editor window with a
// short idiomatic snippet over a glow in the language's brand colours.
//
//   public/code-art/<slug>.svg       portrait 18:25, the landing corridor
//   public/code-art/wide/<slug>.svg  landscape 1.45:1, the dashboard wheel
//
// Run from the project root after editing a snippet:
//   node scripts/generate-code-art.mjs
//
// The SVGs render as <img>, which can't load web fonts, so text uses
// system font stacks.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "code-art");
const SANS = "'Segoe UI', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Cascadia Code', 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
const LINE = 44; // code line height at font-size 27

const LANGS = [
  {
    slug: "python", name: "Python", file: "main.py", c1: "#3776AB", c2: "#FFD43B",
    about: "Fibonacci generator",
    kw: "def for in yield return import from class if else while with as lambda",
    code: [
      "def fib(n):",
      "    a, b = 0, 1",
      "    for _ in range(n):",
      "        yield a",
      "        a, b = b, a + b",
      "",
      "print(list(fib(10)))",
    ],
  },
  {
    slug: "java", name: "Java", file: "Main.java", c1: "#E76F00", c2: "#5382A1",
    about: "Hello-world main class",
    kw: "public class static void new return private final",
    code: [
      "public class Main {",
      "  public static void main(",
      "      String[] args) {",
      "    System.out.println(",
      '        "Hello, Java!");',
      "  }",
      "}",
    ],
  },
  {
    slug: "cpp", name: "C++", file: "main.cpp", c1: "#00599C", c2: "#659AD2",
    about: "Range-for over a vector",
    kw: "#include int for auto return const std",
    code: [
      "#include <iostream>",
      "#include <vector>",
      "",
      "int main() {",
      "  std::vector<int> v{3, 1, 2};",
      "  for (int x : v)",
      "    std::cout << x << '\\n';",
      "}",
    ],
  },
  {
    slug: "javascript", name: "JavaScript", file: "app.js", c1: "#F7DF1E", c2: "#FF8A00",
    about: "Greeting in the DOM",
    kw: "const let function return document",
    code: [
      "const greet = (name) =>",
      "  `Hello, ${name}!`;",
      "",
      "document",
      '  .querySelector("h1")',
      '  .textContent = greet("web");',
    ],
  },
  {
    slug: "rust", name: "Rust", file: "main.rs", c1: "#F74C00", c2: "#DEA584",
    about: "Looping an array",
    kw: "fn let mut for in match impl pub use",
    code: [
      "fn main() {",
      '    let words = ["fast", "safe"];',
      "    for w in words {",
      '        println!("{w}!");',
      "    }",
      "}",
    ],
  },
  {
    slug: "go", name: "Go", file: "main.go", c1: "#00ADD8", c2: "#CE3262",
    about: "Goroutine and channel",
    kw: "package import func go make chan return var",
    code: [
      "package main",
      "",
      'import "fmt"',
      "",
      "func main() {",
      "    ch := make(chan string)",
      '    go func() { ch <- "hi" }()',
      "    fmt.Println(<-ch)",
      "}",
    ],
  },
  {
    slug: "kotlin", name: "Kotlin", file: "Main.kt", c1: "#7F52FF", c2: "#E44857",
    about: "Copying a data class",
    kw: "data class val var fun",
    code: [
      "data class Point(",
      "    val x: Int,",
      "    val y: Int,",
      ")",
      "",
      "fun main() {",
      "    val p = Point(3, 4)",
      "    println(p.copy(y = 0))",
      "}",
    ],
  },
  {
    slug: "typescript", name: "TypeScript", file: "app.ts", c1: "#3178C6", c2: "#00C2FF",
    about: "Typed user model",
    kw: "type const let interface return",
    code: [
      "type User = {",
      "  id: number;",
      "  name: string;",
      "};",
      "",
      "const hi = (u: User): string =>",
      "  `Hi, ${u.name}`;",
    ],
  },
  {
    slug: "swift", name: "Swift", file: "main.swift", c1: "#F05138", c2: "#FFB36B",
    about: "Struct with interpolation",
    kw: "struct let var func",
    code: [
      "struct Planet {",
      "    let name: String",
      "}",
      "",
      'let home = Planet(name: "Earth")',
      'print("Hello, \\(home.name)")',
    ],
  },
  {
    slug: "csharp", name: "C#", file: "Program.cs", c1: "#512BD4", c2: "#C065D9",
    about: "Interpolated foreach",
    kw: "var new foreach in",
    code: [
      'var langs = new[] { "C#", "F#" };',
      "",
      "foreach (var l in langs)",
      "{",
      "    Console.WriteLine(",
      '        $"Hello from {l}");',
      "}",
    ],
  },
  {
    slug: "ruby", name: "Ruby", file: "app.rb", c1: "#CC342D", c2: "#FF7A6B",
    about: "Blocks and iterators",
    kw: "do end puts print def",
    code: [
      "%w[ruby is fun].each do |w|",
      "  puts w.capitalize",
      "end",
      "",
      "5.times { |i| print i }",
    ],
  },
  {
    slug: "php", name: "PHP", file: "index.php", c1: "#777BB4", c2: "#4F9DDE",
    about: "Looping an array",
    kw: "php foreach as echo function return",
    code: [
      "<?php",
      "",
      "$langs = ['PHP', 'Laravel'];",
      "",
      "foreach ($langs as $lang) {",
      '    echo "Hello, $lang!\\n";',
      "}",
    ],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Mixes a hex colour toward white so syntax colours stay legible on black.
function tint(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.round(v + (255 - v) * amount),
  );
  return "#" + ch.map((v) => v.toString(16).padStart(2, "0")).join("");
}

// strings | numbers | identifiers (incl. #include, macros!) | $vars | space | other
const TOKEN =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(\b\d+\b)|(#?[A-Za-z_][A-Za-z0-9_]*!?)|(\$[A-Za-z_]\w*)|(\s+)|(.)/g;

function highlight(line, lang) {
  const colors = {
    text: "#D5D7E2",
    punct: "#8B8FA3",
    keyword: tint(lang.c1, 0.35),
    string: tint(lang.c2, 0.3),
    number: "#F9C97C",
    type: tint(lang.c1, 0.6),
    fn: "#FFFFFF",
    variable: tint(lang.c2, 0.45),
  };
  const keywords = new Set(lang.kw.split(" "));
  let out = "";
  for (const m of line.matchAll(TOKEN)) {
    const [text, str, num, ident, variable, space] = m;
    if (space) {
      out += text;
      continue;
    }
    const rest = line.slice(m.index + text.length);
    let fill = colors.punct;
    if (str) fill = colors.string;
    else if (num) fill = colors.number;
    else if (variable) fill = colors.variable;
    else if (ident) {
      if (keywords.has(ident)) fill = colors.keyword;
      else if (/^[A-Z]/.test(ident)) fill = colors.type;
      else if (ident.endsWith("!") || /^\s*\(/.test(rest)) fill = colors.fn;
      else fill = colors.text;
    }
    out += `<tspan fill="${fill}">${esc(text)}</tspan>`;
  }
  return out;
}

/** Background: grid plus two brand-colour glows, centred at g1 and g2. */
function backdrop(lang, w, h, g1, g2) {
  return `<defs>
    <radialGradient id="g1" cx="${g1[0]}" cy="${g1[1]}" r="${g1[2]}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${lang.c1}" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${lang.c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="${g2[0]}" cy="${g2[1]}" r="${g2[2]}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${lang.c2}" stop-opacity="0.6"/>
      <stop offset="1" stop-color="${lang.c2}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#FFFFFF" stroke-opacity="0.05"/>
    </pattern>
    <linearGradient id="pane" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14141C" stop-opacity="0.92"/>
      <stop offset="1" stop-color="#0A0A10" stop-opacity="0.86"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#07070B"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#g1)"/>
  <rect width="${w}" height="${h}" fill="url(#g2)"/>`;
}

/** Editor window with traffic lights, file name and highlighted code. */
function editor(lang, x, y, width) {
  const height = Math.max(400, 196 + lang.code.length * LINE);
  const lines = lang.code
    .map(
      (line, i) =>
        `<text x="${x + 36}" y="${y + 140 + i * LINE}" xml:space="preserve">${highlight(line, lang)}</text>`,
    )
    .join("\n    ");
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="28" fill="url(#pane)" stroke="#FFFFFF" stroke-opacity="0.12"/>
  <circle cx="${x + 40}" cy="${y + 40}" r="8" fill="#FF5F57"/>
  <circle cx="${x + 68}" cy="${y + 40}" r="8" fill="#FEBC2E"/>
  <circle cx="${x + 96}" cy="${y + 40}" r="8" fill="#28C840"/>
  <text x="${x + width - 40}" y="${y + 48}" text-anchor="end" font-family="${MONO}" font-size="22" fill="#8B8FA3">${esc(lang.file)}</text>
  <path d="M${x} ${y + 72}H${x + width}" stroke="#FFFFFF" stroke-opacity="0.08"/>
  <g font-family="${MONO}" font-size="27">
    ${lines}
  </g>`;
}

/** Language name sized to fit `width`, never larger than `max`. */
function wordmark(lang, x, y, width, max) {
  const size = Math.min(max, Math.floor(width / (lang.name.length * 0.6)));
  return `<text x="${x}" y="${y}" font-family="${SANS}" font-weight="700" font-size="${size}" letter-spacing="-3" fill="#FFFFFF">${esc(lang.name)}</text>`;
}

const ext = (lang) => lang.file.slice(lang.file.lastIndexOf("."));

function portrait(lang) {
  const [w, h] = [720, 1000];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <title>${esc(lang.name)}</title>
  ${backdrop(lang, w, h, [600, 140, 560], [60, 940, 520])}

  ${editor(lang, 48, 96, 624)}

  ${wordmark(lang, 48, 886, 624, 132)}
  <text x="52" y="940" font-family="${MONO}" font-size="24" fill="${tint(lang.c2, 0.4)}">${esc(ext(lang))}</text>
</svg>
`;
}

function landscape(lang) {
  const [w, h] = [1160, 800];
  const paneHeight = Math.max(400, 196 + lang.code.length * LINE);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <title>${esc(lang.name)}</title>
  ${backdrop(lang, w, h, [1020, 100, 760], [80, 760, 620])}
  <text x="68" y="132" font-family="${MONO}" font-size="24" fill="${tint(lang.c2, 0.4)}">// ${esc(lang.about.toLowerCase())}</text>
  ${wordmark(lang, 64, 640, 400, 150)}
  <text x="68" y="696" font-family="${MONO}" font-size="26" fill="${tint(lang.c2, 0.4)}">${esc(ext(lang))}</text>
  ${editor(lang, 500, Math.round((h - paneHeight) / 2), 600)}
</svg>
`;
}

mkdirSync(join(OUT, "wide"), { recursive: true });
for (const lang of LANGS) {
  writeFileSync(join(OUT, `${lang.slug}.svg`), portrait(lang));
  writeFileSync(join(OUT, "wide", `${lang.slug}.svg`), landscape(lang));
}
console.log(`Wrote ${LANGS.length * 2} cards to ${OUT}`);
