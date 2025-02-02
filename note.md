**Frontend Project Notes**

### **Overview**
Frontend aplikasi ini dikembangkan menggunakan **Remix** dengan **React Hook Form** untuk menangani form tanpa state management global seperti `useState`, `signal`, atau lainnya. Aplikasi ini berfungsi untuk mengelola akun, daftar orang (persons), hobi, dan karakter favorit dengan fitur utama CRUD.

### **Fitur Utama yang Sudah Berjalan**
✅ **Autentikasi**
- Jika tabel `accounts` kosong, pengguna diarahkan ke halaman register.

✅ **Manajemen Person**
- Halaman utama menampilkan daftar person dalam bentuk tabel.
- Terdapat aksi: **Edit, Delete, Show Hobbies, Show Fave Chars**.

✅ **Manajemen Hobbies**
- Menampilkan daftar hobi berdasarkan `person_id`.
- Fitur **Tambah, Hapus, Edit** hobi.
- Form dapat menerima multiple hobbies dalam format array.

✅ **Manajemen Favorite Characters**
- Menampilkan daftar karakter favorit berdasarkan `person_id`.
- Fitur **Tambah, Hapus, Edit** karakter favorit.
- Form menerima data dalam bentuk array of objects.

✅ **Backend dengan NestJS & PrismaORM**
- Backend sudah menyediakan **CRUDS** untuk setiap tabel.
- Menggunakan PrismaORM sebagai ORM utama.
- Menggunakan enkripsi AES untuk menyimpan password akun.

### **Catatan Kekurangan di Frontend**

🔴 **Validasi Form Masih Kurang Ketat**
- Beberapa form belum memiliki validasi yang kuat.
- Perlu penambahan validasi lebih lanjut pada `React Hook Form`.

🔴 **Keamanan (Security)**
- Masih ada beberapa bug

🔴 **UI & UX Masih Perlu Ditingkatkan**
- Desain tampilan masih sederhana, perlu ditingkatkan agar lebih **user-friendly**.
- Bisa menggunakan **TailwindCSS** atau **ShadCN** untuk komponen yang lebih konsisten dan menarik.
- Implementasi **loading state** pada tombol submit agar lebih responsif.
- Notifikasi (misalnya `toast`) untuk memberi umpan balik kepada pengguna setelah aksi berhasil/gagal.

🔴 **Bug Minor**
- Ada beberapa minor bug yang mungkin muncul.
- Perlu lebih banyak testing manual serta debugging pada UI.

### **Rekomendasi Perbaikan & Next Steps**
✅ **Tambahkan Validasi di Frontend**
- Cek apakah array of string atau array of object memiliki data yang valid sebelum dikirim ke backend.

✅ **Tingkatkan Keamanan**
- Pastikan setiap request yang membutuhkan autentikasi memiliki token valid.
- Hindari manipulasi data langsung di client-side tanpa validasi dari backend.

✅ **Perbaiki UI/UX**
- Tambahkan loading indicator saat form sedang diproses.
- Gunakan toast notification atau alert untuk memberikan feedback ke pengguna.

✅ **Bug Fixing & Testing**
- Lakukan lebih banyak testing untuk memastikan form mengirim data dengan benar.
- Uji setiap aksi CRUD apakah sudah bekerja dengan baik tanpa error.

✅ **Extra Features (Opsional)**
- Implementasi **layout inheritance** untuk halaman tambahan.

---

### **Kesimpulan**
Proyek ini sudah memiliki **fungsi utama yang berjalan**, namun masih perlu perbaikan dari sisi **validasi, keamanan, dan UI/UX**. Fokus selanjutnya adalah **meningkatkan user experience, memperbaiki bug minor, serta memperketat validasi form dan keamanan**.

