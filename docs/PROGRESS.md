# 📈 Log Progres — Learning Journey

File ini adalah buku harian belajar. Tujuannya bukan pamer, tetapi **membuat proses berpikir terlihat**:
apa yang dikerjakan, apa yang masih bingung, dan bagaimana akhirnya terpecahkan.

> Aturan sederhana: tulis jujur. "Masih bingung soal X" adalah catatan yang lebih berharga
> daripada "hari ini lancar" tanpa isi.

---

## 📅 Tabel Log Harian

| Tanggal | Fase | Topik | Yang dibuat | Yang masih bingung | Link commit/PR |
|---------|------|-------|-------------|--------------------|----------------|
| 2026-10-05 | 00–01 | Setup repo + Git workflow | Repo `learning-journey`, kurikulum 11 fase, PR #1 | Alur PR sudah jelas | `bd792e6`, PR #1 |
| 2026-10-05 | 01 | Value vs reference (menyalin nilai vs alamat) | `latihan.js` + `pembahasan.md` | — (sudah paham setelah 3x penjelasan) | `96400cb`, PR #1 |

<!-- isi tiap selesai sesi belajar -->

**Cara mengisi:** tambahkan satu baris setiap selesai sesi belajar. Untuk kolom *Link commit/PR*,
cukup tulis pesan commit atau tautan PR (mis. `#12`).

---

## 🗓️ Jurnal Mingguan (Template)

Copy blok di bawah setiap akhir minggu. Isi apa adanya.

```markdown
### Minggu ke-<N> — <tanggal mulai> s/d <tanggal selesai>

**Fase yang dikerjakan:** `phase-XX-...`

**Target minggu ini:**
- [ ] <target 1>
- [ ] <target 2>

**Yang berhasil diselesaikan:**
- <poin 1>
- <poin 2>

**Yang belum selesai / tertunda:**
- <poin>

**Jam belajar total:** <mis. 22 jam>

**Tingkat pemahaman (1–5):** <angka> — <alasan singkat>
```

Contoh terisi (sebagai gambaran, hapus saat memakai template):

```markdown
### Minggu ke-1 — 2026-10-05 s/d 2026-10-11

**Fase yang dikerjakan:** `phase-00-setup`

**Target minggu ini:**
- [x] Setup repo & Git
- [x] Menulis log progres pertama

**Yang berhasil diselesaikan:**
- Paham alur branch → commit → push → PR → merge
- Bisa menulis Conventional Commit tanpa melihat cheatsheet

**Yang belum selesai / tertunda:**
- Belum berlatih menyelesaikan merge conflict

**Jam belajar total:** 21 jam

**Tingkat pemahaman (1–5):** 4 — alur Git sudah lancar, tinggal biasakan.
```

---

## 🪞 Refleksi (Template)

Refleksi ditulis **bukan setiap hari**, tetapi saat ada momen penting: selesai satu fase,
menemukan bug yang memakan waktu lama, atau saat merasa stuck.

```markdown
### Refleksi — <tanggal>

**Apa yang sedang saya kerjakan?**


**Apa yang awalnya saya pikir saya paham, ternyata belum?**


**Kesalahan / bug terbesar minggu ini, dan akar penyebabnya?**


**Konsep yang sekarang benar-benar saya paham (jelaskan pakai kata sendiri):**


**Pertanyaan yang belum terjawab (untuk ditanyakan ke mentor):**


**Satu hal yang akan saya ubah dari cara belajar saya:**

```

Contoh terisi:

```markdown
### Refleksi — 2026-10-11

**Apa yang sedang saya kerjakan?**
Menutup `phase-00-setup`, mulai masuk `phase-01-fundamentals`.

**Apa yang awalnya saya pikir saya paham, ternyata belum?**
Saya pikir `const` berarti nilainya tidak bisa berubah. Ternyata untuk object/array,
isinya masih bisa diubah — yang tidak berubah adalah *binding*-nya.

**Kesalahan / bug terbesar minggu ini, dan akar penyebabnya?**
Push ditolak karena branch lokal tertinggal dari remote. Akarnya: saya lupa `git pull`
sebelum mulai kerja di branch itu.

**Konsep yang sekarang benar-benar saya paham (jelaskan pakai kata sendiri):**
Reference vs value: variabel yang menyimpan object sebenarnya menyimpan *alamat* ke data,
bukan datanya. Jadi dua variabel bisa menunjuk ke object yang sama.

**Pertanyaan yang belum terjawab (untuk ditanyakan ke mentor):**
Kapan lebih baik memakai `git rebase` daripada `git merge`?

**Satu hal yang akan saya ubah dari cara belajar saya:**
Selalu `git pull` dulu sebelum mulai sesi belajar di branch yang sudah ada.
```

---

## ✅ Checklist Rutin

Biasakan hal-hal kecil ini agar progres tetap terlihat:

- [ ] Catat satu baris di tabel log setiap selesai sesi belajar.
- [ ] Tulis jurnal mingguan setiap akhir minggu.
- [ ] Tulis refleksi setiap selesai satu fase.
- [ ] Pastikan setiap fase punya branch + Pull Request sendiri.
- [ ] Perbarui **Progress Tracker** di `README.md` saat fase berganti status.
