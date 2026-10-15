/* Landing pages for works on the dashboard wheel, served at /works/<id>.
 * A work gets a page (and its wheel card becomes a link) once it has an
 * entry here. The hero sculpture is the work's own card, cut out by
 * scripts/generate-code-art.mjs into public/code-art/hero, unless the
 * entry sets a hero image of its own. */

export type WorkPage = {
  /** Hero headline; "\n" breaks the line. */
  headline: string;
  /** The part of the headline set in the italic accent face. */
  accent: string;
  body: string;
  /** Accent colour per theme, from the language's brand colours. */
  accentLight: string;
  accentDark: string;
  file: string;
  code: string;
  output: string;
  notes: { title: string; body: string }[];
  /** A cut-out image (transparent background) in place of the work's card. */
  hero?: {
    src: string;
    alt: string;
    subject: string;
    /** Size overrides for very wide or tall artwork (1 = the default for the breakpoint). */
    scale?: number;
    mobileScale?: number;
  };
};

export const WORK_PAGES: Record<string, WorkPage> = {
  python: {
    hero: {
      src: "/code-art/hero/python-logo.webp",
      alt: "The Python logo in neon blue and gold, filled with binary digits",
      subject: "logo",
    },
    headline: "A generator,\nnot a list.",
    accent: "not a list.",
    body: "Five lines that hand back the Fibonacci sequence one number at a time, so nothing is held in memory until you ask for it.",
    accentLight: "#3776AB",
    accentDark: "#FFD43B",
    file: "main.py",
    code: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fib(10)))`,
    output: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    notes: [
      {
        title: "Lazy by design",
        body: "yield hands back one number and pauses. The loop only resumes when the caller asks for the next value.",
      },
      {
        title: "One-line step",
        body: "a, b = b, a + b moves both terms forward at once. The right side is evaluated first, so no temporary variable is needed.",
      },
      {
        title: "Bounded on purpose",
        body: "range(n) stops after n values, which is what makes list(fib(10)) safe to turn into a list.",
      },
    ],
  },
  java: {
    hero: {
      src: "/code-art/hero/java-logo.webp",
      alt: "The Java logo, a steaming coffee cup in neon blue and orange, filled with binary digits",
      subject: "logo",
    },
    headline: "Everything lives\nin a class.",
    accent: "in a class.",
    body: "The smallest Java program still needs a class and a main method, because that exact signature is where the JVM starts running.",
    accentLight: "#E76F00",
    accentDark: "#F89820",
    file: "Main.java",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    output: "Hello, Java!",
    notes: [
      {
        title: "The class is the file",
        body: "A public class has to live in a file with the same name, so Main sits in Main.java.",
      },
      {
        title: "A fixed front door",
        body: "public lets the JVM call main, static means no object has to exist first, and String[] args carries any command-line arguments.",
      },
      {
        title: "One line out",
        body: "System.out is the standard output stream; println writes the text and ends the line.",
      },
    ],
  },
  cpp: {
    hero: {
      src: "/code-art/hero/cpp-logo.webp",
      alt: "The C++ logo, a neon blue hexagon with orange plus signs, filled with streams of binary digits",
      subject: "logo",
    },
    headline: "Walk the vector,\nnot the index.",
    accent: "not the index.",
    body: "A range-for hands you each element in turn, so there is no counter to get wrong and no way to read past the end.",
    accentLight: "#00599C",
    accentDark: "#659AD2",
    file: "main.cpp",
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v{3, 1, 2};
    for (int x : v)
        std::cout << x << '\\n';
}`,
    output: "3 1 2 (one per line)",
    notes: [
      {
        title: "Built in one step",
        body: "std::vector<int> v{3, 1, 2} creates the vector and fills it at once, using list initialisation.",
      },
      {
        title: "Range-for",
        body: "for (int x : v) visits every element from begin() to end(), so the loop can't run past the last one.",
      },
      {
        title: "Streams, not printf",
        body: "std::cout << x sends each value to standard output, and '\\n' ends the line without the flush that std::endl adds.",
      },
    ],
  },
  javascript: {
    hero: {
      src: "/code-art/hero/javascript-logo.webp",
      alt: "The JavaScript logo, a neon gold shield with the letters JS, filled with streams of binary digits",
      subject: "logo",
    },
    headline: "Small function,\nreal page.",
    accent: "real page.",
    body: "An arrow function builds the greeting, and one chained call puts it into the page's first heading.",
    accentLight: "#C77700",
    accentDark: "#F7DF1E",
    file: "app.js",
    code: [
      "const greet = (name) =>",
      "  `Hello, ${name}!`;",
      "",
      "document",
      '  .querySelector("h1")',
      '  .textContent = greet("web");',
    ].join("\n"),
    output: "<h1>Hello, web!</h1>",
    notes: [
      {
        title: "Arrow function",
        body: "(name) => returns its expression directly, so greet needs no braces and no return.",
      },
      {
        title: "Template literal",
        body: "Backticks let ${name} drop the argument straight into the string.",
      },
      {
        title: "Find, then set",
        body: 'querySelector("h1") returns the first heading on the page, and textContent replaces its text without parsing any HTML.',
      },
    ],
  },
  rust: {
    hero: {
      src: "/code-art/hero/rust-logo.webp",
      alt: "The Rust logo, a dark metal gear with a glowing orange R, filled with streams of code",
      subject: "logo",
    },
    headline: "Fast and safe,\nin six lines.",
    accent: "in six lines.",
    body: "An array of two words, a loop that walks it by value, and a println! that writes each one straight from the variable's name.",
    accentLight: "#CE422B",
    accentDark: "#F74C00",
    file: "main.rs",
    code: `fn main() {
    let words = ["fast", "safe"];
    for w in words {
        println!("{w}!");
    }
}`,
    output: "fast! safe! (one per line)",
    notes: [
      {
        title: "A fixed-size array",
        body: 'let words = ["fast", "safe"] is an array of two string slices. Its length is known at compile time, so it lives on the stack.',
      },
      {
        title: "Looping by value",
        body: "Arrays iterate by value, so w is each word in turn, with no index to manage and no way to step past the end.",
      },
      {
        title: "Names in the format string",
        body: 'println!("{w}!") picks up w by name from the surrounding code. The ! marks a macro, so the format string is checked when the program compiles.',
      },
    ],
  },
  go: {
    hero: {
      src: "/code-art/hero/go-logo.webp",
      alt: "The Go wordmark with speed lines in neon blue, filled with columns of binary digits",
      subject: "logo",
      // The wordmark is about 2.5 times as wide as it is tall.
      scale: 0.7,
      mobileScale: 0.48,
    },
    headline: "Start it,\nthen talk to it.",
    accent: "then talk to it.",
    body: "One goroutine sends a string down a channel and main waits at the other end, so the two meet without a lock in sight.",
    accentLight: "#007D9C",
    accentDark: "#00ADD8",
    file: "main.go",
    code: `package main

import "fmt"

func main() {
    ch := make(chan string)
    go func() { ch <- "hi" }()
    fmt.Println(<-ch)
}`,
    output: "hi",
    notes: [
      {
        title: "An unbuffered channel",
        body: "make(chan string) creates a channel with no buffer, so a send waits until something is ready to receive it.",
      },
      {
        title: "go starts a goroutine",
        body: "go func() { … }() runs the function concurrently, and main carries on without waiting for it.",
      },
      {
        title: "Receive, then print",
        body: '<-ch blocks until the goroutine\'s "hi" arrives, which is what keeps main from exiting before the message is sent.',
      },
    ],
  },
  kotlin: {
    hero: {
      src: "/code-art/hero/kotlin-logo.webp",
      alt: "The Kotlin logo and wordmark in neon purple, pink and orange, filled with columns of binary digits",
      subject: "logo",
      // The wordmark is about three times as wide as it is tall.
      scale: 0.7,
      mobileScale: 0.48,
    },
    headline: "Copy it,\nchange one thing.",
    accent: "change one thing.",
    body: "A data class gets equals, toString and copy for free, so changing one field gives you a new value and leaves the old one alone.",
    accentLight: "#7F52FF",
    accentDark: "#A97BFF",
    file: "Main.kt",
    code: `data class Point(
    val x: Int,
    val y: Int,
)

fun main() {
    val p = Point(3, 4)
    println(p.copy(y = 0))
}`,
    output: "Point(x=3, y=0)",
    notes: [
      {
        title: "Data for free",
        body: "data class writes equals, hashCode, toString and copy from the constructor's properties, so Point needs no body at all.",
      },
      {
        title: "Read-only fields",
        body: "val makes x and y read-only. To move a point you make a new one rather than editing it in place.",
      },
      {
        title: "Copy by name",
        body: "p.copy(y = 0) keeps x from p and replaces only y. Naming the argument says exactly which field changes.",
      },
    ],
  },
  typescript: {
    hero: {
      src: "/code-art/hero/typescript-logo.webp",
      alt: "The TypeScript logo and wordmark in neon blue, filled with columns of binary digits",
      subject: "logo",
      // The wordmark is over three times as wide as it is tall.
      scale: 0.7,
      mobileScale: 0.48,
    },
    headline: "Name the shape,\ncatch the typo.",
    accent: "catch the typo.",
    body: "A type alias describes a user once, and the compiler checks every function that takes one before the code ever runs.",
    accentLight: "#3178C6",
    accentDark: "#4FA8FF",
    file: "app.ts",
    code: [
      "type User = {",
      "  id: number;",
      "  name: string;",
      "};",
      "",
      "const hi = (u: User): string =>",
      "  `Hi, ${u.name}`;",
      "",
      'console.log(hi({ id: 1, name: "Ada" }));',
    ].join("\n"),
    output: "Hi, Ada",
    notes: [
      {
        title: "A type alias",
        body: "type User = { … } names an object shape: a numeric id and a string name. It exists only while compiling and leaves nothing behind in the JavaScript.",
      },
      {
        title: "Typed in and out",
        body: "(u: User): string says what the arrow function accepts and what it returns. Passing an object without a name is an error in the editor, not a crash at runtime.",
      },
      {
        title: "Checked, then erased",
        body: "The compiler strips the types and emits plain JavaScript, so hi runs anywhere JavaScript does.",
      },
    ],
  },
  swift: {
    hero: {
      src: "/code-art/hero/swift-logo.webp",
      alt: "The Swift bird and wordmark in neon orange and red, filled with columns of binary digits",
      subject: "logo",
      // The wordmark is about three times as wide as it is tall.
      scale: 0.7,
      mobileScale: 0.48,
    },
    headline: "Name a planet,\nsay hello.",
    accent: "say hello.",
    body: "A struct with one constant, an initializer Swift writes for you, and string interpolation to put the name in the greeting.",
    accentLight: "#F05138",
    accentDark: "#FA7343",
    file: "main.swift",
    code: `struct Planet {
    let name: String
}

let home = Planet(name: "Earth")
print("Hello, \\(home.name)")`,
    output: "Hello, Earth",
    notes: [
      {
        title: "Structs are values",
        body: "Planet is copied whenever it's assigned or passed, so no other part of the program can change home behind your back.",
      },
      {
        title: "A free initializer",
        body: "Swift generates Planet(name:) from the stored properties, so the struct needs no init of its own.",
      },
      {
        title: "Interpolation",
        body: "\\(home.name) evaluates the expression in the parentheses and drops the result into the string.",
      },
    ],
  },
  csharp: {
    hero: {
      src: "/code-art/hero/csharp-logo.webp",
      alt: "The C# logo in neon violet, filled with columns of binary digits",
      subject: "logo",
    },
    headline: "Two languages,\none loop.",
    accent: "one loop.",
    body: "var lets the compiler work out an array of strings, and foreach walks it while an interpolated string builds each greeting.",
    accentLight: "#512BD4",
    accentDark: "#9B7BFF",
    file: "Program.cs",
    code: `var langs = new[] { "C#", "F#" };

foreach (var l in langs)
{
    Console.WriteLine(
        $"Hello from {l}");
}`,
    output: "Hello from C#, Hello from F# (one per line)",
    notes: [
      {
        title: "Inferred types",
        body: "var and new[] leave the types to the compiler, which sees two strings and makes langs a string[].",
      },
      {
        title: "foreach",
        body: "foreach (var l in langs) visits each element once, with no index to manage and no way to step past the end.",
      },
      {
        title: "Interpolated strings",
        body: "The $ before the quotes turns {l} into a slot the current value fills, so there is no concatenation or format string to line up.",
      },
    ],
  },
  ruby: {
    hero: {
      src: "/code-art/hero/ruby-logo.webp",
      alt: "The Ruby gem and wordmark in neon red, filled with columns of binary digits",
      subject: "logo",
      // The wordmark is nearly three times as wide as it is tall.
      scale: 0.7,
      mobileScale: 0.48,
    },
    headline: "Hand it a block,\nlet it loop.",
    accent: "let it loop.",
    body: "Ruby loops by handing a block to an iterator: each walks an array of words, and times counts up from zero on its own.",
    accentLight: "#CC342D",
    accentDark: "#FF6B5E",
    file: "app.rb",
    code: `%w[ruby is fun].each do |w|
  puts w.capitalize
end

5.times { |i| print i }`,
    output: "Ruby, Is, Fun (one per line), then 01234",
    notes: [
      {
        title: "A word array",
        body: '%w[ruby is fun] is shorthand for ["ruby", "is", "fun"], with no quotes or commas to type.',
      },
      {
        title: "Blocks",
        body: "do |w| … end is a block. each calls it once per word, with w holding the current one.",
      },
      {
        title: "Numbers iterate too",
        body: "5.times runs its block five times with i from 0 to 4, and print writes each one without a newline.",
      },
    ],
  },
  php: {
    hero: {
      src: "/code-art/hero/php-logo.webp",
      alt: "The PHP elephant in neon blue and violet, filled with columns of binary digits",
      subject: "elephant",
    },
    headline: "Every name\ngets a greeting.",
    accent: "gets a greeting.",
    body: "A short array, a foreach that hands back each value, and a double-quoted string that drops the variable straight in.",
    accentLight: "#4F5B93",
    accentDark: "#8892BF",
    file: "index.php",
    code: [
      "<?php",
      "",
      "$langs = ['PHP', 'Laravel'];",
      "",
      "foreach ($langs as $lang) {",
      '    echo "Hello, $lang!\\n";',
      "}",
    ].join("\n"),
    output: "Hello, PHP! Hello, Laravel! (one per line)",
    notes: [
      {
        title: "Short array syntax",
        body: "['PHP', 'Laravel'] builds an indexed array. The $ marks every variable, including $langs.",
      },
      {
        title: "foreach … as",
        body: "foreach ($langs as $lang) hands you each value in turn, so there is no counter and no count() call.",
      },
      {
        title: "Variables in strings",
        body: 'Double quotes interpolate, so "Hello, $lang!\\n" reads the variable and ends the line. Single quotes would print $lang as it is.',
      },
    ],
  },
};

/** The landing page for a work, or undefined while it doesn't have one yet. */
export function workHref(id: string): string | undefined {
  return id in WORK_PAGES ? `/works/${id}` : undefined;
}
