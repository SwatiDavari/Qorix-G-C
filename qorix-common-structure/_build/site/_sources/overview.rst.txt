Overview
==========

What this is
---------------

``qorix-common-structure`` is the template documentation project other
Qorix repositories are meant to start from. It fixes the parts that
should stay consistent across projects — page layout, section naming,
theme, and build tooling — so a reader who knows one Qorix doc site can
navigate any other one without relearning the structure.

What it is not
-----------------

This is not a place for project-specific content. Requirements,
architecture decisions, and product documentation belong in each
project's own repository, built from a copy of this structure.

How to use it
-----------------

Copy this project into a new repository, update ``conf.py`` (project
name, author) and the pages under this toctree, and keep the same
section names (Overview, Getting started, Standards, Contributing) so
navigation stays predictable across Qorix documentation sites.
