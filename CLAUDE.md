# redditblocker

Manifest V3 Chrome extension that forces a configurable wait before allowing access to Reddit, then unlocks it for a configurable period across all tabs.

## Files

- `manifest.json` — extension manifest (MV3)
- `content.js` — all logic: overlay injection, timer, unlock state
- `style.css` — overlay and button styles
- `options.html` — settings page UI
- `options.js` — settings page logic: load/save settings, live countdown

## Key design decisions

**Minimal permissions** — only `"storage"`. No `host_permissions`, no background worker, no `tabs`, no `webRequest`. The content script scope is controlled entirely by the `matches` field.

**`document_start`** — content script runs before anything renders, so the overlay blocks the page immediately. Storage reads are async but fast enough that this is imperceptible.

**`chrome.storage` for all state** — `chrome.storage.sync` stores user settings (wait duration, unlock duration); `chrome.storage.local` stores the unlock expiry timestamp (`rdb-unlocked-until`, UTC ms). Using `chrome.storage` (instead of `localStorage`) lets the options page read the state since it runs at the extension origin, not reddit.com.

**`rdb-` prefix** — all injected DOM IDs and CSS classes use this prefix to avoid conflicts with Reddit's own styles.

## Configurable settings (stored in chrome.storage.sync)

| Key          | Default | Description                                  |
| ------------ | ------- | -------------------------------------------- |
| `waitSecs`   | `30`    | Countdown duration before Reddit is unlocked |
| `unlockMins` | `15`    | How long Reddit stays unlocked after waiting |

## Behaviour

- First visit to any reddit.com URL: countdown overlay (default 30 s)
- After waiting: Reddit is unlocked for the configured duration (default 15 min), shared across all tabs via `chrome.storage.local`
- Subframes (embedded Reddit widgets): skipped via `window.top !== window.self` check
- New Reddit (SPA): content script runs once per tab naturally
- Old Reddit (MPA): storage check prevents re-showing the overlay on every page load
- Options page: accessible via right-click on extension icon → Options; shows live countdown and settings inputs

## Testing workflow

1. Load unpacked at `chrome://extensions`
2. After any code change: click ↺ reload on the extension card, then reload open Reddit tabs
3. To reset the unlock timer: run `chrome.storage.local.remove('rdb-unlocked-until')` in the extension's background DevTools console, or in any page context where `chrome` is available
