# Third-Party Notices

HelloBusan is MIT-licensed (see [LICENSE](LICENSE)). It builds on the
following Apache-2.0 licensed work from Google:

## use-webmcp-tool

- Package: [`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool) v0.2.0
- Source: https://github.com/GoogleChromeLabs/use-webmcp-tool
- License: Apache License 2.0
- Used as a normal npm dependency (see `package.json`) to register every
  HelloBusan tool with `document.modelContext.registerTool()`. Unmodified.

## Google's WebMCP Analytics Dashboard demo

- Source: https://github.com/GoogleChromeLabs/webmcp-tools (demos/analytics-dashboard)
- License: Apache License 2.0
- HelloBusan was scaffolded from this demo's project shape (Vite + React +
  `use-webmcp-tool`, the `executeRef`/pending-resolver pattern for tools that
  need to pause for a UI-driven confirmation). No files from that demo are
  copied verbatim; `src/hooks/useAgentEngine.js`,
  `src/components/WebMCPToolBinding.jsx` and the rest of this repo are
  original code written for HelloBusan's own tool set and domain.

A copy of the Apache License, Version 2.0 is available at
<https://www.apache.org/licenses/LICENSE-2.0>.
