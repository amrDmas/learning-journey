# Phase 01 — JavaScript & TypeScript Fundamentals

> Durasi: 3–4 minggu (4+ jam/hari) | Prasyarat: [phase-00-setup](../phase-00-setup/README.md) selesai (Git dasar, Node.js & editor terpasang) | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan dengan kata sendiri** (bukan menghafal) mental model berikut dan mengaitkannya ke kode nyata: call stack, execution context, scope chain, closure, reference vs value, event loop, dan microtask vs macrotask.
2. **Memprediksi output** sebuah potongan JS sebelum menjalankannya — terutama kasus seputar `this`, hoisting, closure, dan urutan async.
3. **Menulis ulang dari nol** utility kecil (mis. `map`, `debounce`, deep clone sederhana) tanpa melihat referensi, lalu menjelaskan tiap barisnya.
4. **Menulis TypeScript yang aman**: memakai inference, narrowing, `unknown` alih-alih `any`, dan generics dasar untuk membuat fungsi yang reusable namun tetap type-safe.
5. **Menjalankan alur kerja harian**: menulis file `.ts`, menjalankannya dengan `npx tsx`, membaca pesan error TypeScript, dan melakukan debugging dasar.
6. **Menyelesaikan 20+ latihan** di `exercises/` dan **lulus review** project `cli-data-tool`.

## Mental Model — Kenapa, bukan cuma Apa

Masalah utama bukan "tidak tahu sintaks", tetapi **"kode jalan tapi tidak paham kenapa"**. Fase ini menyerang akar masalah itu: setiap topik dijelaskan sebagai **model kerja mesin**, bukan daftar aturan hafalan.

Empat model inti yang akan dipakai terus sampai fase akhir:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Call stack & execution context** | "Kode ini jalan dalam urutan apa? Variabel ini hidup di mana?" | hoisting, `this`, scope, error stack trace |
| **Reference vs value & memory** | "Apakah dua variabel menunjuk ke data yang sama?" | mutasi tak terduga, shallow vs deep copy, immutable update (dasar React nanti) |
| **Scope & closure** | "Kenapa fungsi masih bisa akses variabel yang 'sudah selesai'?" | callback, module pattern, React hooks, event handler |
| **Event loop** | "Kenapa `setTimeout(0)` jalan setelah kode sinkron? Kenapa Promise jalan sebelum `setTimeout`?" | async/await, Node.js I/O, Cloud Functions, reliability |

Cara memakai model ini: setiap kali menemukan perilaku aneh, **gambar dulu** (call stack / scope / antrian event loop) di kertas atau komentar file, **baru** tebak outputnya. Kalau tebakanmu salah, modelnya yang perlu diperbaiki — bukan sekadar "apalagi hasilnya".

> Aturan emas fase ini: **"Kalau kamu tidak bisa menjelaskannya ke orang lain dengan kata sendiri, kamu belum paham."** Setiap note punya bagian *Jelaskan dengan Kata Sendiri* — kerjakan itu.

## Materi & Urutan Belajar

Semua materi ada di folder [`notes/`](./notes/). Kerjakan **berurutan** — note 03 mengandaikan kamu sudah paham note 01–02. Target realistis: 1 note ≈ 3–5 hari (materi + latihan + tulis ulang).

| # | File | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | [`notes/01-execution-model.md`](./notes/01-execution-model.md) | Model eksekusi: call stack & execution context, memory (stack vs heap), primitive vs reference, scope & lexical scope, hoisting/TDZ, `var`/`let`/`const`, **closure**, garbage collection | Membaca stack trace; closure & scope adalah dasar callback, React hooks, dan event handler |
| 02 | [`notes/02-types-coercion.md`](./notes/02-types-coercion.md) | Tipe primitif vs object, `typeof`, autoboxing, mutability, `==` vs `===`, truthy/falsy, `NaN`, presisi `Number` & `BigInt`, shallow vs deep copy | Akar dari hampir semua bug "data berubah tanpa saya ubah"; prasyarat immutable update di React |
| 03 | [`notes/03-functions-this.md`](./notes/03-functions-this.md) | Function sebagai nilai, higher-order function, callback, pure function, **aturan `this`**, currying | Menentukan `this` saat dipanggil vs saat ditulis — sumber bug nomor satu di JS |
| 04 | [`notes/04-collections-immutability.md`](./notes/04-collections-immutability.md) | Array methods (`map`/`filter`/`reduce`/…), chaining, **immutability**, shallow vs deep copy, object methods, destructuring, spread/rest, `?.`/`??`, Map/Set, JSON | Manipulasi data API, transformasi Firestore document, state React |
| 05 | [`notes/05-async-event-loop.md`](./notes/05-async-event-loop.md) | Event loop, callback, Promise, combinator (`all`/`race`/`allSettled`/`any`), `async`/`await`, microtask vs macrotask, error async, `AbortController` | Inti "asynchronous programming & event-driven processing" di JD |
| 06 | [`notes/06-typescript.md`](./notes/06-typescript.md) | TypeScript sebagai alat berpikir: setup & `tsconfig`, inference, `type` vs `interface`, union/intersection, literal types, `any`/`unknown`/`never`, narrowing, generics, utility types | TypeScript adalah syarat JD; menulis kode maintainable |
| 07 | [`notes/07-errors-debugging.md`](./notes/07-errors-debugging.md) | Jenis error, `try`/`catch`/`finally`, `throw`, custom error, error propagation, membaca stack trace, teknik & scientific debugging, logging, defensive programming | Reliability; debugging & membaca codebase besar |

> **Catatan status note:** seluruh note `01`–`07` sudah tersedia di folder [`notes/`](./notes/) dan bisa dikerjakan berurutan. Kalau ada note baru atau revisi, mentor akan mengumumkannya di chat — jangan lompat urutan.

### Cara belajar tiap note (ulangi pola ini untuk semua note)

1. **Baca sekali cepat** untuk tahu peta besar. Jangan pusing kalau belum paham detail.
2. **Baca ulang sambil menjalankan kode.** Ketik contohnya sendiri (jangan copy-paste), jalankan dengan `npx tsx namafile.ts`, dan **prediksi output sebelum menekan Enter**.
3. **Jawab bagian "Jelaskan dengan Kata Sendiri"** di akhir note — tulis di file catatanmu atau jelaskan ke mentor di chat.
4. **Kerjakan latihan** note tersebut di `exercises/NN-.../` (lihat [`exercises/README.md`](./exercises/README.md)).
5. **Commit** hasil latihan (Conventional Commits, mis. `feat(phase-01): latihan closure 03`), lalu minta review mentor.
6. **Refleksi**: tulis 3 baris — apa yang tadi mengejutkan, apa yang masih kabur, apa yang mau kamu tanyakan.

> Tips: buat satu file `playground.ts` bebas untuk eksperimen cepat. Ia bukan bagian dari latihan, jadi bebas kamu kotori.

## Latihan

Semua latihan ada di [`exercises/`](./exercises/) dan dibagi per note (folder `01`–`07`). Detail aturan, cara menjalankan, dan cara minta review ada di [`exercises/README.md`](./exercises/README.md).

- **Total target: 20+ latihan selesai** (sekitar 3 latihan per note).
- Aturan inti: **tulis jawabanmu dulu**, jangan intip kunci sebelum mencoba; **commit tiap latihan selesai**.
- Beberapa latihan bergaya "prediksi output": tebak dulu, baru jalankan. Ini melatih mental model, bukan hafalan.

## Project

Project portofolio fase ini: **`cli-data-tool`** (repo terpisah). Spesifikasi lengkap: [`project/README.md`](./project/README.md).

Tujuannya bukan sekadar "aplikasi jalan", tetapi **membuktikan mental model**: tool CLI yang membaca file data (mis. JSON/CSV kecil), memproses dengan `map`/`filter`/`reduce`, mengelola state async (baca file), menangani error dengan baik, dan **ditulis dalam TypeScript strict** dengan tipe yang rapi.

Kriteria yang akan dinilai mentor (review seperti senior dev):

- Struktur file jelas, dipisah antara baca data, olah data, dan tampilkan output.
- Tidak ada `any` yang tidak perlu; tipe membantu, bukan menghambat.
- Error ditangani (file tidak ada, format salah) — bukan crash tanpa pesan.
- Ada minimal beberapa unit test sederhana untuk fungsi pengolah data.
- Commit history rapi dan bermakna; README project menjelaskan cara menjalankan.

Spesifikasi lengkap project sudah tersedia di [`project/README.md`](./project/README.md) — baca sebelum mulai. Repo `cli-data-tool` sendiri terpisah dan akan kamu buat saat fase ini dimulai; jangan menunggu project untuk mulai belajar, kerjakan note & latihan lebih dulu.

## Checklist Kelulusan

Fase ini dianggap **lulus** jika semua poin terukur di bawah terpenuhi. Centang satu per satu; jangan lanjut ke phase-02 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan lisan/tulisan ke mentor)**

- [ ] Bisa menjelaskan **closure** dengan kata sendiri, plus satu contoh nyata pemakaiannya.
- [ ] Bisa menjelaskan **event loop** dan **kenapa `Promise` jalan sebelum `setTimeout(0)`**, dengan kata sendiri.
- [ ] Bisa menjelaskan **reference vs value** dan **kenapa `const` object masih bisa diubah isinya**.
- [ ] Bisa menjelaskan **call stack & scope** dan menunjuk contohnya saat membaca stack trace.
- [ ] Bisa menjelaskan perbedaan **`unknown` dan `any`** serta kapan memakai masing-masing.

**Praktik**

- [ ] Menyelesaikan **minimal 20 latihan** di `exercises/`, semuanya ter-commit.
- [ ] Menulis ulang dari nol (tanpa melihat referensi) minimal 3 utility: `map` sendiri, `debounce`, dan satu deep-clone/shallow-copy sederhana — masing-masing dijelaskan baris per baris.
- [ ] Menjawab bagian "Jelaskan dengan Kata Sendiri" di **ketujuh** note.
- [ ] Menyelesaikan latihan prediksi output dengan akurasi yang memuaskan (mentor menilai penalaran, bukan hanya jawaban).

**Project & Git**

- [ ] Project `cli-data-tool` **lulus review** mentor (struktur, tipe, error handling, test, README).
- [ ] Riwayat Git rapi: branch `phase-01/nama-singkat`, Conventional Commits, dan **minimal satu Pull Request** yang kamu **self-review** sebelum merge.
- [ ] Project bisa dijalankan dari nol oleh orang lain mengikuti README-nya.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal yang paling mengubah cara berpikirmu, dan 1 hal yang masih ingin diperdalam.

## Referensi

- **MDN Web Docs** — JavaScript: <https://developer.mozilla.org/en-US/docs/Web/JavaScript> (rujukan perilaku bahasa; pakai bagian *Guide* untuk penjelasan konsep).
- **JavaScript.info** — <https://javascript.info/> (penjelasan bertahap dengan mental model; sangat cocok untuk fase ini).
- **TypeScript Handbook** — <https://www.typescriptlang.org/docs/handbook/intro.html> (mulai dari *Everyday Types* dan *Narrowing*).
- **Node.js Learn** — <https://nodejs.org/en/learn> (event loop, module system).
- **You Don't Know JS Yet** (Kyle Simpson, gratis di GitHub) — <https://github.com/getify/You-Dont-Know-JS> (bab Scope & Closures, Types & Grammar).
- **tsx** — <https://tsx.is/> (cara menjalankan file TypeScript tanpa konfigurasi build).
- **Conventional Commits** — <https://www.conventionalcommits.org/en/v1.0.0/> (format pesan commit yang dipakai repo ini).

> Catatan: jangan membaca referensi dari awal sampai akhir. Pakai sebagai *kamus* — baca bagian yang relevan saat kamu mentok di satu note, lalu kembali ke latihan.
