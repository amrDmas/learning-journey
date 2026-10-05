# Phase 06 — Full-Stack: API + React + Auth + Integrasi

> Durasi: 3 minggu (4+ jam/hari) | Prasyarat: [phase-03-react](../phase-03-react/README.md), [phase-04-node-backend](../phase-04-node-backend/README.md), [phase-05-database](../phase-05-database/README.md) selesai | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan alur data end-to-end**: dari klik user di React → request HTTP → backend → database → response → UI update — dan menunjuk **file mana** di setiap langkah.
2. **Menyatukan frontend + API + database** menjadi satu aplikasi utuh yang jalan end-to-end, bukan tiga project terpisah yang kebetulan ada.
3. **Mengelola data server di React** dengan **TanStack Query (React Query)**: query, mutation, cache, invalidasi, loading/error/empty state — tanpa menulis `useEffect` fetch manual yang rapuh.
4. **Menerapkan autentikasi & otorisasi**: login/signup, menyimpan token/session dengan aman, proteksi route di frontend, dan proteksi endpoint di backend.
5. **Mengelola konfigurasi environment** per layer (frontend & backend, dev vs prod) dan menjelaskan **kenapa** nilai seperti base URL dan secret harus berbeda.
6. **Menjelaskan & menangani CORS**: kenapa browser memblokir request lintas origin, preflight, dan cara konfigurasinya yang benar.
7. **Menangani error lintas layer**: dari error API → kode status → pesan UI yang ramah, tanpa membocorkan detail internal.
8. **Mengintegrasikan API pihak ketiga** dari backend (mis. kirim email, payment sandbox, atau public API) dengan timeout, retry sederhana, dan penanganan kegagalan.
9. **Menerima & memverifikasi webhook dasar**: kenapa perlu verifikasi signature, idempotency, dan cara merespons dengan benar.
10. **Mengimplementasikan file upload**, **pagination**, dan **search** di UI dengan benar.
11. **Menyelesaikan** project `fullstack-app` yang **lulus review** mentor dan bisa dijalankan orang lain dari README.

## Mental Model — Kenapa, bukan cuma Apa

Aplikasi full-stack adalah **dua program yang berbeda** (browser & server) yang berkomunikasi lewat **kontrak** (HTTP + bentuk data). Hampir semua bug "aneh" di fase ini muncul karena satu hal:

> **Bug antar-layer**: satu sisi mengira data berbentuk X, sisi lain mengirim Y.

Tiga model kerja yang harus kamu pegang:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Kontrak (request ↔ response)** | "Apa bentuk data yang disepakati kedua sisi? Siapa yang memvalidasi?" | endpoint, status code, tipe data, validasi dua sisi, versioning |
| **State server vs state UI** | "Data ini milik siapa? Siapa yang boleh mengubahnya?" | cache, invalidasi, refetch, single source of truth, React Query |
| **Trust boundary (client vs server)** | "Apa yang boleh dipercaya dari client?" | auth, otorisasi, validasi backend, secrets, CORS |

### Kenapa "state server" bukan sekadar state biasa

Di fase 03 kamu belajar bahwa state React adalah **snapshot lokal** yang kamu miliki. Tapi data dari server **tidak kamu miliki** — ia bisa berubah kapan saja (user lain menambah data, data kedaluwarsa). Kalau kamu perlakukan data server seperti `useState` biasa:

- Kamu akan menulis `useEffect` fetch di mana-mana → loading/error state berantakan.
- Setiap komponen fetch sendiri → request berlebihan, data tidak konsisten.
- Setelah mutation, kamu lupa memperbarui data lain → UI menampilkan data basi (*stale*).

**TanStack Query** menyelesaikan ini dengan satu ide: **data server punya cache dengan identitas (query key)**, dan setelah mutation kamu **menginvalidasi** cache agar diambil ulang. Kamu tidak lagi "menyimpan" data server; kamu **berlangganan** padanya. Ini pergeseran mental model terbesar fase ini.

### Kenapa validasi harus di backend walau sudah di frontend

Frontend bisa dimatikan, dimodifikasi, atau dilewati sepenuhnya (curl, Postman). Validasi frontend adalah **UX** (pesan cepat), validasi backend adalah **keamanan** (satu-satunya yang bisa dipercaya). Prinsipnya: **jangan pernah mempercayai input dari client**. Server memvalidasi ulang *semua* hal kritis.

> Aturan emas fase ini: **"Setiap kali ada bug yang sulit dijelaskan, gambar dulu alur request-nya layer per layer."** 90% masalahnya ada di persepsi yang berbeda antara client dan server.

## Materi & Urutan Belajar

Materi ada di folder [`notes/`](./notes/). Kerjakan berurutan; note awal membangun fondasi, note akhir integrasi.

| # | File | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | `notes/01-arsitektur-fullstack.md` | Alur UI → API → DB → UI, kontrak endpoint, struktur repo (`client/` + `server/` vs monorepo), environment per layer | Gambaran besar yang menyatukan semua fase sebelumnya |
| 02 | `notes/02-http-client-react.md` | `fetch`/axios di React, loading/error/empty state, kenapa `useEffect` fetch manual bermasalah | Dasar sebelum masuk state server |
| 03 | `notes/03-tanstack-query.md` | Query key, cache, stale time, `useQuery`, `useMutation`, invalidasi, optimistic update (konsep) | "State management data server" — kebutuhan langsung JD |
| 04 | `notes/04-auth-end-to-end.md` | Login/signup, token vs session, penyimpanan token, proteksi route (frontend) & middleware (backend), refresh (konsep) | Authentication & Authorization end-to-end |
| 05 | `notes/05-environment-dan-cors.md` | `.env` per layer, variabel publik vs rahasia, CORS & preflight, konfigurasi dev/staging/prod | Konfigurasi yang benar & aman; sumber bug integrasi paling umum |
| 06 | `notes/06-error-handling-end-to-end.md` | Kode status, bentuk error konsisten, error API → pesan UI, tidak membocorkan detail internal | Reliability & UX; jangan bocorkan stack trace |
| 07 | `notes/07-integrasi-pihak-ketiga.md` | Memanggil API eksternal dari backend, timeout, retry + backoff, API key di server, sandbox | JD: "REST API & integrasi pihak ketiga" |
| 08 | `notes/08-webhook-dasar.md` | Webhook vs polling, verifikasi signature, idempotency, merespons cepat, retry dari pengirim | Event-driven processing & reliability |
| 09 | `notes/09-file-upload.md` | `multipart/form-data`, validasi tipe & ukuran, menyimpan file (disk/Storage), URL akses | Fitur nyata hampir semua aplikasi |
| 10 | `notes/10-pagination-dan-search-ui.md` | Offset vs cursor pagination, debounce search, sinkronisasi dengan URL query params, state loading | Query efisien + UX; langsung dari JD "query & performa" |
| 11 | `notes/11-deployment-fullstack.md` | Build produksi, deploy frontend & backend, environment produksi, migrasi & smoke test | Deployment (dasar; pendalaman di phase-08) |

> Catatan: file note di atas akan dirilis saat fase ini dimulai.

### Cara belajar tiap note (ulangi pola ini)

1. **Baca sekali cepat** untuk peta besar.
2. **Jalankan dua sisi sekaligus.** Buka terminal untuk `server/` dan terminal untuk `client/`; jangan hanya membaca.
3. **Perhatikan Network tab** setiap kali UI memanggil API — lihat request, status, payload, response.
4. **Jawab bagian "Jelaskan dengan Kata Sendiri"** di akhir tiap note.
5. **Commit** hasil latihan (mis. `feat(phase-06): integrasi tanstack query produk`), lalu minta review mentor.
6. **Refleksi**: 3 baris — apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanyakan.

> Tips: biasakan **membaca response mentah di Network tab** sebelum curiga ke kode React. Setengah bug full-stack sebenarnya bug backend atau CORS, bukan React.

## Latihan

Semua latihan ada di [`exercises/`](./exercises/). Aturan inti: **coba dulu**, jangan intip kunci; **commit tiap latihan selesai**.

Target minimal fase ini:

- **4 latihan integrasi dasar**: fetch list → tampilkan loading/error/empty; form submit → mutation → invalidasi cache.
- **2 latihan auth**: login + proteksi route frontend; endpoint backend yang menolak request tanpa token.
- **2 latihan error handling**: memetakan kode status API ke pesan UI; backend yang tidak membocorkan stack trace.
- **2 latihan integrasi eksternal**: satu panggilan API pihak ketiga dari backend + satu handler webhook yang memverifikasi signature.
- **2 latihan UX data**: file upload dengan validasi, dan search + pagination yang tersinkron dengan URL.
- **1 latihan diagnosa**: diberi bug CORS/preflight, temukan penyebab dan perbaiki dengan penjelasan.

## Project

Project portofolio fase ini: **`fullstack-app`** (repo terpisah, dibuat saat fase ini dimulai).

Kerangka aplikasi full-stack yang nanti diperluas di fase 07 dan 08. Fitur wajib:

1. **Auth end-to-end**: signup/login, session/token tersimpan dengan aman, proteksi route frontend **dan** endpoint backend.
2. **CRUD utama** lewat REST API, dengan validasi di backend dan error handling konsisten.
3. **State data di React** memakai **TanStack Query** — bukan `useEffect` fetch manual bertebaran.
4. **Minimal satu integrasi API pihak ketiga** dari backend (kirim email / payment sandbox / public API) dengan timeout & penanganan gagal.
5. **Satu webhook dasar** yang memverifikasi signature dan idempoten (boleh disimulasikan).
6. **File upload** dengan validasi tipe & ukuran.
7. **Pagination + search** di UI yang tersinkron dengan URL.
8. **UI menangani loading, error, dan empty state** di setiap layar data.
9. **Environment config** terpisah dev/prod; **tidak ada secret** di kode atau di bundle frontend.
10. **README setup** yang bisa diikuti orang lain dari nol (env, migrate/seed, jalankan client & server).

Kriteria yang dinilai mentor (review seperti senior dev):

- Bisa menjelaskan alur **satu aksi pengguna** dari klik sampai data tersimpan dan UI ter-update.
- Tidak ada data server yang dikelola seperti state lokal berlebihan; cache & invalidasi masuk akal.
- Error backend konsisten bentuknya dan pesan UI ramah; tidak ada stack trace bocor.
- CORS dikonfigurasi benar, bukan "asal `*`" tanpa alasan.
- Commit history rapi, branch `phase-06/nama-singkat`, ada PR yang kamu self-review.

Detail lengkap spesifikasi project akan diberikan mentor saat fase dimulai.

## Checklist Kelulusan

Fase ini dianggap **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-07 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan lisan/tulisan ke mentor)**

- [ ] Bisa menjelaskan **alur lengkap satu aksi pengguna** dari klik sampai data tersimpan.
- [ ] Bisa menjelaskan perbedaan **autentikasi vs otorisasi** dan implementasinya di kode sendiri.
- [ ] Bisa menjelaskan **kenapa validasi harus ada di backend** walau sudah ada di frontend.
- [ ] Bisa menjelaskan **kenapa CORS ada** dan bagaimana preflight bekerja.
- [ ] Bisa menjelaskan **kenapa data server berbeda dari state React** dan peran cache/invalidasi.
- [ ] Bisa menjelaskan cara mengelola **konfigurasi berbeda untuk dev dan prod**.
- [ ] Bisa menjelaskan **kenapa webhook harus diverifikasi signature-nya** dan apa itu idempotency.

**Praktik**

- [ ] Menyelesaikan **4 latihan integrasi**, **2 auth**, **2 error handling**, **2 integrasi eksternal**, dan **2 UX data**.
- [ ] Menyelesaikan **1 latihan diagnosa CORS** dengan penjelasan akar masalah.
- [ ] Menjawab bagian "Jelaskan dengan Kata Sendiri" di **kesebelas** note.
- [ ] Aplikasi menangani **loading, error, dan empty state** dengan benar di semua layar data.

**Project & Git**

- [ ] Project `fullstack-app` **jalan end-to-end** dan **lulus review** mentor.
- [ ] Ada README setup yang bisa diikuti orang lain dari nol.
- [ ] Riwayat Git rapi: branch `phase-06/nama-singkat`, Conventional Commits, dan **minimal satu Pull Request** yang kamu **self-review** sebelum merge.
- [ ] Tidak ada secret (API key, kredensial) yang ter-commit.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal tersulit soal "menyatukan dua program", dan 1 hal yang masih ingin diperdalam.

## Referensi

- **TanStack Query (React Query) Docs** — <https://tanstack.com/query/latest> (baca *Overview*, *Queries*, *Mutations*, *Query Invalidation*).
- **MDN — CORS** — <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS> (penjelasan preflight & header).
- **MDN — HTTP response status codes** — <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status> (memilih status code yang tepat).
- **OWASP — Authentication Cheat Sheet** — <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> (prinsip auth yang aman; baca secukupnya).
- **Stripe Docs — Webhooks** — <https://stripe.com/docs/webhooks> (contoh nyata verifikasi signature & idempotency; konsepnya berlaku umum).
- **Firebase Docs — Authentication** — <https://firebase.google.com/docs/auth> (alternatif auth terkelola; didalami di phase-07).
- **Vercel / Render / Railway Docs** — (dokumentasi masing-masing platform untuk deployment; pilih satu dan kuasai).

> Catatan: jangan membaca referensi dari awal sampai akhir. Pakai sebagai *kamus* — baca bagian yang relevan saat mentok di satu note, lalu kembali ke latihan.
