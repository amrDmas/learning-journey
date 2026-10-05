# Exercises — Phase 01 Fundamentals

Folder ini adalah tempat kamu mengerjakan latihan dari [`notes/`](../notes/). Tujuannya melatih **mental model**, bukan sekadar "jawabannya benar". Karena itu aturannya sengaja dibuat sedikit ketat.

> Baca dulu [`../README.md`](../README.md) untuk daftar note dan tujuan fase.

## Cara Pakai Folder Ini

Struktur yang dituju:

```
exercises/
├── README.md          <- file ini
├── 01/                <- latihan untuk notes/01-execution-model.md
├── 02/                <- latihan untuk notes/02-types-coercion.md
├── 03/                <- latihan untuk notes/03-functions-this.md
├── 04/                <- latihan untuk notes/04-collections-immutability.md
├── 05/                <- latihan untuk notes/05-async-event-loop.md
├── 06/                <- latihan untuk notes/06-typescript.md
└── 07/                <- latihan untuk notes/07-errors-debugging.md
```

**Folder `01`–`07` kamu yang membuat** saat mulai mengerjakan note tersebut — tidak disediakan di awal supaya kamu terbiasa menata sendiri. Satu latihan = satu file, dengan nama deskriptif.

Contoh penamaan:

```
exercises/03/closure-counter.ts
exercises/03/predict-this.ts
exercises/05/promise-order.ts
```

Setiap folder latihan sebaiknya punya `NOTES.md` kecil berisi: pertanyaan/latihan apa ini, prediksimu (kalau ada), dan apa yang akhirnya kamu pahami.

## Cara Menjalankan

Fase ini fokus ke JS/TS dasar, jadi **tanpa framework**. Kita pakai [`tsx`](https://tsx.is/) untuk menjalankan file TypeScript langsung:

```bash
# jalankan satu file
npx tsx exercises/03/closure-counter.ts

# jalankan dengan watch (otomatis restart saat file disimpan)
npx tsx watch exercises/05/promise-order.ts
```

Untuk file JavaScript murni (`.js`), kamu juga bisa pakai Node langsung:

```bash
node exercises/01/reference-vs-value.js
```

Cek versi yang terpasang:

```bash
node --version
npx tsx --version
```

> `npx tsx` akan mengunduh `tsx` sementara jika belum ada — itu normal dan tidak perlu setup apa pun. Jangan buat `package.json` di folder ini kecuali diminta mentor; latihan harus tetap ringan.

## Aturan Latihan

1. **Tulis jawabanmu dulu, baru jalankan.** Kalau latihan bertipe "prediksi output", tulis tebakanmu sebagai komentar di atas kode **sebelum** menjalankannya.
2. **Jangan lihat kunci sebelum mencoba.** Kalau ada kunci/referensi, baru buka setelah kamu menyerah dengan jujur (minimal sudah mencoba 2 pendekatan). Menyontek kunci = kehilangan latihan mental model-nya.
3. **Commit tiap latihan selesai.** Satu latihan yang selesai = satu commit (atau gabung beberapa latihan dalam satu note, yang penting rapi). Format Conventional Commits:
   ```bash
   git add exercises/03/closure-counter.ts
   git commit -m "feat(phase-01): latihan closure counter (note 03)"
   ```
4. **Jangan hapus riwayat salahmu.** Kalau kode awal salah, biarkan di commit history lalu perbaiki di commit berikutnya — itu bukti proses belajarmu.
5. **Tulis komentar "kenapa"**, bukan "apa". Komentar yang baik menjelaskan alasan, mis. `// pakai let karena nilai counter berubah tiap klik`, bukan `// deklarasikan counter`.
6. **Boleh pakai internet untuk sintaks**, tapi **dilarang copy-paste solusi utuh** dari internet/AI tanpa menjelaskan ulang dengan kata sendiri.

## Daftar Folder Latihan 01–07

Kerjakan berurutan, sejalan dengan note-nya. Target minimal **3 latihan per folder** (total 20+).

| Folder | Sumber note | Fokus latihan | Contoh latihan |
| --- | --- | --- | --- |
| `01/` | `notes/01-execution-model.md` | call stack, scope, hoisting, closure | Prediksi urutan eksekusi & output `var` vs `let` di dalam blok; buat `counter()` dengan closure; buat `once(fn)` yang hanya boleh jalan sekali |
| `02/` | `notes/02-types-coercion.md` | tipe, coercion, reference vs value | Prediksi output `==` vs `===` dan truthy/falsy; buat `shallowCopy` vs `deepCopy` dan tunjukkan bedanya |
| `03/` | `notes/03-functions-this.md` | function sebagai nilai, `this` | Prediksi `this` pada pemanggilan biasa vs method vs arrow; buat higher-order function `map` versi sendiri |
| `04/` | `notes/04-collections-immutability.md` | transformasi data, immutable update | Implementasi `filter`/`reduce` sendiri; update array of object tanpa memutasi aslinya |
| `05/` | `notes/05-async-event-loop.md` | event loop, Promise, async/await | Prediksi urutan output `setTimeout` vs `Promise`; tulis `delay(ms)` berbasis Promise |
| `06/` | `notes/06-typescript.md` | inference, narrowing, generics | Ubah kode `any` jadi type-safe; tulis fungsi generik `firstOrNull<T>(arr: T[]): T \| null` |
| `07/` | `notes/07-errors-debugging.md` | error handling, debugging | Tulis fungsi dengan `try/catch` + custom error yang jelas; baca stack trace dan temukan bug |

> Isi latihan detail per note akan diumumkan mentor di chat saat note-nya mulai dikerjakan. Tabel di atas adalah peta arah, bukan daftar final.

## Cara Minta Review

Review adalah bagian terpenting — ini simulasi *code review* ala senior dev (juga bagian dari JD).

1. **Commit & push** dulu pekerjaanmu di branch fase:
   ```bash
   git checkout -b phase-01/fundamentals   # sekali saja di awal fase
   git add exercises/
   git commit -m "feat(phase-01): latihan note 03"
   git push -u origin phase-01/fundamentals
   ```
2. **Minta review lewat chat mentor** dengan menyebut: note mana, file mana, dan **apa yang masih kamu ragukan**. Contoh:
   > "Tolong review `exercises/03/closure-counter.ts` dan `once.ts`. Saya yakin soal closure, tapi masih ragu kenapa `once` saya gagal kalau fungsinya dipanggil dua kali dengan argumen beda."
3. **Sertakan konteks**: tempel potongan kode yang kamu ragu atau jelaskan prediksimu. Mentor akan membalas dengan pertanyaan penggali — bukan langsung jawaban. **Jawab pertanyaannya**; di situ belajarnya.
4. **Perbaiki berdasarkan review**, lalu commit lagi (`fix(phase-01): perbaiki once() sesuai review`). Jangan paksakan merge sebelum mentor bilang lulus.
5. Setelah satu note selesai di-review, merge ke `main` lewat Pull Request dan **self-review** dulu sebelum merge (lihat aturan Git di [`../README.md`](../README.md)).

### Yang dinilai mentor saat review

- Apakah kodenya **jalan** dan menangani kasus tepi (input kosong, `null`/`undefined`).
- Apakah kamu bisa **menjelaskan tiap baris**, terutama "kenapa begitu".
- Apakah penamaan dan struktur file **jelas**.
- Apakah tipe TypeScript **membantu** (bukan `any` di mana-mana).
- Apakah commit message **bermakna**.

> Tidak masalah salah. Yang masalah adalah diam saja saat tidak paham — justru itu momen terbaik untuk bertanya.
