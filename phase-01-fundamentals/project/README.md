# Project Brief — `cli-data-tool`

> Bagian dari [Phase 01 — JavaScript & TypeScript Fundamentals](../README.md) | Repo: **terpisah** (`cli-data-tool`) | Prasyarat: sudah mengerjakan note 01–05, plus note 07 (error handling) sebelum Milestone 4 dan note 06 (TypeScript) sebelum Milestone 6
>
> **Ini bukan tutorial.** Ini *brief* (spesifikasi + kriteria penilaian). Kamu yang menulis kodenya dari nol. Mentor tidak menyediakan kode implementasi — hanya review.

---

## 1. Ringkasan Project

`cli-data-tool` adalah aplikasi **command-line (CLI)** untuk **membaca, mengolah, dan mengonversi data** dari file **CSV** dan **JSON** — **tanpa framework apa pun**.

- **Runtime:** Node.js
- **Bahasa:** TypeScript (`strict`)
- **Cara jalan:** dijalankan dari terminal, mis. `npx tsx src/index.ts ...` atau lewat script npm
- **Dilarang:** React, Express, database, ORM, library CSV/JSON pihak ketiga, atau apa pun yang "menyembunyikan" logika. Semua parsing, filtering, sorting, dan konversi **kamu tulis sendiri** memakai JS/TS standar.

**Kenapa tanpa framework?** Supaya kamu berhadapan langsung dengan *mental model* — file I/O, async, manipulasi data, error handling, dan tipe — bukan dengan API framework. Framework akan datang di fase berikutnya; di sini kita bangun fondasinya.

**Bentuk akhirnya (ilustrasi pemakaian, bukan kode):**

```bash
# baca file dan tampilkan isinya sebagai tabel di terminal
npx tsx src/index.ts show --file fixtures/employees.csv

# filter baris, lalu urutkan
npx tsx src/index.ts filter --file fixtures/employees.csv --where "role=engineer" --sort "salary:desc"

# agregasi: hitung jumlah & rata-rata per grup
npx tsx src/index.ts aggregate --file fixtures/employees.csv --group-by role --sum salary --avg salary

# konversi CSV -> JSON (tulis ke file atau ke stdout)
npx tsx src/index.ts convert --file fixtures/employees.csv --to json --out output/employees.json
```

> Nama command dan flag di atas **boleh kamu sesuaikan**, selama kamu dokumentasikan di README project dan konsisten. Yang dinilai adalah perilaku dan kualitas kode, bukan hafalan nama flag.

---

## 2. Skill yang Dilatih (Pemetaan ke Note 01–07)

Setiap milestone sengaja dipetakan ke note, supaya project ini benar-benar **memakai** materi yang kamu pelajari — bukan sekadar menumpuk fitur.

| Note | Topik | Dipakai di project untuk... |
| --- | --- | --- |
| **01** | Execution model: call stack & execution context, memory (stack vs heap), primitive vs reference, scope & lexical scope, hoisting/TDZ, closure | Memahami kenapa hasil filter/sort tidak boleh memutasi data asli; membuat salinan yang benar sebelum mengubah; membaca stack trace saat CLI error |
| **02** | Types & coercion: tipe primitif vs object, `==` vs `===`, coercion, truthy/falsy, `NaN`, presisi `Number` | Memahami kenapa `'10'` bukan angka, kenapa hasil baca CSV semua string, dan kapan perlu konversi eksplisit |
| **03** | Functions & `this`: function sebagai nilai, higher-order function, callback, pure function, aturan `this` | Menulis fungsi olah data yang menerima fungsi lain (mis. comparator untuk sort, predicate untuk filter) |
| **04** | Collections & immutability: array methods (`map`/`filter`/`reduce`), chaining, immutable update, destructuring, spread/rest | Inti pengolahan data: filter, sort, agregasi, transformasi baris CSV menjadi object |
| **05** | Async & event loop: Promise, combinator, `async`/`await`, microtask vs macrotask, error async | Membaca file secara async (`fs/promises`), menunggu urutan operasi, menangani error async dengan benar |
| **06** | TypeScript mental model: inference, narrowing, `unknown` vs `any`, generics, utility types | Memberi tipe pada data yang dibaca (yang aslinya "tidak diketahui"), menghindari `any`, membuat fungsi reusable yang type-safe |
| **07** | Errors & debugging: `try`/`catch`/`finally`, `throw`, custom error, error propagation, membaca stack trace, logging | Error handling yang ramah, jenis error sendiri, pesan konsisten, debugging CLI |

> Sebagian besar milestone dipetakan ke note; untuk topik yang belum ada note-nya (mis. Vitest di Milestone 5), ikuti tautan referensi di bagian 10.

> Kalau di tengah project kamu merasa "ini butuh note yang belum kubaca", **berhenti dan baca note-nya dulu**. Itu tanda pemetaan di atas bekerja.

---

## 3. Requirement Fungsional Bertahap

Kerjakan **berurutan**. Jangan lompat ke milestone berikutnya sebelum yang sekarang lulus review. Setiap milestone = satu branch + satu Pull Request (lihat bagian 7).

### Milestone 1 — Baca file & tampilkan

**Tujuan:** CLI bisa membuka file dan menampilkan isinya. Melatih file I/O async + parsing dasar.

- Menerima path file lewat argumen CLI (mis. `--file <path>`).
- Mendukung minimal **dua format**: `.csv` dan `.json`.
- **CSV:** baris pertama = header (nama kolom); baris berikutnya = data. Pisahkan dengan koma. (Anggap sederhana: belum perlu menangani koma di dalam tanda kutip — catat sebagai batasan di README. Jika di Milestone 3 kamu mulai menulis CSV dengan mengutip nilai, parser ini **harus ikut diperbarui** untuk membaca field berkutip.)
- **JSON:** file berisi array of object (mis. `[{ "nama": "...", "umur": 30 }, ...]`).
- Tampilkan hasil sebagai **tabel rapi** di terminal (kolom sejajar; boleh pakai padding manual).
- Tampilkan jumlah baris yang berhasil dibaca.

**Selesai bila:** menjalankan `show --file fixtures/employees.csv` dan `show --file fixtures/employees.json` menampilkan data yang sama secara wajar.

### Milestone 2 — Filter, sort, agregasi

**Tujuan:** Ini inti pengolahan data. Melatih `filter`/`sort`/`reduce` dan immutable update.

- **Filter:** `--where "kolom=nilai"` (minimal dukung pencocokan string & angka). Boleh tambah `!=`, `>`, `<` sebagai nilai tambah.
- **Sort:** `--sort "kolom:asc"` atau `--sort "kolom:desc"`. Harus benar untuk **angka** (bukan urutan string) dan **string**.
- **Agregasi:** minimal dukung:
  - `count` (jumlah baris),
  - `sum` dan `avg` untuk kolom numerik,
  - `min` dan `max`,
  - `--group-by <kolom>` (mis. rata-rata gaji per role).
- **Aturan penting:** semua operasi **tidak boleh memutasi** array data asli. Kalau kamu menyalin, pahami bedanya *shallow* vs *deep* copy (note 01 & 04).
- Filter + sort + agregasi boleh **dirangkai** dalam satu perintah.

**Selesai bila:** hasil `aggregate --group-by role --avg salary` dihitung benar, dan kamu bisa menjelaskan kenapa data asli tidak berubah.

### Milestone 3 — Konversi format CSV ⇄ JSON

**Tujuan:** Melatih transformasi data dua arah + penulisan file.

- `convert --file <input> --to <csv|json> [--out <path>]`.
- **CSV → JSON:** hasil array of object. Konversi ke `number` hanya bila **seluruh nilai kolom berupa angka dan tidak berawalan nol**; selain itu biarkan string (agar kode seperti `"00123"` tidak berubah jadi `123`).
- **JSON → CSV:** header dari union semua key; nilai yang hilang ditulis kosong.
- Kalau `--out` diberikan, tulis ke file; kalau tidak, cetak ke **stdout** (agar bisa di-pipe).
- Escaping minimal: kalau nilai mengandung koma/tanda kutip/baris baru, kutip dengan benar. **Jika kamu mengutip nilai saat menulis CSV, parser di Milestone 1 harus ikut diperbarui** untuk membaca field berkutip (RFC 4180 sederhana). Jika tidak, nyatakan batasan bahwa round-trip hanya dijamin untuk data yang tidak mengandung delimiter/tanda kutip di dalam nilai, dan uji round-trip hanya pada fixture tanpa karakter tersebut.

**Selesai bila:** `csv → json → csv` menghasilkan data yang ekuivalen (round-trip) **sesuai aturan di atas**, dan hasilnya valid dibuka tool lain (mis. editor/spreadsheet). Sertakan fixture yang mencakup kolom berawalan nol untuk menguji batas konversi numerik.

### Milestone 4 — Error handling & validasi input

**Tujuan:** Reliability. Program tidak boleh crash tanpa pesan yang berguna. (Ini bagian penting dari JD.)

- **Validasi argumen:** command/flag tidak dikenal, flag wajib kosong, nilai `--sort` salah format → tampilkan pesan **jelas + contoh pemakaian**, lalu keluar dengan **exit code ≠ 0**.
- **Validasi file:** file tidak ada, bukan file, tanpa izin baca → pesan ramah, bukan stack trace mentah.
- **Validasi isi:** CSV tanpa header, CSV dengan jumlah kolom tak konsisten, JSON yang bukan array of object → beri pesan yang menunjukkan **baris/kolom bermasalah**.
- **Operasi tak masuk akal:** `sum`/`avg` pada kolom non-numerik → beri peringatan yang jelas (bukan `NaN` yang membingungkan).
- Gunakan `try/catch` untuk error async (note 05 & 07). Buat **jenis error sendiri** bila perlu, agar pesan konsisten.
- Ada flag `--help` yang menjelaskan command & flag yang tersedia.

**Selesai bila:** kamu bisa menunjukkan minimal **5 skenario error berbeda**, dan semuanya keluar dengan pesan yang bisa dimengerti orang lain.

### Milestone 5 — Unit test dengan Vitest

**Tujuan:** Membuktikan logika benar tanpa harus menjalankan CLI manual. (Testing adalah bagian JD.)

- Pakai **Vitest** sebagai test runner.
- **Prioritas test:** fungsi murni di `core/` (filter, sort, aggregate, convert) — bukan I/O. Fungsi murni paling mudah diuji dan paling bernilai.
- Setiap fungsi core punya test untuk: **kasus normal**, **kasus tepi** (array kosong, satu elemen, nilai `null`/`undefined`), dan **kasus error** yang diharapkan.
- **Wajib ada** test untuk:
  - sort numerik vs string (angka `10` tidak dianggap lebih kecil dari `9`),
  - `avg` dengan pembagi nol,
  - filter tanpa hasil (mengembalikan array kosong, bukan error),
  - round-trip konversi CSV ⇄ JSON pada fixture kecil.
- Jalankan dengan `npm test`. Semua test **hijau** sebelum minta review.

**Selesai bila:** `npm test` lulus, dan kamu bisa menjelaskan **apa** yang diuji tiap test dan **kenapa** kasus tepi itu penting.

### Milestone 6 — Struktur modular & dokumentasi

**Tujuan:** Membuat kode bisa dibaca & dipelihara orang lain (dan dirimu 3 bulan lagi).

- Pecah kode sesuai **struktur folder** di bagian 4 — tidak ada file "raksasa" berisi semua logika.
- Pisahkan **lapisan**: parsing argumen (`cli/`) ≠ baca/tulis file (`io/`) ≠ logika data (`core/`). Fungsi `core/` **tidak boleh** tahu soal file atau terminal.
- Tidak ada `any` yang tidak perlu; gunakan `unknown` + narrowing untuk data yang dibaca dari file (note 06).
- **README project** lengkap (lihat bagian 6).
- Semua komentar menjelaskan **kenapa**, bukan mengulang **apa**.
- Tambah `npm run lint` (ESLint) sebagai nilai tambah (opsional tapi disarankan).

**Selesai bila:** orang lain bisa meng-*clone* repo, mengikuti README, dan menjalankan tool **tanpa bertanya** apa pun padamu.

---

## 4. Struktur Folder yang Disarankan

Ini **saran**, bukan kewajiban — tapi kalau kamu menyimpang, pastikan ada alasan yang bisa kamu jelaskan saat review.

```
cli-data-tool/
├── README.md              # cara install, menjalankan, contoh perintah, batasan
├── package.json           # script: start / test / lint
├── tsconfig.json          # strict: true
├── .gitignore             # node_modules, output/, dist/, *.log
├── src/
│   ├── index.ts           # entry point: baca argumen -> dispatch ke command
│   ├── cli/
│   │   ├── args.ts        # parsing & validasi argumen CLI
│   │   ├── commands.ts    # definisi command (show/filter/aggregate/convert)
│   │   └── help.ts        # teks --help
│   ├── io/
│   │   ├── read.ts        # baca file (async), deteksi format dari ekstensi
│   │   └── write.ts       # tulis output ke file / stdout
│   ├── core/              # FUNGSI MURNI — tidak menyentuh file/terminal
│   │   ├── parse.ts       # CSV/JSON -> struktur data internal
│   │   ├── serialize.ts   # struktur data -> CSV/JSON (string)
│   │   ├── filter.ts
│   │   ├── sort.ts
│   │   ├── aggregate.ts
│   │   └── format.ts      # render tabel ke string
│   ├── types.ts           # tipe domain (mis. Row, Column, Command)
│   └── errors.ts          # jenis error + pesan konsisten
├── test/
│   ├── filter.test.ts
│   ├── sort.test.ts
│   ├── aggregate.test.ts
│   ├── convert.test.ts
│   └── fixtures/          # data kecil khusus test
├── fixtures/              # data contoh untuk dicoba manual
│   ├── employees.csv
│   └── employees.json
└── docs/
    └── decisions.md       # (opsional) catatan keputusan desain & batasan
```

**Prinsip kuncinya:** `core/` adalah **fungsi murni** — input data, output data, tanpa efek samping. `io/` yang menyentuh disk. `cli/` yang menyentuh terminal. Pemisahan ini yang membuat Milestone 5 (test) jadi mudah.

---

## 5. Acceptance Criteria (Kriteria Penerimaan)

Project dinilai **lulus** jika semua poin berikut terpenuhi:

**Fungsional**

- [ ] Bisa membaca `.csv` dan `.json`, menampilkan tabel yang terbaca manusia.
- [ ] `filter`, `sort`, `aggregate` (`count`/`sum`/`avg`/`min`/`max`/`group-by`) berjalan benar dan bisa dirangkai.
- [ ] Konversi CSV ⇄ JSON berjalan, dengan `--out` maupun stdout.
- [ ] Data asli **tidak termutasi** oleh operasi apa pun.
- [ ] Minimal **5 skenario error** ditangani dengan pesan jelas + exit code ≠ 0.
- [ ] Ada `--help` yang berguna.

**Kualitas kode**

- [ ] TypeScript `strict` menyala; **tidak ada `any`** tanpa alasan yang bisa kamu jelaskan.
- [ ] Data dari file ditangani sebagai `unknown` lalu di-*narrow* sebelum dipakai.
- [ ] Lapisan `cli` / `io` / `core` terpisah; `core` bebas efek samping.
- [ ] Tidak ada duplikasi logika besar; penamaan jelas dan konsisten.
- [ ] Komentar menjelaskan **kenapa**.

**Test**

- [ ] `npm test` lulus semua.
- [ ] Test mencakup kasus normal, kasus tepi, dan kasus error untuk fungsi `core`.
- [ ] Test tidak bergantung pada urutan eksekusi atau state global.

**Dokumentasi & Git**

- [ ] README project lengkap (lihat bagian 6).
- [ ] Riwayat commit rapi, Conventional Commits, satu milestone = satu PR yang kamu **self-review**.
- [ ] `.gitignore` benar (tidak ada `node_modules/` yang ter-commit).

---

## 6. Definition of Done (Definisi Selesai)

Project `cli-data-tool` **selesai** (boleh dipakai sebagai portofolio) bila **semua** ini terpenuhi:

**1. README project** memuat:

- Deskripsi singkat: apa ini dan untuk apa.
- **Prasyarat** (versi Node.js) dan **cara install** (`npm install`).
- **Cara menjalankan** tiap command, dengan **contoh nyata** yang bisa di-*copy-paste*.
- Contoh **format file** yang didukung (potongan `fixtures/employees.csv` & `.json`).
- **Batasan yang diketahui** secara jujur (mis. "CSV belum menangani koma di dalam tanda kutip"). Jika parser tidak diperbarui untuk membaca field berkutip, tuliskan bahwa round-trip `csv → json → csv` hanya dijamin untuk data yang tidak mengandung delimiter/tanda kutip di dalam nilai, dan konversi numerik hanya dilakukan pada kolom yang seluruhnya angka tanpa awalan nol.
- Struktur folder singkat + penjelasan per folder.

**2. Test lulus:** `npm test` hijau dari kondisi repo yang baru di-*clone*.

**3. Commit rapi:**

- Pesan Conventional Commits (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`).
- Riwayat mencerminkan proses (termasuk perbaikan setelah review) — jangan di-*squash* semua jadi satu commit raksasa.
- Setiap milestone di-*merge* lewat **Pull Request** yang kamu tulis deskripsinya dan **self-review** dulu.

**4. Bisa dijalankan orang lain:** kamu (atau mentor) meng-*clone* ke folder baru, ikut README, dan tool jalan **tanpa bertanya**.

**5. Review mentor lulus:** mentor menyatakan struktur, tipe, error handling, test, dan README sudah memadai.

---

## 7. Stretch Goals (Opsional, Kalau Sudah Lulus)

Kerjakan **hanya setelah** semua milestone inti lulus. Tujuannya memperdalam, bukan menambah beban.

- **Streaming file besar:** baca CSV besar baris-per-baris (bukan muat semua ke memori) dan jelaskan trade-off-nya.
- **Format output:** `--format table|json|md` (mis. output Markdown untuk ditempel ke dokumen).
- **Dukungan delimiter lain:** `--delimiter ";"` untuk CSV bergaya Eropa.
- **Multiple file:** gabungkan beberapa file dengan `--files a.csv,b.csv`.
- **Konfigurasi:** baca default dari file `.clirc.json`.
- **Watch mode:** pantau perubahan file input dan cetak ulang hasil (melatih event loop lebih dalam).
- **Benchmark:** bandingkan performa `filter` manual vs `reduce` untuk dataset besar, tulis temuanmu di `docs/`.

> Aturan stretch goal: kalau sebuah stretch goal mulai **mengorbankan kualitas milestone inti**, hentikan. Fondasi rapi lebih bernilai daripada fitur banyak tapi berantakan.

---

## 8. Cara Meminta Review ke Mentor

Review adalah bagian dari penilaian (simulasi *code review* senior dev — bagian dari JD). Lakukan **per milestone**, jangan menunggu semuanya selesai.

1. **Pastikan bersih dulu:** `npm test` lulus, tidak ada file sampah yang ter-commit, dan PR sudah kamu **self-review** sekali.
2. **Buka Pull Request** di repo `cli-data-tool` (branch milestone → `main`), tulis deskripsi berisi:
   - Milestone apa ini.
   - **Apa yang sudah jalan** dan **apa yang masih ragu**.
   - **Keputusan desain** yang kamu ambil dan alasannya (mis. "saya pilih `reduce` untuk agregasi karena ...").
3. **Kirim pesan ke mentor di chat**, contohnya:

   > "Tolong review PR milestone 2 di repo `cli-data-tool` (branch `phase-01/m2-filter-sort-aggregate`).
   > Fokus yang saya ragu: `sort` saya benar untuk angka, tapi saya tidak yakin kenapa string `'10'` masih dianggap lebih kecil dari `'9'` walau nilainya angka. Test di `test/sort.test.ts` juga saya rasa belum menutup kasus itu."

4. **Jawab pertanyaan penggali mentor.** Mentor akan bertanya "kenapa", bukan langsung memberi jawaban — di situ letak belajarnya. Jangan minta kodenya.
5. **Perbaiki berdasarkan review**, commit lagi (`fix(phase-01): perbaiki sort numerik sesuai review`), lalu minta review ulang. **Jangan merge sebelum mentor bilang lulus.**

**Yang dinilai saat review:** apakah kode jalan & menangani kasus tepi; apakah kamu bisa menjelaskan tiap bagian; apakah tipe membantu; apakah struktur & penamaan jelas; apakah commit bermakna; apakah README cukup untuk orang lain.

---

## 9. Cara Push ke Repo Terpisah `cli-data-tool`

Repo project ini **terpisah** dari repo `learning-journey` (materi). Jangan campur keduanya. Langkah pertama — dilakukan **sekali** saat project dimulai:

**1. Buat repo kosong di GitHub** bernama `cli-data-tool` (tanpa README/gitignore otomatis, agar tidak konflik).

**2. Inisialisasi project lokal** (sesuaikan path dengan milikmu):

```bash
# buat folder project di luar repo learning-journey
mkdir cli-data-tool
cd cli-data-tool

# inisialisasi git & scaffold Node/TypeScript
git init
npm init -y
npm install --save-dev typescript tsx vitest @types/node

# buat file dasar
# - tsconfig.json  (set "strict": true)
# - .gitignore     (node_modules, dist, output, *.log)
# - README.md      (kerangka: judul, cara install, cara jalan)
# - src/index.ts   (entry point kosong / placeholder)
```

> Kamu boleh membuat `package.json`/`tsconfig.json` **di repo project ini**. Di repo materi, `package.json` hanya dilarang di folder latihan (lihat [`../exercises/README.md`](../exercises/README.md)); untuk project portofolio di repo terpisah ini `package.json` justru wajib ada.

**3. Hubungkan ke remote & push commit pertama:**

```bash
git add .
git commit -m "chore: inisialisasi project cli-data-tool (Node + TypeScript)"
git branch -M main
git remote add origin https://github.com/<username>/cli-data-tool.git
git push -u origin main
```

**4. Alur kerja per milestone** (branch → commit → push → PR → self-review → merge), sama seperti aturan Git di repo materi:

```bash
# mulai milestone 1
git checkout -b phase-01/m1-read-and-display

# ... kerjakan, lalu commit bertahap dengan Conventional Commits ...
git add src/io/read.ts src/cli/args.ts
git commit -m "feat(cli): baca dan tampilkan file CSV/JSON (M1)"

# push branch & buka Pull Request ke main
git push -u origin phase-01/m1-read-and-display
```

Lalu di GitHub: buka **Pull Request** dari branch itu ke `main` → tulis deskripsi → **self-review** (baca ulang diff-mu sendiri, cari yang janggal) → minta review mentor → setelah lulus, **merge**.

**5. Setelah merge**, kembali ke `main` dan tarik perubahan sebelum mulai milestone berikutnya:

```bash
git checkout main
git pull origin main
git checkout -b phase-01/m2-filter-sort-aggregate
```

> Konvensi penamaan branch: `phase-01/m<N>-<deskripsi-singkat>`, mis. `phase-01/m3-convert`. Konsisten dan mudah dibaca.

---

## 10. Referensi

- [`../README.md`](../README.md) — tujuan & checklist kelulusan Phase 01.
- [`../exercises/README.md`](../exercises/README.md) — aturan latihan & cara minta review.
- [`../notes/`](../notes/) — materi note 01–07 yang dipakai project ini.
- **Node.js — File system (`fs/promises`)**: <https://nodejs.org/api/fs.html>
- **Node.js — `process.argv` & `process.exit`**: <https://nodejs.org/api/process.html>
- **TypeScript Handbook — Narrowing**: <https://www.typescriptlang.org/docs/handbook/2/narrowing.html>
- **Vitest**: <https://vitest.dev/>
- **Conventional Commits**: <https://www.conventionalcommits.org/en/v1.0.0/>

> Pakai referensi sebagai *kamus*, bukan bacaan linear. Buka saat kamu mentok pada satu bagian, selesaikan, lalu lanjut menulis kode.
