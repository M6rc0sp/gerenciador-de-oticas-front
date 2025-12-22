#!/bin/bash
set -e
cd /home/documents/mvl/gerenciador-de-oticas-front
exec /usr/local/bin/serve -s dist -l 10003
