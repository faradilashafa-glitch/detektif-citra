# GEOEXPLORE – LKPD INTERAKTIF DETEKTIF CITRA
**Topik Pembelajaran Geografi Kelas X:** Penginderaan Jauh – Pengenalan Objek pada Citra  
**Alokasi Waktu:** 1 JP (45 Menit) | **Sasaran:** 35–36 Siswa (6 Kelompok @ 5–6 Siswa)  
**Wilayah Studi Kasus:** Kota Malang (Alun-Alun Tugu, Jalan Ijen, Universitas Brawijaya, Universitas Negeri Malang, Velodrome Sawojajar, Pasar Madyopuro)

---

## 📖 Panduan Penggunaan & Pengelolaan untuk Guru / Operator

### 1. Cara Membuat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/) dan login menggunakan akun Google.
2. Klik **Add project** (Tambah Proyek).
3. Masukkan nama proyek (contoh: `geoexplore-malang-sma`).
4. Aktifkan **Google Analytics** (opsional) lalu klik **Create Project**.
5. Pada menu samping:
   - Pilih **Build > Authentication**, klik *Get Started*, lalu aktifkan penyedia **Google** dan **Email/Password**.
   - Pilih **Build > Firestore Database**, klik *Create database*, pilih mode produksi, dan tentukan lokasi server terdekat (contoh: `asia-southeast2` Jakarta).
   - Pilih **Build > Storage**, klik *Get Started* untuk mengaktifkan penyimpanan berkas citra.

---

### 2. Cara Mengisi Firebase Config
1. Pada halaman beranda proyek Firebase, klik ikon **Web (`</>`)** untuk mendaftarkan aplikasi web.
2. Masukkan nama aplikasi (contoh: `GeoExplore Web`), lalu centang *Firebase Hosting* jika ingin langsung mengaktifkan hosting.
3. Salin objek konfigurasi `firebaseConfig` yang muncul.
4. Buka berkas `firebase-applet-config.json` di direktori proyek dan pastikan formatnya seperti berikut:
```json
{
  "projectId": "ID_PROYEK_FIREBASE_ANDA",
  "appId": "ID_APLIKASI_WEB",
  "apiKey": "KUNCI_API_FIREBASE",
  "authDomain": "ID_PROYEK.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "ID_PROYEK.firebasestorage.app",
  "messagingSenderId": "SENDER_ID"
}
```

---

### 3. Akun Operator / Guru Resmi SMANDASA
Guru/Operator dapat langsung masuk ke dashboard menggunakan kredensial resmi:
- **Username:** `gurugeosmandasa`
- **Password:** `citrajauh`

Tersedia pula tombol *"Klik untuk isi otomatis"* pada halaman login untuk kemudahan akses guru di kelas, serta dukungan login via akun Google.

---

### 4. Cara Mengunggah Citra Tiap Kelompok
1. Buka halaman utama aplikasi dan klik **MASUK SEBAGAI OPERATOR/GURU**.
2. Login menggunakan akun Google atau email guru.
3. Pada Dashboard Operator, pilih tab **"Kelola Citra Wilayah"**.
4. Tersedia 6 kartu untuk masing-masing kelompok:
   - Kelompok 1: Alun-Alun Tugu – Balai Kota Malang – Stasiun Kota Baru
   - Kelompok 2: Jalan Ijen – Museum Brawijaya – Oro-Oro Dowo
   - Kelompok 3: Universitas Brawijaya – Jalan Veteran – Malang Town Square
   - Kelompok 4: Universitas Negeri Malang – Jalan Semarang – Jalan Veteran
   - Kelompok 5: Velodrome – Madyopuro – Sawojajar
   - Kelompok 6: Kedungkandang – Pasar Madyopuro – Jalan Danau Jonge
5. Klik **"Unggah Citra"**, lalu pilih berkas citra satelit resolusi tinggi dari komputer Anda.
6. Sistem akan otomatis mengompresi dan menyinkronkan citra ke layar masing-masing kelompok siswa secara real-time. Anda juga dapat menekan tombol **Ganti Citra** atau **Hapus Citra** kapan saja.

---

### 5. Cara Melihat Jawaban Siswa
1. Pada Dashboard Operator, buka tab **"Monitoring & Penilaian Kelompok"**.
2. Pada tabel daftar kelompok, cari kelompok yang ingin dipantau.
3. Klik tombol **"Lihat Jawaban"**.
4. Kotak dialog detail monitoring akan menampilkan:
   - Identitas 6 anggota kelompok dan kelas.
   - Waktu mulai dan waktu pengumpulan.
   - Progres pengerjaan aktual (%).
   - Jawaban 5 pertanyaan awal pengamatan citra.
   - Tabel hasil pengamatan objek (objek, ciri visual, dan alasan dugaan).
   - Dua objek pilihan presentasi 1 menit.
   - Refleksi pembelajaran siswa.

---

### 6. Cara Memberi Nilai Berdasarkan Rubrik 100 Poin
1. Pada tabel kelompok atau dari jendela detail jawaban, klik tombol hijau **"Nilai"**.
2. Form penilaian akan menampilkan rubrik 5 kriteria standar:
   - **Ketepatan Identifikasi Objek** (Maksimal 30 poin)
   - **Ciri Visual dan Alasan** (Maksimal 25 poin)
   - **Kelengkapan Tabel Pengamatan** (Maksimal 20 poin)
   - **Hasil Diskusi / Presentasi** (Maksimal 15 poin)
   - **Refleksi dan Kerja Kelompok** (Maksimal 10 poin)
3. Masukkan skor untuk masing-masing komponen. Nilai akhir dihitung otomatis (total maksimal 100 poin). Sistem membatasi agar input tidak melebihi skor maksimum.
4. Tuliskan umpan balik pada kolom **"Catatan / Feedback Guru"**.
5. Klik **"Simpan Nilai & Komentar"**. Status kelompok akan berubah menjadi **🔵 Sudah Dinilai** dan siswa dapat melihat rincian nilainya secara privat di tab hasil mereka.

---

### 7. Cara Export Nilai & Cetak Rekap
1. Pada Dashboard Operator, buka tab **"Rekap Nilai Kelas"**.
2. Halaman ini menyajikan statistik rata-rata kelas, nilai tertinggi, dan nilai terendah tanpa perangkingan otomatis.
3. Klik tombol **"Export CSV"** untuk mengunduh rekap nilai dalam format spreadsheet `.csv` (kompatibel dengan Microsoft Excel & Google Sheets).
4. Klik tombol **"Cetak Rekap"** untuk mencetak rekap atau menyimpannya sebagai dokumen PDF.

---

### 8. Cara Deploy Gratis Menggunakan Firebase Hosting
1. Pasang Firebase CLI pada komputer Anda:
   ```bash
   npm install -g firebase-tools
   ```
2. Login ke akun Google Anda melalui terminal:
   ```bash
   firebase login
   ```
3. Inisialisasi Firebase Hosting di dalam folder proyek:
   ```bash
   firebase init hosting
   ```
   - Pilih *Use an existing project* dan pilih proyek Firebase Anda.
   - Masukkan public directory: `dist`
   - Configure as single-page app (rewrite all urls to /index.html)? Ketik `y` (Yes).
4. Lakukan build aplikasi:
   ```bash
   npm run build
   ```
5. Deploy ke server Firebase Hosting gratis:
   ```bash
   firebase deploy --only hosting
   ```
6. Aplikasi Anda kini live di URL gratis `https://<PROJECT-ID>.web.app` dan siap digunakan di kelas!
