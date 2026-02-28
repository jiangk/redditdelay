# Privacy Policy — Reddit Delay

_Last updated: February 2026_

## Summary

Reddit Delay does not collect, transmit, or share any data. Everything the extension stores stays on your device.

## What is stored

The extension stores two types of data locally in your browser using the Chrome storage API:

**Settings** (`chrome.storage.sync`) — your configured wait time and unlock duration. This is synced across your Chrome instances via your Google account, the same way Chrome syncs bookmarks and preferences. Reddit Delay has no involvement in that sync beyond writing the values.

**Unlock state** (`chrome.storage.local`) — a timestamp recording when Reddit was last unlocked, so the countdown doesn't restart across tabs. This stays on your device only and is never transmitted anywhere.

## What is not collected

Reddit Delay does not collect or transmit browsing history, personal information, usage analytics, or any other data. There are no servers, no accounts, and no third-party services involved.

## Permissions

The extension requests the following permissions:

**`storage`** — used to save your settings and track the unlock state across tabs, as described above.

**Host access to `reddit.com`** — required to inject the countdown overlay on Reddit pages.

## Disclaimer

This extension is provided under the [MIT License](https://github.com/jiangk/redditdelay/blob/main/LICENSE) on an "as is" basis, without warranties or conditions of any kind. The developer is not liable for any damages or losses arising from use of the extension.

## Contact

Questions or concerns? Open an issue on [GitHub](https://github.com/jiangk/redditdelay/issues).
