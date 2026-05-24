import { useEffect, useRef } from "react";
import ShikiHighlighter from "react-shiki";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

const code = [
  "\\documentclass{article}",
  "\\begin{document}",
  "Hello world.",
  "\\end{document}",
  "%",
].join("\n");

export default function App() {
  const monacoHostRef = useRef(null);

  useEffect(() => {
    if (!monacoHostRef.current) return undefined;
    self.MonacoEnvironment = {
      getWorker() {
        return new EditorWorker();
      },
    };

    const editor = monaco.editor.create(monacoHostRef.current, {
      value: code,
      language: "latex",
      theme: "vs-dark",
      lineNumbers: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 13,
    });

    return () => editor.dispose();
  }, []);

  return (
    <main>
      <h1>react-shiki + Monaco line-number collision</h1>
      <p>
        react-shiki injects global line-number styles. Monaco uses the same{" "}
        <code>.line-numbers</code> class, so its gutter picks up the counter rule.
      </p>

      <section aria-label="react-shiki repro">
        <ShikiHighlighter
          language="latex"
          theme="github-dark"
          showLineNumbers
          startingLineNumber={1}
        >
          {code}
        </ShikiHighlighter>
      </section>

      <section aria-label="monaco repro">
        <div ref={monacoHostRef} id="monaco" />
      </section>

      <p>
        Expected: Monaco’s gutter shows an extra “1” overlay from react-shiki’s global{" "}
        <code>.line-numbers::before</code> rule. If you remove react-shiki, the ghost
        disappears.
      </p>
    </main>
  );
}
