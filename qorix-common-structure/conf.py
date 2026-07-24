# Configuration file for the Sphinx documentation builder.
project = "Qorix common structure"
copyright = "2026, Qorix"
author = "Qorix"
release = "1.0"

extensions = [
    "sphinx.ext.autosectionlabel",
    "sphinx.ext.viewcode",
]

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

html_theme = "furo"
html_static_path = ["_static"]
html_title = "Qorix common structure"

html_theme_options = {
    "sidebar_hide_name": False,
    "navigation_with_keys": True,
}
