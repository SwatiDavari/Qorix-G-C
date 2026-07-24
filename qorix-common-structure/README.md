# Qorix common structure

The shared documentation baseline for Qorix projects — the layout,
section naming, and build tooling every project-specific Qorix
documentation site should start from.

## Build locally

```bash
pip install -r requirements.txt
./build.sh
```

Open `_build/site/index.html`.

## Deploy

`.github/workflows/docs.yml` builds this project and publishes it to
GitHub Pages on every push to `main`, using GitHub's official
`actions/deploy-pages` action (Settings → Pages → Source →
"GitHub Actions" must be enabled once per repository).

## Starting a new project from this template

1. Copy this folder into the new repository.
2. Update `project` / `author` in `conf.py`.
3. Keep the four sections (`overview`, `getting_started`, `standards`,
   `contributing`) as-is so navigation stays consistent across every
   Qorix doc site; add project-specific pages after them in
   `index.rst`'s toctree.
