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
};

/** The landing page for a work, or undefined while it doesn't have one yet. */
export function workHref(id: string): string | undefined {
  return id in WORK_PAGES ? `/works/${id}` : undefined;
}
