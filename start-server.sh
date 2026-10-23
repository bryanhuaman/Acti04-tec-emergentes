#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  echo "SmartClaim AI (vista estática) disponible en http://localhost:4173/"
  echo "Presiona Ctrl+C para detener el servidor."
  python3 -m http.server 4173 --bind 127.0.0.1 --directory frontend
elif command -v python >/dev/null 2>&1; then
  echo "SmartClaim AI (vista estática) disponible en http://localhost:4173/"
  echo "Presiona Ctrl+C para detener el servidor."
  python -m http.server 4173 --bind 127.0.0.1 --directory frontend
else
  echo "No se encontró Python. Abre index.html directamente en tu navegador."
fi
