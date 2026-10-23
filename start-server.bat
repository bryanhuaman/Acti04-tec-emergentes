@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel% equ 0 (
  echo SmartClaim AI (vista estática) disponible en http://localhost:4173/
  echo Presiona Ctrl+C para detener el servidor.
  py -m http.server 4173 --bind 127.0.0.1 --directory frontend
  goto :eof
)
where python >nul 2>nul
if %errorlevel% equ 0 (
  echo SmartClaim AI (vista estática) disponible en http://localhost:4173/
  echo Presiona Ctrl+C para detener el servidor.
  python -m http.server 4173 --bind 127.0.0.1 --directory frontend
  goto :eof
)
echo No se encontro Python. Abre index.html directamente en tu navegador.
pause
