# Notes — Phase 05 Database: SQL & Firestore

Folder ini berisi materi note untuk [Phase 05](../README.md). Kerjakan **berurutan**: note SQL dulu (konsepnya berlaku umum), baru Firestore.

> Note di folder ini diterbitkan saat fase dimulai. Kalau sebuah tautan belum berisi, berarti note itu belum rilis — tanyakan mentor di chat. Pola ini sengaja sama dengan phase-01.

## Daftar Note

| # | File | Isi utama |
| --- | --- | --- |
| 01 | `01-model-data-relasional.md` | Tabel, baris, kolom, tipe data, PK/FK, relasi 1-1/1-N/N-N, ERD sederhana |
| 02 | `02-normalisasi.md` | Anomali data, 1NF/2NF/3NF, normalisasi vs denormalisasi, kapan sengaja melanggar |
| 03 | `03-sql-dasar.md` | `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `INSERT`/`UPDATE`/`DELETE`, agregasi |
| 04 | `04-sql-join-groupby.md` | `INNER`/`LEFT JOIN`, `GROUP BY` + `HAVING`, subquery, `UNION` ringkas |
| 05 | `05-index-dan-performa.md` | Cara kerja index, index komposit, kapan dipakai/tidak, `EXPLAIN`, N+1 |
| 06 | `06-transaksi-acid.md` | `BEGIN`/`COMMIT`/`ROLLBACK`, ACID, tingkat isolasi, deadlock ringkas |
| 07 | `07-nosql-firestore-model.md` | Koleksi & dokumen, subkoleksi, embed vs reference, denormalisasi sengaja |
| 08 | `08-firestore-query.md` | Query modular SDK, `where`/`orderBy`/`limit`, pagination, composite index |
| 09 | `09-firestore-rules-dan-performa.md` | Security Rules dasar, batched write/read, menghindari N+1 di Firestore |

> Cara belajar tiap note ada di [README fase](../README.md) bagian *Materi & Urutan Belajar*.
