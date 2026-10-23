@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel% equ 0 (
  echo Delivery G4 disponible en http://localhost:4173/frontend/
  echo Presiona Ctrl+C para detener el servidor.
  py -m http.server 4173
  goto :eof
)
where python >nul 2>nul
if %errorlevel% equ 0 (
  echo Delivery G4 disponible en http://localhost:4173/frontend/
  echo Presiona Ctrl+C para detener el servidor.
  python -m http.server 4173
  goto :eof
)
echo No se encontro Python. Abre index.html directamente en tu navegador.
pause
