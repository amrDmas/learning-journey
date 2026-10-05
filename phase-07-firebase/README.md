# Phase 07 — Firebase Deep Dive

> Durasi: 2 minggu (4+ jam/hari) | Prasyarat: [phase-05-database](../phase-05-database/README.md), [phase-06-fullstack](../phase-06-fullstack/README.md) selesai | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan perbedaan client SDK dan Admin SDK**, kapan memakai masing-masing, dan kenapa Admin SDK **tidak boleh** ada di kode frontend.
2. **Menguasai Firestore lanjutan**: batched write, transaction, realtime listener, offline persistence, pagination, dan composite index — serta **kapan** memakai masing-masing.
3. **Mengimplementasikan Authentication** lengkap: email/password, provider pihak ketiga, session persistence, **custom claims**, dan role-based access.
4. **Menulis Security Rules yang benar** untuk Firestore dan Storage: rules per-operasi, validasi field, fungsi & variabel rules, dan **mengujinya** dengan emulator.
5. **Membuat Cloud Functions** dengan berbagai trigger: HTTP, Firestore, Auth, **scheduled (cron)**, dan callable — serta menjelaskan event-driven processing.
6. **Menjelaskan cold start, batas eksekusi, idempotency, dan secrets/env** pada Cloud Functions.
7. **Mengimplementasikan Storage**: upload/download file, metadata, rules akses, dan signed URL.
8. **Memakai Firebase Emulator Suite** untuk mengembangkan & menguji tanpa menyentuh data produksi.
9. **Memahami biaya & kuota** Firebase: apa yang dihitung (read/write/delete dokumen, egress, invocations), dan bagaimana mendesain agar tidak boros.
10. **Mendiagnosis satu error nyata lewat log Firebase** (Console atau log Functions) dan memperbaikinya.

## Mental Model — Kenapa, bukan cuma Apa

Firebase adalah **backend terkelola**: kamu tidak mengelola server, tapi kamu juga **tidak bisa menyembunyikan logika di client**. Ini pergeseran mental model paling penting:

> **Client SDK itu "terbuka" — semua yang ada di frontend bisa dibaca & dimodifikasi user. Keamanan yang sebenarnya ada di Security Rules dan di Cloud Functions, bukan di kode React.**

Model kerja inti fase ini:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Trust boundary Firebase** | "Siapa yang mengeksekusi kode ini — user atau server?" | client vs Admin SDK, Security Rules, Cloud Functions, custom claims |
| **Event-driven** | "Apa yang memicu kode ini jalan, dan boleh dijalankan dua kali?" | trigger Firestore/Auth/scheduled, idempotency, retry, at-least-once |
| **Konsistensi & offline** | "Bagaimana data tetap benar saat koneksi hilang atau dua user menulis bersamaan?" | transaction, batched write, realtime listener, offline persistence |
| **Biaya per operasi** | "Berapa dokumen yang kubaca/ditulis untuk aksi ini?" | read/write count, N+1, denormalisasi, caching, batas kuota |

### Kenapa "aturan" lebih penting daripada "kode"

Di aplikasi biasa, kamu melindungi data dengan menaruh pengecekan di backend. Di Firebase, **client berbicara langsung ke database**. Artinya:

- Kode `if (user.role === 'admin')` di React **tidak melindungi apa pun** — user bisa menghapusnya.
- Yang benar-benar melindungi data adalah **Security Rules** yang dievaluasi di server Firebase.
- Untuk operasi yang butuh logika rahasia (mis. menghitung harga, memanggil API dengan API key), tempatnya di **Cloud Function**, bukan di client.

Jadi urutan berpikirmu harus: *"Kalau user jahat, bisa tidak dia memanggil operasi ini langsung?"* Kalau bisa, maka rules/functions-lah yang harus menutupnya.

### Kenapa event-driven butuh idempotency

Cloud Function yang terpicu event bisa **dijalankan lebih dari sekali** (retry dari platform, event ganda). Kalau fungsimu "tambah saldo 100" tanpa pengecekan, retry bisa membuat saldo bertambah dua kali. Karena itu function harus dirancang **idempoten**: hasilnya sama walau dijalankan berulang. Ini konsep yang sama dengan webhook di phase-06.

> Aturan emas fase ini: **"Setiap kali menulis kode di client, tanya: kalau user menghapus baris ini, apakah data masih aman?"** Kalau tidak, pindahkan perlindungannya ke rules atau Functions.

## Materi & Urutan Belajar

Materi ada di folder [`notes/`](./notes/). Kerjakan berurutan; setup emulator dulu agar bisa berlatih tanpa biaya.

| # | File | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | `notes/01-firebase-setup-sdk.md` | Project Firebase, konfigurasi client vs Admin SDK, environment, emulator suite | Fondasi sebelum semua fitur Firebase |
| 02 | `notes/02-firestore-lanjutan.md` | Batched write, transaction, composite index, pagination `startAfter` | Konsistensi & performa data (JD: Firestore) |
| 03 | `notes/03-realtime-dan-offline.md` | `onSnapshot` realtime listener, unsubscribe, offline persistence, kapan memakai realtime vs query biasa | Fitur realtime & reliability saat koneksi hilang |
| 04 | `notes/04-authentication.md` | Email/password, provider (Google dll.), session persistence, `onAuthStateChanged` | JD: Firebase Authentication |
| 05 | `notes/05-custom-claims-dan-role.md` | Custom claims, role-based access, verifikasi di rules & functions | Otorisasi & keamanan (JD: keamanan) |
| 06 | `notes/06-security-rules.md` | Bahasa rules, per-operasi, validasi field, fungsi & variabel, menguji dengan emulator | Keamanan data — tidak ada di aplikasi tanpa ini |
| 07 | `notes/07-cloud-functions.md` | Trigger HTTP, Firestore, Auth, scheduled/cron, callable, cold start, secrets/env, idempotency | JD: Cloud Functions & event-driven processing |
| 08 | `notes/08-storage.md` | Upload/download, metadata, rules Storage, signed URL | JD: Firebase Storage |
| 09 | `notes/09-biaya-kuota-monitoring.md` | Model biaya (read/write/invocation/egress), kuota, log Functions, monitoring Console | Desain hemat biaya & observability |

> Catatan: file note di atas akan dirilis saat fase ini dimulai.

### Cara belajar tiap note (ulangi pola ini)

1. **Baca sekali cepat** untuk peta besar.
2. **Jalankan Emulator Suite** (`firebase emulators:start`) setiap kali berlatih — jangan langsung ke produksi.
3. **Uji rules dengan emulator**, bukan dengan tebakan: coba akses yang seharusnya ditolak dan pastikan benar-benar ditolak.
4. **Jawab bagian "Jelaskan dengan Kata Sendiri"** di akhir tiap note.
5. **Commit** hasil latihan (mis. `feat(phase-07): rules firestore produk`), lalu minta review mentor.
6. **Refleksi**: 3 baris — apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanyakan.

> Tips: aktifkan emulator sejak awal. Mengembangkan Firebase langsung di produksi (walau project "latihan") adalah kebiasaan buruk yang mahal dipelajari nanti.

## Latihan

Semua latihan ada di [`exercises/`](./exercises/). Aturan inti: **coba dulu**, jangan intip kunci; **commit tiap latihan selesai**.

Target minimal fase ini:

- **3 latihan Firestore lanjutan**: satu transaction (mis. transfer antar saldo), satu batched write, satu pagination dengan `startAfter`.
- **2 latihan auth**: email/password + satu provider; satu alur custom claim/role.
- **3 latihan Security Rules**: tolak akses tidak sah, validasi field, akses berbasis role — semua **diuji dengan emulator**.
- **3 latihan Cloud Functions**: HTTP, Firestore trigger, dan scheduled; minimal satu dirancang idempoten.
- **1 latihan Storage**: upload + rules + URL akses.
- **1 latihan diagnosa**: diberi error dari log Firebase, temukan penyebabnya dan perbaiki.

## Project

Project portofolio fase ini: **`firebase-ops-app`** (repo terpisah, dibuat saat fase ini dimulai).

Aplikasi operasional berbasis Firebase yang membuktikan kamu paham **ekosistemnya sebagai satu kesatuan**:

1. **Auth**: login/signup, minimal satu provider, session persistence, dan role (custom claims).
2. **Firestore realtime**: minimal satu layar yang memakai `onSnapshot` (mis. daftar pesanan live).
3. **Cloud Function** yang bereaksi pada event — mis. saat dokumen pesanan dibuat, kirim notifikasi atau lakukan agregasi. Dirancang **idempoten**.
4. **Minimal satu scheduled function** (cron) untuk tugas berkala (mis. rekap harian).
5. **Storage**: upload file (mis. bukti/attachment) dengan rules yang benar.
6. **Security Rules** untuk Firestore & Storage yang benar-benar menolak akses tidak sah (dibuktikan lewat uji emulator).
7. **Emulator Suite** terpasang untuk pengembangan lokal.
8. **README** yang menjelaskan setup, cara menjalankan emulator, cara deploy functions & rules.

Kriteria yang dinilai mentor (review seperti senior dev):

- Bisa menjelaskan **kenapa** setiap rules ditulis begitu, dan akses mana yang ditolak.
- Function tidak akan merusak data kalau dijalankan dua kali (idempotency dibuktikan atau dijelaskan).
- Tidak ada logika rahasia atau kredensial di client.
- Tidak ada pemborosan read/write yang tidak disadari; kamu bisa menyebutkan berapa operasi untuk aksi utama.
- Commit history rapi, branch `phase-07/nama-singkat`, ada PR yang kamu self-review.

Detail lengkap spesifikasi project akan diberikan mentor saat fase dimulai.

## Checklist Kelulusan

Fase ini dianggap **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-08 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan lisan/tulisan ke mentor)**

- [ ] Bisa menjelaskan perbedaan **client SDK dan Admin SDK** serta kapan memakai masing-masing.
- [ ] Bisa menjelaskan **kenapa Security Rules penting** dan menulis rules yang menolak akses tidak sah.
- [ ] Bisa menjelaskan **cara kerja Cloud Function saat terpicu event** dan isu **idempotency**.
- [ ] Bisa menjelaskan **kapan memakai realtime listener vs query biasa**.
- [ ] Bisa menjelaskan **transaction vs batched write** dan kapan memilih masing-masing.
- [ ] Bisa menjelaskan **cold start** dan batas eksekusi Functions.
- [ ] Bisa menjelaskan **apa saja yang dihitung sebagai biaya** Firebase dan cara menghematnya.
- [ ] Bisa menjelaskan perbedaan **custom claims** dan penyimpanan role di database.

**Praktik**

- [ ] Menyelesaikan **3 latihan Firestore lanjutan**, **2 auth**, **3 Security Rules**, **3 Cloud Functions**, dan **1 Storage**.
- [ ] Menyelesaikan **1 latihan diagnosa** lewat log Firebase.
- [ ] Menjawab bagian "Jelaskan dengan Kata Sendiri" di **kesembilan** note.
- [ ] Semua uji rules dijalankan lewat **emulator**, bukan tebakan.

**Project & Git**

- [ ] Project `firebase-ops-app` **jalan**, functions berjalan/ter-deploy, dan **lulus review** mentor.
- [ ] Ada README yang bisa diikuti orang lain (termasuk menjalankan emulator).
- [ ] Riwayat Git rapi: branch `phase-07/nama-singkat`, Conventional Commits, dan **minimal satu Pull Request** yang kamu **self-review** sebelum merge.
- [ ] Tidak ada secret atau kredensial Admin SDK yang ter-commit.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal yang paling mengubah cara berpikirmu tentang "backend terkelola", dan 1 hal yang masih ingin diperdalam.

## Referensi

- **Firebase Docs** — <https://firebase.google.com/docs> (peta utama; mulai dari Firestore, Auth, Functions, Storage).
- **Firebase — Cloud Firestore** — <https://firebase.google.com/docs/firestore> (query, index, transaction, batched write, realtime).
- **Firebase — Authentication** — <https://firebase.google.com/docs/auth> (provider, session, custom claims).
- **Firebase — Cloud Functions** — <https://firebase.google.com/docs/functions> (trigger, scheduled, callable, secrets).
- **Firebase — Storage** — <https://firebase.google.com/docs/storage> (upload/download, rules, signed URL).
- **Firebase — Security Rules** — <https://firebase.google.com/docs/rules> (bahasa rules Firestore & Storage).
- **Firebase — Emulator Suite** — <https://firebase.google.com/docs/emulator-suite> (pengembangan lokal tanpa biaya).
- **Firebase Pricing** — <https://firebase.google.com/pricing> (model biaya & kuota; baca bagian Firestore, Functions, Storage).

> Catatan: jangan membaca referensi dari awal sampai akhir. Pakai sebagai *kamus* — baca bagian yang relevan saat mentok di satu note, lalu kembali ke latihan.
