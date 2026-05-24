import "./style.css";
import loader from "@monaco-editor/loader";

const editorRoot = document.getElementById("editor");
if (!editorRoot) {
  throw new Error("Missing #editor element.");
}

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs",
  },
});

loader.init().then((monaco) => {
  monaco.editor.create(editorRoot, {
    value: [
      "\\documentclass{article}",
      "\\begin{document}",
      "Hello world.",
      "\\end{document}",
      "%",
    ].join("\n"),
    language: "latex",
    theme: "vs",
    lineNumbers: "on",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
  });
});
