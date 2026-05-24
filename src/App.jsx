import { useEffect, useMemo, useRef, useState } from "react";
import ShikiHighlighter, {
  createHighlighterCore,
  createJavaScriptRegexEngine,
} from "react-shiki/core";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import shikiCss from "react-shiki/css?inline";

const code = [
  "\\documentclass{article}",
  "\\begin{document}",
  "Hello world.",
  "\\end{document}",
  "%",
].join("\n");

export default function App() {
  const monacoHostRef = useRef(null);
  const [highlighter, setHighlighter] = useState(null);
  const shikiCssInjected = useRef(false);

  const shikiTheme = useMemo(() => ({ dark: "github-dark" }), []);

  useEffect(() => {
    if (!shikiCssInjected.current) {
      const style = document.createElement("style");
      style.setAttribute("data-react-shiki", "true");
      style.textContent = shikiCss;
      document.head.appendChild(style);
      shikiCssInjected.current = true;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadHighlighter() {
      const instance = await createHighlighterCore({
        themes: [import("@shikijs/themes/github-dark")],
        langs: [import("@shikijs/langs/latex")],
        engine: createJavaScriptRegexEngine(),
      });
      if (!cancelled) {
        setHighlighter(instance);
      }
    }

    loadHighlighter();
    return () => {
      cancelled = true;
    };
  }, []);

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
    <main className="app">
      <header>
        <h1>react-shiki + Monaco line-number collision</h1>
        <p>
          react-shiki/core injects global line-number styles at runtime. Monaco uses the
          same <code>.line-numbers</code> class, so its gutter picks up the counter rule.
        </p>
      </header>

      <section className="card" aria-label="react-shiki repro">
        {highlighter ? (
          <ShikiHighlighter
            highlighter={highlighter}
            language="latex"
            theme={shikiTheme}
            showLineNumbers
            startingLineNumber={1}
          >
            {code}
          </ShikiHighlighter>
        ) : (
          <p>Loading shiki highlighter…</p>
        )}
      </section>

      <section className="card" aria-label="monaco repro" style={{ marginTop: 16 }}>
        <div ref={monacoHostRef} className="editor" />
      </section>

      <p className="note">
        Expected: Monaco’s gutter shows the actual line number plus an extra “1” overlay
        from react-shiki’s global <code>.line-numbers::before</code> rule. Remove the
        runtime CSS injection in <code>src/App.jsx</code> to confirm the ghost disappears.
      </p>
    </main>
  );
}
