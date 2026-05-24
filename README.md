# react-shiki + Monaco line-number collision repro

This repro demonstrates a class-name collision between `react-shiki` line numbers and
Monaco Editor's gutter. `react-shiki` injects a global `.line-numbers::before` rule, and
Monaco uses the same `.line-numbers` class, causing a phantom “1” overlay in the gutter.

## Repro steps

```bash
npm install
npm run dev
```

Open http://localhost:5173. You should see Monaco’s gutter show an extra “1” overlay on
every row.

To confirm the source, remove `react-shiki` and its import in `src/App.jsx`:

```tsx
import ShikiHighlighter from "react-shiki";
```

With that removed, the ghost number disappears.
