@echo off
echo ========================================
echo   Backend ITLA Soporte - Servidor PHP
echo ========================================
echo.
echo Iniciando servidor en http://localhost:8080
echo.
echo Para detener el servidor, presiona Ctrl+C
echo.
cd /d %~dp0
C:\xampp\php\php.exe -S localhost:8080 -t public
pause
