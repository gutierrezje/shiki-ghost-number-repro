import ShikiHighlighter from "react-shiki";

const code = [
  "\\documentclass{article}",
  "\\begin{document}",
  "Hello world.",
  "\\end{document}",
  "%",
].join("\n");

export default function App() {
  return (
    <main className="app">
      <header>
        <h1>Tailwind v4 + react-shiki line numbers</h1>
        <p>
          This repro uses react-shiki line numbers with Tailwind v4 preflight enabled.
          The bug appears when the line-number pseudo elements inherit Tailwind&apos;s
          counter rules.
        </p>
      </header>

      <section className="card" aria-label="react-shiki repro">
        <ShikiHighlighter
          language="latex"
          theme="github-dark"
          showLineNumbers
          startingLineNumber={1}
        >
          {code}
        </ShikiHighlighter>
      </section>

      <p className="note">
        Expected: each gutter row shows the actual line number plus an extra “1” overlay.
        Comment out <code>@import "tailwindcss";</code> in <code>src/style.css</code> and
        the ghost numbers disappear.
      </p>
    </main>
  );
}
