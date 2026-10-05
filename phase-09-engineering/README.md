# Phase 09 — Software Engineering & Codebase Mastery

> Durasi: berkelanjutan (mulai ~minggu 14, berjalan sampai capstone) | Prasyarat: [phase-03-react](../phase-03-react/README.md), [phase-04-node-backend](../phase-04-node-backend/README.md) — minimal sudah punya project sendiri untuk dibedah | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini (dan seterusnya) kamu bisa:

1. **Membaca codebase besar** dengan strategi: menemukan **entry point**, menelusuri **alur data**, memetakan dependency, dan membedakan kode inti vs noise — dalam waktu terbatas, tanpa membaca semuanya.
2. **Menavigasi codebase dengan alat**: `grep`/pencarian simbol, "go to definition"/"find references", membaca **test** dan **git blame/log** untuk memahami *kenapa* kode berbentuk begitu.
3. **Melakukan refactoring dengan aman**: langkah kecil, perilaku tetap sama, dan **karakterisasi test** lebih dulu sebagai jaring pengaman.
4. **Menerapkan pola refactor umum**: extract function, rename, hapus duplikasi, pecah modul besar, perkenalkan tipe.
5. **Menerapkan clean code**: penamaan yang jelas, fungsi kecil dengan satu tanggung jawab, dan **komentar yang menjelaskan "kenapa"** bukan "apa".
6. **Menggunakan SOLID secara praktis** (bukan dogma) dan menjelaskan **trade-off**-nya.
7. **Mengenali design pattern umum** (mis. strategy, factory, repository, observer) dan tahu kapan **tidak** memakainya.
8. **Memberi & menerima code review** yang spesifik, sopan, dan bisa menjelaskan alasannya.
9. **Menulis dokumentasi teknis**: README yang bisa diikuti orang lain, **ADR** (Architecture Decision Record), dan dokumentasi API yang berguna.
10. **Mengestimasi & mengomunikasikan pekerjaan teknis**: memecah tugas, menyebut asumsi & risiko, dan menjelaskan trade-off ke orang non-teknis.
11. **Menjalankan prinsip ownership**: mengelola utang teknis, memprioritaskan, dan mempertanggungjawabkan keputusan jangka panjang.

## Mental Model — Kenapa, bukan cuma Apa

Fase ini bukan tentang menambah fitur baru, tetapi mengubah identitasmu: dari **"orang yang menulis kode"** menjadi **"orang yang menjaga kode"**. Ada satu pertanyaan yang mengubah segalanya:

> **"Kalau aku tidak ada 3 bulan, apakah orang lain bisa paham dan mengubah kode ini dengan aman?"**

Model kerja inti fase ini:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Kode sebagai komunikasi** | "Apakah nama & struktur ini menjelaskan *maksud*, bukan cuma *mekanisme*?" | penamaan, fungsi kecil, komentar berguna, dokumentasi |
| **Perubahan sebagai risiko** | "Apa cara paling aman mengubah ini tanpa merusak perilaku?" | karakterisasi test, langkah kecil, refactor vs rewrite |
| **Dependency & arah ketergantungan** | "Kalau aku ubah modul ini, siapa lagi yang ikut rusak?" | coupling, cohesion, dependency graph, SOLID |
| **Keputusan & jejak** | "Kenapa dulu dipilih begini? Apakah alasannya masih berlaku?" | ADR, git history, `git blame`, trade-off tertulis |
| **Utang teknis** | "Perbaikan apa yang sengaja ditunda, dan apa risikonya?" | prioritisasi, backlog, ownership |

### Kenapa "refactor" bukan "rewrite"

Refactor berarti **mengubah struktur tanpa mengubah perilaku**. Rewrite berarti **membangun ulang**, dan hampir selalu lebih berisiko daripada yang terlihat: kamu kehilangan perbaikan bug lama, edge case yang tidak terdokumentasi, dan pemahaman yang terkubur di kode berjalan.

Karena itu urutan yang benar:

1. **Pahami perilaku sekarang** (baca kode + tulis **karakterisasi test** yang mengunci perilaku saat ini, walau kode itu "jelek").
2. **Ubah sedikit-sedikit**, jalankan test setiap langkah kecil.
3. **Hentikan saat tujuan tercapai** — jangan refactor selamanya.

### Kenapa membaca kode besar terasa mustahil (dan cara mengatasinya)

Kamu tidak perlu memahami *semua*. Kamu perlu memahami **satu alur** terlebih dahulu:

1. Temukan **entry point** (mis. `main`, route handler, `index.tsx`).
2. Ikuti **satu request/aksi** dari awal sampai akhir — lewati cabang yang tidak relevan.
3. Catat **modul** yang dilalui. Itu peta awalmu.
4. Ulangi untuk alur kedua; mulai terlihat polanya.

Ini teknik **"follow the data flow"**, dan jauh lebih efektif daripada membaca file satu per satu dari atas ke bawah.

> Aturan emas fase ini: **"Kalau kamu tidak bisa menjelaskan sebuah kode ke orang lain dalam 2 menit, kamu belum memahaminya cukup untuk mengubahnya."**

## Materi & Urutan Belajar

Materi ada di folder [`notes/`](./notes/). Fase ini **tidak punya akhir**; kerjakan note sesuai kebutuhan project nyata, lalu ulangi.

| # | File | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | `notes/01-clean-code-penamaan.md` | Penamaan, ukuran fungsi, komentar berguna vs noise, konsistensi, format otomatis | Maintainability; dasar review yang sehat |
| 02 | `notes/02-solid-praktis.md` | SRP, OCP, LSP, ISP, DIP — versi praktis + contoh TS, kapan **tidak** menerapkan | Desain yang bisa berubah tanpa reruntuhan |
| 03 | `notes/03-design-pattern-umum.md` | Strategy, factory, repository, observer, adapter — masalah yang dipecahkan tiap pola | Kosakata desain; menghindari solusi ad-hoc |
| 04 | `notes/04-refactoring-aman.md` | Karakterisasi test, langkah kecil, pola refactor, kapan berhenti, refactor vs rewrite | JD: "refactoring aman & maintainable" |
| 05 | `notes/05-membaca-codebase-besar.md` | Entry point, follow data flow, grep & find references, membaca test, `git blame`/`log` | JD: "membaca existing codebase besar" |
| 06 | `notes/06-dokumentasi-teknis.md` | README yang berguna, dokumentasi API, ADR, komentar desain, dokumentasi yang tidak basi | JD: "dokumentasi teknis" |
| 07 | `notes/07-code-review.md` | Memberi & menerima review, apa yang layak dikomentari, nada yang sopan & tajam, review sebagai pembelajaran | JD: "Git & GitHub termasuk code review" |
| 08 | `notes/08-estimasi-dan-komunikasi.md` | Memecah tugas, menyebut asumsi & risiko, estimasi kasar, menjelaskan trade-off ke non-teknis | Kolaborasi & komunikasi teknis |
| 09 | `notes/09-technical-ownership.md` | Utang teknis, prioritisasi, keputusan jangka panjang, SLA sederhana, kapan bilang "tidak" | JD: "technical ownership jangka panjang" |

> Catatan: file note di atas akan dirilis saat fase ini dimulai.

### Cara belajar tiap note (ulangi pola ini)

1. **Baca sekali cepat** untuk peta besar.
2. **Terapkan langsung ke project nyata milikmu** (dari fase 01–08) — bukan contoh mainan.
3. **Lakukan refactor kecil hari ini**, commit, dan jelaskan alasannya di pesan commit.
4. **Jawab bagian "Jelaskan dengan Kata Sendiri"** di akhir tiap note.
5. **Commit** hasil kerja (mis. `refactor(phase-09): ekstrak fungsi validasi`), lalu minta review mentor.
6. **Refleksi**: 3 baris — apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanyakan.

> Tips: buat **jurnal keputusan**. Setiap kali mengambil keputusan teknis nontrivial, tulis 5 baris: konteks, pilihan, alasan, trade-off, tanggal. Ini bibit ADR dan bukti ownership.

## Latihan

Semua latihan ada di [`exercises/`](./exercises/). Karena fase ini berkelanjutan, latihan bersifat **berulang** — ulangi pada project berbeda.

Target minimal:

- **1 latihan membaca codebase**: ambil satu repo open-source kecil atau project lamamu, dalam ≤ 30 menit tuliskan entry point + alur utama + modul inti.
- **3 latihan refactor aman**: extract function, rename, dan hapus duplikasi — masing-masing dengan **karakterisasi test** lebih dulu.
- **1 latihan menulis karakterisasi test**: kunci perilaku kode "jelek" sebelum mengubahnya.
- **2 latihan code review**: review PR orang lain (atau PR lamamu sendiri) dengan komentar spesifik & beralasan.
- **1 latihan dokumentasi**: tulis README yang bisa diikuti orang lain + minimal **1 ADR**.
- **1 latihan estimasi**: pecah satu fitur menjadi tugas, sebut asumsi & risiko, estimasi kasar.
- **1 latihan ownership**: identifikasi 3 item utang teknis di projectmu, urutkan prioritas, jelaskan alasannya.

## Project

Project portofolio fase ini: **`refactoring-case-study`** (repo terpisah, dibuat saat fase ini dimulai).

Ambil satu project lamamu yang **berantakan** (mis. `cli-data-tool` atau `react-dashboard`) dan refactor secara bertahap **dengan bukti**, bukan klaim:

1. **Dokumentasi masalah awal**: daftar konkret apa yang salah (duplikasi, fungsi raksasa, penamaan kabur, coupling).
2. **Karakterisasi test** yang mengunci perilaku saat ini — supaya refactor aman.
3. **Langkah refactor kecil** yang masing-masing punya commit sendiri dan alasan jelas.
4. **Sebelum/sesudah**: ukuran terukur (jumlah fungsi, panjang file, duplikasi, kompleksitas sederhana) — bukan "terasa lebih rapi".
5. **ADR**: minimal satu catatan keputusan teknis (mis. kenapa memilih pola X, kenapa tidak rewrite).
6. **README studi kasus**: apa yang dipelajari, apa yang akan dilakukan berbeda lain kali.

Alternatif: ambil **satu codebase open-source kecil** sebagai bahan latihan *membaca*, lalu tulis laporan navigasinya.

Kriteria yang dinilai mentor (review seperti senior dev):

- Ada bukti bahwa **perilaku tidak berubah** (test lulus sebelum & sesudah).
- Perubahan terukur, bukan subjektif; kamu bisa menunjuk angka.
- Keputusan refactor punya alasan tertulis (termasuk yang **sengaja tidak** dilakukan).
- Commit history menunjukkan **langkah kecil**, bukan satu commit raksasa "refactor semuanya".
- Kamu bisa menjelaskan trade-off dari minimal satu keputusan desain.

## Checklist Kelulusan

Karena fase ini **berkelanjutan**, checklist ini dinilai berulang (bukan sekali selesai). Capstone (phase-10) menjadi ujian akhirnya.

**Pemahaman (dinilai lewat penjelasan lisan/tulisan ke mentor)**

- [ ] Bisa menjelaskan **alur sebuah codebase asing dalam ≤ 30 menit membaca** (entry point → alur utama).
- [ ] Bisa menjelaskan beda **refactor vs rewrite** dan kapan memilih masing-masing.
- [ ] Bisa menjelaskan apa itu **karakterisasi test** dan kenapa ditulis lebih dulu.
- [ ] Bisa menjelaskan **SOLID** dengan contoh praktis **dan** kapan tidak menerapkannya.
- [ ] Bisa menjelaskan minimal **3 design pattern umum** dan masalah yang dipecahkannya.
- [ ] Bisa menjelaskan cara memberi **code review** yang spesifik & beralasan.
- [ ] Bisa menjelaskan **trade-off** dari minimal satu keputusan desain di kode sendiri.
- [ ] Bisa menjelaskan **utang teknis** yang kamu miliki dan rencana mengelolanya.

**Praktik**

- [ ] Menyelesaikan **1 latihan membaca codebase**, **3 refactor aman**, **1 karakterisasi test**, **2 code review**, **1 dokumentasi**, **1 estimasi**, **1 ownership**.
- [ ] Menjawab bagian "Jelaskan dengan Kata Sendiri" di **kesembilan** note (boleh bertahap seiring waktu).
- [ ] Melakukan refactor tanpa mengubah perilaku, **dibuktikan dengan test**.

**Project & Git**

- [ ] `refactoring-case-study` menunjukkan **perubahan terukur** (angka, bukan perasaan).
- [ ] Ada minimal **1 ADR** / catatan keputusan teknis yang jelas.
- [ ] Ada dokumentasi teknis yang membuat orang lain bisa menjalankan project.
- [ ] Riwayat Git rapi: branch `phase-09/nama-singkat`, Conventional Commits, langkah refactor kecil, dan PR yang kamu **self-review**.
- [ ] Bisa menyebutkan **trade-off** dari minimal satu keputusan desain di kode sendiri.

**Refleksi**

- [ ] Menulis ringkasan: bagaimana caramu membaca & mengubah kode berubah, dan apa yang masih ingin diperdalam.

## Referensi

- **Refactoring (Martin Fowler)** — <https://refactoring.com/> (katalog refactor & prinsip langkah kecil; situs resminya).
- **Clean Code (Robert C. Martin)** — buku; gunakan sebagai inspirasi prinsip, bukan aturan kaku.
- **A Philosophy of Software Design (John Ousterhout)** — buku; sangat berguna untuk berpikir soal kompleksitas & interface.
- **The Twelve-Factor App** — <https://12factor.net/> (prinsip aplikasi yang mudah dioperasikan).
- **Martin Fowler — Architecture Decision Records** — <https://martinfowler.com/bliki/ArchitectureDecisionRecord.html> (apa itu ADR dan cara menulisnya).
- **Google Engineering Practices — Code Review** — <https://google.github.io/eng-practices/review/> (panduan review yang praktis & manusiawi).
- **Conventional Commits** — <https://www.conventionalcommits.org/en/v1.0.0/> (format commit yang dipakai repo ini).
- **Git Documentation — `git blame`, `git log`** — <https://git-scm.com/docs> (membaca sejarah kode untuk memahami *kenapa*).

> Catatan: jangan membaca referensi dari awal sampai akhir. Pakai sebagai *kamus* — baca bagian yang relevan saat mentok, lalu kembali ke project nyata.
