#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
sphinx-build -b html . _build/site
echo
echo "Built: _build/site/index.html"
