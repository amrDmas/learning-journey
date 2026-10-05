# How to Learn — Metode Belajar Repo Ini

> Dokumen ini menjelaskan **cara** belajar di `learning-journey`, bukan **apa** yang dipelajari.
> Baca sekali di awal, lalu kembali ke sini setiap kali kamu merasa "sudah nonton tapi belum bisa".
>
> Target pembaca: Dimas — paham dasar JS/TS, tapi sering merasa *"kode jalan tapi aku tidak paham kenapa"*.

---

## Daftar Isi

1. [Kenapa "tutorial hell" gagal](#1-kenapa-tutorial-hell-gagal)
2. [Cara membangun mental model](#2-cara-membangun-mental-model)
3. [Loop belajar 6 langkah](#3-loop-belajar-6-langkah)
4. [Cara bertanya yang baik ke mentor](#4-cara-bertanya-yang-baik-ke-mentor)
5. [Cara menerima code review](#5-cara-menerima-code-review)
6. [Definition of Done per topik](#6-definition-of-done-per-topik)
7. [Latihan recall (spaced repetition sederhana)](#7-latihan-recall-spaced-repetition-sederhana)
8. [Debug sebagai kebiasaan](#8-debug-sebagai-kebiasaan)
9. [Mengelola waktu 4 jam/hari](#9-mengelola-waktu-4-jamhari)
10. [Anti-pattern](#10-anti-pattern)
11. [Cara mengukur kemajuan](#11-cara-mengukur-kemajuan)

---

## 1. Kenapa "tutorial hell" gagal

**Tutorial hell** adalah kondisi ketika kamu menonton/mengikuti tutorial terus-menerus,
semuanya terasa masuk akal saat ditonton, tapi begitu diminta membuat sesuatu dari nol —
kosong. Kamu tahu **cara mengetik** kodenya, tapi tidak tahu **kenapa** kode itu ada di situ.

Kenapa ini terjadi? Karena menonton tutorial melatih **pengenalan** (recognition),
bukan **pemanggilan kembali** (recall) dan bukan **produksi** (generation).

| Aktivitas | Yang dilatih | Hasil setelah 1 bulan |
|---|---|---|
| Nonton tutorial | Pengenalan | "Aku pernah lihat ini" |
| Nonton + ikut ketik | Pengenalan + sedikit motorik | Bisa ulangi kalau tutorialnya ada |
| Nonton + tutup + tulis dari nol | Recall + produksi | Bisa bikin sendiri tanpa tutorial |
| Tulis dari nol + jelaskan ke orang lain | Pemahaman (Feynman) | Bisa mengajarkan & mengadaptasi |

Tiga jebakan utama yang membuat tutorial hell bertahan:

1. **Illusion of competence.** Saat tutorial berjalan, otakmu memproses kode sebagai
   "masuk akal" — dan itu terasa seperti "aku sudah paham". Rasa itu palsu. Memahami
   saat dibimbing ≠ bisa memproduksi sendiri.
2. **Tidak ada gesekan (friction).** Tutorial menghapus semua keputusan sulit:
   nama variabel, struktur file, error handling, kenapa pakai `map` bukan `for`.
   Gesekan itulah tempat belajar yang sebenarnya.
3. **Tidak ada kegagalan terkontrol.** Tanpa error yang kamu perbaiki sendiri, kamu
   tidak membangun intuisi debugging — dan debugging adalah 50% pekerjaan developer.

**Kesimpulan operasional untuk repo ini:** tutorial hanya **sumber referensi**, bukan
metode belajar. Metode belajarnya adalah **menulis kode dari nol, diprediksi dulu,
lalu dijelaskan ulang**. Detailnya di bawah.

---

## 2. Cara membangun mental model

Mental model adalah **gambaran di kepalamu tentang apa yang terjadi di balik kode**.
Developer yang kuat tidak menghafal solusi — mereka menjalankan simulasi di kepala:
"kalau fungsi ini dipanggil, apa yang masuk ke call stack? variabel ini menunjuk ke
objek yang sama atau salinan?"

Mental model dibangun lewat siklus pendek berulang:

```
PREDIKSI  →  JALANKAN  →  JELASKAN
   ↑                            │
   └────────  ulangi  ──────────┘
```

### 2.1 Prediksi

Sebelum menjalankan kode (atau sebelum menekan Run), **tulis di komentar** apa yang
kamu kira akan terjadi. Contoh:

```js
function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const c1 = makeCounter();
const c2 = makeCounter();

// PREDIKSI: c1() -> 1, c1() -> 2, c2() -> 1
// ALASAN: tiap makeCounter() membuat scope `count` baru (closure)
console.log(c1(), c1(), c2());
```

Kalau prediksimu salah, **itulah pelajaran paling berharga hari itu** — bukan momen
memalukan. Selisih antara prediksi dan kenyataan = tepat di mana mental modelmu bolong.

### 2.2 Jalankan

Jalankan kode dan bandingkan dengan prediksimu. Perhatikan bukan hanya output,
tapi juga:

- **Urutan** eksekusi (kapan tiap baris jalan?)
- **Nilai** di tengah jalan (pakai `console.log` atau debugger)
- **Identitas** (apakah dua variabel menunjuk objek yang sama? cek dengan `===`)

### 2.3 Jelaskan

Tutup editor, lalu jelaskan dengan **kata-katamu sendiri** — ke mentor, ke catatan,
atau ke kursi khayalan. Aturan: kalau kamu tidak bisa menjelaskannya tanpa membaca kode,
kamu belum paham. Teknik ini disebut **Feynman technique**:

1. Tulis nama konsep di atas kertas.
2. Jelaskan seolah ke anak SMA.
3. Tandai bagian yang bikin kamu macet → itu lubang pemahamanmu.
4. Kembali ke materi hanya untuk lubang itu.
5. Ulangi sampai lancar.

### 2.4 Peta mental model inti (dipakai berulang di semua fase)

Konsep-konsep ini akan muncul lagi dan lagi. Setiap kali muncul, perkuat modelnya:

| Konsep | Pertanyaan kunci yang harus bisa kamu jawab |
|---|---|
| Call stack | Fungsi mana yang sedang berjalan sekarang? Apa yang menunggu di bawahnya? |
| Reference vs value | Ini menunjuk ke objek yang sama, atau menyalin isinya? |
| Scope & closure | Variabel ini "milik" siapa? Siapa saja yang masih bisa mengaksesnya? |
| Event loop | Kode ini masuk ke call stack, microtask, atau macrotask? Kapan dijalankan? |
| Async/await | Apa yang terjadi pada stack saat `await` dipanggil? |
| Immutability | Apakah aku mengubah data lama, atau membuat yang baru? |

---

## 3. Loop belajar 6 langkah

Ini adalah **satu-satunya loop** yang dipakai repo ini. Setiap topik = satu putaran penuh.
Jangan lompat langkah. Loop ini lambat di awal, tapi membuat kamu tidak pernah "lupa total".

```
┌───────────────────────────────────────────────────────────────┐
│  1. MENTOR MENJELASKAN   →  kenapa-nya dulu, baru caranya      │
│  2. MURID MEMPREDIKSI    →  tulis dugaan sebelum jalan         │
│  3. MURID MENULIS DARI NOL →  tanpa copy, tanpa lihat jawaban  │
│  4. MENTOR REVIEW        →  seperti senior dev review PR       │
│  5. MURID JELASKAN ULANG →  teknik Feynman, kata sendiri       │
│  6. PAKAI DI PROJECT     →  minimal satu pemakaian nyata       │
└───────────────────────────────────────────────────────────────┘
```

### Langkah 1 — Mentor menjelaskan (kenapa dulu, baru apa)

Mentor (Claude) menjelaskan **mental model** dulu: masalah apa yang dipecahkan konsep ini,
apa yang terjadi di memori/stack, trade-off-nya. Sintaks menyusul setelah "kenapa" jelas.

- Kamu **tidak wajib** langsung paham. Tapi kamu wajib tahu **pertanyaan apa** yang muncul.
- Catat pertanyaan. Ajukan di langkah 4.

### Langkah 2 — Murid memprediksi

Sebelum menulis kode, tulis di komentar (atau di chat) prediksimu:

```
// Yang aku kira akan terjadi: ...
// Karena: ...
```

Ini memaksa otak bekerja aktif, bukan pasif.

### Langkah 3 — Murid menulis kode dari nol

Aturan keras:

- **Tutup** tab tutorial/Stack Overflow/dokumentasi jawaban.
- Tulis dari file kosong. Boleh buka dokumentasi **API** (nama fungsi, tanda tangan), tapi
  jangan menyalin solusi utuh.
- Kalau macet: **jeda 10 menit** (istirahat singkat, jangan tanya dulu) untuk menulis
  hipotesis dan mencoba sendiri. Baru bertanya setelah **~30 menit** macet tanpa kemajuan
  (lihat [bagian 4.3](#43-kapan-tidak-bertanya-dulu) dan [bagian 9.3](#93-aturan-waktu-yang-menyelamatkan)).
- Simpan usahamu yang gagal sebagai komentar — itu bukti proses, bukan sampah.

### Langkah 4 — Mentor review (seperti senior dev)

Kirim kodemu. Mentor akan mereview: kebenaran, keterbacaan, penamaan, edge case,
dan **mental model yang bocor**. Lihat [bagian 5](#5-cara-menerima-code-review) untuk
cara menerimanya dengan sehat.

### Langkah 5 — Murid menjelaskan ulang (Feynman)

Tanpa melihat kode, jelaskan:

- Apa masalahnya?
- Kenapa solusimu begini, bukan begitu?
- Apa yang terjadi di runtime?
- Kapan solusi ini **salah** (batasannya)?

Kalau ada bagian yang kamu "tahu tapi tak bisa dijelaskan", ulangi langkah 1 untuk bagian itu saja.

### Langkah 6 — Pakai di project

Topik belum selesai sampai dipakai di **project nyata** (lihat folder project per fase,
mis. `cli-data-tool` untuk fase 01). Pemakaian nyata memunculkan masalah yang tidak
ada di latihan: input aneh, data besar, error tak terduga.

> **Aturan 1 topik 1 putaran:** jangan menumpuk 5 topik lalu berharap paham di akhir.
> Selesaikan putaran per topik kecil.

---

## 4. Cara bertanya yang baik ke mentor

Pertanyaan buruk membuang waktumu dan mentor. Pertanyaan baik **mempercepat** pemahaman
karena memaksa kamu berpikir dulu.

### 4.1 Formula bertanya (4 bagian)

```
1. TUJUAN   : aku sedang mencoba apa?
2. USAHA    : yang sudah aku coba (dengan hasilnya)
3. HASIL    : yang terjadi vs yang aku harapkan
4. PERTANYAAN: apa yang sebenarnya aku tidak paham?
```

Contoh **buruk**:

> "Kenapa kodeku error?"

Contoh **baik**:

> **Tujuan:** mencoba mengubah array objek jadi array nama pakai `map`.
> **Usaha:** aku coba `data.map(d => d.nama)`, hasilnya `[undefined, undefined]`.
> **Hasil:** aku harap `['Budi', 'Sari']`, yang keluar `undefined`. Aku cek `data[0]`
> dan field-nya bernama `name`, bukan `nama`.
> **Pertanyaan:** apakah aku boleh bertanya *kenapa* `map` mengembalikan `undefined`
> alih-alih error, dan kapan pola ini berbahaya?

### 4.2 Aturan bertanya

- **Sertakan kode minimal** yang bisa direproduksi (bukan seluruh file).
- **Sertakan pesan error lengkap** + barisnya. Jangan diringkas.
- **Sebutkan yang sudah dicoba** — mentor tidak akan mengulang saran yang sudah gagal.
- **Tanya "kenapa", bukan hanya "bagaimana".** `"Bagaimana cara memperbaikinya?"`
  menyelesaikan hari ini; `"Kenapa ini terjadi?"` menyelesaikan 10 masalah berikutnya.
- **Satu pertanyaan fokus per pesan** kalau bisa.
- **Boleh bilang "aku tidak tahu".** Itu data penting, bukan kelemahan.

### 4.3 Kapan TIDAK bertanya (dulu)

Sebelum bertanya, coba dulu (maksimal ~30 menit):

1. Baca ulang pesan error **kata per kata**.
2. `console.log` nilai di sekitar titik masalah.
3. Buat contoh **terkecil** yang masih error (isolasi variabel).
4. Cek dokumentasi resmi API yang dipakai.

Kalau setelah itu masih macet — bertanya itu keputusan yang benar, bukan kegagalan.

---

## 5. Cara menerima code review

Code review di repo ini meniru review senior dev di kerja nyata. Tujuannya **bukan**
menghakimi kamu, tapi melatih kebiasaan yang membuat kode bisa dipercaya orang lain.

### 5.1 Sikap yang benar

- **Pisahkan dirimu dari kodemu.** Kritik pada kode bukan kritik pada dirimu.
- **Review adalah percepatan, bukan gerbang.** Developer yang "benar sendiri" tumbuh 5x lebih lambat.
- **Pahami, jangan asal turuti.** Kalau kamu tidak setuju, jelaskan alasanmu — diskusi
  yang sehat justru tanda kamu berpikir.
- **Catat pola, bukan hanya perbaikan.** Kalau direview "penamaan kurang jelas" 3 kali,
  itu sinyal kebiasaan yang harus diubah, bukan bug satu kali.

### 5.2 Alur menerima review (per komentar)

```
1. BACA sampai paham     → jangan edit dulu
2. TANYA kalau ragu      → "kenapa pendekatan X lebih baik di sini?"
3. PUTUSKAN              → setuju / tidak setuju (dengan alasan)
4. PERBAIKI              → commit terpisah kalau besar
5. JELASKAN BALIK        → "aku ubah jadi Y karena ..." (bukti kamu paham)
```

### 5.3 Tingkatan komentar review (biar tidak salah tangkap)

| Label | Arti | Wajib diperbaiki? |
|---|---|---|
| `[blocker]` | Salah / rusak / berbahaya | Ya, sebelum merge |
| `[suggestion]` | Alternatif lebih baik | Pertimbangkan, boleh ditolak dengan alasan |
| `[nit]` | Detail kecil (penamaan, format) | Silakan, tidak wajib |
| `[question]` | Mentor ingin tahu alasanmu | Jawab dengan penjelasan |

---

## 6. Definition of Done per topik

Sebuah topik **belum selesai** hanya karena kodenya jalan. Pakai checklist ini.
Kalau ada satu yang belum, topik itu masih "setengah jadi".

### 6.1 Definition of Done (DoD) — semua topik

- [ ] **Bisa dijelaskan** dengan kata sendiri tanpa membaca kode (Feynman).
- [ ] **Bisa ditulis dari nol** dalam file kosong, tanpa menyalin.
- [ ] **Bisa memprediksi** output/error sebelum menjalankan.
- [ ] **Tahu batasannya** — kapan konsep ini **tidak** cocok dipakai.
- [ ] **Sudah dipakai** minimal sekali di project nyata (bukan hanya latihan).
- [ ] **Lolos review** mentor tanpa `[blocker]`.
- [ ] **Ada catatan** di jurnal: apa yang sulit, apa yang akhirnya kupahami.

### 6.2 Contoh DoD untuk topik "Closure"

| Kriteria | Bukti yang harus ada |
|---|---|
| Paham kenapa | Bisa jelaskan: closure = fungsi "mengingat" scope tempat ia dibuat |
| Bisa tulis dari nol | Bikin `makeCounter` / `once` / `memoize` dari file kosong |
| Bisa prediksi | Prediksi output kasus loop + closure sebelum jalan |
| Tahu batasan | Bisa sebut masalah memory leak kalau closure menahan referensi besar |
| Dipakai di project | Dipakai di `cli-data-tool` untuk state antar perintah |
| Lolos review | Tidak ada `[blocker]` |

> **Aturan emas:** kalau kamu tidak bisa mengajarkannya, kamu belum selesai. Ajarkan ke
> kursi khayalan, ke teman, atau tulis tutorial singkat untuk dirimu 1 bulan lalu.

---

## 7. Latihan recall (spaced repetition sederhana)

**Recall** (mengambil info dari kepala) jauh lebih kuat daripada **review** (membaca ulang).
Membaca ulang terasa mudah dan itu justru masalahnya — otak tidak dipaksa bekerja.

### 7.1 Cara sederhana (tanpa aplikasi)

Buat file `docs/journal/recall.md` (atau catatanmu sendiri) dengan satu baris per konsep:

```markdown
| Konsep          | Tanggal diajar | H+1 | H+3 | H+7 | H+21 |
|-----------------|----------------|-----|-----|-----|------|
| closure         | 2026-09-28     | ✅  |     |     |      |
| event loop      | 2026-09-29     | ✅  |     |     |      |
| reference value | 2026-09-29     | ✅  |     |     |      |
```

Jadwal tinjau (spacing): **H+1, H+3, H+7, H+21** setelah hari belajar.

Cara meninjau (jangan baca catatan dulu!):

1. Lihat nama konsepnya saja.
2. Dari ingatan, jelaskan 2-3 kalimat **tanpa membuka apa pun**.
3. Baru buka catatan, bandingkan. Tandai apa yang lupa.
4. Kalau lupa → jadwalkan tinjauan lebih cepat (mis. besok).

### 7.2 Aturan penting

- **Tulis pertanyaan, bukan jawaban.** Contoh kartu: "Kenapa `let` di dalam loop `for`
  menghasilkan nilai berbeda dari `var`?" — jawab dari ingatan.
- **Cukup 5-10 menit/hari.** Konsistensi mengalahkan durasi.
- **Tinjau konsep yang paling kamu benci.** Yang terasa "tidak nyaman" biasanya yang
  paling perlu dilatih.
- Kalau kamu sudah menjelaskan konsep ini ke mentor di Langkah 5, **itu sudah satu sesi recall**.
  Catat saja tanggalnya untuk tinjauan berikutnya.

---

## 8. Debug sebagai kebiasaan

Debug bukan bakat — ini **prosedur**. Developer pemula menebak-nebak dan mengubah kode
acak-acakan; developer kuat membentuk hipotesis lalu mengujinya. Latih prosedur ini
sampai jadi refleks.

### 8.1 Loop debug 5 langkah

```
1. BACA error          → kata per kata, termasuk nama file & baris
2. REPRODUKSI          → buat error muncul konsisten (minimal)
3. HIPOTESIS           → "aku kira penyebabnya X" (tulis!)
4. UJI                 → satu perubahan untuk menguji satu hipotesis
5. PERBAIKI & VERIFIKASI → pastikan error hilang DAN tidak muncul yang baru
```

### 8.2 Detail tiap langkah

**1. Baca error.** Pesan error JavaScript biasanya jujur dan spesifik.
- `TypeError: Cannot read properties of undefined (reading 'nama')` →
  ada sesuatu yang `undefined` dan kamu akses `.nama`-nya. Cari **yang mana**.
- `ReferenceError: x is not defined` → nama salah ketik atau scope salah.
- Jangan langsung Google error-nya. Baca dulu. Sering jawabannya sudah di situ.

**2. Reproduksi.** Error yang tidak bisa kamu munculkan ulang tidak bisa kamu perbaiki.
Kecilkan kodenya sampai tinggal 5-10 baris yang masih error.

**3. Hipotesis.** Tulis satu kalimat: *"Aku kira ini error karena ..."*. Ini memaksa
kamu berpikir, bukan menembak acak.

**4. Uji satu variabel.** Ubah **satu** hal, jalankan, lihat. Kalau kamu ubah 5 hal
sekaligus dan error hilang, kamu tidak tahu yang mana yang memperbaiki — kamu tidak belajar.

**5. Verifikasi.** Perbaikan bukan "error hilang", tapi "perilaku benar di kasus normal,
kasus kosong, dan kasus ekstrem". Cek `null`, array kosong, angka `0`, string kosong.

### 8.3 Alat debug yang dipakai (urutan dari paling sering)

| Alat | Kapan dipakai |
|---|---|
| Pesan error + stack trace | Selalu, langkah pertama |
| `console.log` bertanda | Cek nilai & urutan eksekusi |
| `console.log({ nama, umur })` | Cetak objek lengkap dengan label |
| Breakpoint di DevTools | Ketika ingin "berhenti" dan periksa seluruh state |
| `debugger;` di kode | Memicu breakpoint tanpa klik |
| Buat kasus terkecil | Ketika kode besar membingungkan |

### 8.4 Kebiasaan baik

- **Ubah mindset:** bug adalah informasi, bukan hukuman. Semakin cepat kamu menemukan bug,
  semakin murah diperbaiki.
- **Catat bug yang sulit** di jurnal: gejala, hipotesis salah, penyebab asli, pelajaran.
  Bug yang sama tidak akan menipumu dua kali.
- **Jangan debug dengan panik.** Kalau lebih dari 30 menit macet: berdiri, jalan 5 menit,
  kembali dengan hipotesis baru.
- **Baca stack trace dari atas ke bawah**, cari baris **kodemu** (bukan kode library).

---

## 9. Mengelola waktu 4 jam/hari

4 jam/hari itu ~28 jam/minggu — cukup untuk target ~4 bulan **kalau dipakai dengan struktur**.
Kuncinya: **blok waktu dengan satu tujuan**, bukan "belajar sambil buka 10 tab".

### 9.1 Prinsip

- **Deep work dulu.** 2 jam pertama untuk hal tersulit (materi baru, menulis kode dari nol).
  Otak paling tajam di awal sesi.
- **Satu blok = satu tujuan.** Jangan campur "nonton materi" dan "bikin fitur" dalam satu blok.
- **Batasi konsumsi, utamakan produksi.** Rasio sehat: **≤30% nonton/baca, ≥70% nulis/berpikir**.
- **Istirahat terjadwal.** Teknik Pomodoro (25 menit fokus + 5 menit istirahat) mencegah
  kelelahan. Setiap ~2 blok, istirahat lebih panjang (15-20 menit).
- **Tutup notifikasi** selama blok fokus. Multitasking memotong fokus dan menurunkan kualitas.

### 9.2 Contoh jadwal blok 4 jam

**Hari kerja materi baru (belajar + latihan):**

| Waktu | Blok | Aktivitas |
|---|---|---|
| 0:00–0:25 | Fokus 1 | Mentor menjelaskan konsep (kenapa dulu) — catat pertanyaan |
| 0:25–0:30 | Istirahat | Berdiri, minum |
| 0:30–1:00 | Fokus 2 | Prediksi + tulis kode dari nol (tanpa copy) |
| 1:00–1:15 | Istirahat | Jauh dari layar |
| 1:15–2:00 | Fokus 3 | Lanjut kode + debug sendiri (maks 30 menit macet baru tanya) |
| 2:00–2:30 | — | **Istirahat panjang / makan** |
| 2:30–3:15 | Fokus 4 | Kirim ke mentor, terima review, perbaiki |
| 3:15–3:20 | Istirahat | — |
| 3:20–4:00 | Fokus 5 | Jelaskan ulang (Feynman) + catat jurnal + recall H+1 |

**Hari project (implementasi):**

| Waktu | Blok | Aktivitas |
|---|---|---|
| 0:00–0:15 | Rencana | Tulis 1-3 tugas konkret hari ini (kecil & selesai) |
| 0:15–1:30 | Fokus | Kerjakan tugas 1 (kode dari nol) |
| 1:30–1:45 | Istirahat | — |
| 1:45–3:00 | Fokus | Kerjakan tugas 2 |
| 3:00–3:15 | Istirahat | — |
| 3:15–4:00 | Fokus | Git commit, tulis jurnal, siapkan pertanyaan untuk mentor |

### 9.3 Aturan waktu yang menyelamatkan

- **Aturan 30 menit:** macet >30 menit tanpa kemajuan → tulis pertanyaan (formula bagian 4),
  lanjut hal lain, atau tanya mentor. Jangan tenggelam.
- **Stop saat lelah, bukan saat selesai.** Materi yang dipaksakan saat otak habis
  menghasilkan kode yang tidak kamu pahami.
- **Sisakan 10 menit/hari** untuk jurnal + recall. Ini investasi terbesarmu jangka panjang.
- **Jangan hitung jam nonton sebagai jam belajar.** Hitung jam menulis kode & menjelaskan.
- **Satu hari libur per minggu** itu sehat, bukan kemalasan. Otak mengonsolidasi memori saat istirahat.

---

## 10. Anti-pattern

Ini pola yang **terlihat produktif** tapi menghambat. Kenali dan hentikan sejak awal.

| Anti-pattern | Kenapa berbahaya | Gantinya |
|---|---|---|
| **Copy-paste tanpa paham** | Kode jalan tapi kamu tidak bisa debug/ubah; utang pemahaman menumpuk | Tulis dari nol; kalau menyalin, ketik ulang baris per baris sambil jelaskan |
| **Nonton tanpa ngoding** | Melatih pengenalan, bukan produksi; ilusi kompetensi | Rasio ≥70% menulis kode; tutup video, tulis dari nol |
| **Tutorial berantai** | Pindah tutorial saat macet → tidak pernah menyelesaikan masalah sendiri | Selesaikan satu sumber sampai tuntas; macet = kesempatan debug |
| **Tidak pernah debug sendiri** | Bergantung pada orang; tidak membangun intuisi | Terapkan loop debug 5 langkah (bagian 8) |
| **Lompat fase** | Fondasi bolong → fase lanjut terasa mustahil | Ikuti urutan fase; tuntaskan checklist kelulusan |
| **Menumpuk topik tanpa praktik** | "Paham" saat dibaca, lupa seminggu kemudian | Loop 6 langkah per topik, pakai di project |
| **Menghindari topik sulit** | Kelemahan jadi makin mahal nanti | Tinjau konsep paling tidak nyaman lebih sering |
| **Tidak commit / commit besar sekali** | Kehilangan jejak belajar; PR tak bisa direview | Commit kecil & sering, pesan Conventional Commits |
| **Menyembunyikan kebingungan** | Mentor tidak bisa membantu titik yang salah | Tanya dengan formula 4 bagian; bilang "aku tidak tahu" |
| **Terlalu banyak tooling sebelum dasar** | Waktu habis di konfigurasi, bukan di konsep | Kuasai dasar dulu; tooling saat dibutuhkan |
| **Tidak menulis jurnal** | Kehilangan jejak progres & pola kesalahan | 10 menit/hari di `docs/journal/` |
| **Bekerja di `main` langsung** | Tidak melatih alur PR yang dipakai kerja nyata | Selalu branch `phase-NN/nama-singkat` → PR → self-review → merge |

---

## 11. Cara mengukur kemajuan

Kemajuan **bukan** "sudah nonton 20 video" atau "sudah baca 3 buku". Ukur dengan
**bukti kemampuan**, bukan waktu yang dihabiskan.

### 11.1 Tiga sinyal kemajuan

1. **Checklist kelulusan fase** (di `phase-XX/README.md`) — semua kotak tercentang.
2. **Definition of Done per topik** (bagian 6) — tiap topik lulus semua kriteria.
3. **Jurnal** — catatan harian usaha, kebingungan, dan pelajaran.

### 11.2 Jurnal belajar

Buat `docs/journal/YYYY-MM-DD.md` (atau satu file `docs/journal/log.md`). Isi minimal 3 baris:

```markdown
## 2026-10-05 — closure & scope

- **Belajar:** closure, kenapa fungsi "mengingat" scope tempat ia dibuat
- **Sulit:** awalnya bingung kenapa `var` di loop beri nilai akhir, `let` beri per iterasi
- **Bukti:** bikin `makeCounter` & `once` dari nol, lolos review tanpa blocker
- **Besok:** event loop — macrotask vs microtask
- **Recall H+1:** closure ✅
```

Jurnal memberi tiga hal: **jejak progres**, **pola kebingungan** (kalau "async" muncul
5 kali sebagai sulit, itu prioritas), dan **bukti belajar** untuk dirimu sendiri saat
merasa "tidak berkembang".

### 11.3 Tanda kamu benar-benar maju

- Kamu bisa **memprediksi** output lebih sering daripada menebak.
- Kamu **menemukan bugmu sendiri** lebih cepat daripada sebelumnya.
- Kamu bisa **menjelaskan konsep lama** dengan lancar saat recall.
- Kamu **tidak butuh tutorial** untuk membuat fitur kecil yang mirip-mirip.
- Kamu mulai **bertanya "kenapa"** alih-alih "bagaimana caranya".
- Kamu nyaman **membaca kode orang lain** dan menjelaskan alurnya.

### 11.4 Tanda kamu stagnan (waspada)

- Menulis kode tapi tidak bisa menjelaskannya → balik ke Langkah 5 (Feynman).
- Merasa produktif tapi tidak ada commit/PR → cek anti-pattern (bagian 10).
- Sering copy dari tutorial → ulangi Langkah 3 (tulis dari nol).
- Fase jalan lambat karena satu topik → tinjau ulang mental model, tanya mentor dengan formula 4 bagian.

### 11.5 Ritme pengecekan

| Frekuensi | Yang dilakukan |
|---|---|
| Harian | Isi jurnal (3 baris) + recall H+1/H+3/H+7/H+21 |
| Mingguan | Cek checklist fase: apa yang sudah/belum; rencanakan minggu depan |
| Per fase | Pastikan semua kotak `Checklist Kelulusan` di `phase-XX/README.md` tercentang sebelum lanjut |
| Per project | Pastikan project jalan, ada README, dan ada bukti di Git history |

> **Ingat:** yang membuatmu job-ready bukan jumlah materi yang dilihat, tapi jumlah
> **masalah nyata yang kamu selesaikan sendiri** dan **bisa kamu jelaskan**.

---

## Ringkasan satu halaman

- Tutorial = referensi, bukan metode. **Metode = prediksi → jalankan → jelaskan.**
- Setiap topik lewat **loop 6 langkah**; tidak ada langkah yang dilompati.
- **Tulis dari nol.** Kalau tidak bisa, kamu belum paham.
- **Tanya dengan 4 bagian:** tujuan, usaha, hasil, pertanyaan. Tanya "kenapa".
- Review itu **percepatan**, bukan gerbang. Pisahkan dirimu dari kodemu.
- **Definition of Done:** bisa jelaskan, bisa tulis dari nol, tahu batasan, dipakai di project.
- **Recall** H+1/H+3/H+7/H+21 mengalahkan baca ulang.
- Debug = prosedur 5 langkah, bukan tebak-tebakan.
- 4 jam = blok waktu bertujuan; **≥70% menulis kode**, ≤30% nonton.
- Hentikan anti-pattern sejak awal; ukur kemajuan dengan **bukti kemampuan + jurnal**.

Selamat belajar — yang penting bukan cepat, tapi **tidak pernah kembali ke tutorial hell**.
