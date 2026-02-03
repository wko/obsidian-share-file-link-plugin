# Obsidian Link Sharer

Share Obsidian vault links with your team in Slack, Teams, and other messaging apps.

## Why?

When collaborating with teammates on a shared Obsidian vault, you often want to point them to specific notes. Normal `obsidian://` links don't work in most chat apps because they get blocked or mangled.

This plugin generates standard HTTPS links that:
- Work in Slack, Teams, WhatsApp, email, and any messaging app
- Open directly in Obsidian when clicked
- Don't require any setup for recipients (just Obsidian installed)

## How It Works

1. Right-click any file in Obsidian and select **"Copy Shareable Link"**
2. Paste the link in Slack, Teams, or any app
3. When a teammate clicks it, the file opens in their Obsidian

The shared link looks like a normal web URL:
```
https://yourname.github.io/obsidian-link-sharer/open.html?link=...
```

When someone clicks it, they're redirected to your Obsidian vault via the `obsidian://` protocol.

## Installation

### From Obsidian Community Plugins (Recommended)
1. Open Obsidian Settings
2. Go to Community Plugins
3. Search for "Link Sharer"
4. Install and enable

### Manual Installation
1. Download `main.js` and `manifest.json` from the latest release
2. Create folder: `YourVault/.obsidian/plugins/obsidian-link-sharer/`
3. Copy both files into that folder
4. Restart Obsidian and enable the plugin in Settings > Community Plugins

## Setup GitHub Pages (Required)

For the shareable links to work, you need to host the redirect page on GitHub Pages:

1. **Fork or clone this repository**

2. **Create the gh-pages branch:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   mkdir docs
   cp path/to/open.html docs/
   git add docs/open.html
   git commit -m "Add redirect page"
   git push -u origin gh-pages
   ```

3. **Enable GitHub Pages:**
   - Go to your repo Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/docs`

4. **Configure the plugin:**
   - In Obsidian, go to Settings > Link Sharer
   - Set your GitHub Pages URL (e.g., `https://yourusername.github.io/your-repo-name`)

## Usage

### Context Menu
- Right-click any file in the file explorer
- Select **"Copy shareable link"**
- Link is copied to clipboard

### Command Palette
- Open Command Palette (Cmd/Ctrl + P)
- Search for "Copy shareable link for active file"
- Link for current file is copied

## Settings

| Setting | Description |
|---------|-------------|
| **GitHub pages URL** | Base URL for your redirect page (without `/open.html`) |
| **Vault name override** | Override the vault name used in links. Leave empty to use actual vault name. |

## How It Works Technically

1. Plugin generates an Obsidian URI: `obsidian://open?vault=MyVault&file=Notes/File.md`
2. URI is encoded using URL-safe Base64 (RFC 4648)
3. Encoded URI is appended to your GitHub Pages URL
4. When clicked, the redirect page decodes and redirects to the Obsidian URI

## Programmatic Link Generation

If you're building tools or using AI agents that need to generate shareable links, you can use **direct URL parameters** instead of Base64 encoding:

```
https://yourname.github.io/your-repo/open.html?vault=MyVault&file=Notes/File.md
```

Simply provide:
- `vault` - Your vault name
- `file` - Path to the file (relative to vault root)

URL encode special characters in the path (spaces become `%20`, etc.).

**Example with spaces:**
```
https://yourname.github.io/your-repo/open.html?vault=MyVault&file=Notes/Project%20Plan.md
```

## Requirements

- Obsidian 1.0.0 or higher
- GitHub account (for hosting the redirect page)
- Recipients must have Obsidian installed

## Privacy

- No data is sent to any server
- Links are stateless (all data is in the URL itself)
- No tracking or analytics

## Security

The plugin and redirect page are fully **open source** - you can review every line of code in this repository.

For additional control, you can **host the redirect page yourself** on your own domain or company server:

1. Copy `docs/open.html` to your own web server
2. In Obsidian, go to Settings > Link Sharer
3. Update the "GitHub Pages URL" to your self-hosted URL

This way, you have complete control over the redirect page your team uses.

## License

0-BSD