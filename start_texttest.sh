#!/bin/sh

if [ ! -d "venv" ]; then
    # TextTest imports sre_parse, which newer Pythons have removed.
    for python in "$PYTHON" python python3 /usr/bin/python3; do
        if "$python" -c 'import sre_parse' 2>/dev/null; then
            "$python" -m venv venv
            break
        fi
    done
fi
venv/bin/pip install texttest
PATH="$PWD/venv/bin:$PATH" venv/bin/texttest -d . -con "$@"
