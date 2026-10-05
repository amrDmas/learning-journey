# Phase 10 — Capstone: Operational Management System

> Durasi: 4 minggu (4+ jam/hari) | Prasyarat: [phase-06-fullstack](../phase-06-fullstack/README.md), [phase-07-firebase](../phase-07-firebase/README.md), [phase-08-testing-deploy](../phase-08-testing-deploy/README.md), [phase-09-engineering](../phase-09-engineering/README.md) | Status: belum mulai

## Tujuan Pembelajaran

Ini **ujian akhir**, bukan fase belajar konsep baru. Di akhir fase ini kamu sudah membuktikan bahwa kamu:

1. **Merancang sistem nyata dari requirement** — menulis user story, memilih stack dengan alasan tertulis (ADR), dan menyusun arsitektur tingkat tinggi sebelum menulis kode.
2. **Membangun satu aplikasi end-to-end** yang mengintegrasikan **semua** yang dipelajari: React + TypeScript, Node/Firebase, database, auth, integrasi pihak ketiga, testing, deployment, CI/CD, dan monitoring.
3. **Menerapkan otorisasi berbasis role** di seluruh lapisan (UI, API/rules, dan data) — bukan hanya menyembunyikan tombol.
4. **Membangun alur kerja (workflow) dengan approval** yang punya state yang jelas dan **audit log** untuk setiap perubahan penting.
5. **Membuat dashboard & reporting** dari data nyata dengan query yang efisien (bukan menghitung semuanya di client).
6. **Mengotomasi pekerjaan berkala** dengan scheduled function/job (mis. rekap harian, pengingat).
7. **Menjalankan disiplin engineering**: test untuk bagian kritis, CI hijau, deploy otomatis, monitoring aktif, dokumentasi lengkap, dan riwayat Git yang bersih.
8. **Mempertahankan sistem ini jangka panjang** (ownership): backlog, prioritas, utang teknis, dan rencana 6 bulan ke depan — dan bisa mempertanggungjawabkan setiap keputusan teknis.

## Mental Model — Kenapa, bukan cuma Apa

Capstone bukan "project besar pertama". Ia adalah **latihan menjadi pemilik sistem**. Perbedaan mendasarnya:

> **Membangun fitur** berarti menjawab "bagaimana cara membuat ini jalan?".
> **Memiliki sistem** berarti menjawab "bagaimana ini tetap benar, aman, dan bisa diubah, 6 bulan dari sekarang?".

Model kerja yang mengikat seluruh capstone:

| Model | Pertanyaan yang dijawab | Muncul di modul |
| --- | --- | --- |
| **Requirement → desain** | "Kebutuhan ini diterjemahkan jadi modul & kontrak apa?" | perencanaan, arsitektur, ADR |
| **Trust boundary** | "Siapa boleh melakukan apa, dan di lapisan mana ditegakkan?" | auth, role, rules, API authorization |
| **State machine alur kerja** | "Status apa saja yang mungkin, dan transisi mana yang legal?" | workflow approval |
| **Data → keputusan** | "Angka di dashboard dihitung dari mana, dan berapa biayanya?" | reporting, query, index |
| **Operasi & observability** | "Kalau ini rusak jam 2 pagi, bagaimana aku tahu dan memperbaikinya?" | CI/CD, monitoring, rollback |
| **Ownership** | "Apa yang akan aku lakukan pada sistem ini bulan depan?" | backlog, utang teknis, roadmap |

### Kenapa arsitektur ditulis sebelum kode

Kalau kamu langsung ngoding, kamu akan menemukan keputusan arsitektur di tengah jalan — saat sudah terlalu mahal untuk diubah. Menulis arsitektur tingkat tinggi lebih dulu memaksa jawaban atas pertanyaan sulit: *di mana otorisasi ditegakkan? bagaimana bentuk audit log? apakah reporting dihitung realtime atau di-precompute?* Keputusan ini jauh lebih murah diubah di kertas daripada di kode.

### Kenapa "audit log" bukan sekadar fitur tambahan

Sistem operasional menyentuh data penting (pesanan, persetujuan, stok). Audit log berarti **setiap perubahan penting tercatat: siapa, kapan, apa yang berubah**. Ini bukan pemanis — ini yang membuat sistem bisa **dipercaya dan dipertanggungjawabkan**. Ia juga melatih pemikiran event-driven (mencatat aksi sebagai event) dan menyiapkanmu untuk sistem nyata di perusahaan.

> Aturan emas fase ini: **"Sebelum menulis sebuah fitur, tulis dulu: siapa yang boleh melakukannya, data apa yang berubah, dan bagaimana aku tahu kalau itu gagal?"** Kalau ketiganya belum jelas, jangan mulai ngoding.

## Materi & Urutan Belajar

Capstone tidak punya "note" seperti fase lain. Materi = **dokumen perencanaan yang kamu tulis sendiri**, ditambah rujukan dari fase-fase sebelumnya saat kamu mentok.

Struktur dokumen yang harus kamu buat di awal (di repo project):

| # | Dokumen | Isi |
| --- | --- | --- |
| 01 | `docs/01-requirement.md` | Latar belakang, aktor/pengguna, user story, ruang lingkup (dan yang **di luar** lingkup) |
| 02 | `docs/02-arsitektur.md` | Diagram arsitektur tingkat tinggi, pembagian modul, kontrak API, model data, strategi auth |
| 03 | `docs/03-adr/` | Architecture Decision Records: stack, auth, penyimpanan file, reporting, dsb. |
| 04 | `docs/04-milestone.md` | Milestone 4 minggu, deliverable tiap minggu, kriteria selesai |
| 05 | `docs/05-testing-dan-deploy.md` | Strategi test, pipeline CI/CD, environment, monitoring, rollback |
| 06 | `docs/06-ownership.md` | Backlog lanjutan, utang teknis, prioritas, rencana 6 bulan |

### Arsitektur Tingkat Tinggi (contoh kerangka, sesuaikan dengan kebutuhanmu)

```text
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (React + TypeScript)              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Auth UI │  │ Master    │  │ Workflow │  │  Dashboard  │  │
│  │ & Role   │  │ Data CRUD │  │ Approval │  │  & Report   │  │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │  TanStack Query (cache, invalidasi, loading/error)   │
└───────┼──────────────┼─────────────┼───────────────┼─────────┘
        │  HTTPS (REST) / Firebase SDK (Firestore, Auth, Storage)
        ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND / BaaS LAYER                      │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ REST API      │  │ Cloud Functions│  │ Security Rules │   │
│  │ (Node + TS)   │  │ • HTTP         │  │ Firestore      │   │
│  │ • authz       │  │ • Firestore    │  │ Storage        │   │
│  │ • validasi    │  │ • scheduled    │  │ (least priv.)  │   │
│  │ • integrasi   │  │ • callable     │  └────────────────┘   │
│  └───────┬───────┘  └───────┬────────┘                       │
└──────────┼──────────────────┼────────────────────────────────┘
           ▼                  ▼
┌──────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
│  Firestore (koleksi, subkoleksi, composite index)            │
│  + Storage (file/bukti)  + Audit Log (append-only)           │
└──────────────────────────────────────────────────────────────┘
           ▲
           │  Integrasi pihak ketiga (email / notifikasi / API publik)
           │  Monitoring: Sentry / Cloud Logging  ·  CI/CD: GitHub Actions
```

> Diagram ini **contoh kerangka**, bukan resep wajib. Kamu boleh memilih REST API murni (Node) **atau** Firebase langsung dari client, asalkan keputusan itu ditulis di ADR beserta trade-off-nya (biaya, keamanan, kecepatan pengembangan).

### Modul Wajib Capstone

| Modul | Isi minimal | Poin JD yang dibuktikan |
| --- | --- | --- |
| **Auth & Role** | Login/signup, session, role (mis. `admin`, `staff`, `viewer`), otorisasi di UI **dan** backend/rules | Firebase Auth, keamanan, otorisasi |
| **Master Data** | CRUD beberapa entitas inti (mis. produk/barang, pelanggan, kategori) dengan validasi & pencarian | REST API, struktur data, query |
| **Workflow Approval** | Alur berstatus (mis. `draft → diajukan → disetujui/ditolak`) dengan aturan transisi & pencatatan | event-driven, reliability, struktur data |
| **Dashboard & Reporting** | Ringkasan angka + filter periode; query efisien, index, hindari N+1 | query & performa, struktur data |
| **Integrasi API** | Minimal satu integrasi pihak ketiga **nyata** (email/notifikasi/pembayaran sandbox/public API) | REST API & integrasi pihak ketiga |
| **Automasi** | Scheduled function/job (rekap harian, pengingat, pembersihan) yang idempoten | Cloud Functions, automasi, event-driven |
| **Audit Log** | Catatan append-only: siapa, kapan, aksi, sebelum/sesudah | keamanan, reliability, ownership |
| **File/Attachment** | Upload bukti/attachment dengan rules & validasi | Firebase Storage, keamanan |
| **Dokumentasi** | README setup, arsitektur, dokumentasi API, ADR | dokumentasi teknis |
| **Deployment & Monitoring** | Live, CI/CD, logging/error tracking, rollback | deployment, CI/CD, monitoring |

### Milestone 4 Minggu (contoh — sesuaikan)

| Minggu | Fokus | Deliverable | Kriteria selesai |
| --- | --- | --- | --- |
| **1** | Perencanaan & fondasi | Requirement, arsitektur, ADR, skeleton project, auth + role, CI dasar | Bisa login, role terpasang, pipeline `lint → typecheck → test → build` hijau |
| **2** | Data & alur inti | Master data CRUD, workflow approval, audit log, test untuk bagian kritis | Alur `draft → diajukan → disetujui` jalan end-to-end, ada test |
| **3** | Insight & integrasi | Dashboard/reporting, integrasi pihak ketiga, scheduled job, file upload | Angka dashboard benar & efisien, integrasi nyata jalan, job terjadwal jalan |
| **4** | Rilis & ownership | Deploy produksi, monitoring, rollback teruji, dokumentasi lengkap, laporan ownership | Aplikasi **live** & bisa dipakai orang lain; error produksi terpantau; dokumentasi bisa diikuti |

> Milestone adalah **panduan**. Kalau minggu 1 molor, geser — yang penting tiap deliverable benar-benar selesai, bukan sekadar "hampir".

## Latihan

Tidak ada folder `exercises/` untuk fase ini. "Latihan"-nya adalah **menjalankan proyek nyata dengan disiplin**:

- Setiap fitur dikerjakan di **branch sendiri** → commit Conventional Commits → PR → self-review → merge.
- Setiap keputusan teknis nontrivial **ditulis sebagai ADR** (5–10 baris cukup).
- Setiap perubahan skema/model data punya **catatan migrasi** (cara data lama diperlakukan).
- Setiap bug yang ditemukan di produksi dicatat: gejala, penyebab, perbaikan, pencegahan.
- Setiap akhir minggu, tulis **retrospektif 5 baris**: selesai apa, meleset apa, pelajaran apa.

## Project

Project portofolio fase ini: **`ops-management-system`** (repo terpisah, dibuat saat fase ini dimulai).

Sistem manajemen operasional perusahaan yang **live** — memakai **React + TypeScript + Node.js + Firebase** (atau kombinasi yang kamu pertahankan dengan ADR). Wajib mencakup seluruh **Modul Wajib** di atas.

Kriteria yang dinilai mentor (review seperti senior dev, sekaligus seperti *tech lead*):

- Aplikasi **live dan bisa dipakai** orang lain — bukan hanya jalan di laptopmu.
- Bisa menjelaskan **setiap keputusan teknis utama** dan trade-off-nya, tanpa membaca catatan.
- Ada bukti **otorisasi ditegakkan di lapisan yang benar** (bukan hanya menyembunyikan tombol).
- Query dashboard **efisien** dan kamu bisa menyebutkan biaya (jumlah baca) dari aksi utama.
- Scheduled job **idempoten**; audit log **tidak bisa dihapus/diubah sembarangan**.
- Ada test untuk bagian kritis dan **pipeline CI hijau**.
- Deploy otomatis + monitoring/error tracking aktif; rollback pernah diuji.
- Dokumentasi lengkap: setup, arsitektur, API, ADR.
- Riwayat Git bersih: branch per fitur, Conventional Commits, PR dengan review.
- Ada **laporan ownership**: backlog lanjutan, utang teknis, dan rencana 6 bulan.

## Kriteria Selesai (Definition of Done Capstone)

Capstone dianggap **selesai** bila **semua** poin di bawah terpenuhi:

- [ ] Aplikasi **live dan bisa dipakai** oleh orang lain (bukan hanya jalan di laptop).
- [ ] Fitur inti lengkap: **auth, CRUD, peran/otorisasi, dashboard**.
- [ ] **Workflow approval** berstatus dengan aturan transisi yang jelas dan tercatat.
- [ ] **Audit log** mencatat setiap perubahan penting (siapa, kapan, apa).
- [ ] Minimal satu **integrasi pihak ketiga berjalan nyata** (bukan mock).
- [ ] **Scheduled job/automasi** berjalan dan idempoten.
- [ ] Ada **test untuk bagian kritis** dan **pipeline CI hijau** yang memblokir merge saat gagal.
- [ ] **Deploy otomatis** + **monitoring/logging/error tracking** aktif.
- [ ] **Rollback** pernah diuji dan langkahnya terdokumentasi.
- [ ] Dokumentasi lengkap: **setup, arsitektur, API, ADR**.
- [ ] Riwayat Git bersih: branch per fitur, Conventional Commits, PR dengan review.
- [ ] Bisa menjelaskan **setiap keputusan teknis utama** dan trade-off-nya.
- [ ] Ada **laporan ownership**: bagaimana sistem ini dirawat **6 bulan ke depan**.

## Checklist Kelulusan

Fase ini dianggap **lulus** (dan kurikulum inti tuntas) bila semua poin berikut terpenuhi:

**Perencanaan & Arsitektur**

- [ ] Dokumen **requirement** (aktor, user story, ruang lingkup) tersedia.
- [ ] Dokumen **arsitektur tingkat tinggi** (diagram + modul + kontrak API + model data) tersedia.
- [ ] Minimal **3 ADR** yang menjelaskan keputusan stack & desain utama.
- [ ] **Milestone** tertulis dengan deliverable & kriteria selesai per minggu.

**Implementasi & Kualitas**

- [ ] Seluruh **Modul Wajib** terimplementasi dan bisa didemokan.
- [ ] **Otorisasi** ditegakkan di backend/rules, bukan hanya UI.
- [ ] Query dashboard efisien; kamu bisa menyebutkan biaya baca aksi utama.
- [ ] Scheduled job idempoten; audit log append-only.
- [ ] Test bermakna untuk bagian kritis; CI hijau dan memblokir merge saat gagal.

**Operasi & Ownership**

- [ ] Aplikasi **live** dan bisa dipakai orang lain mengikuti README.
- [ ] Monitoring/logging/error tracking aktif; kamu pernah mendiagnosis satu error nyata dari sana.
- [ ] **Rollback** teruji dan terdokumentasi.
- [ ] Dokumentasi teknis lengkap (README, arsitektur, API, ADR).
- [ ] Riwayat Git rapi: branch per fitur, Conventional Commits, PR dengan self-review.
- [ ] Laporan **ownership** (backlog, utang teknis, rencana 6 bulan) tersedia.
- [ ] Bisa menjelaskan **setiap** keputusan teknis utama dan trade-off-nya.

**Refleksi Akhir Kurikulum**

- [ ] Menulis refleksi akhir: apa yang paling mengubah cara berpikirmu, di mana kamu masih lemah, dan apa rencana belajar berikutnya.

## Pemetaan Capstone ke Setiap Poin JD

Tabel ini adalah **bukti kesiapan kerja**: setiap poin JD punya artefak nyata di capstone.

| Poin JD | Dibuktikan di capstone lewat |
| --- | --- |
| **React** | UI seluruh modul (auth, master data, workflow, dashboard) dengan komponen terstruktur + TypeScript |
| **Node.js** | REST API (authz, validasi, integrasi) dan/atau Cloud Functions; logika server yang jelas |
| **TypeScript** | Seluruh codebase frontend & backend bertipe, `strict`, tanpa `any` sembarangan |
| **JavaScript** | Mental model async/event loop terpakai di semua alur data & function |
| **Firebase — Firestore** | Model data dokumen, composite index, batched write/transaction, realtime bila perlu |
| **Firebase — Authentication** | Login/signup, session, custom claims/role |
| **Firebase — Cloud Functions** | Trigger HTTP/Firestore/scheduled/callable untuk automasi & integrasi |
| **Firebase — Storage** | Upload/download attachment dengan rules & validasi |
| **Asynchronous programming & event-driven processing** | Scheduled job, trigger Firestore, webhook/queue sederhana, penanganan async konsisten |
| **REST API & integrasi pihak ketiga** | Desain endpoint + minimal satu integrasi eksternal nyata (email/notifikasi/pembayaran sandbox/public API) |
| **Struktur data, query, performa** | Model data & index, query dashboard efisien, hindari N+1, pagination |
| **Keamanan** | Validasi dua sisi, otorisasi backend/rules, secrets di env, least privilege, audit log |
| **Reliability** | Error handling konsisten, retry/timeout, idempotency, rollback teruji, monitoring |
| **Testing** | Unit/integration/e2e untuk bagian kritis; test menguji perilaku |
| **Deployment** | Aplikasi live; environment dev/staging/prod terpisah |
| **CI/CD** | Pipeline GitHub Actions `install → lint → typecheck → test → build → deploy` |
| **Monitoring** | Structured logging, error tracking (Sentry/Cloud Logging), metrik & alert dasar |
| **Git & GitHub termasuk code review** | Branch per fitur, Conventional Commits, PR dengan self-review, riwayat bersih |
| **Refactoring aman & maintainable** | Refactor bertahap didukung test (hasil phase-09 diterapkan) |
| **Membaca existing codebase besar** | Bekerja di codebase capstone sendiri yang membesar + studi kasus phase-09 |
| **Dokumentasi teknis** | README, dokumentasi arsitektur & API, ADR |
| **Automasi / internal tools** | Scheduled job, script seed/migrasi, tooling internal |
| **Technical ownership jangka panjang** | Laporan ownership: backlog, utang teknis, prioritas, rencana 6 bulan |

## Referensi

- **Semua referensi fase 01–09** — pakai kembali saat kamu mentok (jangan hafal, cari bagian yang relevan).
- **Firebase Docs** — <https://firebase.google.com/docs> (Auth, Firestore, Functions, Storage, Rules, Emulator).
- **TanStack Query Docs** — <https://tanstack.com/query/latest> (state data server di UI).
- **Playwright / Vitest Docs** — <https://playwright.dev/docs/intro>, <https://vitest.dev/> (test bagian kritis).
- **GitHub Actions Docs** — <https://docs.github.com/en/actions> (CI/CD).
- **Sentry Docs** — <https://docs.sentry.io/> (error tracking & performance).
- **Martin Fowler — Architecture Decision Records** — <https://martinfowler.com/bliki/ArchitectureDecisionRecord.html> (menulis ADR).
- **The Twelve-Factor App** — <https://12factor.net/> (prinsip aplikasi yang mudah dioperasikan).
- **Google Engineering Practices — Code Review** — <https://google.github.io/eng-practices/review/> (review yang sehat).

> Penutup: capstone bukan garis akhir, tapi **bukti pertama** bahwa kamu bisa memiliki sistem. Setelah ini, yang membedakanmu dari kandidat lain adalah kebiasaan: membaca kode, menulis test, mencatat keputusan, dan menjaga apa yang sudah kamu bangun.
