# Phase 00 — Setup, Mindset & Git Dasar

> Durasi: 1 minggu (4+ jam/hari) | Prasyarat: tidak ada (ini titik awal) | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan kenapa kamu belajar ini** — tujuan karier yang konkret (Full Stack Developer), bukan sekadar "biar bisa ngoding".
2. **Memasang dan memverifikasi tooling inti**: Node.js (LTS), npm, VS Code + ekstensi penting, dan mengonfigurasi identitas Git (`user.name`, `user.email`).
3. **Menggunakan terminal dengan percaya diri**: berpindah direktori, membuat/menghapus file, membaca isi file, mencari file — tanpa takut.
4. **Menjelaskan model mental Git dasar**: tiga area kerja (working directory → staging → repository), apa itu commit, dan kenapa commit kecil lebih baik.
5. **Membuat akun GitHub, repo, dan melakukan alur lengkap**: `init` → `add` → `commit` → `push`.
6. **Melakukan commit pertama** di repo `learning-journey` ini, dengan pesan bergaya Conventional Commits.
7. **Menjelaskan konsep *growth mindset*** dan kenapa "kode jalan tapi tidak paham kenapa" adalah masalah yang bisa diperbaiki, bukan bakat.

## Mental Model — Kenapa, bukan cuma Apa

Fase ini terlihat "cuma setup", padahal justru di sini fondasi mental dibangun. Tiga model yang wajib kamu pegang:

| Model | Pertanyaan yang dijawab | Kenapa penting |
| --- | --- | --- |
| **Mesin vs kode** | "Apa bedanya program yang saya tulis dengan program yang menjalankannya?" | Node.js adalah *runtime* — mesin yang membaca dan mengeksekusi JS. Memahaminya menjelaskan kenapa file bisa jalan tanpa browser. |
| **Snapshot, bukan perubahan** | "Apa yang sebenarnya disimpan Git saat saya commit?" | Git menyimpan *snapshot* seluruh isi proyek pada satu titik waktu, bukan sekadar "perubahan baris". Ini menjelaskan kenapa kamu bisa kembali ke commit lama. |
| **Zona (working / staging / repo)** | "Kenapa saya harus `add` dulu sebelum `commit`?" | Git memisahkan "apa yang kamu ubah" dari "apa yang mau kamu simpan". Staging memberi kamu kontrol memilih perubahan mana yang masuk satu commit. |

**Growth mindset dalam praktik**, bukan slogan. Yang dimaksud di sini sangat spesifik:

- **Kesalahan adalah data, bukan vonis.** Kalau kodenya error, itu bukan "saya bodoh", tapi "model saya belum lengkap". Tugasmu: cari tahu bagian mana yang salah.
- **Belum ≠ tidak bisa.** "Saya belum paham closure" itu status, bukan identitas.
- **Fokus pada proses, bukan hasil instan.** 4 jam/hari yang konsisten mengalahkan maraton semalam.
- **Minta petunjuk, bukan jawaban.** Saat mentok, minta *hint* bertahap ke mentor, lalu coba lagi sendiri. Rasa "berjuang lalu berhasil" itulah yang menempel.

> Aturan emas fase ini: **nyaman dengan terminal dan Git sejak awal.** Dua hal ini akan kamu pakai setiap hari selama 4 bulan ke depan. Lebih baik lambat tapi paham, daripada cepat tapi buta.

## Materi & Urutan Belajar

Kerjakan berurutan. Perkiraan: 1 hari untuk tiap bagian, sisa hari untuk latihan dan membiasakan diri.

| # | Topik | Isi utama | Keluaran konkret |
| --- | --- | --- | --- |
| 01 | **Mindset & tujuan karier** | Kenapa belajar ini, target JD Full Stack, cara belajar berbasis mental model, aturan "jelaskan dengan kata sendiri" | Satu paragraf tertulis: *"Saya belajar ini karena ___, dalam 4 bulan target saya ___."* |
| 02 | **Terminal dasar** | `pwd`, `ls`, `cd`, `mkdir`, `rm`, `cp`, `mv`, `cat`, `code .` | Bisa berpindah dan mengelola folder lewat terminal, bukan hanya klik-klik. |
| 03 | **Node.js & npm** | Apa itu runtime Node, cek `node -v` / `npm -v`, beda Node dengan browser, apa itu `package.json` (sekilas) | Node LTS terpasang dan `node -v` mengeluarkan versi. |
| 04 | **Editor: VS Code + ekstensi** | Settings, terminal terintegrasi, ekstensi wajib (ESLint, Prettier, GitLens, Error Lens) | VS Code siap; Prettier & ESLint aktif. |
| 05 | **Identitas Git** | `git config --global user.name`, `user.email`, `git config --list` | Nama & email muncul di `git config --list`. |
| 06 | **Git dasar (model mental)** | Tiga zona (working/staging/repo), `status`, `add`, `commit`, `log`, `diff` | Bisa menjelaskan tiap perintah *kenapa* dipakai. |
| 07 | **GitHub: akun, repo, remote** | Buat akun, SSH/HTTPS, `git remote add`, `push`, `clone` | Repo `learning-journey` ter-push ke GitHub. |
| 08 | **Conventional Commits** | Format `tipe(scope): pesan`, tipe umum (feat/fix/docs/chore), kenapa pesan commit penting | Bisa menulis pesan commit yang jelas & konsisten. |

### Tooling yang harus terpasang (checklist cepat)

| Tool | Cara verifikasi | Catatan |
| --- | --- | --- |
| **Node.js LTS** | `node -v` | Pilih versi LTS, bukan "Current". |
| **npm** | `npm -v` | Ikut terpasang bersama Node. |
| **Git** | `git --version` | Windows: pakai Git for Windows (sudah termasuk Git Bash). |
| **VS Code** | buka dari terminal: `code .` | Pastikan `code` dikenali (centang "Add to PATH" saat instalasi). |
| **Ekstensi VS Code** | lihat panel Extensions | Minimal: ESLint, Prettier, GitLens, Error Lens. |
| **Akun GitHub** | buka profilmu di browser | Siapkan juga foto/username yang rapi (ini portofolio publik). |

## Latihan

Latihan fase ini bersifat **praktik langsung**, bukan tulis-menulis panjang. Semua dikerjakan di terminal/VS Code, lalu di-commit.

1. **Terminal gymnastics** — dari folder kosong, buat struktur `latihan/`, `latihan/sub/`, pindah-pindah direktori, buat 3 file, tampilkan isinya dengan `cat`, lalu hapus satu. Lakukan tanpa menyentuh mouse.
2. **Git pertama dari nol** — buat folder `latihan-git/`, jalankan `git init`, buat `catatan.md`, `git add`, `git commit -m "docs: catatan pertama"`, lalu `git log`. Ulangi dengan 3 commit berbeda topik.
3. **Baca status, bukan menebak** — ubah satu file, jalankan `git status` dan `git diff` sebelum `add`. Biasakan **selalu** melihat status sebelum commit.
4. **Tulis pesan commit yang baik** — ambil 5 perubahan acak, tulis pesan commit Conventional Commits untuk masing-masing. Diskusikan dengan mentor mana yang paling jelas.
5. **Repo pertama di GitHub** — push `latihan-git/` ke GitHub sebagai repo publik, lalu `clone` ulang ke folder lain dan pastikan isinya sama.

> Aturan: **ketik perintahnya sendiri**, jangan copy-paste. Tujuan latihan ini membangun otot ingatan, bukan sekadar menyelesaikan tugas.

## Project

Project fase ini adalah **repo `learning-journey` ini sendiri** — dan itu bukan project "kecil", karena repo ini akan jadi rumahmu selama 4 bulan.

Yang harus kamu lakukan:

1. **Push repo `learning-journey` ke GitHub** milikmu (repo publik).
2. **Buat commit pertama** yang bermakna, misalnya:
   ```bash
   git add .
   git commit -m "docs: inisialisasi kurikulum learning-journey"
   ```
3. **Isi `docs/PROGRESS.md`**: catat tanggal mulai, target, dan refleksi hari pertama (3 baris: apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanyakan).
4. **Biasakan alur branch** sejak hari pertama (walaupun fase ini sederhana):
   ```bash
   git checkout -b phase-00/setup-awal
   # ...kerjakan...
   git add .
   git commit -m "chore(phase-00): setup tooling dan catatan awal"
   git push -u origin phase-00/setup-awal
   # buka Pull Request di GitHub, self-review, lalu merge ke main
   ```

Kriteria yang dinilai mentor:

- Repo ada di GitHub, publik, dan bisa di-clone orang lain.
- Riwayat commit rapi (bukan satu commit raksasa "update").
- `docs/PROGRESS.md` terisi, bukan template kosong.
- Bisa menjelaskan **kenapa** setiap perintah Git yang kamu pakai dipakai.

## Checklist Kelulusan

Fase ini **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-01 sebelum ini selesai.

**Mindset**

- [ ] Menulis satu paragraf tujuan karier dan target 4 bulanmu (di `docs/PROGRESS.md`).
- [ ] Bisa menjelaskan *growth mindset* dengan contoh nyata dari pengalamanmu sendiri.
- [ ] Berkomitmen pada aturan: minta *hint*, bukan jawaban; jelaskan konsep dengan kata sendiri.

**Tooling**

- [ ] `node -v` dan `npm -v` mengeluarkan versi (Node LTS).
- [ ] `git --version` jalan, dan `git config --list` menampilkan `user.name` + `user.email` yang benar.
- [ ] VS Code terpasang dengan ekstensi minimal (ESLint, Prettier, GitLens, Error Lens).
- [ ] Bisa membuka folder di VS Code dari terminal dengan `code .`.

**Terminal**

- [ ] Bisa membuat, memindah, menghapus, dan membaca file/folder lewat terminal tanpa ragu.
- [ ] Paham beda path relatif (`./`, `../`) dan path absolut.

**Git & GitHub**

- [ ] Repo `learning-journey` ada di GitHub dan bisa di-clone.
- [ ] Bisa menjelaskan model **tiga zona Git** (working → staging → repo) dengan kata sendiri.
- [ ] Melakukan **minimal 5 commit** dengan pesan Conventional Commits yang jelas.
- [ ] Melakukan satu alur lengkap: branch → commit → push → Pull Request → self-review → merge.

**Refleksi**

- [ ] Menulis catatan hari pertama di `docs/PROGRESS.md`.
- [ ] Menuliskan 1 hal yang masih membingungkan tentang Git/terminal untuk didiskusikan di fase berikutnya.

## Referensi

- **Node.js — Download**: <https://nodejs.org/en/download> (pilih versi **LTS**).
- **Git — Downloads**: <https://git-scm.com/downloads> (Windows: Git for Windows, sudah termasuk Git Bash).
- **Pro Git (buku gratis)**: <https://git-scm.com/book/id/v2> (bab 1–2 untuk dasar; bab 2 menjelaskan tiga zona Git).
- **GitHub Docs — Hello World**: <https://docs.github.com/en/get-started/start-your-journey/hello-world> (panduan repo & PR pertama).
- **VS Code — Setup**: <https://code.visualstudio.com/docs/setup/setup-overview>.
- **Conventional Commits**: <https://www.conventionalcommits.org/en/v1.0.0/> (format pesan commit yang dipakai repo ini).
- **MDN — Command line crash course**: <https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line> (terminal untuk pemula).
- **Mindset (Carol Dweck) — ringkasan konsep**: cari "growth mindset vs fixed mindset"; fokus pada gagasan bahwa kemampuan bisa dilatih.

> Catatan: jangan menghabiskan berhari-hari mengutak-atik tema editor atau plugin. Setup selesai saat *checklist kelulusan* di atas tercentang. Sisa energi untuk belajar, bukan mengonfigurasi.
