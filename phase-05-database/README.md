# Phase 05 — Database: SQL & Firestore

> Durasi: 3 minggu (4+ jam/hari) | Prasyarat: [phase-04-node-backend](../phase-04-node-backend/README.md) selesai (REST API, async di server, error handling) | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Memodelkan data** dua cara: relasional (tabel, baris, relasi, normalisasi) dan dokumen (koleksi, dokumen, subkoleksi, denormalisasi) — lalu menjelaskan **kapan memilih yang mana**.
2. **Menulis query SQL dari nol** (tanpa menyalin contoh): `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `LIMIT`, agregasi, dan subquery sederhana.
3. **Menjelaskan kenapa query lambat** dan bagaimana **index** mempercepatnya, termasuk kapan index justru tidak dipakai.
4. **Menjelaskan transaksi & ACID** dan kenapa operasi multi-langkah (mis. transfer saldo, buat pesanan) butuh atomisitas.
5. **Menulis query Firestore** dengan `where`, `orderBy`, `limit`, pagination (`startAfter`), dan memahami **batasan composite index** serta kenapa kombinasi filter tertentu butuh index tambahan.
6. **Memodelkan data untuk Firestore**: memilih **embed vs reference** berdasarkan pola baca, bukan berdasarkan "kebiasaan".
7. **Menulis Security Rules dasar** Firestore dengan prinsip *least privilege* dan menjelaskan kenapa validasi di aplikasi saja tidak cukup.
8. **Mendiagnosis masalah performa data**: N+1 query, query tanpa index, membaca dokumen berlebihan, dan memperbaikinya dengan batched read/write.
9. **Menyelesaikan** latihan query di kedua database dan **lulus review** project `data-layer-lab`.

## Mental Model — Kenapa, bukan cuma Apa

Database bukan "tempat menyimpan data". Database adalah **struktur yang menentukan biaya** dari setiap operasi baca dan tulis. Pertanyaan sebenarnya bukan "bagaimana cara menyimpan ini?", tetapi:

> **"Query seperti apa yang akan sering dijalankan, dan berapa biaya menjalankannya?"**

Model desain apa pun harus dijawab dari pertanyaan itu. Ini beberapa model kerja inti fase ini:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Struktur data → biaya akses** | "Untuk mengambil data ini, DB harus baca berapa baris/dokumen?" | index, full table scan, kompleksitas query, Firestore "no index = no query" |
| **Relasi vs duplikasi** | "Kalau data yang sama dipakai di banyak tempat, aku simpan sekali atau menyalinnya?" | normalisasi, denormalisasi, `JOIN`, embed vs reference |
| **Integritas & atomisitas** | "Kalau langkah ke-3 gagal, bagaimana langkah 1–2 tidak setengah jalan?" | transaksi, ACID, batched write, konsistensi |
| **Pola baca menentukan model** | "Aplikasi ini lebih sering baca atau tulis? Bentuk query-nya apa?" | skema SQL, struktur koleksi Firestore, composite index, duplikasi sengaja |

### Kenapa "baca dulu, baru desain"

Kesalahan paling umum pemula: **mendesain skema berdasarkan bentuk data di kepala**, lalu kaget ketika query-nya lambat atau butuh index aneh. Urutan yang benar:

1. Tulis **daftar pertanyaan** yang akan sering ditanyakan aplikasi (mis. "tampilkan 20 pesanan terbaru milik user X", "total penjualan per bulan").
2. Desain struktur yang membuat pertanyaan itu **murah**.
3. Baru pertimbangkan kenyamanan menulis data.

Contoh: di SQL, `JOIN` murah karena DB yang mengerjakan; di Firestore, **`JOIN` tidak ada** — kalau kamu butuh data gabungan, kamu harus menyiapkannya saat menulis (embed) atau melakukan **query kedua** (reference). Jadi model Firestore "membayar di sisi tulis", SQL "membayar di sisi baca". Memahami trade-off inilah inti fase ini.

> Aturan emas fase ini: **"Setiap kali menulis query, tanyakan: ini membaca berapa banyak?"** Kalau jawabannya 'semua lalu disaring di aplikasi', berarti ada yang salah dengan desain atau index.

## Materi & Urutan Belajar

Materi dipecah menjadi note di folder [`notes/`](./notes/). Kerjakan berurutan; note SQL dulu (konsepnya berlaku umum), baru Firestore.

| # | File | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | `notes/01-model-data-relasional.md` | Tabel, baris, kolom, tipe data, **PK/FK**, relasi 1-1/1-N/N-N, ERD sederhana | Dasar membaca skema & merancang data yang tidak kacau |
| 02 | `notes/02-normalisasi.md` | Anomali data, 1NF/2NF/3NF, normalisasi vs **denormalisasi**, kapan sengaja melanggar | Keputusan model data = keputusan arsitektur |
| 03 | `notes/03-sql-dasar.md` | `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `INSERT`/`UPDATE`/`DELETE`, agregasi `COUNT`/`SUM`/`AVG` | Query harian backend |
| 04 | `notes/04-sql-join-groupby.md` | `INNER`/`LEFT JOIN`, `GROUP BY` + `HAVING`, subquery, `UNION` ringkas | Menggabungkan data dari banyak tabel (kebutuhan reporting) |
| 05 | `notes/05-index-dan-performa.md` | Cara kerja index, index komposit, kapan index dipakai/tidak, `EXPLAIN` (konsep), N+1 | "Struktur data, query, performa" langsung dari JD |
| 06 | `notes/06-transaksi-acid.md` | `BEGIN`/`COMMIT`/`ROLLBACK`, ACID, tingkat isolasi (konsep), deadlock ringkas | Integritas data & reliability |
| 07 | `notes/07-nosql-firestore-model.md` | Koleksi & dokumen, subkoleksi, tipe data, **embed vs reference**, denormalisasi sengaja | Model data Firebase (JD: Firestore) |
| 08 | `notes/08-firestore-query.md` | Query modular SDK, `where`/`orderBy`/`limit`, pagination `startAfter`, **composite index**, batasan query | Menulis query Firestore yang benar & efisien |
| 09 | `notes/09-firestore-rules-dan-performa.md` | Security Rules dasar, batched write, transaction, batched read, menghindari N+1 di Firestore | Keamanan + performa + biaya |

> Catatan: file note di atas akan dirilis saat fase ini dimulai.

### Cara belajar tiap note (ulangi pola ini)

1. **Baca sekali cepat** untuk peta besar.
2. **Jalankan query-nya sendiri.** Untuk SQL, pakai SQLite (paling mudah, tanpa server): `sqlite3 latihan.db` lalu `.read file.sql`. Untuk Firestore, pakai **Emulator Suite** (lihat phase-07) atau project Firebase khusus latihan.
3. **Prediksi hasil query sebelum menjalankan.** Salah prediksi = model belum benar.
4. **Jawab bagian "Jelaskan dengan Kata Sendiri"** di akhir tiap note.
5. **Commit** hasil latihan (Conventional Commits, mis. `feat(phase-05): latihan join produk-pesanan`), lalu minta review mentor.
6. **Refleksi**: 3 baris — apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanyakan.

> Tips SQL: siapkan satu database latihan kecil (mis. `produk`, `pelanggan`, `pesanan`) dan **ketik ulang** semua contoh. Jangan hanya membaca hasil query — tulis sendiri, salahkan sendiri, perbaiki sendiri.

## Latihan

Semua latihan ada di [`exercises/`](./exercises/) dan dibagi per note. Aturan inti: **tulis query-mu dulu**, jangan intip kunci sebelum mencoba; **commit tiap latihan selesai**.

Target minimal fase ini:

- **10+ latihan SQL**: dari `SELECT` sederhana sampai `JOIN` + `GROUP BY` + subquery, ditulis tanpa melihat contoh.
- **8+ latihan Firestore**: menulis query modular SDK, pagination, dan satu composite index yang benar-benar dibutuhkan.
- **3 latihan desain**: diberi deskripsi kebutuhan, kamu merancang skema (SQL **dan** Firestore) dan menjelaskan trade-off-nya.
- **1 latihan diagnosa**: diberi query lambat, temukan penyebabnya (index hilang / N+1 / full scan) dan perbaiki.

Setiap latihan desain dinilai dari **alasan**, bukan dari "skema terlihat rapi". Mentor akan bertanya "kenapa begini, bukan begitu?".

## Project

Project portofolio fase ini: **`data-layer-lab`** (repo terpisah, dibuat saat fase ini dimulai).

Tujuannya membuktikan bahwa kamu bisa **memodelkan data yang sama di dua dunia** dan menjelaskan konsekuensinya:

1. Pilih satu domain kecil, mis. **katalog produk + pesanan**.
2. Buat skema **SQL** (tabel, PK/FK, relasi) dan tulis query umum: daftar produk, pesanan per pelanggan, total penjualan per bulan, produk terlaris.
3. Buat model **Firestore** untuk domain yang sama: pilih dengan sadar mana yang di-embed, mana yang direferensikan, dan **tulis alasannya**.
4. Tulis query Firestore untuk kebutuhan yang sama (termasuk satu pagination dan satu query yang butuh composite index).
5. Sertakan **Security Rules dasar** untuk sisi Firestore.
6. Buat **catatan perbandingan**: mana yang lebih mudah, mana yang lebih murah, kapan masing-masing menang.

Kriteria yang dinilai mentor (review seperti senior dev):

- Skema SQL ternormalisasi **kecuali** tempat di mana kamu sengaja mendenormalisasi — dan alasannya ditulis.
- Query SQL tidak melakukan full scan yang tidak perlu; index yang dipakai dijelaskan.
- Model Firestore mengikuti **pola baca**, bukan meniru bentuk tabel SQL.
- Security Rules menolak akses tidak sah dan alasannya bisa dijelaskan.
- Ada README yang bisa diikuti orang lain untuk menjalankan skema + query dari nol.

Detail lengkap spesifikasi project akan diberikan mentor saat fase dimulai.

## Checklist Kelulusan

Fase ini dianggap **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-06 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan lisan/tulisan ke mentor)**

- [ ] Bisa menjelaskan **PK, FK, dan relasi** serta menggambar ERD sederhana.
- [ ] Bisa menjelaskan **normalisasi** dan kapan **sengaja mendenormalisasi**.
- [ ] Bisa menulis query dengan **`JOIN` dan `GROUP BY`** tanpa menyalin contoh.
- [ ] Bisa menjelaskan **kenapa index mempercepat query** dan **kapan index tidak terpakai**.
- [ ] Bisa menjelaskan **transaksi & ACID** dengan contoh nyata (mis. pesanan + stok).
- [ ] Bisa menjelaskan kapan data sebaiknya **di-embed vs direferensikan** di Firestore.
- [ ] Bisa menjelaskan **kenapa Security Rules penting** dan menulis rules dasar yang benar.
- [ ] Bisa menjelaskan apa itu **N+1 query** dan cara memperbaikinya di SQL maupun Firestore.

**Praktik**

- [ ] Menyelesaikan **10+ latihan SQL** dan **8+ latihan Firestore**, semuanya ter-commit.
- [ ] Menyelesaikan **3 latihan desain** dengan alasan trade-off tertulis.
- [ ] Menyelesaikan **1 latihan diagnosa performa** dan menjelaskan akar masalahnya.
- [ ] Menjawab bagian "Jelaskan dengan Kata Sendiri" di **kesembilan** note.

**Project & Git**

- [ ] Project `data-layer-lab` **lulus review** mentor (skema, query, index, rules, catatan perbandingan, README).
- [ ] Riwayat Git rapi: branch `phase-05/nama-singkat`, Conventional Commits, dan **minimal satu Pull Request** yang kamu **self-review** sebelum merge.
- [ ] Project bisa dijalankan dari nol oleh orang lain mengikuti README-nya.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal yang paling mengubah cara berpikirmu tentang data, dan 1 hal yang masih ingin diperdalam.

## Referensi

- **SQLBolt** — <https://sqlbolt.com/> (latihan interaktif SQL dasar; cepat dan langsung).
- **PostgreSQL Tutorial** — <https://www.postgresqltutorial.com/> (rujukan `JOIN`, `GROUP BY`, index; berlaku umum untuk SQL).
- **SQLite Documentation** — <https://www.sqlite.org/docs.html> (untuk menjalankan latihan lokal tanpa server; lihat bagian *Query Planning* untuk `EXPLAIN QUERY PLAN`).
- **Use The Index, Luke!** — <https://use-the-index-luke.com/> (penjelasan index database paling jelas; baca bagian dasar).
- **Firebase Docs — Cloud Firestore** — <https://firebase.google.com/docs/firestore> (model data, query, index, rules, batched write).
- **Firebase Docs — Security Rules** — <https://firebase.google.com/docs/rules> (bahasa rules dan cara mengujinya).
- **Firebase Emulator Suite** — <https://firebase.google.com/docs/emulator-suite> (jalankan Firestore lokal untuk latihan tanpa biaya).

> Catatan: jangan membaca referensi dari awal sampai akhir. Pakai sebagai *kamus* — baca bagian yang relevan saat mentok di satu note, lalu kembali ke latihan.
