# Reddit Delay

A Manifest V3 Chrome extension that forces a configurable countdown before allowing access to Reddit, then keeps it unlocked for a configurable period across all tabs.

## How it works

1. You navigate to any `reddit.com` URL
2. A full-page overlay appears with a countdown timer (default: 30 seconds)
3. The timer only runs while the tab is visible and focused — switching tabs or minimizing resets it
4. Once the countdown completes, Reddit is unlocked for a set duration (default: 15 minutes), shared across all open Reddit tabs
5. After the unlock window expires, the next visit triggers the countdown again

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the project folder
5. Visit any `reddit.com` URL to see it in action

## Development

After any code change:

1. Go to `chrome://extensions`
2. Click the reload (↺) button on the extension card
3. Reload any open Reddit tabs