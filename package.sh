#!/bin/sh
zip -r reddit-delay.zip \
  manifest.json \
  content.js \
  style.css \
  options.html \
  options.js \
  icons/icon16.png \
  icons/icon48.png \
  icons/icon128.png
echo "Created reddit-delay.zip"
