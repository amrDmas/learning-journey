# 🚀 Learning Journey — Menuju Full Stack Developer

> Repo kurikulum belajar mandiri + portofolio untuk **Dimas** (freshgraduate S1 Teknik Informatika).
> Target: **job-ready Full Stack Developer** dalam ~4 bulan, dengan komitmen 4+ jam/hari.

Repo ini **bukan** kumpulan teori yang dibaca sekali lalu dilupakan. Ini adalah wadah kerja:
tempat kamu menulis kode, mencatat progres, berlatih alur Git/PR, dan membangun portofolio nyata
yang bisa ditunjukkan ke rekruter.

---

## 🎯 Filosofi Belajar

Fokus utama repo ini adalah **mental model** — *kenapa* sebuah kode berperilaku begitu, bukan sekadar
*apa* sintaksnya. Kamu sudah paham dasar JS/TS, tetapi sering merasa "kode jalan tapi tidak paham kenapa".
Di sini kita perbaiki itu.

Setiap konsep dipelajari lewat tiga langkah:

1. **Tulis ulang dari nol** — jangan copy-paste, ketik sendiri sampai paham.
2. **Jelaskan pakai kata sendiri** — kalau tidak bisa menjelaskan, berarti belum paham.
3. **Pakai di project** — konsep yang tidak dipakai akan hilang dalam seminggu.

Topik mental model yang akan terus muncul: `call stack`, `memory`, `reference vs value`, `scope`,
`closure`, dan `event loop`.

---

## 📚 Ringkasan 11 Fase

| Fase | Judul | Durasi | Project Portofolio |
|------|-------|--------|--------------------|
| `phase-00-setup` | Setup, Mindset & Git Dasar | 1 minggu | — |
| `phase-01-fundamentals` | JavaScript & TypeScript Fundamentals | 3–4 minggu | `cli-data-tool` |
| `phase-02-web-browser` | Web & Browser Fundamentals | 2 minggu | `interactive-web-no-framework` |
| `phase-03-react` | React: Mental Model Rendering & State | 4 minggu | `react-dashboard` |
| `phase-04-node-backend` | Node.js & Backend Fundamentals | 3 minggu | `rest-api-node` |
| `phase-05-database` | Database: SQL & Firestore | 3 minggu | `data-layer-lab` |
| `phase-06-fullstack` | Full-Stack: API + React + Auth + Integrasi | 3 minggu | `fullstack-app` |
| `phase-07-firebase` | Firebase Deep Dive | 2 minggu | `firebase-ops-app` |
| `phase-08-testing-deploy` | Testing, Deployment, CI/CD & Monitoring | 2 minggu | CI/CD ditambahkan ke repo sebelumnya |
| `phase-09-engineering` | Software Engineering & Codebase Mastery | berkelanjutan | `refactoring-case-study` |
| `phase-10-capstone` | Capstone: Operational Management System | 4 minggu | `ops-management-system` |

> Project portofolio dibuat di **repo terpisah** saat fasenya tiba. Repo ini hanya menampung
> materi, catatan progres, dan tautan ke project tersebut.

---

## 🗂️ Struktur Folder

```text
learning-journey/
├── README.md               # Kamu sedang di sini
├── .gitignore              # Aturan abaikan untuk proyek Node/TypeScript
├── docs/
│   ├── PROGRESS.md         # Log progres + jurnal mingguan + refleksi
│   ├── ROADMAP.md          # Peta kurikulum 11 fase (urutan & target)
│   ├── HOW-TO-LEARN.md     # Metode belajar (cara memakai note, latihan, refleksi)
│   ├── GIT-WORKFLOW.md     # Alur Git/PR lengkap (branch, commit, review)
│   └── journal/            # Jurnal harian + lembar recall (spaced repetition)
│       ├── README.md       # Cara pakai jurnal
│       └── recall.md       # Template recall konsep
├── phase-00-setup/
│   └── README.md
├── phase-01-fundamentals/
│   ├── README.md
│   ├── notes/              # 7 note materi (01-execution-model … 07-errors-debugging)
│   ├── exercises/          # Latihan per note (folder 01–07)
│   └── project/            # Spesifikasi project `cli-data-tool`
├── phase-02-web-browser/
│   └── README.md
├── phase-03-react/
│   └── README.md
├── phase-04-node-backend/
│   └── README.md
├── phase-05-database/
│   ├── README.md
│   ├── notes/              # Stub; note dirilis saat fase dimulai
│   └── exercises/          # Stub; latihan dirilis saat fase dimulai
├── phase-06-fullstack/
│   ├── README.md
│   ├── notes/              # Stub
│   └── exercises/          # Stub
├── phase-07-firebase/
│   ├── README.md
│   ├── notes/              # Stub
│   └── exercises/          # Stub
├── phase-08-testing-deploy/
│   ├── README.md
│   ├── notes/              # Stub
│   └── exercises/          # Stub
├── phase-09-engineering/
│   ├── README.md
│   ├── notes/              # Stub
│   └── exercises/          # Stub
└── phase-10-capstone/
    └── README.md
```

> Catatan: `phase-01-fundamentals` sudah berisi penuh (7 note, latihan, dan spesifikasi project).
> `phase-05` s/d `phase-09` saat ini baru punya subfolder `notes/` dan `exercises/` berisi
> README stub; note dan latihannya dirilis saat fasenya dimulai. `phase-02`, `phase-03`,
> `phase-04`, dan `phase-10` masih berupa README fase saja.

Setiap `phase-XX/README.md` mengikuti template yang sama:

```text
# Phase NN — <Judul>
> Durasi: <..> | Prasyarat: <..> | Status: belum mulai

## Tujuan Pembelajaran
## Mental Model — Kenapa, bukan cuma Apa
## Materi & Urutan Belajar
## Latihan
## Project
## Checklist Kelulusan
## Referensi
```

---

## 🧑‍🏫 Cara Pakai Repo Ini (Mode Belajar Interaktif)

Sebelum mulai, baca tiga dokumen inti ini:

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — peta kurikulum 11 fase: urutan, target, dan project tiap fase.
- [`docs/HOW-TO-LEARN.md`](docs/HOW-TO-LEARN.md) — metode belajar: cara memakai note, latihan, dan refleksi.
- [`docs/GIT-WORKFLOW.md`](docs/GIT-WORKFLOW.md) — alur Git/PR lengkap (branch, commit, self-review, merge).

Belajar di repo ini bersifat **interaktif** bersama mentor (Claude). Alurnya sederhana:

```text
1. Mentor menjelaskan konsep di chat (dengan mental model, bukan hafalan).
2. Murid menulis kode sendiri di repo / project.
3. Mentor mereview seperti senior dev: cari bug, tanya "kenapa", usul perbaikan.
4. Ulangi sampai checklist kelulusan fase terpenuhi.
5. Catat progres di docs/PROGRESS.md.
```

**Tips:** jangan minta jawaban langsung. Minta petunjuk bertahap (*hint*), lalu coba sendiri dulu.
Proses "salah → debug → benar" itulah yang membangun mental model.

### Alur Kerja Git (wajib dibiasakan)

Setiap fase dikerjakan di branch sendiri. Alur lengkapnya:

```bash
# 1. Buat branch untuk fase
git checkout -b phase-01/nama-singkat

# 2. Kerjakan, lalu commit dengan Conventional Commits
git add .
git commit -m "feat(phase-01): tambah latihan closure counter"

# 3. Push ke remote
git push -u origin phase-01/nama-singkat

# 4. Buka Pull Request di GitHub
# 5. Self-review: baca ulang diff, cari yang janggal, tinggalkan komentar
# 6. Merge ke main setelah yakin bersih
```

Format **Conventional Commits** yang dipakai:

| Prefix | Untuk apa |
|--------|-----------|
| `feat` | Menambah fitur / materi baru |
| `fix` | Memperbaiki bug atau kesalahan |
| `docs` | Perubahan dokumentasi |
| `refactor` | Merapikan kode tanpa mengubah perilaku |
| `test` | Menambah / memperbaiki tes |
| `chore` | Tugas rutin (konfigurasi, dependency, dll.) |

Aturan branch: `phase-NN/nama-singkat`, contoh `phase-03/react-state-model`.

---

## 📈 Progress Tracker

Status awal semua fase: **belum mulai**. Perbarui tabel ini setiap fase dimulai / selesai.

| Fase | Status | Mulai | Selesai | Link PR |
|------|--------|-------|---------|---------|
| `phase-00-setup` | ⬜ belum mulai | — | — | — |
| `phase-01-fundamentals` | ⬜ belum mulai | — | — | — |
| `phase-02-web-browser` | ⬜ belum mulai | — | — | — |
| `phase-03-react` | ⬜ belum mulai | — | — | — |
| `phase-04-node-backend` | ⬜ belum mulai | — | — | — |
| `phase-05-database` | ⬜ belum mulai | — | — | — |
| `phase-06-fullstack` | ⬜ belum mulai | — | — | — |
| `phase-07-firebase` | ⬜ belum mulai | — | — | — |
| `phase-08-testing-deploy` | ⬜ belum mulai | — | — | — |
| `phase-09-engineering` | ⬜ belum mulai | — | — | — |
| `phase-10-capstone` | ⬜ belum mulai | — | — | — |

Legenda: ⬜ belum mulai · 🟡 sedang berjalan · ✅ selesai.

Catatan progres harian dan refleksi ditulis di [`docs/PROGRESS.md`](docs/PROGRESS.md).

---

## 🎯 Target JD (Job Description)

Kurikulum ini disusun mundur dari kebutuhan JD Full Stack Developer berikut:

- **Bahasa & Framework:** React, Node.js, TypeScript, JavaScript.
- **Firebase:** Firestore, Authentication, Cloud Functions, Storage.
- **Backend & Integrasi:** asynchronous programming, event-driven processing, REST API,
  integrasi pihak ketiga.
- **Fundamental CS:** struktur data, query, performa, keamanan, reliability.
- **Kualitas & Operasi:** testing, deployment, monitoring, CI/CD.
- **Kolaborasi:** Git & GitHub termasuk code review, refactoring aman & maintainable,
  membaca existing codebase besar, dokumentasi teknis.
- **Sikap kerja:** automasi / internal tools, dan *technical ownership* jangka panjang.

Setiap fase dipetakan ke satu atau lebih poin di atas, sehingga apa yang kamu pelajari selalu
punya alasan jelas: **ini dipakai untuk pekerjaan yang mana**.

---

## 📄 Lisensi & Catatan

- Materi di repo ini untuk keperluan belajar pribadi Dimas.
- Bebas dipakai ulang untuk belajar, dengan atribusi bila dibagikan.
- Kode contoh boleh di-copy untuk latihan, tetapi **disarankan diketik ulang**, bukan copy-paste.
- Repo ini berisi catatan pribadi; sebagian penjelasan mungkin disederhanakan demi kejelasan.

> **Satu langkah kecil setiap hari lebih baik daripada satu lompatan besar sekali sebulan.**
> Konsisten 4 jam/hari selama 4 bulan akan mengalahkan semangat semalam.
