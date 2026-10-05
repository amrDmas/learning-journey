# Phase 08 — Testing, Deployment, CI/CD & Monitoring

> Durasi: 2 minggu (4+ jam/hari) | Prasyarat: [phase-06-fullstack](../phase-06-fullstack/README.md), [phase-07-firebase](../phase-07-firebase/README.md) selesai | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Memilih jenis test yang tepat** (unit, integration, e2e) untuk sebuah perubahan — dan menjelaskan **kenapa** tidak semua hal perlu e2e.
2. **Menulis unit test bermakna** dengan **Vitest** (atau Jest): `describe`/`it`, assertion, dan test yang **tidak rapuh** (tidak gagal karena hal yang tidak relevan).
3. **Menguji komponen React** dengan **Testing Library**: query berdasarkan perilaku user, bukan detail implementasi.
4. **Memakai mocking & stub** dengan benar: memalsukan jaringan, waktu, dan dependensi eksternal tanpa membuat test palsu yang selalu hijau.
5. **Mengukur coverage** dan memahaminya sebagai **alat**, bukan target: 100% coverage tidak berarti bebas bug.
6. **Menulis e2e dasar** dengan **Playwright** (atau Cypress): satu alur kritikal end-to-end.
7. **Menerapkan TDD singkat** pada satu fungsi kecil: red → green → refactor, dan menjelaskan kapan TDD berguna dan kapan tidak.
8. **Membangun pipeline CI dengan GitHub Actions**: `install → lint → typecheck → test → build`, yang **memblokir merge** saat gagal.
9. **Mengelola environment dev/staging/prod** dan menjelaskan kenapa artefak & konfigurasi harus berbeda.
10. **Deploy ke hosting** (Vercel / Firebase Hosting / Render) dengan alur yang jelas dan **tidak ada langkah rahasia di kode**.
11. **Memasang monitoring & logging** (Sentry / Cloud Logging): structured logging, error tracking, metrik dasar, dan alert sederhana.
12. **Menjalankan rollback** dan menangani kejadian pasca-rilis dengan tenang.

## Mental Model — Kenapa, bukan cuma Apa

Test bukan "kewajiban" — test adalah **jaring pengaman untuk perubahan**. Nilainya baru terasa ketika kamu mengubah kode dan ingin tahu *apakah ada yang rusak* tanpa mengklik seluruh aplikasi manual.

> **Pertanyaan yang benar bukan "sudah berapa persen coverage?", tapi "kalau aku ubah ini, test mana yang akan menangkap kalau aku salah?"**

Model kerja inti fase ini:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Piramida test** | "Seberapa mahal test ini, dan seberapa banyak yang harus kutulis?" | unit vs integration vs e2e, biaya & kecepatan |
| **Perilaku vs implementasi** | "Test ini menguji *apa yang dilakukan* atau *bagaimana caranya*?" | test rapuh, refactor aman, query Testing Library |
| **Isolasi & determinisme** | "Test ini selalu memberi hasil sama, atau tergantung jaringan/waktu?" | mock, stub, fake timer, flaky test |
| **Pipeline sebagai gerbang** | "Apa yang harus benar sebelum kode boleh masuk main?" | CI, lint, typecheck, test, build, branch protection |
| **Observability** | "Kalau ada masalah di produksi, bagaimana aku tahu dan menemukan penyebabnya?" | logging, error tracking, metrik, alert, rollback |

### Kenapa test yang rapuh lebih buruk daripada tidak ada test

Test yang rapuh (mudah gagal karena hal tidak relevan) membuat orang **berhenti percaya** pada test, lalu mulai mengabaikannya. Akibatnya lebih buruk daripada tidak punya test sama sekali. Karena itu:

- Uji **perilaku yang terlihat user**, bukan struktur internal komponen.
- Jangan assert pada hal acak (waktu, urutan tak terjamin, id auto-increment) tanpa mengontrolnya.
- Satu test menguji **satu hal**; nama test menjelaskan *perilaku yang diharapkan*, bukan nama fungsi.

### Kenapa CI harus memblokir merge

CI yang hanya "memberi tahu" tapi tidak memblokir akan diabaikan saat buru-buru. Gerbang yang berguna adalah gerbang yang **benar-benar menahan**. Kalau test gagal, PR tidak boleh bisa di-merge. Ini juga melatih kebiasaan kerja tim yang sesungguhnya.

> Aturan emas fase ini: **"Test yang bagus gagal ketika kode salah, dan lulus ketika kode benar — tanpa peduli bagaimana kodenya ditulis."** Kalau test gagal hanya karena kamu refactor (perilaku tidak berubah), test itu menguji implementasi, bukan perilaku.

## Materi & Urutan Belajar

Materi ada di folder [`notes/`](./notes/). Kerjakan berurutan; testing dulu, baru pipeline & deployment.

| # | File | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | `notes/01-jenis-dan-strategi-test.md` | Piramida test, unit/integration/e2e, kapan menulis yang mana, biaya test | Strategi testing yang bernilai, bukan sekadar "punya test" |
| 02 | `notes/02-unit-test-vitest.md` | Setup Vitest, `describe`/`it`, assertion, struktur test, nama test yang baik | Unit test bermakna di TS/JS |
| 03 | `notes/03-testing-react-testing-library.md` | Render komponen, query by role/text, `userEvent`, async, menunggu UI berubah | Menguji frontend dari sudut pandang user |
| 04 | `notes/04-mocking-dan-test-double.md` | Mock, stub, spy, fake timer, memalsukan network, `vi.mock` | Menguji kode yang bergantung I/O/waktu tanpa flaky |
| 05 | `notes/05-coverage-dan-tdd.md` | Coverage (line/branch), kenapa bukan target, siklus TDD red-green-refactor, kapan berguna | Cara kerja tim engineering yang disiplin |
| 06 | `notes/06-e2e-playwright.md` | Playwright dasar: page, locator, alur kritikal, test di browser nyata, CI headless | Membuktikan aplikasi benar-benar jalan end-to-end |
| 07 | `notes/07-lint-typecheck-build.md` | ESLint, Prettier, `tsc --noEmit`, build produksi, script npm yang rapi | Kualitas otomatis sebelum test |
| 08 | `notes/08-github-actions-ci.md` | Workflow YAML, job & step, cache dependency, matrix, secrets di CI, branch protection | JD: CI/CD |
| 09 | `notes/09-environment-dan-deployment.md` | Env dev/staging/prod, variabel build vs runtime, deploy frontend & backend, migrasi, smoke test | Deployment yang terverifikasi, bukan "asal naik" |
| 10 | `notes/10-monitoring-logging-rollback.md` | Structured logging, Sentry/Cloud Logging, metrik dasar, alert, rollback & post-release | JD: monitoring & reliability |

> Catatan: file note di atas akan dirilis saat fase ini dimulai.

### Cara belajar tiap note (ulangi pola ini)

1. **Baca sekali cepat** untuk peta besar.
2. **Tulis test untuk kode yang sudah kamu punya** dari fase sebelumnya — jangan menulis kode baru hanya untuk dites.
3. **Sengaja buat test gagal** (ubah kode, lihat test menangkap) untuk membuktikan test benar-benar bekerja.
4. **Jawab bagian "Jelaskan dengan Kata Sendiri"** di akhir tiap note.
5. **Commit** hasil latihan (mis. `test(phase-08): unit test kalkulasi total`), lalu minta review mentor.
6. **Refleksi**: 3 baris — apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanyakan.

> Tips: kalau sebuah test sulit ditulis, itu **sinyal desain**: mungkin fungsinya terlalu besar atau terlalu banyak tanggung jawab. Dengarkan sinyal itu.

## Latihan

Semua latihan ada di [`exercises/`](./exercises/). Aturan inti: **coba dulu**, jangan intip kunci; **commit tiap latihan selesai**.

Target minimal fase ini:

- **5 latihan unit test**: fungsi murni, fungsi dengan dependency, error path, edge case, dan satu test yang sengaja dibuat rapuh lalu **diperbaiki**.
- **3 latihan Testing Library**: render + interaksi user, menunggu perubahan async, dan form.
- **2 latihan mocking**: memalsukan network dan memakai fake timer.
- **1 latihan TDD**: satu fungsi kecil dikerjakan red → green → refactor, catat langkahnya.
- **2 latihan e2e**: satu alur login, satu alur CRUD kritikal.
- **1 latihan CI**: workflow GitHub Actions yang benar-benar memblokir merge saat test gagal.
- **1 latihan rollback**: deploy versi rusak (di staging), deteksi lewat monitoring, lalu rollback — dan tulis langkahnya.

## Project

Project fase ini **bukan repo baru**: tambahkan **CI/CD, test, dan monitoring** ke repo sebelumnya — **`fullstack-app`** dan/atau **`firebase-ops-app`**.

Deliverable wajib:

1. **Test bermakna** untuk bagian kritis (bukan hanya test yang selalu hijau):
   - unit test untuk logika inti (mis. kalkulasi, validasi, transformasi data),
   - minimal satu integration test untuk endpoint atau komponen yang berinteraksi,
   - minimal satu e2e untuk alur kritikal (mis. login → aksi utama).
2. **Pipeline CI** dengan GitHub Actions: `install → lint → typecheck → test → build`, dan **memblokir merge** saat gagal (branch protection).
3. **Deployment otomatis** dari `main` (atau manual terverifikasi) tanpa langkah rahasia di kode; secrets lewat CI secrets.
4. **Environment terpisah** (dev/staging/prod) dengan konfigurasi jelas.
5. **Monitoring & error tracking** dasar terpasang (Sentry dan/atau Cloud Logging) — kamu bisa melihat error produksi.
6. **README operasional singkat**: cara menjalankan test, cara deploy, cara rollback.

Kriteria yang dinilai mentor (review seperti senior dev):

- Test menguji **perilaku**, bukan implementasi; refactor kecil tidak memecahkan test.
- Ada test yang benar-benar menangkap bug (kamu pernah membuktikannya dengan sengaja merusak kode).
- Pipeline benar-benar memblokir merge; tidak ada `continue-on-error` yang menyembunyikan kegagalan.
- Tidak ada secret di kode maupun di log CI.
- Rollback bisa dijelaskan langkah demi langkah, bukan improvisasi.
- Commit history rapi, branch `phase-08/nama-singkat`, ada PR yang kamu self-review.

## Checklist Kelulusan

Fase ini dianggap **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-09 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan lisan/tulisan ke mentor)**

- [ ] Bisa menjelaskan **piramida test** dan memilih jenis test untuk sebuah fungsi.
- [ ] Bisa menjelaskan beda **test yang menguji perilaku vs implementasi**, dengan contoh.
- [ ] Bisa menjelaskan kenapa **coverage bukan target** dan apa gunanya.
- [ ] Bisa menjelaskan kapan **TDD berguna** dan kapan justru menghambat.
- [ ] Bisa menjelaskan **apa yang dijalankan CI** dan kenapa urutannya begitu.
- [ ] Bisa menjelaskan perbedaan **variabel build-time dan runtime**.
- [ ] Bisa menjelaskan cara **mendeteksi dan menangani masalah produksi**, termasuk rollback.

**Praktik**

- [ ] Menyelesaikan **5 unit test**, **3 Testing Library**, **2 mocking**, **1 TDD**, **2 e2e**, **1 CI**, dan **1 rollback**.
- [ ] Menjawab bagian "Jelaskan dengan Kata Sendiri" di **kesepuluh** note.
- [ ] Ada minimal satu test yang kamu **buktikan menangkap bug** dengan sengaja merusak kode.

**Project & Git**

- [ ] Test bermakna terpasang di repo sebelumnya; **pipeline CI hijau** dan memblokir merge saat gagal.
- [ ] Deploy berjalan otomatis/terverifikasi tanpa langkah rahasia di kode.
- [ ] Monitoring/error tracking aktif dan bisa dibaca.
- [ ] README operasional (test, deploy, rollback) tersedia.
- [ ] Riwayat Git rapi: branch `phase-08/nama-singkat`, Conventional Commits, dan **minimal satu Pull Request** yang kamu **self-review** sebelum merge.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal yang paling mengubah cara kerjamu, dan 1 hal yang masih ingin diperdalam.

## Referensi

- **Vitest Docs** — <https://vitest.dev/> (runner test untuk Vite/TS; baca *Guide* & *API*).
- **Testing Library** — <https://testing-library.com/docs/> (terutama *React Testing Library*; baca bagian *Guiding Principles*).
- **Playwright Docs** — <https://playwright.dev/docs/intro> (e2e modern; mulai dari *Getting Started*).
- **Cypress Docs** — <https://docs.cypress.io/> (alternatif e2e; pilih salah satu, jangan dua-duanya).
- **GitHub Actions Docs** — <https://docs.github.com/en/actions> (workflow, secrets, cache, branch protection).
- **Sentry Docs** — <https://docs.sentry.io/> (error tracking & performance; baca *Getting Started*).
- **Google Cloud Logging** — <https://cloud.google.com/logging/docs> (logging untuk Cloud Functions/backend GCP).
- **Twelve-Factor App** — <https://12factor.net/> (prinsip konfigurasi, build/release/run; relevan untuk deploy & env).

> Catatan: jangan membaca referensi dari awal sampai akhir. Pakai sebagai *kamus* — baca bagian yang relevan saat mentok di satu note, lalu kembali ke latihan.
