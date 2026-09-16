@echo off
echo ======================================================
echo       UPDATE & DEPLOY OTOMATIS PORTOFOLIO
echo ======================================================
echo.
git status
echo.
set /p msg="Tulis catatan perubahan (tekan Enter untuk default): "
if "%msg%"=="" set msg=Update konten website portofolio

echo.
echo Mengirim perubahan ke GitHub...
git add .
git commit -m "%msg%"
git push origin main

echo.
echo ======================================================
echo   BERHASIL! Perubahan telah dikirim ke GitHub.
echo   Vercel sedang memproses update secara otomatis.
echo   Cek hasilnya dalam 10-30 detik di:
echo   https://portofolio-bayuakbar.my.id/
echo ======================================================
echo.
pause
