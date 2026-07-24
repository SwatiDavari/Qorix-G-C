Getting started
==================

Install
----------

.. code-block:: bash

   pip install -r requirements.txt

Build
--------

.. code-block:: bash

   sphinx-build -b html . _build/site

Open ``_build/site/index.html`` in a browser.

Live rebuild while editing
------------------------------

.. code-block:: bash

   pip install sphinx-autobuild
   sphinx-autobuild . _build/site
