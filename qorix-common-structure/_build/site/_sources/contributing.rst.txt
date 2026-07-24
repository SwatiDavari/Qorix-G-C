Contributing
===============

Adding a page
-----------------

Create a new ``.rst`` file at the project root and add it to the
``toctree`` in ``index.rst``. Follow the section order in
:doc:`standards`.

Reviewing changes
---------------------

Build locally before opening a pull request:

.. code-block:: bash

   sphinx-build -W -b html . _build/site

The ``-W`` flag turns warnings into errors, catching broken references
and malformed directives before review.
