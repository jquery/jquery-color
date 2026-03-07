#!/usr/bin/env bash

set -euo pipefail

# $1: Version

if (( $(echo "$BASH_VERSION" | cut -f1 -d.) < 5 )); then
	echo "Bash 5 or newer required. If you're on macOS, the built-in Bash is too old; install a newer one from Homebrew."
	exit 1
fi

cdn="tmp/release/cdn"

if [[ -z "$1" ]]; then
	echo "Version is not set (1st argument)"
	exit 1
fi

# Push files to cdn repo
npm run release:cdn -- "$version"

echo "Committing CDN changes"
cd "$cdn"
git add -A
git commit -S -m "jquery-color: Add version $version"
git push
cd -

# Restore AUTHORS URL
sed -i '' -e "s|$1/AUTHORS.txt|main/AUTHORS.txt|" package.json
git add package.json

# Remove built files from tracking.
npm run build:clean
git rm --cached -r dist/
git commit -S -m "Release: remove dist files from main branch"

# Wait for confirmation from user to push changes
read -p "Press enter to push changes to main branch"
git push
