# Bayu Akbar — Portfolio

Portfolio statis berbahasa Indonesia untuk business development, e-commerce, dan data analytics. HTML, CSS, serta JavaScript tersedia langsung tanpa npm, proses build, atau CDN runtime.

## Jalankan lokal

Dari folder proyek, jalankan `python -m http.server 8000`, lalu buka `http://localhost:8000`.

## Validasi sebelum deploy

- `python scripts/check_site.py` memeriksa struktur HTML, ID, anchor, gambar, dan referensi aksesibilitas.
- `node --check script.js` memeriksa sintaks JavaScript.
- `node --check theme.js` memeriksa inisialisasi dan pilihan tema.
- Periksa menu mobile, filter proyek, detail karier, dan lightbox (termasuk Escape serta fokus keyboard) melalui browser.

GitHub Actions menjalankan pemeriksaan statis saat push dan pull request.

## Aset dan konten

- `index.html`: semua konten; tetap dapat dibaca tanpa JavaScript.
- `styles.css`: desain responsif, reduced motion, fokus keyboard, dan tampilan cetak.
- `refinements.css`: penyempurnaan tata letak dan palet tema terang/gelap.
- `theme.js`: tema awal sesuai perangkat, pilihan manual, dan penyimpanan preferensi.
- `spotlight.css` dan `intro.js`: pembuka Spotlight, transisi masuk, pilihan suara, dan navigasi desktop tepat di tengah.
- `assets/spotlight-chime.wav`: chime orisinal 1,6 detik; hanya diputar setelah klik Masuk dengan suara. Regenerasi dengan `python scripts/generate_intro_sound.py` (tanpa dependency tambahan).
- `script.js`: menu mobile, filter, navigasi aktif, dan dialog gambar.
- `assets/`: gambar yang diperkecil untuk web. File sumber di root dipertahankan.
- `scripts/optimize_assets.py`: regenerasi gambar memakai Python dan Pillow (`python -m pip install Pillow`, lalu `python scripts/optimize_assets.py`).

Metrik Shopee mengikuti laporan tiga bulan yang tersedia; tahunnya tidak tercantum pada screenshot. Data GMV Max memakai periode 13 April–12 Juli 2026. Label ROI GMV Max mengikuti platform dan bukan klaim laba bersih. Jumlah cabang/akun dan indeks harga yang belum memiliki konteks tidak ditampilkan sebagai klaim utama. Pelatihan Digital Marketing tetap dicantumkan tanpa tautan sertifikat yang belum tersedia. Tombol CV membuka permintaan melalui email; PDF lengkap belum dipublikasikan. Fakta profil dan pendidikan mengikuti CV November 2026: Jakarta, lulus S1 tahun 2026, IPK 3,34. Tema terang/gelap mengikuti perangkat pada kunjungan awal dan menyimpan pilihan eksplisit di localStorage bila tersedia.

## Deploy GitHub dan Vercel

Pembuka tampil sekali per sesi tab melalui sessionStorage; tautan langsung ke bagian tertentu melewati pembuka. Escape atau Masuk tanpa suara menutupnya tanpa audio. Tombol Lihat pembuka di footer memungkinkan pemutaran ulang. Jika JavaScript, penyimpanan, atau audio tidak tersedia, konten tetap dapat diakses. Animasi dinonaktifkan untuk prefers-reduced-motion. Tidak ada autoplay atau musik berulang.

Remote yang digunakan: `https://github.com/bayuakbar2810/bayu-portfolio.git`.

Website menggunakan direktori root sebagai output statis; Vercel tidak membutuhkan perintah build. Integrasi Vercel yang terhubung ke branch `main` dapat menerbitkan perubahan otomatis setelah push. Status deployment tetap harus diperiksa di Vercel atau domain; keberhasilan push tidak berarti deployment telah selesai.

`deploy.bat` memvalidasi konten lalu commit dan push perubahan pada branch aktif. Script berhenti ketika validasi, commit, atau push gagal. Pastikan hanya perubahan yang memang ingin diterbitkan ada di working tree, karena script menambahkan seluruh file yang tidak diabaikan Git.
