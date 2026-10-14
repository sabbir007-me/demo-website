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
  hero?: { src: string; alt: string; subject: string };
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
};

/** The landing page for a work, or undefined while it doesn't have one yet. */
export function workHref(id: string): string | undefined {
  return id in WORK_PAGES ? `/works/${id}` : undefined;
}
