# ROADMAP — Learning Journey: Full Stack Developer

> Dokumen ini adalah **peta perjalanan** dari nol (mental model dasar) sampai job-ready
> Full Stack Developer. Target: **~4 bulan** dengan komitmen **4+ jam/hari**.
> Fokus bukan hafalan sintaks, tapi **mental model** — "kenapa kode ini jalan".

**Repo ini** = wadah progres belajar + latihan Git/PR.
**Repo terpisah** = portofolio project (dibuat saat fasenya tiba).

---

## Cara Membaca Dokumen Ini

- **Fase** = unit belajar besar, punya folder sendiri (`phase-XX-nama/`).
- **Project** = deliverable portofolio. Beberapa fase tidak punya repo portofolio terpisah: fase 00 mengerjakan repo ini, dan fase 08 menambahkan CI/CD ke repo sebelumnya. Fase 09 membuat repo baru `refactoring-case-study` (bahan mentahnya diambil dari project lama).
- **Checklist Kelulusan** = syarat objektif untuk lanjut ke fase berikutnya. Jangan lanjut kalau belum centang semua.
- Setiap fase punya file `phase-XX-nama/README.md` sendiri (materi detail, latihan, referensi). Dokumen ini hanya **peta besarnya**.

---

## Tabel Ringkasan 11 Fase

| Fase | Judul | Durasi | Prasyarat | Project / Deliverable |
|------|-------|--------|-----------|-----------------------|
| 00 | Setup, Mindset & Git Dasar | 1 minggu | — | Latihan Git di repo ini |
| 01 | JavaScript & TypeScript Fundamentals | 3–4 minggu | 00 | `cli-data-tool` |
| 02 | Web & Browser Fundamentals | 2 minggu | 01 | `interactive-web-no-framework` |
| 03 | React: Mental Model Rendering & State | 4 minggu | 02 | `react-dashboard` |
| 04 | Node.js & Backend Fundamentals | 3 minggu | 01 | `rest-api-node` |
| 05 | Database: SQL & Firestore | 3 minggu | 04 | `data-layer-lab` |
| 06 | Full-Stack: API + React + Auth + Integrasi | 3 minggu | 03, 04, 05 | `fullstack-app` |
| 07 | Firebase Deep Dive | 2 minggu | 05, 06 | `firebase-ops-app` |
| 08 | Testing, Deployment, CI/CD & Monitoring | 2 minggu | 06, 07 | CI/CD ditambahkan ke repo sebelumnya |
| 09 | Software Engineering & Codebase Mastery | berkelanjutan | 03, 04 | `refactoring-case-study` |
| 10 | Capstone: Operational Management System | 4 minggu | 06, 07, 08, 09 | `ops-management-system` |

> **Catatan realistis:** jumlah durasi di atas kalau dijalankan **berurutan murni** ≈ 27–28 minggu.
> Target 4 bulan (≈ 16 minggu inti) tercapai karena: (a) 4+ jam/hari membuat fase awal lebih cepat,
> (b) **fase 09 berjalan paralel** sejak minggu ~14, (c) **capstone (10) dimulai lebih awal** dan
> beririsan dengan fase 08–09. Peta di bawah sudah memperhitungkan tumpang-tindih ini.

---

## Timeline 4 Bulan (4+ jam/hari)

Asumsi: 4–6 jam/hari, 6–7 hari/minggu (~28–40 jam/minggu). Kolom **Paralel** = aktivitas
yang berjalan bersamaan tanpa mengganggu fokus utama.

| Minggu | Fase Utama | Paralel / Catatan |
|--------|-----------|-------------------|
| 1 | Phase 00 — Setup, Mindset & Git | Bangun kebiasaan harian + catatan belajar |
| 2–4 | Phase 01 — JS & TS Fundamentals | Tulis ulang tiap konsep dari nol (call stack, closure, event loop) |
| 5–6 | Phase 02 — Web & Browser | DOM, event, HTTP dasar, devtools |
| 7–10 | Phase 03 — React | Selesaikan `react-dashboard`; mulai biasakan baca kode orang lain |
| 11–13 | Phase 04 — Node.js & Backend | `rest-api-node`; async di server, error handling |
| 14 | — | **Mulai Phase 09 (paralel):** baca codebase + latihan refactor kecil (setelah Phase 04 selesai) |
| 14–16 | Phase 05 — Database | SQL dasar + Firestore; query, index, keamanan data |
| 17–19 | Phase 06 — Full-Stack | Gabung React + API + Auth + integrasi pihak ketiga |
| 19–20 | Phase 07 — Firebase Deep Dive | Auth, Firestore lanjutan, Cloud Functions, Storage |
| 21–22 | Phase 08 — Testing, Deploy, CI/CD, Monitoring | Tambahkan ke repo sebelumnya |
| 21–24 | Phase 10 — Capstone (mulai) | `ops-management-system` berjalan beririsan dengan 08–09 |
| 25+ | Phase 10 — Capstone (lanjut) + Phase 09 | Polish, dokumentasi, deploy, technical ownership |

> Timeline ini **panduan, bukan jadwal kaku**. Kalau satu fase molor 1 minggu, geser sisanya —
> yang penting tidak melompati fase tanpa mencentang checklist kelulusan.
> Total realistis: **≈22–26 minggu**. Inti fase 00–08 ≈23 minggu berjalan berurutan;
> fase 09 berjalan paralel, dan capstone beririsan dengan fase 08–09 sehingga menambah
> 3–4 minggu di ujung.

### Ritme Mingguan yang Disarankan

| Hari | Fokus |
|------|-------|
| Senin–Kamis | Materi baru + latihan kode |
| Jumat | Review + refactor + tulis catatan (jelaskan pakai kata sendiri) |
| Sabtu | Kerjakan project fase / PR |
| Minggu | Self-review PR, update checklist, rencanakan minggu depan (atau istirahat) |

---

## Prinsip Urutan — Kenapa Urutannya Begitu

1. **Mental model sebelum tools.** JS/TS dulu (fase 01) sebelum framework. Kalau langsung React
   tanpa paham `this`, closure, reference vs value, dan event loop, kamu akan "menghafal resep"
   dan buntu saat error. Framework adalah *lapisan di atas* bahasa.
2. **Browser setelah bahasa.** Fase 02 menjelaskan *lingkungan tempat kode JS hidup* (DOM, event,
   network). React (fase 03) pada dasarnya adalah cara mengelola DOM secara deklaratif — mustahil
   dipahami kalau DOM-nya sendiri belum jelas.
3. **Frontend dan backend dipisah.** Fase 03 (React) dan fase 04 (Node) sengaja berurutan agar
   kamu mengerti **dua sisi** komunikasi (client ↔ server) sebelum menyatukannya di fase 06.
4. **Backend sebelum database.** Fase 04 mengajarkan request/response, lalu fase 05 menambah
   *lapisan data* di belakangnya. Menyimpan data sebelum paham alur request = bingung arah.
5. **Database sebelum full-stack.** Fase 06 menggabungkan React + API + Auth + DB. Ini fase
   integrasi — semua fondasi harus sudah ada.
6. **Firebase setelah konsep database.** Firestore (fase 05/07) adalah database NoSQL. Kalau
   konsep query, index, dan keamanan data sudah dipahami dari SQL, mempelajari Firestore jadi
   "syntax baru", bukan konsep baru.
7. **Testing/deploy/monitoring di akhir sebelum capstone.** Fase 08 mengajarkan cara *membuktikan*
   dan *mengirim* kode ke produksi. Ini prasyarat capstone agar hasilnya benar-benar live.
8. **Engineering & codebase mastery berjalan paralel.** Fase 09 tidak punya "akhir" — ia adalah
   kebiasaan: membaca kode besar, refactor aman, dokumentasi, dan ownership. Dimulai saat kamu
   sudah punya cukup kode sendiri untuk direfactor.
9. **Capstone terakhir & beririsan.** Fase 10 adalah ujian akhir: membangun sistem nyata jangka
   panjang, mengintegrasikan **semua** yang sudah dipelajari, dan mempertahankannya (ownership).

---

## Pemetaan Kebutuhan JD → Fase yang Menutupinya

| Kebutuhan JD | Fase Penutup | Catatan |
|--------------|--------------|---------|
| React | 03, 06, 10 | Rendering, state, komposisi komponen, integrasi API |
| Node.js | 04, 06, 07, 10 | Runtime server, async, error handling, Cloud Functions |
| TypeScript | 01, 03, 04, 06 | Types, generics, narrowing, diterapkan di semua project lanjutan |
| JavaScript | 01, 02, 03 | Fondasi mental model: scope, closure, prototype, event loop |
| Firebase — Firestore | 05, 07 | Model dokumen, query, index, rules, realtime listener |
| Firebase — Authentication | 06, 07 | Login/signup, session, proteksi route & API |
| Firebase — Cloud Functions | 07, 10 | Event-driven backend, trigger, scheduled jobs |
| Firebase — Storage | 07 | Upload/download file, URL aman, rules storage |
| Asynchronous programming & event-driven processing | 01, 04, 07 | Promise, async/await, call stack vs microtask/macrotask, trigger event |
| REST API & integrasi pihak ketiga | 04, 06 | Desain endpoint, status code, konsumsi API eksternal, webhook |
| Struktur data, query, performa | 01, 05, 08, 09 | Array/object/map/set, indexing, query efisien, profiling |
| Keamanan (security) | 05, 06, 07, 08 | Validasi input, auth, Firestore/Storage rules, secrets |
| Reliability | 04, 08, 10 | Error handling, retry, logging, observability, graceful failure |
| Testing | 08, 09 | Unit test, integration test, strategi test yang bernilai |
| Deployment | 08, 10 | Build, environment, hosting, deploy otomatis |
| CI/CD | 08, 10 | GitHub Actions, pipeline test → build → deploy |
| Monitoring | 08, 10 | Logging, error tracking, metrik dasar |
| Git & GitHub termasuk code review | 00, 09 (+ semua fase) | Branch, commit, PR, self-review, review kode orang lain |
| Refactoring aman & maintainable | 09, 10 | Refactor bertahap, test sebagai jaring pengaman, clean code |
| Membaca existing codebase besar | 09, 10 | Navigasi, entry point, dependency graph, membedakan noise vs inti |
| Dokumentasi teknis | 00, 09, 10 | README, komentar yang berguna, ADR, dokumentasi API |
| Automasi / internal tools | 01, 04, 09 | CLI tool, script otomasi, tooling internal |
| Technical ownership jangka panjang | 09, 10 | Menjaga sistem, prioritas, trade-off, keputusan teknis terdokumentasi |

---

# Detail Setiap Fase

Setiap blok berisi: **Tujuan**, **Topik Utama**, **Project / Deliverable**, **Checklist Kelulusan**.
Detail materi (penjelasan, latihan, referensi) ada di `phase-XX-nama/README.md` masing-masing.

---

## Phase 00 — Setup, Mindset & Git Dasar

> Durasi: 1 minggu | Prasyarat: — | Status: belum mulai

**Tujuan**
Menyiapkan lingkungan kerja, membangun kebiasaan belajar harian, dan menguasai alur Git/GitHub
dasar yang akan dipakai di **setiap fase** setelah ini.

**Topik Utama**
- Instalasi & konfigurasi: Node.js (versi LTS), npm, editor (VS Code), terminal.
- Mindset: belajar berbasis **kenapa**, menulis ulang konsep dengan kata sendiri, jurnal belajar.
- Git dasar: `init`, `clone`, `add`, `commit`, `status`, `log`, `diff`, `branch`, `checkout`/`switch`.
- Remote & GitHub: `push`, `pull`, `fetch`, Pull Request, self-review, merge.
- **Conventional Commits** (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
- Markdown & struktur README sebagai dokumentasi teknis pertama.

**Project / Deliverable**
Tidak ada repo portofolio terpisah. Deliverable = repo `learning-journey` terisi rapi
(README, struktur folder fase) + minimal 1 Pull Request latihan yang di-merge ke `main`.

**Checklist Kelulusan**
- [ ] Node.js & npm terpasang, versi terverifikasi di terminal.
- [ ] Bisa menjelaskan (kata sendiri) beda `working directory`, `staging`, dan `commit`.
- [ ] Sudah membuat minimal 1 branch, 1 commit Conventional Commit, 1 PR, dan merge ke `main`.
- [ ] Bisa membaca `git log` dan `git diff` untuk memahami riwayat perubahan.
- [ ] Bisa menulis Markdown rapi (heading, tabel, code fence).
- [ ] Punya catatan/jurnal belajar harian.

---

## Phase 01 — JavaScript & TypeScript Fundamentals

> Durasi: 3–4 minggu | Prasyarat: 00 | Status: belum mulai

**Tujuan**
Membangun **mental model eksekusi** JavaScript: bagaimana kode dijalankan (call stack),
bagaimana data disimpan (memory, reference vs value), bagaimana scope & closure bekerja,
dan bagaimana asynchronous benar-benar berjalan (event loop). Lalu menambah TypeScript
untuk keamanan tipe.

**Topik Utama**
- Eksekusi: call stack, execution context, hoisting, `this`.
- Memory: primitive vs object, reference vs value, copy vs mutate, garbage collection (konsep).
- Scope & closure: function scope, block scope, lexical scope, closure praktis.
- Function & paradigma: pure function, higher-order function, `map`/`filter`/`reduce`.
- Prototype & class: prototype chain, `class`, inheritance, komposisi vs inheritance.
- Asynchronous: callback, Promise, `async`/`await`, call stack vs microtask vs macrotask, event loop.
- Error handling: `try`/`catch`, custom error, membedakan error yang bisa dipulihkan.
- Struktur data dasar: Array, Object, `Map`, `Set`, kompleksitas dasar (Big-O ringkas).
- TypeScript: tipe primitif, `interface` vs `type`, union, narrowing, generics, `strict` mode.
- Automasi dasar: script Node.js sederhana, baca/tulis file, argumen CLI.

**Project / Deliverable**
**`cli-data-tool`** — CLI (Node.js + TypeScript) untuk memproses data (mis. membaca file
JSON/CSV, filter/agregasi, output ke file). Menuntut async, struktur data, error handling,
dan tipe yang rapi.

**Checklist Kelulusan**
- [ ] Bisa menggambar alur call stack saat sebuah fungsi memanggil fungsi lain.
- [ ] Bisa menjelaskan reference vs value dan bug nyata yang muncul karenanya.
- [ ] Bisa menjelaskan closure dengan contoh sendiri (bukan menyalin).
- [ ] Bisa menjelaskan urutan eksekusi `Promise`, `setTimeout`, dan kode sinkron.
- [ ] Bisa menulis TS dengan `strict: true` tanpa `any` sembarangan.
- [ ] `cli-data-tool` berjalan, punya README, dan di-merge lewat PR.
- [ ] Bisa menjelaskan tiap baris kode di project sendiri tanpa membuka dokumentasi.

---

## Phase 02 — Web & Browser Fundamentals

> Durasi: 2 minggu | Prasyarat: 01 | Status: belum mulai

**Tujuan**
Memahami **lingkungan tempat kode JS berjalan di browser**: DOM, event, rendering, dan
komunikasi jaringan. Ini fondasi sebelum memakai framework apa pun.

**Topik Utama**
- Cara browser bekerja: parsing HTML → DOM → render, CSSOM, layout & paint (gambaran besar).
- DOM API: seleksi, manipulasi, create/append/remove, atribut & style.
- Event: event bubbling & capturing, `addEventListener`, event delegation, `preventDefault`.
- Form & validasi dasar, aksesibilitas dasar (label, keyboard, aria ringkas).
- HTTP & network: request/response, method, status code, header, CORS (konsep).
- `fetch` & async di browser, JSON, loading/error state.
- DevTools: Elements, Console, Network, Sources (breakpoint), Application/Storage.
- Storage browser: `localStorage`, `sessionStorage`, cookie (konsep), kapan memakainya.

**Project / Deliverable**
**`interactive-web-no-framework`** — aplikasi web interaktif **tanpa framework**
(HTML + CSS + JS murni): mis. todo/tracker yang memakai DOM, event, `fetch` ke API publik,
dan menyimpan state di storage. Tujuannya merasakan "sakitnya" mengelola DOM manual —
sebagai pemicu kenapa React (fase 03) ada.

**Checklist Kelulusan**
- [ ] Bisa menjelaskan perbedaan DOM dan HTML sumber.
- [ ] Bisa menjelaskan event bubbling dan memakai event delegation.
- [ ] Bisa membaca tab Network: lihat request, status, response.
- [ ] Bisa menangani loading, sukses, dan error dari `fetch`.
- [ ] Bisa pakai breakpoint DevTools untuk mencari nilai variabel saat runtime.
- [ ] `interactive-web-no-framework` jalan, responsif dasar, ada README, di-merge lewat PR.
- [ ] Bisa menyebutkan minimal 2 kesulitan mengelola DOM manual (alasan React ada).

---

## Phase 03 — React: Mental Model Rendering & State

> Durasi: 4 minggu | Prasyarat: 02 | Status: belum mulai

**Tujuan**
Memahami React bukan sebagai kumpulan API, tetapi sebagai **cara berpikir**: UI adalah
fungsi dari state, render itu deklaratif, dan React yang mengurus DOM. Fokus pada
*kenapa* komponen re-render dan bagaimana state benar-benar bekerja.

**Topik Utama**
- Mental model: UI = `f(state)`, declarative vs imperative, virtual DOM (konsep, bukan mitos).
- Komponen & props: komposisi, `children`, satu arah aliran data.
- State: `useState`, batching, state sebagai snapshot, kenapa update bersifat immutable.
- Render & re-render: kapan React render, reconciliation, `key` dan kenapa penting.
- Efek samping: `useEffect`, dependency array, cleanup, kapan *tidak* butuh effect.
- Data turunan vs state: menghindari state berlebih, "single source of truth".
- Form terkontrol, list rendering, conditional rendering.
- State management: lifting state up, Context, kapan butuh library eksternal.
- Memoization: `memo`, `useMemo`, `useCallback` — kapan berguna, kapan malah noise.
- Data fetching di React, loading/error state, struktur folder yang scalable.
- TypeScript di React: props, generic component, event typing.

**Project / Deliverable**
**`react-dashboard`** — dashboard (mis. data penjualan/tugas) dengan komponen tersusun,
state terkelola, data fetching dari API, filtering/pencarian, dan struktur folder rapi.
Dibangun dengan TypeScript.

**Checklist Kelulusan**
- [ ] Bisa menjelaskan "UI = fungsi dari state" dengan contoh sendiri.
- [ ] Bisa menjelaskan kenapa mutasi state langsung tidak memicu re-render.
- [ ] Bisa menjelaskan kapan `useEffect` dijalankan dan kenapa dependency array penting.
- [ ] Bisa menjelaskan kenapa `key` di list harus stabil.
- [ ] Bisa memperbaiki re-render berlebih dan menjelaskan alasannya.
- [ ] `react-dashboard` punya minimal 5 komponen terpisah, ada README, di-merge lewat PR.
- [ ] Bisa menjelaskan struktur folder project sendiri dan alasannya.

---

## Phase 04 — Node.js & Backend Fundamentals

> Durasi: 3 minggu | Prasyarat: 01 | Status: belum mulai

**Tujuan**
Memahami Node.js sebagai runtime server: model async/event-driven, cara membuat REST API,
menangani error, dan prinsip desain API yang bersih.

**Topik Utama**
- Node.js runtime: event loop di server, non-blocking I/O, modul (`CommonJS` vs ESM).
- HTTP server dasar, routing manual, lalu framework (mis. Express) — pahami sebelum pakai.
- REST API: resource, method, status code, struktur response, versioning (konsep).
- Middleware: alur request → middleware → handler → response, error middleware.
- Validasi input & error handling terpusat, jangan bocorkan detail internal.
- Environment & konfigurasi: `.env`, secrets, perbedaan dev/staging/prod.
- Logging dasar & struktur log yang berguna untuk debugging.
- Konsumsi API pihak ketiga dari server, timeout, retry sederhana.
- Automasi/internal tool: script Node untuk tugas berulang (mis. seed data, migrasi kecil).
- Dasar keamanan API: autentikasi vs otorisasi (konsep), rate limiting (konsep).

**Project / Deliverable**
**`rest-api-node`** — REST API (Node.js + TypeScript) dengan beberapa endpoint CRUD,
validasi input, error handling rapi, konfigurasi via env, dan dokumentasi endpoint
(mis. di README atau file OpenAPI sederhana).

**Checklist Kelulusan**
- [ ] Bisa menjelaskan kenapa operasi I/O di Node tidak memblokir proses lain.
- [ ] Bisa menjelaskan peran middleware dan urutannya.
- [ ] Bisa memilih status code yang tepat untuk sukses dan tipe error umum.
- [ ] Bisa menangani error tanpa mematikan server dan tanpa membocorkan stack trace ke client.
- [ ] Semua secrets lewat env, tidak ada kredensial di kode.
- [ ] `rest-api-node` punya dokumentasi endpoint, di-merge lewat PR.
- [ ] Bisa menjelaskan alur satu request dari masuk sampai response pada kode sendiri.

---

## Phase 05 — Database: SQL & Firestore

> Durasi: 3 minggu | Prasyarat: 04 | Status: belum mulai

**Tujuan**
Memahami cara menyimpan, mengambil, dan mengamankan data. Fokus pada **query dan
performa**, serta perbedaan model relasional (SQL) vs dokumen (Firestore).

**Topik Utama**
- Model data: tabel/baris vs koleksi/dokumen, relasi vs embedding.
- SQL dasar: `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `LIMIT`.
- Query lanjutan & performa: index, kenapa query lambat, `EXPLAIN` (konsep).
- Normalisasi vs denormalisasi, kapan memilih masing-masing.
- Firestore: koleksi & dokumen, subkoleksi, query, `where`/`orderBy`, batasan composite index.
- Realtime listener (konsep + contoh), batch write, transaction (konsep).
- Keamanan data: Firestore Security Rules dasar, prinsip least privilege.
- Integritas data: validasi di aplikasi vs di database, migrasi skema sederhana.
- Memilih database: kapan SQL, kapan Firestore.

**Project / Deliverable**
**`data-layer-lab`** — lab perbandingan: buat skema data yang sama (mis. katalog produk +
pesanan) di SQL **dan** di Firestore, tulis query umum di keduanya, ukur/bandingkan
performa dan kompleksitasnya. Sertakan Security Rules dasar untuk sisi Firestore.

**Checklist Kelulusan**
- [ ] Bisa menulis query SQL dengan `JOIN` dan `GROUP BY` tanpa menyalin contoh.
- [ ] Bisa menjelaskan kenapa index mempercepat query dan kapan index tidak terpakai.
- [ ] Bisa menjelaskan kapan data sebaiknya di-embed vs direferensikan di Firestore.
- [ ] Bisa menjelaskan kenapa security rules penting dan menulis rules dasar yang benar.
- [ ] `data-layer-lab` punya skema + query di kedua database, ada README, di-merge lewat PR.
- [ ] Bisa memilih SQL atau Firestore untuk sebuah kasus dan membela alasannya.

---

## Phase 06 — Full-Stack: API + React + Auth + Integrasi

> Durasi: 3 minggu | Prasyarat: 03, 04, 05 | Status: belum mulai

**Tujuan**
Menyatukan semua fondasi menjadi satu aplikasi utuh: frontend React ↔ API ↔ database,
dengan autentikasi dan integrasi pihak ketiga. Ini fase **integrasi**, tempat banyak bug
"antar lapisan" muncul dan diselesaikan.

**Topik Utama**
- Arsitektur full-stack: alur data dari UI → API → DB → UI, contract antara frontend & backend.
- State data di frontend: loading/error/empty state, caching dasar, refetch.
- Autentikasi & otorisasi: login/signup, token/session, proteksi route (frontend) & endpoint (backend).
- Integrasi pihak ketiga: konsumsi API eksternal (mis. pembayaran, email, peta) dari backend.
- CORS, environment per-layer, konfigurasi dev vs prod.
- Handling error lintas layer: error API → pesan UI yang ramah pengguna.
- Keamanan: validasi di kedua sisi, jangan percaya input client, proteksi secrets.
- Struktur repo full-stack (monorepo sederhana atau dua folder `client/` + `server/`).
- Dokumentasi: README setup, cara menjalankan, dokumentasi endpoint.

**Project / Deliverable**
**`fullstack-app`** — aplikasi full-stack dengan auth, CRUD, minimal satu integrasi API
pihak ketiga, dan UI React yang menangani loading/error. Menjadi kerangka yang nanti
diperluas di fase 07/08.

**Checklist Kelulusan**
- [ ] Bisa menjelaskan alur lengkap satu aksi pengguna dari klik sampai data tersimpan.
- [ ] Bisa menjelaskan perbedaan autentikasi dan otorisasi serta implementasinya.
- [ ] Bisa menjelaskan kenapa validasi harus ada di backend walau sudah ada di frontend.
- [ ] Aplikasi menangani loading, error, dan empty state dengan benar.
- [ ] Bisa menjelaskan cara mengelola konfigurasi berbeda untuk dev dan prod.
- [ ] `fullstack-app` jalan end-to-end, ada README setup, di-merge lewat PR.

---

## Phase 07 — Firebase Deep Dive

> Durasi: 2 minggu | Prasyarat: 05, 06 | Status: belum mulai

**Tujuan**
Menguasai ekosistem Firebase secara mendalam sebagai backend terkelola: Authentication,
Firestore lanjutan, Cloud Functions (event-driven), dan Storage.

**Topik Utama**
- Firebase project & SDK: konfigurasi client vs admin SDK, environment.
- Authentication: provider (email, Google), session persistence, custom claims (konsep).
- Firestore lanjutan: realtime listener, batched write, transaction, composite index, pagination.
- Security Rules: rules per-operasi, validasi field, fungsi & variabel rules, menguji rules.
- Cloud Functions: trigger (HTTP, Firestore, Auth, scheduled), event-driven processing,
  idempotency, batas eksekusi & cold start (konsep).
- Storage: upload/download file, metadata, aturan akses Storage, URL aman.
- Integrasi Functions ↔ Firestore ↔ Auth dalam satu alur (mis. buat profil saat signup).
- Monitoring dasar di Firebase Console: usage, error, log Functions.

**Project / Deliverable**
**`firebase-ops-app`** — aplikasi operasional berbasis Firebase: auth, data Firestore realtime,
minimal satu Cloud Function yang bereaksi pada event (mis. kirim notifikasi/agregasi saat data
berubah), upload file ke Storage, dan security rules yang benar.

**Checklist Kelulusan**
- [ ] Bisa menjelaskan perbedaan client SDK dan admin SDK serta kapan memakai masing-masing.
- [ ] Bisa menulis security rules yang menolak akses tidak sah (dan menjelaskan alasannya).
- [ ] Bisa menjelaskan cara kerja Cloud Function saat terpicu event dan isu idempotency.
- [ ] Bisa menjelaskan kapan memakai realtime listener vs query biasa.
- [ ] `firebase-ops-app` jalan, functions ter-deploy/berjalan, ada README, di-merge lewat PR.
- [ ] Bisa mendiagnosis satu error lewat log Firebase.

---

## Phase 08 — Testing, Deployment, CI/CD & Monitoring

> Durasi: 2 minggu | Prasyarat: 06, 07 | Status: belum mulai

**Tujuan**
Membuat kode bisa **dipercaya** (test) dan **dikirim** (deploy otomatis) serta **dipantau**
(monitoring) — keterampilan yang membedakan "bisa bikin" dan "bisa diandalkan".

**Topik Utama**
- Jenis test: unit, integration, end-to-end — kapan masing-masing layak ditulis.
- Unit test: struktur `describe`/`it`, assertion, mock & stub, test yang tidak rapuh.
- Testing frontend (komponen) dan backend (endpoint) dasar.
- Build & environment: build produksi, variabel env, perbedaan artefak dev vs prod.
- Deployment: hosting frontend, deploy backend/functions, alur rilis.
- CI/CD dengan GitHub Actions: pipeline `install → lint → test → build → deploy`.
- Manajemen secrets di CI, proteksi branch, gate test sebelum merge.
- Monitoring & observability: structured logging, error tracking, metrik dasar, alert sederhana.
- Reliability: retry, timeout, graceful degradation, rencana rollback.

**Project / Deliverable**
CI/CD ditambahkan ke **repo sebelumnya** (`fullstack-app` dan/atau `firebase-ops-app`):
workflow GitHub Actions yang menjalankan test + build + deploy otomatis, plus logging/error
tracking dasar yang terpasang.

**Checklist Kelulusan**
- [ ] Bisa menjelaskan piramida test dan memilih jenis test untuk sebuah fungsi.
- [ ] Ada unit test bermakna (bukan hanya test yang selalu hijau) di repo.
- [ ] Pipeline CI berjalan otomatis di setiap PR dan memblokir merge saat gagal.
- [ ] Deploy berjalan otomatis dari `main` (atau manual terverifikasi) tanpa langkah rahasia di kode.
- [ ] Error/log produksi bisa dilihat dan dipahami.
- [ ] Ada README singkat: cara test, cara deploy, cara rollback.
- [ ] Perubahan di-merge lewat PR dengan review.

---

## Phase 09 — Software Engineering & Codebase Mastery

> Durasi: berkelanjutan | Prasyarat: 03, 04 | Status: belum mulai

**Tujuan**
Naik dari "bisa menulis kode" ke "bisa menjaga kode": membaca codebase besar, refactor
dengan aman, menulis dokumentasi, dan mengambil keputusan teknis (ownership). Fase ini
**tidak punya akhir** — dimulai sekitar minggu 14 (setelah prasyarat fase 03 dan 04 selesai) dan berlanjut sampai capstone.

**Topik Utama**
- Membaca codebase besar: menemukan entry point, menelusuri alur, memetakan dependency,
  membedakan kode inti vs noise, membaca lewat test dan riwayat Git.
- Refactoring aman: langkah kecil, jaga perilaku tetap sama, test sebagai jaring pengaman,
  pola refactor umum (extract function, rename, hapus duplikasi, pecah modul besar).
- Prinsip desain: separation of concerns, coupling & cohesion, DRY vs duplikasi yang wajar,
  YAGNI, KISS, SOLID (secukupnya, bukan dogma).
- Clean code: penamaan, ukuran fungsi, komentar yang berguna vs komentar noise.
- Code review: memberi dan menerima review, apa yang layak dikomentari, review yang sopan & tajam.
- Dokumentasi teknis: README, dokumentasi API, komentar desain, ADR (Architecture Decision Record).
- Git lanjutan: rebase vs merge (konsep), menyelesaikan konflik, history yang bersih.
- Automasi & internal tools: script untuk mengurangi pekerjaan berulang.
- Technical ownership: memprioritaskan, mengelola utang teknis, menimbang trade-off,
  dan mempertanggungjawabkan keputusan jangka panjang.

**Project / Deliverable**
**`refactoring-case-study`** — ambil salah satu project lamamu (mis. `cli-data-tool` atau
`react-dashboard`) yang berantakan, lalu refactor bertahap **dengan bukti**: sebelum/sesudah,
daftar masalah, langkah refactor, test yang menjaga perilaku, dan catatan keputusan (ADR).
Bisa juga mengambil codebase open-source kecil sebagai bahan latihan membaca.

**Checklist Kelulusan**
- [ ] Bisa menjelaskan alur sebuah codebase asing dalam ≤ 30 menit membaca (entry point → alur utama).
- [ ] Bisa melakukan refactor tanpa mengubah perilaku, dibuktikan dengan test.
- [ ] Bisa memberi review kode yang spesifik dan bisa menjelaskan alasannya.
- [ ] Bisa menulis dokumentasi teknis yang membuat orang lain bisa menjalankan project.
- [ ] Ada minimal 1 ADR / catatan keputusan teknis yang jelas.
- [ ] `refactoring-case-study` menunjukkan perubahan terukur (bukan hanya "terasa lebih rapi").
- [ ] Bisa menyebutkan trade-off dari minimal satu keputusan desain di kode sendiri.

---

## Phase 10 — Capstone: Operational Management System

> Durasi: 4 minggu | Prasyarat: 06, 07, 08, 09 | Status: belum mulai

**Tujuan**
Membangun **satu sistem nyata end-to-end** yang mengintegrasikan seluruh kemampuan:
frontend, backend, database/Firebase, auth, integrasi, testing, deployment, monitoring,
dokumentasi, dan ownership. Ini bukti utama kesiapan kerja.

**Topik Utama**
- Perencanaan: requirement, user story, sketsa alur, pemilihan stack & alasan (ADR).
- Arsitektur: pembagian modul, kontrak API, model data, strategi auth & otorisasi.
- Implementasi bertahap dengan Git flow: branch per fitur → commit → PR → review → merge.
- Kualitas: test untuk bagian kritis, error handling, validasi, keamanan (rules/authorization).
- Performa: query efisien, indexing, caching dasar, menghindari N+1 (konsep).
- Deployment & CI/CD: otomatis, environment terpisah, rilis terverifikasi.
- Monitoring: logging, error tracking, metrik, alert sederhana.
- Dokumentasi: README, panduan setup, dokumentasi API, catatan keputusan teknis.
- Ownership: backlog, prioritas, utang teknis, dan rencana pengembangan lanjutan.

**Project / Deliverable**
**`ops-management-system`** — sistem manajemen operasional (mis. manajemen order, inventori,
atau task/workflow) yang **live**: auth, CRUD, peran pengguna, dashboard, minimal satu
integrasi pihak ketiga, realtime/notifikasi, test, CI/CD, dan monitoring. Disertai dokumentasi
lengkap dan riwayat PR yang menunjukkan proses kerja yang rapi.

**Checklist Kelulusan**
- [ ] Aplikasi **live dan bisa dipakai** oleh orang lain (bukan hanya jalan di laptop).
- [ ] Fitur inti lengkap: auth, CRUD, peran/otorisasi, dashboard.
- [ ] Minimal satu integrasi pihak ketiga berjalan nyata (bukan mock).
- [ ] Ada test untuk bagian kritis dan pipeline CI hijau.
- [ ] Deploy otomatis + monitoring/logging/error tracking aktif.
- [ ] Dokumentasi lengkap: setup, arsitektur, API, keputusan teknis.
- [ ] Riwayat Git bersih: branch per fitur, Conventional Commits, PR dengan review.
- [ ] Bisa menjelaskan **setiap** keputusan teknis utama dan trade-off-nya.
- [ ] Bisa menjelaskan bagaimana sistem ini akan dirawat 6 bulan ke depan (ownership).

---

## Definition of Done — Kapan Sebuah Fase Dianggap Selesai

Sebuah fase **hanya** dianggap selesai bila:

1. **Semua checklist kelulusan** di fase tersebut tercentang.
2. **Project fase** selesai, punya README, dan sudah **di-merge ke `main` lewat PR**.
3. Kamu bisa **menjelaskan ulang konsep inti fase** dengan kata sendiri, tanpa membaca catatan.
4. Tidak ada bagian kode di project sendiri yang kamu "tidak tahu kenapa jalan".
5. Progres sudah dicatat (di README fase atau jurnal belajar).

> Kalau ada poin yang belum, **jangan lanjut**. Menumpuk "belum paham" adalah penyebab
> utama belajar programming terasa mandek.

---

## Aturan Git untuk Semua Fase

**Branch per fase:** `phase-NN/nama-singkat` (contoh: `phase-01/js-fundamentals`).
Untuk capstone, branch per fitur: `feat/nama-fitur`.

**Alur wajib:**

```bash
# 1. Buat branch dari main yang terbaru
git switch main
git pull
git switch -c phase-01/js-fundamentals

# 2. Kerjakan, lalu commit dengan Conventional Commits
git add .
git commit -m "feat(cli): tambah parser argumen"

# 3. Push dan buat Pull Request
git push -u origin phase-01/js-fundamentals
```

**Jenis commit (Conventional Commits):**

| Prefix | Untuk apa |
|--------|-----------|
| `feat` | Fitur / kemampuan baru |
| `fix` | Perbaikan bug |
| `docs` | Perubahan dokumentasi |
| `refactor` | Mengubah struktur kode tanpa mengubah perilaku |
| `test` | Menambah / memperbaiki test |
| `chore` | Tugas pemeliharaan (konfigurasi, tooling) |

**Siklus setiap perubahan:**
`branch → commit → push → Pull Request → self-review → merge ke main`

**Self-review sebelum merge (tanyakan ke diri sendiri):**
- Apakah kode ini bisa dijelaskan baris per baris?
- Apakah ada duplikasi yang seharusnya diekstrak?
- Apakah error sudah ditangani, bukan disembunyikan?
- Apakah nama variabel/fungsi jelas tanpa perlu komentar?
- Apakah ada file rahasia (`.env`, kredensial) yang ikut ter-commit? (harus tidak)

---

## Cara Memakai AI Mentor (Claude)

Repo ini dirancang untuk belajar **interaktif**, bukan menonton:

1. **Mentor menjelaskan di chat** — minta analogi dan "kenapa", bukan sekadar sintaks.
2. **Kamu menulis kodenya sendiri** — jangan minta mentor menuliskan solusi penuh sebelum mencoba.
3. **Mentor mereview seperti senior dev** — minta review kritis atas kode yang sudah kamu tulis.
4. **Ulangi:** tulis ulang konsep dari nol → jelaskan dengan kata sendiri → pakai di project.

> Aturan emas: kalau kamu belum bisa menjelaskan sebuah konsep dengan kata sendiri,
> kamu belum memahaminya. Belajar = bisa mengajarkan kembali.
