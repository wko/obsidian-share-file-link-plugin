# Agent Instructions

This document provides context for AI agents working on this Obsidian plugin.

## Project Overview

**Obsidian Link Sharer** converts native `obsidian://` URIs into shareable HTTPS links that work in Slack, WhatsApp, and other messengers.

### Architecture

1. **Plugin** (`src/main.ts`, `src/settings.ts`) - Adds context menu item to copy shareable links
2. **Redirect Page** (`docs/open.html`) - GitHub Pages hosted page that decodes and redirects to `obsidian://` URIs

### How It Works

1. User right-clicks a file → "Copy shareable link"
2. Plugin generates `obsidian://open?vault=...&file=...` URI
3. URI is Base64 URL-safe encoded
4. Final link: `https://<github-pages>/open.html?link=<encoded>`
5. When clicked, redirect page decodes and redirects to Obsidian

## Development

```bash
npm install      # Install dependencies
npm run dev      # Watch mode (auto-rebuild)
npm run build    # Production build
npm run lint     # Run ESLint
```

### Testing Locally

1. Build the plugin: `npm run build`
2. Reload Obsidian (Cmd+R on Mac)
3. Right-click any file → "Copy shareable link"
4. Paste link in browser to test redirect

### Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Plugin entry point, context menu registration |
| `src/settings.ts` | Settings interface and tab |
| `docs/open.html` | GitHub Pages redirect page |
| `manifest.json` | Obsidian plugin metadata |

## Code Conventions

- Follow Obsidian ESLint rules (`eslint-plugin-obsidianmd`)
- Use sentence case for UI text (e.g., "Copy shareable link" not "Copy Shareable Link")
- Use `new Setting().setHeading()` instead of `createEl('h2')`
- Avoid deprecated APIs (e.g., use `TextEncoder` instead of `unescape`)

## GitHub Pages

The redirect page is hosted on the `gh-pages` branch:
- Branch: `gh-pages`
- Folder: `/docs`
- URL: `https://wko.github.io/obsidian-share-file-link-plugin/open.html`
