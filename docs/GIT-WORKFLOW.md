# Git & GitHub Workflow — Dari Dasar sampai Standar Industri

> Untuk: murid yang sudah pernah `git push` tapi masih bingung branching, Pull Request, dan code review.
> Tujuan: kamu bisa bekerja dengan Git seperti di tim profesional — bukan cuma "asal commit lalu push ke main".

---

## Daftar Isi

1. [Apa itu Git & GitHub](#1-apa-itu-git--github)
2. [Mental Model: Repo, Commit, Branch, Remote, HEAD](#2-mental-model-repo-commit-branch-remote-head)
3. [Perintah Dasar](#3-perintah-dasar)
4. [Branching](#4-branching)
5. [Alur Kerja Tim (Branch → Commit → Push → PR → Self-review → Merge)](#5-alur-kerja-tim)
6. [Conventional Commits](#6-conventional-commits)
7. [Pull Request yang Baik](#7-pull-request-yang-baik)
8. [Code Review](#8-code-review)
9. [Menyelesaikan Merge Conflict](#9-menyelesaikan-merge-conflict)
10. [.gitignore](#10-gitignore)
11. [Kesalahan Umum Pemula & Solusinya](#11-kesalahan-umum-pemula--solusinya)
12. [Cheatsheet Perintah](#12-cheatsheet-perintah)
13. [Latihan PR Pertama (untuk repo ini)](#13-latihan-pr-pertama-untuk-repo-ini)

---

## 1. Apa itu Git & GitHub

**Git** adalah *version control system* (VCS) yang berjalan di komputer kamu. Git mencatat setiap perubahan file dari waktu ke waktu, sehingga kamu bisa:

- Melihat riwayat perubahan dan siapa yang mengubah apa.
- Kembali ke versi sebelumnya kalau ada yang rusak.
- Bekerja di banyak fitur secara paralel tanpa saling menimpa.
- Menggabungkan pekerjaan beberapa orang menjadi satu.

**GitHub** adalah layanan hosting untuk repo Git yang ada di internet. GitHub **bukan** Git. GitHub menyimpan salinan repo Git kamu di server, dan menambahkan fitur kolaborasi di atasnya: Pull Request, code review, Issues, Actions (CI/CD), dan lain-lain.

Analogi sederhana:

| Konsep | Analogi |
|---|---|
| Git | Mesin kamera yang menyimpan semua foto (versi) di komputermu |
| Repo lokal | Album foto di komputermu |
| GitHub | Layanan cloud untuk meng-upload album itu supaya bisa dilihat orang lain |
| Commit | Satu jepretan foto (snapshot) dengan keterangan |
| Push | Upload foto baru ke cloud |
| Pull | Download foto terbaru dari cloud |

**Kenapa ini penting untuk karier?** Hampir semua lowongan developer mensyaratkan "familiar dengan Git & GitHub, termasuk code review". Cara kamu membuktikan itu bukan lewat CV, tapi lewat riwayat commit dan Pull Request di repo portofoliomu. Repo ini (`learning-journey`) adalah tempat latihannya.

---

## 2. Mental Model: Repo, Commit, Branch, Remote, HEAD

Bagian ini yang paling sering terlewat. Kalau kamu paham modelnya, semua perintah Git jadi masuk akal.

### Repo (Repository)

Repo adalah **satu folder proyek yang diawasi Git**. Di dalamnya ada folder tersembunyi `.git/` yang menyimpan seluruh riwayat. Kalau kamu hapus `.git/`, file proyekmu tetap ada, tapi riwayat Git-nya hilang.

Repo punya dua jenis:

- **Repo lokal** — yang ada di komputermu (`D:/dimas/myproject/learning-journey`).
- **Repo remote** — salinan di server (misalnya `origin` di GitHub).

### Commit

Commit adalah **snapshot lengkap** dari semua file yang kamu "track" pada satu titik waktu, ditambah:

- Pesan commit (kenapa perubahan ini dibuat),
- Penulis dan waktu,
- Referensi ke commit induk (parent).

Penting dipahami: commit **bukan** diff/perbedaan. Git menyimpan snapshot, lalu menghitung diff saat kamu minta (`git diff`, `git show`). Analogi: commit itu seperti save point di game, bukan catatan "apa yang berubah sejak save terakhir".

Setiap commit punya **hash** unik (misalnya `a1b2c3d`), dan commit-commit itu saling terhubung membentuk rantai:

```
A --- B --- C --- D   (main)
```

`D` adalah commit terbaru. `D` tahu parent-nya `C`, `C` tahu parent-nya `B`, dan seterusnya. Rantai inilah yang disebut **history**.

### Branch

Branch adalah **penunjuk (pointer) yang bisa digerakkan ke sebuah commit**. Itu saja. Branch bukan folder salinan file, bukan "copy project". Ini konsep yang bikin banyak pemula salah paham.

```
              main
                |
A --- B --- C --+
                |
              feature-login
```

Di gambar di atas, `main` dan `feature-login` sama-sama menunjuk ke commit `C`. Saat kamu commit lagi di `feature-login`, pointer-nya maju:

```
              main
                |
A --- B --- C --+
                 \
                  D --- E   (feature-login)
```

Branch memungkinkan kamu mengerjakan fitur di jalur terpisah tanpa mengganggu `main`.

### Remote

Remote adalah **nama panggilan untuk URL repo di server**. Konvensi paling umum: `origin` menunjuk ke repo GitHub-mu.

```bash
git remote -v
# origin  https://github.com/dimas/learning-journey.git (fetch)
# origin  https://github.com/dimas/learning-journey.git (push)
```

Kamu bisa punya lebih dari satu remote (misalnya `origin` = fork-mu, `upstream` = repo utama).

### HEAD

`HEAD` adalah **penunjuk ke posisi kamu saat ini** — biasanya menunjuk ke branch yang sedang aktif.

```bash
git branch
# * main
```

Tanda `*` artinya `main` adalah branch aktif, jadi `HEAD` → `main` → commit terbaru di `main`.

Kalau kamu pindah branch (`git switch feature-login`), `HEAD` ikut pindah. Kalau kamu checkout langsung ke sebuah commit (bukan branch), kamu masuk kondisi **detached HEAD** — kamu "melihat" commit itu tanpa berada di branch mana pun. Aman untuk sekadar lihat-lihat, tapi jangan commit di sana kecuali kamu memang mau membuat branch baru.

### Ringkasan model

```
HEAD ──> branch aktif ──> commit terbaru
                                │
                                ├── parent commit
                                └── parent commit ... (history)
Remote (origin) <──push/pull──> Repo lokal
```

---

## 3. Perintah Dasar

Semua perintah dijalankan dari dalam folder repo, kecuali `git init`.

### `git init` — membuat repo baru

```bash
git init
# Initialized empty Git repository in D:/dimas/myproject/learning-journey/.git/
```

Menambahkan folder `.git/` dan mengaktifkan Git di folder tersebut. Cukup sekali per proyek.

Untuk menghubungkan ke GitHub setelah `git init`:

```bash
git remote add origin https://github.com/username/learning-journey.git
```

### `git status` — melihat kondisi saat ini

```bash
git status
```

Perintah yang **paling sering** kamu pakai. Menampilkan:

- Branch aktif.
- File yang berubah tapi belum di-stage (*untracked* / *modified*).
- File yang sudah di-stage (siap di-commit).

Biasakan `git status` sebelum dan sesudah operasi apa pun.

### `git add` — memilih perubahan yang akan di-commit

```bash
git add README.md          # satu file
git add docs/              # satu folder
git add .                  # semua perubahan di folder saat ini
```

Proses `add` ini disebut **staging**. Analogi: kamu memilih barang mana yang mau dimasukkan ke dalam kotak (commit) sebelum menutupnya.

Kalau salah `add`, keluarkan dengan:

```bash
git restore --staged README.md
```

### `git commit` — menyimpan snapshot

```bash
git commit -m "docs: tambah panduan git workflow"
```

Commit hanya menyimpan apa yang sudah di-*stage*. File yang diubah tapi belum di-`add` tidak ikut.

Kalau ingin langsung commit semua file yang sudah di-track (hati-hati, file baru tidak ikut):

```bash
git commit -am "fix: perbaiki typo di README"
```

### `git log` — melihat riwayat

```bash
git log                     # riwayat lengkap
git log --oneline           # ringkas, satu baris per commit
git log --oneline --graph --all   # lihat struktur branch secara visual
```

Contoh `git log --oneline`:

```
e4f5a6b (HEAD -> main) docs: tambah cheatsheet git
c3d4e5f feat: setup struktur folder fase
b2c3d4e chore: init repo
```

### `git diff` — melihat perubahan

```bash
git diff                    # perubahan yang belum di-stage
git diff --staged           # perubahan yang sudah di-stage (siap commit)
git diff main feature-login # bandingkan dua branch
```

`git diff` adalah alat debugging sosial — sebelum commit, lihat dulu apa yang sebenarnya kamu ubah. Sering kali ada file yang tidak sengaja ikut terubah.

---

## 4. Branching

### Membuat branch

```bash
git branch feature-login          # buat branch (tanpa pindah)
git switch -c feature-login       # buat branch DAN langsung pindah
```

`git switch -c` adalah cara modern (Git ≥ 2.23). Cara lama yang masih sering kamu lihat: `git checkout -b feature-login`. Keduanya sama.

### Pindah branch

```bash
git switch main
git switch feature-login
```

Cara lama: `git checkout main`.

### Melihat daftar branch

```bash
git branch            # branch lokal
git branch -a         # termasuk branch remote (origin/...)
git branch -v         # beserta commit terakhirnya
```

### Menghapus branch

```bash
git branch -d feature-login       # hapus kalau sudah di-merge (aman)
git branch -D feature-login       # hapus paksa (hati-hati, bisa kehilangan commit)
```

### Konvensi penamaan branch di repo ini

Repo ini memakai konvensi **`phase-NN/nama-singkat`**:

```
phase-00/setup-git
phase-01/js-fundamentals
phase-01/closure-exercise
phase-03/react-rendering-mental-model
phase-10/capstone-scaffold
```

Aturan penamaan yang baik:

- Huruf kecil semua, kata dipisah tanda hubung (`-`).
- Deskriptif: orang lain harus bisa menebak isinya tanpa membuka branch.
- Satu branch = satu topik. Jangan campur "nambah latihan" dan "perbaiki typo fase 2" di branch yang sama.

Contoh nama yang **buruk**: `test`, `coba`, `branch-baru`, `fix`, `dimas`.

### Melihat branch mana yang aktif

```bash
git status
# On branch phase-01/closure-exercise
```

---

## 5. Alur Kerja Tim

Ini alur standar industri. Repo ini memakai alur yang sama, dalam skala satu orang.

```
main (selalu stabil)
  │
  ├── 1. git switch -c phase-01/topik   ← buat branch dari main
  │
  ├── 2. edit file... git add ... git commit -m "..."   ← commit kecil-kecil
  │
  ├── 3. git push -u origin phase-01/topik   ← push ke GitHub
  │
  ├── 4. buka Pull Request di GitHub    ← ajukan merge ke main
  │
  ├── 5. self-review: baca ulang diff, tinggalkan komentar   ← koreksi sendiri
  │
  └── 6. merge ke main, hapus branch   ← selesai
```

### Langkah 1 — Buat branch dari `main` yang terbaru

Selalu mulai dari `main` yang update, supaya tidak ketinggalan perubahan orang lain:

```bash
git switch main
git pull origin main          # ambil perubahan terbaru
git switch -c phase-01/closure-exercise
```

### Langkah 2 — Commit kecil-kecil yang bermakna

Jangan menunggu semua selesai baru commit. Commit yang baik adalah **satu perubahan logis**. Contoh urutan commit di satu branch:

```bash
git commit -m "docs(phase-01): tambah materi closure"
git commit -m "docs(phase-01): tambah latihan closure counter"
git commit -m "test(phase-01): tambah contoh output latihan"
```

### Langkah 3 — Push branch

Pertama kali push branch baru:

```bash
git push -u origin phase-01/closure-exercise
```

`-u` (`--set-upstream`) mengikat branch lokal ke branch remote. Setelah itu cukup `git push`.

### Langkah 4 — Buka Pull Request

Buka repo di GitHub. GitHub biasanya menampilkan tombol **"Compare & pull request"**. Isi judul dan deskripsi (lihat [bagian 7](#7-pull-request-yang-baik)).

### Langkah 5 — Self-review

Sebelum minta orang lain review (atau sebelum merge kalau kamu sendirian), baca ulang PR-mu sendiri di tab **Files changed**:

- Apakah ada file yang tidak sengaja ikut (misalnya `.env`, `node_modules`)?
- Apakah ada `console.log` debugging yang tertinggal?
- Apakah nama variabel jelas?
- Apakah deskripsi PR sudah menjelaskan *kenapa*?

Tinggalkan komentar sendiri di baris yang kamu ragukan. Ini kebiasaan senior dev yang bagus.

### Langkah 6 — Merge

Kalau semua sudah oke, klik **Merge pull request**. Setelah merge:

```bash
git switch main
git pull origin main                       # tarik hasil merge
git branch -d phase-01/closure-exercise    # hapus branch lokal
git push origin --delete phase-01/closure-exercise   # hapus branch remote (opsional)
```

> **Aturan penting:** `main` selalu stabil. Jangan pernah commit langsung ke `main` untuk perubahan yang belum direview. Semua perubahan masuk lewat branch + PR.

---

## 6. Conventional Commits

Format pesan commit yang distandarkan. Tujuannya: riwayat jadi mudah dibaca, dan tool otomatis (changelog, versioning) bisa memprosesnya.

### Format

```
<tipe>(<scope opsional>): <deskripsi singkat>

<badan opsional: kenapa, bukan apa>

<footer opsional: referensi issue, breaking change>
```

### Tipe yang dipakai di repo ini

| Tipe | Kapan dipakai | Contoh |
|---|---|---|
| `feat` | Fitur/materi baru | `feat(phase-03): tambah materi react state` |
| `fix` | Memperbaiki kesalahan | `fix(phase-01): perbaiki typo contoh closure` |
| `docs` | Dokumentasi saja | `docs: perbarui panduan git workflow` |
| `refactor` | Ubah struktur tanpa ubah perilaku | `refactor(phase-01): pecah file latihan jadi modul` |
| `test` | Menambah/memperbaiki test | `test(phase-04): tambah test endpoint users` |
| `chore` | Tugas rutin (config, dependensi) | `chore: tambah .gitignore` |

### Contoh pesan commit yang baik

```bash
feat(phase-03): tambah latihan useEffect dependency array
fix(phase-02): perbaiki contoh DOM event listener yang salah
docs(git): tambah bagian penyelesaian merge conflict
refactor(cli-data-tool): pisahkan parsing argumen ke fungsi sendiri
test(data-layer-lab): tambah test query filter tanggal
chore: tambah konfigurasi prettier
```

### Contoh pesan commit yang buruk

```bash
update            # tidak jelas apa yang di-update
fix bug           # bug apa?
asdf              # jangan
wip               # boleh untuk commit sementara lokal, jangan di-push ke PR
ganti ganti       # tidak bermakna
```

### Aturan praktis

- **Imperatif, huruf kecil, tanpa titik di akhir**: "tambah materi", bukan "Menambahkan materi." atau "ditambahkan materi".
- **≤ 72 karakter** untuk baris judul.
- Jelaskan **kenapa** di badan commit kalau tidak obvious:

```bash
git commit -m "fix(phase-01): perbaiki contoh hoisting" -m "Contoh sebelumnya mencampur var dan let sehingga output
membingungkan pembaca. Dipisah jadi dua contoh terpisah."
```

- Satu commit = satu perubahan logis. Kalau pesan commit-mu butuh kata "dan", kemungkinan itu harusnya dua commit.

---

## 7. Pull Request yang Baik

Pull Request (PR) adalah **usulan untuk menggabungkan branch-mu ke branch lain** (biasanya `main`). PR yang baik memudahkan reviewer memahami perubahan tanpa harus bertanya.

### Template deskripsi PR

Simpan template ini, pakai untuk setiap PR:

```markdown
## Apa yang berubah
<!-- Ringkas 1-3 poin. Apa yang ditambahkan/diubah/dihapus. -->
- Menambahkan materi closure di phase-01
- Menambahkan 3 latihan counter

## Kenapa
<!-- Alasan perubahan. Kaitkan ke fase/tujuan belajar atau issue. -->
Bagian closure belum punya latihan praktik, padahal konsep ini
sering ditanyakan di interview.

## Cara test / verifikasi
<!-- Langkah konkret supaya reviewer bisa memastikan ini benar. -->
1. Buka `phase-01-fundamentals/README.md`
2. Jalankan `node latihan/closure-counter.js`
3. Output yang diharapkan: `1 2 3`

## Screenshot (kalau ada perubahan UI)
<!-- Tempel gambar. Untuk materi berbasis teks, bisa screenshot render markdown. -->

## Checklist
- [ ] Sudah cek `git diff` sendiri
- [ ] Tidak ada file rahasia (.env, kredensial) yang ikut
- [ ] Tidak ada `console.log` / kode debug yang tertinggal
- [ ] Sudah baca ulang sendiri (self-review)
- [ ] Branch mengikuti konvensi `phase-NN/nama-singkat`
```

### Judul PR

Judul PR yang baik **sama baiknya dengan judul commit** — singkat dan jelas:

```
docs(phase-01): tambah materi & latihan closure
feat(phase-04): endpoint CRUD users dengan validasi
```

Hindari: `Update`, `PR baru`, `Tolong merge`.

### PR kecil lebih baik

PR yang menyentuh 50 file sekaligus sulit di-review dan rawan konflik. Usahakan satu PR = satu topik. Untuk repo ini, satu PR biasanya = satu sub-topik dalam satu fase.

---

## 8. Code Review

Code review bukan ujian atau ajang menghakimi. Tujuannya: **meningkatkan kualitas kode dan berbagi pengetahuan**, dua arah.

### Cara MEMBERI review (kalau kamu jadi reviewer)

- **Fokus ke kode, bukan orang.** "Fungsi ini sulit dibaca" lebih baik daripada "kamu nulisnya berantakan".
- **Jelaskan alasannya.** Jangan cuma "ganti ini"; sebutkan kenapa.
- **Bedakan tingkat kepentingan.** Gunakan awalan:
  - `nit:` — hal kecil, opsional (misalnya gaya penamaan).
  - `question:` — kamu belum paham, minta penjelasan.
  - `suggestion:` — usulan, boleh didiskusikan.
  - `blocking:` — harus diperbaiki sebelum merge.
- **Puji yang bagus.** "Ini rapi, penamaan fungsinya jelas" itu umpan balik yang berguna.
- **Tanya dulu, jangan langsung menghakimi.** Mungkin ada alasan teknis di balik pilihan kode.

Contoh komentar review yang baik:

```
suggestion: Fungsi ini bisa dipisah jadi dua — satu untuk validasi,
satu untuk menyimpan. Sekarang satu fungsi melakukan dua hal, jadi
sulit di-test terpisah. Bagaimana menurutmu?
```

### Cara MENERIMA review (kalau kode kamu yang di-review)

- **Jangan defensif.** Review itu gratis, manfaatkan.
- **Kalau setuju** → perbaiki, commit lagi ke branch yang sama, push. PR otomatis ter-update.
- **Kalau tidak setuju** → jelaskan alasannya dengan sopan, buka diskusi. Boleh berdebat soal teknis, jangan soal pribadi.
- **Balas setiap komentar** supaya jelas mana yang sudah ditangani dan mana yang belum.
- **Jangan merge sebelum semua komentar `blocking` selesai.**

Alur merespons review:

```bash
# setelah memperbaiki sesuai review
git add .
git commit -m "refactor(phase-01): pisah validasi dan penyimpanan sesuai review"
git push
# PR di GitHub otomatis menampilkan commit baru
```

---

## 9. Menyelesaikan Merge Conflict

Conflict terjadi ketika **dua branch mengubah baris yang sama** dan Git tidak bisa memutuskan mana yang benar. Git akan berhenti dan minta kamu memutuskan. Ini normal, bukan tanda kesalahan fatal.

### Skenario

Branch `phase-01/feature-a` dan `phase-01/feature-b` sama-sama mengubah baris yang sama di `README.md`. Saat kamu merge `phase-01/feature-b` ke `main` setelah `phase-01/feature-a` masuk:

```bash
git switch main
git merge phase-01/feature-b
# Auto-merging README.md
# CONFLICT (content): Merge conflict in README.md
# Automatic merge failed; fix conflicts and then commit the result.
```

### Langkah demi langkah

**Langkah 1 — Lihat file mana yang konflik**

```bash
git status
# Unmerged paths:
#   both modified:   README.md
```

**Langkah 2 — Buka file dan temukan penanda konflik**

Git menandai bagian yang konflik seperti ini:

```
<<<<<<< HEAD
Ini isi dari branch yang sedang aktif (main).
=======
Ini isi dari branch yang akan di-merge (phase-01/feature-b).
>>>>>>> phase-01/feature-b
```

- Bagian antara `<<<<<<< HEAD` dan `=======` adalah versi branch kamu saat ini.
- Bagian antara `=======` dan `>>>>>>>` adalah versi yang datang.

**Langkah 3 — Edit file, putuskan hasil akhirnya**

Kamu **bukan** wajib memilih salah satu. Kamu bisa menggabungkan keduanya, atau menulis ulang. Yang penting: **hapus semua penanda** `<<<<<<<`, `=======`, `>>>>>>>` dan sisakan teks final yang benar.

Contoh sebelum:

```
<<<<<<< HEAD
Durasi: 3 minggu
=======
Durasi: 4 minggu
>>>>>>> phase-01/feature-b
```

Contoh sesudah (memilih satu):

```
Durasi: 4 minggu
```

Contoh sesudah (menggabungkan):

```
Durasi: 3-4 minggu
```

**Langkah 4 — Tandai sudah selesai & commit**

```bash
git add README.md
git commit
# Git sudah menyiapkan pesan merge; simpan saja.
```

**Langkah 5 — Verifikasi**

```bash
git log --oneline --graph
git status      # pastikan "nothing to commit, working tree clean"
```

### Kalau kacau dan ingin membatalkan

Sebelum commit merge, kamu bisa kembali ke kondisi semula:

```bash
git merge --abort
```

Ini membatalkan proses merge dan mengembalikan repo ke kondisi sebelum kamu mulai. Selamat mencoba lagi dengan lebih hati-hati.

### Tips mencegah conflict

- Sering `git pull` dari `main` ke branch-mu.
- PR kecil dan cepat di-merge, jangan menggantung lama.
- Satu branch satu topik, jangan menyentuh file yang sama dengan orang lain kalau tidak perlu.
- Koordinasikan kalau kamu tahu akan mengedit file yang sama.

---

## 10. .gitignore

File `.gitignore` berisi daftar file/folder yang **tidak boleh** dilacak Git. Ini mencegah file sampah atau rahasia masuk ke repo.

### Kenapa penting

- `node_modules/` bisa berisi puluhan ribu file — tidak perlu di-commit, bisa di-*install* ulang dari `package.json`.
- `.env` berisi kredensial (API key, password) — **jangan pernah** masuk repo.
- File OS/editor (`.DS_Store`, `.idea/`) tidak relevan untuk proyek.

### Contoh `.gitignore` untuk repo ini

```gitignore
# Dependensi
node_modules/
.pnp/
.pnp.js

# Build output
dist/
build/
out/

# Environment & rahasia
.env
.env.local
.env.*.local
*.key
*.pem

# Log
*.log
npm-debug.log*
yarn-error.log*

# Editor / OS
.vscode/
.idea/
.DS_Store
Thumbs.db

# Coverage / cache
coverage/
.cache/
*.tsbuildinfo
```

### Cara pakai

Buat file `.gitignore` di root repo, isi dengan pola di atas, lalu:

```bash
git add .gitignore
git commit -m "chore: tambah .gitignore"
```

### Kalau file sudah terlanjur ter-track

`.gitignore` hanya berlaku untuk file yang **belum** dilacak. Kalau file sudah ter-commit, kamu harus menghapusnya dari tracking dulu:

```bash
git rm --cached .env
git commit -m "chore: hapus .env dari tracking"
```

`--cached` membuat Git berhenti melacak file itu, **tapi filenya tetap ada di disk-mu**.

> ⚠️ Kalau kredensial sudah terlanjur ter-push ke GitHub, menghapusnya dari commit terbaru **tidak cukup** — nilainya masih ada di riwayat. Segera **rotate/revoke** kredensial itu di layanan terkait, baru bersihkan riwayat.

### Pola `.gitignore` dasar

| Pola | Arti |
|---|---|
| `node_modules/` | Folder bernama `node_modules` di mana pun |
| `*.log` | Semua file berakhiran `.log` |
| `/dist/` | Hanya folder `dist` di root (bukan di subfolder) |
| `!important.log` | Pengecualian: file ini tetap dilacak |
| `**/temp` | Folder `temp` di kedalaman mana pun |

---

## 11. Kesalahan Umum Pemula & Solusinya

| Kesalahan | Gejala | Solusi |
|---|---|---|
| Commit langsung ke `main` | Riwayat `main` kacau, tidak ada review | Buat branch dulu: `git switch -c phase-01/topik`. Kalau terlanjur, pindahkan commit dengan `git switch -c phase-01/topik && git switch main && git reset --hard HEAD~1` (branch baru menunjuk commit itu, `main` mundur satu commit, pekerjaan aman di branch). |
| Pesan commit "update" | Riwayat tak terbaca | Pakai Conventional Commits (bagian 6). |
| Lupa `git add` sebelum commit | "nothing to commit" atau file tidak ikut | `git status` dulu, lalu `git add <file>`. |
| `node_modules` ikut ter-commit | Repo membengkak | Tambah `.gitignore`, lalu `git rm -r --cached node_modules`. |
| `.env` ikut ter-push | Kredensial bocor | Hapus dari tracking, **rotate kredensial**, tambah ke `.gitignore`. |
| Salah branch saat mengedit | Perubahan masuk ke branch yang salah | `git stash` → pindah branch → `git stash pop`. |
| Menghapus file tanpa sengaja | File hilang dari disk | `git restore <file>` untuk membatalkan perubahan (kalau belum di-stage). Kalau sudah di-stage/di-`git rm`, pakai `git restore --source=HEAD --staged --worktree <file>` (atau `git checkout HEAD -- <file>`). Untuk ambil dari commit lama: `git restore --source=<commit> <file>`. |
| Salah commit, mau batal tapi belum push | Commit jelek | `git reset --soft HEAD~1` (batalkan commit, perubahan tetap di staging). |
| Sudah push lalu mau ubah pesan commit | Pesan salah di remote | `git commit --amend` lalu `git push --force-with-lease` (**hanya** di branch sendiri, jangan di `main`). |
| Detached HEAD dan bingung | `git status` bilang "HEAD detached at ..." | `git switch -c nama-branch-baru` untuk menyelamatkan pekerjaan. |
| Pull ditolak karena ada perubahan lokal | "Your local changes would be overwritten" | Commit atau `git stash` perubahan lokal dulu, baru `git pull`. |
| Konflik merge panik | `CONFLICT` | Ikuti bagian 9, atau `git merge --abort` untuk mundur. |
| Salah hapus branch | Branch hilang | `git reflog` untuk menemukan commit terakhir, lalu `git switch -c nama <hash>`. |
| Force push ke branch bersama | Pekerjaan orang lain hilang | Jangan pernah `--force` ke branch bersama. Kalau perlu, pakai `--force-with-lease`. |

### `git reflog` — jaring pengaman

`reflog` mencatat **semua** pergerakan HEAD, termasuk commit yang sudah "hilang" karena reset/hapus branch. Kalau kamu merasa kehilangan pekerjaan:

```bash
git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~1
# d4e5f6a HEAD@{1}: commit: feat: tambah fitur penting

git switch -c penyelamat d4e5f6a
```

Hampir semua yang "hilang" di Git bisa dikembalikan dalam ~30 hari selama belum di-*garbage collect*. Tenang dulu, jangan panik.

---

## 12. Cheatsheet Perintah

### Setup & remote

```bash
git init                                  # buat repo baru
git clone <url>                           # salin repo dari remote
git remote -v                             # lihat daftar remote
git remote add origin <url>               # tambah remote bernama origin
```

### Melihat kondisi

```bash
git status                                # kondisi working tree
git log --oneline --graph --all           # riwayat visual semua branch
git diff                                  # perubahan belum di-stage
git diff --staged                         # perubahan sudah di-stage
git show <hash>                           # detail satu commit
```

### Menyimpan perubahan

```bash
git add <file>                            # stage satu file
git add .                                 # stage semua
git commit -m "tipe: pesan"               # commit
git commit --amend                        # ubah commit terakhir (belum di-push)
```

### Branch

```bash
git branch                                # daftar branch lokal
git branch -a                             # termasuk remote
git switch -c phase-01/topik              # buat + pindah branch
git switch main                           # pindah ke main
git branch -d phase-01/topik              # hapus branch (aman)
git branch -D phase-01/topik              # hapus paksa
```

### Sinkronisasi

```bash
git pull origin main                      # ambil + merge dari remote
git fetch origin                          # ambil tanpa merge
git push                                  # kirim commit ke remote
git push -u origin phase-01/topik         # push branch baru + set upstream
git push origin --delete phase-01/topik   # hapus branch di remote
```

### Membatalkan

```bash
git restore <file>                        # buang perubahan file (belum di-stage)
git restore --staged <file>               # keluarkan dari staging
git reset --soft HEAD~1                   # batalkan commit, perubahan tetap
git reset --hard HEAD~1                   # ⚠️ batalkan commit + buang perubahan
git revert <hash>                         # buat commit baru yang membatalkan commit lain
git stash                                 # simpan perubahan sementara
git stash pop                             # ambil kembali
```

### Merge & conflict

```bash
git merge phase-01/topik                  # merge branch ke branch aktif
git merge --abort                         # batalkan merge yang konflik
git rebase main                           # pindahkan commit di atas main (alternatif merge)
```

### Menyelamatkan

```bash
git reflog                                # riwayat semua pergerakan HEAD
git switch -c penyelamat <hash>           # buat branch dari commit yang hilang
```

---

## 13. Latihan PR Pertama (untuk repo ini)

Tujuan: merasakan **satu siklus penuh** — branch → commit → push → PR → self-review → merge — di repo `learning-journey`. Kerjakan di terminal, dari folder repo.

### Persiapan

Kalau folder ini **belum** jadi repo Git (mis. langsung dari hasil unduhan), inisialisasi dulu dan hubungkan ke GitHub. Langkah ini biasanya sudah dilakukan sekali di phase-00 setup; lewati kalau sudah pernah:

```bash
cd D:/dimas/myproject/learning-journey
git init                                   # buat repo lokal (sekali saja)
git remote add origin https://github.com/username/learning-journey.git   # hubungkan ke GitHub
```

Kalau repo sudah ada (sudah punya folder `.git/` dan remote `origin`), cukup pastikan kondisinya bersih dan terbaru:

```bash
git status                 # pastikan tidak ada perubahan yang belum di-commit
git switch main
git pull origin main       # pastikan main terbaru
```

> Catatan: `git pull origin main` hanya bisa jalan kalau remote `origin` sudah diatur. Kalau belum, tambahkan dulu dengan `git remote add origin <url>` di atas.

### Langkah 1 — Buat branch

```bash
git switch -c phase-00/latihan-pr-pertama
```

Cek: `git branch` harus menunjukkan `* phase-00/latihan-pr-pertama`.

### Langkah 2 — Buat perubahan kecil

Buat file latihan sederhana, misalnya `docs/latihan/latihan-pr-pertama.md`:

```markdown
# Latihan PR Pertama

Ini file latihan untuk mencoba alur branch → commit → push → Pull Request.

## Yang saya pelajari
- Cara membuat branch dengan konvensi `phase-NN/nama-singkat`
- Cara menulis Conventional Commit
- Cara membuka dan me-review Pull Request sendiri
```

### Langkah 3 — Cek lalu commit

```bash
git status                 # lihat file baru muncul sebagai "untracked"
git diff                   # (kosong untuk file baru; ini normal)
git add docs/latihan/latihan-pr-pertama.md
git diff --staged          # lihat isi yang akan di-commit
git commit -m "docs(phase-00): tambah latihan PR pertama"
```

### Langkah 4 — Push branch

```bash
git push -u origin phase-00/latihan-pr-pertama
```

Output akan menampilkan URL untuk membuat Pull Request.

### Langkah 5 — Buka Pull Request di GitHub

1. Buka repo di browser. GitHub menampilkan tombol **"Compare & pull request"** — klik.
2. Isi judul: `docs(phase-00): tambah latihan PR pertama`.
3. Isi deskripsi dengan template di [bagian 7](#7-pull-request-yang-baik).
4. Klik **Create pull request**.

### Langkah 6 — Self-review

1. Buka tab **Files changed** di PR.
2. Baca setiap baris yang berubah. Tanyakan: "Kalau saya orang lain, apakah saya paham ini?"
3. Tinggalkan minimal satu komentar sendiri di baris tertentu — misalnya:
   `nit: mungkin judul file bisa lebih deskriptif.`
4. Kalau ada perbaikan, lakukan di lokal, commit lagi, `git push` — PR otomatis ter-update:

```bash
# contoh kalau ada perbaikan setelah self-review
git add .
git commit -m "docs(phase-00): perbaiki judul file latihan sesuai review"
git push
```

### Langkah 7 — Merge

1. Kembali ke tab **Conversation** PR.
2. Klik **Merge pull request** → **Confirm merge**.
3. (Opsional) Klik **Delete branch** di GitHub untuk menghapus branch remote.

### Langkah 8 — Bersihkan lokal

```bash
git switch main
git pull origin main                       # tarik hasil merge
git branch -d phase-00/latihan-pr-pertama  # hapus branch lokal
git log --oneline --graph                  # lihat hasilnya
```

### Langkah 9 — Verifikasi pemahaman

Jawab pertanyaan ini untuk dirimu sendiri:

1. Apa bedanya `git add` dan `git commit`?
2. Kenapa `main` harus selalu stabil?
3. Kenapa `HEAD` disebut "penunjuk", bukan "salinan"?
4. Apa yang terjadi kalau kamu `git reset --hard` dan bagaimana `git reflog` menolong?
5. Kenapa PR kecil lebih baik daripada PR besar?

Kalau kelima pertanyaan ini bisa kamu jawab dengan kata-katamu sendiri tanpa membuka catatan, kamu sudah punya mental model Git yang cukup untuk bekerja di tim.

### Langkah 10 — Ulangi untuk fase berikutnya

Setiap kali mulai topik baru di fase mana pun:

```bash
git switch main && git pull origin main
git switch -c phase-NN/nama-topik
# ... kerjakan, commit kecil-kecil ...
git push -u origin phase-NN/nama-topik
# ... buka PR, self-review, merge ...
```

Lakukan ini sampai jadi kebiasaan. Setelah 5–10 PR, alur ini akan terasa otomatis.

---

## Penutup

Git terasa rumit karena orang mencoba menghafal perintah tanpa memahami modelnya. Sekali kamu paham bahwa **commit adalah snapshot, branch adalah pointer, dan HEAD adalah posisi kamu**, sisa perintahnya hanyalah cara bergerak di antara ketiganya.

Latih terus di repo ini. Riwayat commit dan PR-mu sendiri adalah bukti paling kuat kepada recruiter bahwa kamu bisa bekerja dengan Git seperti profesional.
