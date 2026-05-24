import "./style.css";
import "monaco-editor/min/vs/editor/editor.main.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  },
};

const editorRoot = document.getElementById("editor");
if (!editorRoot) {
  throw new Error("Missing #editor element.");
}

monaco.editor.create(editorRoot, {
  value: [
    "\\documentclass{article}",
    "\\begin{document}",
    "Hello world.",
    "\\end{document}",
    "%",
  ].join("\n"),
  language: "latex",
  theme: "vs-dark",
  lineNumbers: "on",
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 13,
});
