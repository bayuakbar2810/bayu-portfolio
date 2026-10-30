@echo off
setlocal
cd /d "%~dp0"
echo Memeriksa portofolio sebelum dikirim ke GitHub...

set "PORTFOLIO_PYTHON=python"
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" set "PORTFOLIO_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
"%PORTFOLIO_PYTHON%" scripts\check_site.py
if errorlevel 1 goto :failed
node --check script.js
if errorlevel 1 goto :failed
git diff --check
if errorlevel 1 goto :failed

git status --short
echo.
echo Mengirim semua perubahan yang tidak diabaikan Git pada branch aktif.
git add .
if errorlevel 1 goto :failed
git diff --cached --quiet
if errorlevel 2 goto :failed
if errorlevel 1 goto :commit
echo Tidak ada perubahan baru. Memeriksa push commit yang sudah ada...
goto :push

:commit
git commit -m "Update portfolio content and presentation"
if errorlevel 1 goto :failed

:push
git push
if errorlevel 1 goto :failed
echo.
echo BERHASIL: commit sudah dikirim ke GitHub.
echo Jika integrasi Vercel aktif pada branch ini, deployment akan diproses.
echo Periksa status Vercel dan https://portofolio-bayuakbar.my.id/
pause
exit /b 0

:failed
echo.
echo GAGAL: proses dihentikan. Baca pesan error di atas.
echo Pastikan Python, Node.js, dan Git tersedia serta akses GitHub aktif.
pause
exit /b 1
