# Admin Dashboard - Responsi Wisata

Admin Dashboard untuk aplikasi wisata dengan tema **Wonderful Indonesia**.
Project ini dibangun menggunakan **Vanilla HTML, JavaScript (ES Modules)**, dan **Tailwind CSS (CDN)**.

## Fitur Utama

1.  **Dashboard Overview**: Statistik pengunjung, destinasi, dan pendapatan.
2.  **Manajemen Wisata**: CRUD (Create, Read, Update, Delete) destinasi wisata.
3.  **Manajemen Kategori**: Kelola kategori wisata (Pantai, Gunung, dll).
4.  **Riwayat Pemesanan**: Pantau booking masuk dari customer.
5.  **Moderasi Ulasan**: Approve/Reject review dari pengunjung.
6.  **Manajemen Pengguna**: Data user terdaftar.
7.  **Laporan**: Rekapitulasi pendapatan mingguan/bulanan.

## Cara Menjalankan

Project ini **tidak memerlukan `npm install` atau build tool**. Cukup browser modern.

1.  Buka root folder project ini.
2.  Klik ganda file `index.html`.
3.  Login (Sembarang username/password untuk demo).
4.  Dashboard siap digunakan.

> **Catatan**: Pastikan koneksi internet aktif untuk memuat Tailwind CSS dari CDN.

## Struktur Folder

```
/
├── index.html            (Halaman Login)
├── src/
│   ├── components/       (Shared: Sidebar.js, Navbar.js)
│   ├── features/         (Fitur per halaman)
│   │   ├── dashboard/
│   │   ├── wisata/
│   │   ├── kategori/
│   │   ├── pemesanan/
│   │   ├── ulasan/
│   │   ├── pengguna/
│   │   └── laporan/
│   └── main.js
```

## Teknologi

- **HTML5**
- **JavaScript (Vanilla ES6)**
- **Tailwind CSS (via CDN)**
- **Font**: Plus Jakarta Sans (Google Fonts)
