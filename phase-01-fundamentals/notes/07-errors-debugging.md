# 07 — Error Handling & Debugging

> Bagian dari `phase-01-fundamentals` | Prasyarat: sudah paham `function`, scope, closure, dan dasar async (lihat notes sebelumnya).
> Topik ini langsung menyentuh **reliability** di JD: kode yang baik bukan kode yang tidak pernah error, tapi kode yang **gagal dengan cara yang bisa dimengerti dan dipulihkan**.

---

## Daftar Isi

1. [Kenapa Error Itu Teman, Bukan Musuh](#1-kenapa-error-itu-teman-bukan-musuh)
2. [Jenis-Jenis Error di JavaScript](#2-jenis-jenis-error-di-javascript)
3. [try / catch / finally](#3-try--catch--finally)
4. [throw — Melempar Error Sendiri](#4-throw--melempar-error-sendiri)
5. [Custom Error: Subclass & Properti Penting](#5-custom-error-subclass--properti-penting)
6. [Error Propagation — Kapan Menangkap, Kapan Membiarkan](#6-error-propagation--kapan-menangkap-kapan-membiarkan)
7. [Pola return vs throw](#7-pola-return-vs-throw)
8. [Membaca Stack Trace Baris per Baris](#8-membaca-stack-trace-baris-per-baris)
9. [Teknik Debugging](#9-teknik-debugging)
10. [Scientific Debugging — Hipotesis & Uji](#10-scientific-debugging--hipotesis--uji)
11. [Kesalahan Runtime Umum & Cara Mendiagnosisnya](#11-kesalahan-runtime-umum--cara-mendiagnosisnya)
12. [Logging yang Baik](#12-logging-yang-baik)
13. [Defensive Programming & Validasi Input](#13-defensive-programming--validasi-input)
14. [Jangan Menelan Error (Empty Catch)](#14-jangan-menelan-error-empty-catch)
15. [Latihan Debug — Kode Rusak, Temukan Bug](#15-latihan-debug--kode-rusak-temukan-bug)
16. [Ringkasan Kata Sendiri](#16-ringkasan-kata-sendiri)

---

## 1. Kenapa Error Itu Teman, Bukan Musuh

Ada dua jenis masalah yang terlihat mirip tapi berbeda:

- **Bug**: kode melakukan hal yang tidak kamu maksud (logika salah). Contoh: `total = harga - pajak` padahal harusnya `+`.
- **Error / exception**: runtime memberi tahu bahwa sesuatu yang tidak mungkin diselesaikan telah terjadi. Contoh: memanggil method pada `undefined`, membaca file yang tidak ada.

Error adalah **sistem alarm**. Ia menghentikan eksekusi di titik masalah dan membawa **lokasi + pesan**. Kalau kamu mematikan alarm (menelan error), kamu mematikan informasi paling berharga yang kamu punya.

> **Mental model:** bayangkan call stack sebagai tumpukan piring. Saat error dilempar, JS "menjatuhkan piring" — ia berhenti, lalu mencatat **piring mana yang pecah** (baris error) dan **piring apa saja yang ada di atasnya** (jalur pemanggilan / stack trace). Membaca error = membaca tumpukan itu.

Tujuan catatan ini: kamu bisa **membaca**, **menangani**, dan **membuat** error dengan sadar.

---

## 2. Jenis-Jenis Error di JavaScript

Semua error bawaan adalah turunan dari `Error`. Yang paling sering kamu temui:

| Tipe | Kapan muncul | Contoh penyebab |
| --- | --- | --- |
| `SyntaxError` | Kode **tidak bisa diparsing** — gagal sebelum dijalankan | Kurung kurawal tidak ditutup, `const x = ;`, JSON tidak valid |
| `TypeError` | Operasi dilakukan pada **tipe yang tidak cocok** | `undefined.foo`, memanggil nilai yang bukan function, `null.length` |
| `ReferenceError` | Mengakses **variabel yang tidak ada** | Salah tulis nama variabel, akses sebelum deklarasi `let`/`const` (TDZ) |
| `RangeError` | Nilai **di luar rentang** yang diizinkan | `new Array(-1)`, `(123).toFixed(200)` |
| `URIError` | Format URI salah saat `decodeURIComponent` dll. | `decodeURIComponent("%")` |
| `EvalError` | Jarang dipakai di JS modern; terkait `eval` | — |
| `AggregateError` | Beberapa error digabung (mis. dari `Promise.any`) | — |

### 2.1 SyntaxError — gagal di tahap parse

`SyntaxError` istimewa: ia terjadi **sebelum satu baris pun berjalan**. Artinya `try/catch` **tidak menolong** untuk kode yang ditulis langsung di file — error-nya muncul saat file dimuat.

```js
// FILE INI GAGAL SAAT DIMUAT — tidak ada satu baris pun yang jalan
console.log("mulai");

function tambah(a, b) {
  return a + b;
// <- kurung kurawal penutup function hilang -> SyntaxError

console.log("selesai");
```

Versi ringkasnya juga SyntaxError:

```js
const x = ; // <- nilai di sisi kanan `=` kosong -> SyntaxError
```

Karena parse gagal, **output-nya kosong total** — `"mulai"` dan `"selesai"` tidak pernah tercetak. Ini berbeda dari error runtime (`TypeError`, dsb.) yang baru muncul saat barisnya dieksekusi dan karena itu **bisa** ditangkap `try/catch`.

Pelajarannya: kalau program **sama sekali tidak jalan** (tidak ada output sama sekali) dan pesannya menyebut "Unexpected token" atau "Unexpected end of input", curigai struktur kurung/kutip/koma, bukan logika.

### 2.2 TypeError — tipe tidak cocok

```js
const user = { nama: "Dimas" };

console.log(user.alamat.kota); // TypeError: Cannot read properties of undefined (reading 'kota')
```

`user.alamat` adalah `undefined`, lalu kamu mencoba `.kota` dari `undefined` → `TypeError`. Ini **error nomor satu** yang akan kamu temui saat bekerja dengan data API.

```js
const nilai = 42;
nilai(); // TypeError: nilai is not a function
```

### 2.3 ReferenceError — nama tidak dikenal

```js
console.log(total); // ReferenceError: total is not defined
```

```js
console.log(hasil); // ReferenceError: Cannot access 'hasil' before initialization (TDZ)
let hasil = 10;
```

Perhatikan bedanya: pada kasus TDZ, variabelnya **ada** tapi belum diinisialisasi. Pesannya beda ("before initialization" vs "is not defined"), dan itu petunjuk penting.

### 2.4 RangeError — di luar batas

```js
new Array(-1);            // RangeError: Invalid array length
(1.23).toFixed(500);      // RangeError: toFixed() digits argument must be between 0 and 100
```

### 2.5 Membaca nama error = setengah diagnosis

Sebelum membaca pesan panjang, **lihat dulu tipe errornya**. Pola pikirnya:

- `SyntaxError` → masalah struktur file, bukan runtime.
- `TypeError` → ada nilai `undefined`/`null` yang tidak kamu antisipasi.
- `ReferenceError` → salah nama / urutan deklarasi.
- `RangeError` → angka/ukuran tidak masuk akal.

---

## 3. try / catch / finally

`try` membungkus kode yang **mungkin gagal**. `catch` menangkap error yang dilempar di dalamnya. `finally` **selalu** jalan, baik sukses maupun gagal.

```js
function parseJSON(teks) {
  try {
    return JSON.parse(teks);      // berhasil -> return
  } catch (err) {
    console.error("JSON tidak valid:", err.message);
    return null;                  // gagal -> nilai fallback
  } finally {
    console.log("parseJSON selesai dijalankan"); // SELALU jalan
  }
}

console.log(parseJSON('{"a":1}')); // { a: 1 }
console.log(parseJSON('bukan json')); // null
```

Output:

```
parseJSON selesai dijalankan
{ a: 1 }
parseJSON selesai dijalankan
null
```

### 3.1 Urutan eksekusi — perhatikan `return` di dalam `try`

`finally` tetap jalan **bahkan** ketika `try` sudah `return`. Kalau `finally` juga `return`, nilai dari `finally` **menang** (dan menutupi return di `try`) — ini sering jadi sumber bug.

```js
function contoh() {
  try {
    return "dari try";
  } finally {
    return "dari finally"; // ⚠️ menimpa return di try
  }
}

console.log(contoh()); // "dari finally"
```

> **Aturan praktis:** jangan `return` di dalam `finally`. Pakai `finally` hanya untuk **bersih-bersih** (tutup koneksi, reset flag, hentikan loading spinner).

### 3.2 `catch` menerima nilai apa saja

`catch (err)` bisa berisi apa pun, bukan hanya `Error` — karena JS mengizinkan `throw "string"` atau `throw 42`. Untuk keamanan, selalu periksa tipenya:

```js
try {
  // ...
} catch (err) {
  const pesan = err instanceof Error ? err.message : String(err);
  console.error("Terjadi masalah:", pesan);
}
```

Di **TypeScript**, `err` di dalam `catch` bertipe `unknown` (kalau `useUnknownInCatchVariables` aktif, yang default pada `strict`). Artinya kamu **harus** mempersempit tipe (narrowing) sebelum mengakses `.message`. Ini fitur, bukan gangguan — memaksa kamu sadar bahwa apa pun bisa dilempar.

```ts
try {
  // ...
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message); // di sini err sudah aman
  } else {
    console.error("Error tak terduga:", err);
  }
}
```

---

## 4. throw — Melempar Error Sendiri

`throw` menghentikan eksekusi saat ini dan **meneruskan error ke atas** sampai ada `catch` yang menangkapnya.

```js
function bagi(a, b) {
  if (b === 0) {
    throw new Error("Tidak bisa membagi dengan nol");
  }
  return a / b;
}

bagi(10, 2); // 5
bagi(10, 0); // melempar Error
```

### 4.1 Selalu `throw new Error(...)`, jangan `throw "string"`

```js
// ❌ Buruk: kehilangan stack trace, tipe tidak jelas
throw "gagal";

// ✅ Baik: ada name, message, stack
throw new Error("gagal");
```

Melempar string membuat `err.stack` tidak ada, dan `catch` jadi sulit membedakan jenis error. Kebiasaan ini kelihatan sepele, tapi di codebase besar perbedaannya besar.

### 4.2 Error vs `return null`/`false`

Kapan melempar, kapan mengembalikan nilai "gagal"? Lihat [bagian 7](#7-pola-return-vs-throw).

---

## 5. Custom Error: Subclass & Properti Penting

### 5.1 Properti standar

Setiap `Error` punya:

| Properti | Isi |
| --- | --- |
| `name` | Nama tipe error, mis. `"TypeError"`, `"ValidationError"` |
| `message` | Penjelasan singkat yang bisa dibaca manusia |
| `stack` | Jejak pemanggilan (file + baris) dari titik error sampai atas |
| `cause` | Error asli yang menyebabkan error ini (opsional, ES2022) |

```js
const err = new Error("Gagal memuat profil");
console.log(err.name);    // "Error"
console.log(err.message); // "Gagal memuat profil"
console.log(typeof err.stack); // "string"
```

### 5.2 `cause` — membungkus error tanpa kehilangan aslinya

Saat kamu menangkap error lalu melempar error baru (mis. mengubah error teknis jadi pesan domain), **sertakan penyebab aslinya** agar konteks tidak hilang:

```js
async function muatProfil(id) {
  try {
    return await ambilDariAPI(`/users/${id}`);
  } catch (err) {
    throw new Error(`Gagal memuat profil user ${id}`, { cause: err });
  }
}
```

`cause` membuat rantai: error baru di atas, error asli tersimpan di `err.cause`. Saat menelusuri bug, rantai ini sangat berharga.

### 5.3 Membuat subclass Error

Untuk membedakan jenis kegagalan (mis. validasi vs jaringan vs "tidak ditemukan"), buat kelas sendiri:

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} dengan id ${id} tidak ditemukan`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}
```

Pemakaian:

```js
function validasiUmur(umur) {
  if (typeof umur !== "number") {
    throw new ValidationError("umur", "Umur harus berupa angka");
  }
  if (umur < 0 || umur > 150) {
    throw new ValidationError("umur", "Umur harus antara 0 dan 150");
  }
}

try {
  validasiUmur(-5);
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(`Field "${err.field}": ${err.message}`);
  } else {
    throw err; // bukan error yang kita kenali -> lempar lagi
  }
}
```

> **Di TypeScript:** pada target **ES2015+** (Node modern / bundler modern), `instanceof` bekerja baik dengan subclass `Error`. Bila kamu terpaksa menargetkan **ES5**, `instanceof` bisa gagal: `class ValidationError extends Error` menghasilkan `err instanceof ValidationError === false`, karena konstruktor `Error` mengembalikan objek baru sehingga prototype chain terputus. Perbaikannya, set ulang prototype di konstruktor:
>
> ```js
> class ValidationError extends Error {
>   constructor(field, message) {
>     super(message);
>     this.name = "ValidationError";
>     this.field = field;
>     Object.setPrototypeOf(this, ValidationError.prototype); // wajib di target ES5
>   }
> }
> ```
>
> Untuk custom error yang lebih ketat (mis. membawa data terstruktur), kamu bisa mendeklarasikan properti tambahan seperti `field` di atas. Hindari mengandalkan `err.message` untuk logika program — pakai **tipe/properti**, karena `message` bisa berubah.

### 5.4 Kapan bikin custom error?

Buat subclass ketika **pemanggil perlu membedakan** jenis error dan bereaksi berbeda (tampilkan pesan ke field form, tampilkan halaman 404, retry, dll.). Kalau semua error diperlakukan sama, cukup `new Error(...)` biasa.

---

## 6. Error Propagation — Kapan Menangkap, Kapan Membiarkan

Error "merambat ke atas" (propagate) lewat call stack sampai ada `catch`. Kalau tidak ada yang menangkap, program berhenti dengan pesan error.

```
fungsiLevel3()  <-- error dilempar di sini
     ↑ dipanggil oleh
fungsiLevel2()  <-- TIDAK ada try/catch -> dilewatkan
     ↑ dipanggil oleh
fungsiLevel1()  <-- ADA try/catch -> error ditangkap di sini
```

```js
function level3() {
  throw new Error("sesuatu rusak di level 3");
}

function level2() {
  level3(); // tidak menangkap, error naik ke atas
}

function level1() {
  try {
    level2();
  } catch (err) {
    console.error("level1 menangkap:", err.message);
  }
}

level1(); // "level1 menangkap: sesuatu rusak di level 3"
```

### 6.1 Prinsip: tangkap hanya kalau bisa berbuat sesuatu

Pertanyaan sebelum menulis `catch`: **"Di sini saya bisa memulihkan, menambahkan konteks, atau menerjemahkan error ini?"**

- **Ya** → tangkap dan tangani.
- **Tidak** → biarkan naik. Jangan tangkap hanya agar "kode terlihat tidak crash".

Tangkap di **batas aplikasi** (boundary), bukan di setiap fungsi. Contoh boundary: layer HTTP handler, top-level `main()`, event handler UI, worker/Cloud Function entry.

```js
// Boundary: di sini kita MENANGKAP karena kita tahu cara merespons
async function handlerRequest(req, res) {
  try {
    const data = await ambilData(req.params.id);
    res.json(data);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
```

Di layer bawah (`ambilData`, dsb.) **tidak** ada `try/catch` — biarkan error naik ke handler. Ini membuat kode lebih bersih dan alur kegagalan lebih jelas.

### 6.2 Async: error tidak otomatis tertangkap oleh `try` di luar

Ini penting dan sering menjebak:

```js
try {
  setTimeout(() => {
    throw new Error("boom"); // ❌ TIDAK tertangkap try/catch di luar
  }, 0);
} catch (err) {
  console.error("tidak akan tercetak");
}
```

Callback async dijalankan **belakangan**, di luar call stack `try`. Untuk menangkapnya, tangkap **di dalam** callback, atau pakai `async/await` yang memang mengalirkan error lewat `try/catch`.

```js
// ✅ Dengan async/await, try/catch BEKERJA
async function jalankan() {
  try {
    await delayLaluLempar();
  } catch (err) {
    console.error("tertangkap:", err.message);
  }
}
```

Untuk Promise yang tidak di-`await`, gunakan `.catch()` atau `process.on("unhandledRejection")` di Node — tapi yang benar adalah selalu menangani promise.

---

## 7. Pola return vs throw

Dua gaya memberi tahu kegagalan:

| Aspek | `return` nilai gagal (`null`, `false`, `{ok:false}`) | `throw` |
| --- | --- | --- |
| Sifat | Kegagalan **diharapkan**, bagian dari alur normal | Kegagalan **tidak diharapkan** / kondisi abnormal |
| Pemanggil | Harus memeriksa hasil setiap kali | Bisa mengabaikan; error naik sampai ditangkap |
| Contoh | `findUser()` → `null` kalau tidak ada | `parseConfig()` → `throw` kalau file rusak |
| Risiko | Lupa memeriksa hasil → bug senyap | Lupa menangkap → crash |

Aturan praktis:

- **Kegagalan yang wajar dan sering** → kembalikan nilai (mis. pencarian yang boleh kosong → `null`).
- **Pelanggaran kontrak / kondisi yang seharusnya tidak terjadi** → `throw` (mis. argumen tidak valid, data rusak).

Contoh memilih:

```js
// "tidak ketemu" adalah hasil NORMAL -> return null
function cariUser(users, id) {
  return users.find((u) => u.id === id) ?? null;
}

// argumen salah adalah PELANGGARAN kontrak -> throw
function hitungDiskon(harga) {
  if (typeof harga !== "number" || harga < 0) {
    throw new TypeError("harga harus angka >= 0");
  }
  return harga * 0.9;
}
```

Pola "hasil terstruktur" sering dipakai di TypeScript agar compiler memaksa pemanggil memeriksa:

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseAngka(teks: string): Result<number> {
  const n = Number(teks);
  if (Number.isNaN(n)) {
    return { ok: false, error: `"${teks}" bukan angka` };
  }
  return { ok: true, value: n };
}

const hasil = parseAngka("abc");
if (!hasil.ok) {
  console.error(hasil.error); // TS tahu hasil.error ada di cabang ini
} else {
  console.log(hasil.value * 2);
}
```

---

## 8. Membaca Stack Trace Baris per Baris

Stack trace adalah peta perjalanan error. Contoh (Node.js):

```
TypeError: Cannot read properties of undefined (reading 'nama')
    at tampilkanUser (D:\app\src\user.ts:12:20)
    at muatData (D:\app\src\data.ts:5:3)
    at main (D:\app\src\index.ts:20:1)
    at Object.<anonymous> (D:\app\src\index.ts:25:1)
    at Module._compile (node:internal/modules/cjs/loader:1254:14)
```

Cara membacanya — **dari atas ke bawah**:

1. **Baris pertama** = jenis error + pesan. Ini petunjuk utama: di sini `reading 'nama'` berarti ada sesuatu `undefined` yang kamu coba ambil `.nama`.
2. **Frame pertama** (`at tampilkanUser ... user.ts:12:20`) = **titik error terjadi**. `12` baris, `20` kolom. Buka file itu, baris itu.
3. **Frame berikutnya** = siapa yang **memanggil** fungsi tersebut, ke atas sampai akar program.
4. **Frame `node:internal/...`** = kode internal Node; abaikan saat mendiagnosis kode kamu.
5. Baris paling bawah biasanya titik masuk (`main`, `Module._compile`).

### 8.1 Membaca dari atas atau bawah?

- **Cari lokasi error** (frame pertama, file kamu sendiri) → mulai dari atas.
- **Pahami alur pemanggilan** ("kenapa fungsi ini jalan?") → baca dari bawah ke atas.

### 8.2 Nama fungsi yang baik = stack trace yang baik

Perhatikan `tampilkanUser` muncul dengan nama. Bandingkan dengan anonymous function:

```js
[1, 2, 3].map(function (n) {
  return n.besar(); // stack trace menyebut <anonymous> — lebih sulit dilacak
});
```

Beri nama fungsi penting (atau gunakan arrow yang diberi nama lewat variabel) agar stack trace informatif:

```js
const olahAngka = (n) => n.besar();
[1, 2, 3].map(olahAngka); // stack trace menyebut "olahAngka"
```

### 8.3 Source maps

Kode yang kamu tulis (TS/JSX) sering **di-compile** sebelum jalan, jadi baris di stack trace bisa menunjuk ke kode hasil build, bukan file aslimu. **Source map** adalah file pemetaan yang membuat debugger & stack trace menunjuk balik ke file sumber.

- Di Node + `tsx`, source map ditangani otomatis — stack trace biasanya menunjuk file `.ts` aslimu.
- Di build tool (Vite, esbuild, tsc), pastikan opsi `sourceMap` aktif saat development.
- Di browser, DevTools otomatis memakai source map sehingga kamu melihat file `.ts`, bukan bundle.

Kalau baris di stack trace "tidak cocok" dengan kode yang kamu tulis, curigai source map tidak aktif.

---

## 9. Teknik Debugging

Debugging = proses **mencari tahu keadaan sebenarnya** dari program, lalu membandingkannya dengan yang kamu **duga**. Semua teknik di bawah ini melayani tujuan itu.

### 9.1 `console.log` terarah (bukan berserakan)

`console.log` masih alat terbaik **kalau dipakai dengan sengaja**. Kuncinya: cetak **nilai + konteks**, dan lakukan hipotesis sebelum mencetak.

```js
function hitungTotal(items) {
  console.log("hitungTotal dipanggil dengan", items.length, "item");

  let total = 0;
  for (const item of items) {
    console.log("item:", item.id, "harga:", item.harga);
    total += item.harga;
  }

  console.log("total akhir:", total);
  return total;
}
```

Bandingkan dengan `console.log("masuk sini")` yang tidak memberi informasi apa pun. Cetak **variabel yang kamu curigai**, bukan sekadar "sampai sini".

Tips: beri label, dan jangan lupa hapus log sementara sebelum commit.

### 9.2 `console.table` — untuk array/object

```js
const users = [
  { id: 1, nama: "Dimas", aktif: true },
  { id: 2, nama: "Sari", aktif: false },
];

console.table(users);
```

Output berbentuk tabel — jauh lebih mudah membandingkan banyak baris daripada `console.log` biasa.

### 9.3 `console.time` / `console.timeEnd` — mengukur durasi

```js
console.time("baca-data");
// ... operasi yang diukur ...
console.timeEnd("baca-data"); // baca-data: 123.45ms
```

Berguna saat membandingkan dua pendekatan (mis. loop berurutan vs `Promise.all`).

### 9.4 `console.count` — menghitung pemanggilan

```js
function render() {
  console.count("render dipanggil");
}
render(); // render dipanggil: 1
render(); // render dipanggil: 2
```

Membantu menemukan fungsi yang dipanggil jauh lebih sering dari dugaan (mis. indikasi infinite loop / re-render berlebih nanti di React).

### 9.5 `debugger` statement

Menaruh kata `debugger;` di kode membuat eksekusi **berhenti** di sana ketika DevTools / debugger aktif, dan kamu bisa memeriksa variabel saat itu.

```js
function proses(data) {
  const hasil = transform(data);
  debugger; // eksekusi berhenti di sini saat DevTools terbuka
  return hasil;
}
```

Jangan tinggalkan `debugger;` di kode yang di-commit.

### 9.6 Breakpoint di DevTools / VS Code

Breakpoint = `debugger` tanpa mengubah kode. Klik nomor baris di editor untuk menandainya.

- **VS Code**: buka panel *Run and Debug*, buat konfigurasi (untuk Node: pilih "Node.js"), jalankan, lalu klik gutter kiri pada baris yang dicurigai.
- **Browser DevTools**: tab *Sources*, buka file, klik nomor baris. Untuk kode yang di-bundle, sumber asli muncul berkat source map.

Saat berhenti di breakpoint, kamu bisa:

- **Hover** variabel untuk melihat nilainya saat itu.
- **Watch** — tambahkan ekspresi (mis. `user.alamat`) ke panel Watch; nilainya diperbarui setiap kali eksekusi berhenti.
- **Call Stack panel** — lihat tumpukan fungsi yang sedang aktif, persis seperti membaca stack trace tapi "hidup".
- **Step over** (jalankan baris ini), **Step into** (masuk ke dalam fungsi), **Step out** (keluar dari fungsi), **Continue** (lanjut ke breakpoint berikutnya).

> **Kapan pakai debugger daripada `console.log`?** Saat kamu perlu melihat **banyak nilai sekaligus**, saat masalahnya soal **urutan** eksekusi, atau saat kamu tidak tahu nilai mana yang salah. Debugger lebih kuat, tapi lebih lambat disiapkan — untuk kasus cepat, `console.log` lebih efisien.

### 9.7 Membaca call stack saat breakpoint

Panel call stack menunjukkan: fungsi yang sedang berjalan (paling atas) sampai `main`. Klik frame mana pun untuk melihat **variabel lokal di frame itu**. Ini cara tercepat memahami "kok fungsi ini bisa dipanggil dari sini?".

---

## 10. Scientific Debugging — Hipotesis & Uji

Cara paling umum orang debugging salah: **mengubah-ubah kode secara acak** sampai jalan. Itu bukan debugging, itu judi. Debugging yang baik seperti eksperimen ilmiah:

1. **Amati** — apa yang terjadi? Apa yang seharusnya terjadi? Di mana bedanya?
2. **Hipotesis** — buat tebakan spesifik dan bisa diuji: *"Saya duga `user.alamat` adalah `undefined` karena API tidak mengirim field itu."*
3. **Uji** — lakukan **satu** perubahan/pengecekan untuk menguji hipotesis (tambah log, breakpoint, atau tes kecil).
4. **Simpulkan** — hipotesis benar → perbaiki akar masalah; salah → buat hipotesis baru. Jangan langsung ubah kode sebelum tahu penyebabnya.
5. **Verifikasi** — setelah perbaikan, buktikan bug **hilang** dan tidak ada regresi.

Contoh:

> **Gejala:** total keranjang selalu `0` padahal ada item.
> **Hipotesis:** `item.harga` bertipe string, sehingga `total += item.harga` malah menyambung string / `NaN`.
> **Uji:** `console.log(typeof items[0].harga)` → hasilnya `"string"`.
> **Perbaikan:** konversi eksplisit: `total += Number(item.harga)`.
> **Verifikasi:** total benar, dan cek item dengan harga `"0"` tetap benar.

> **Aturan emas:** perbaiki **penyebab**, bukan **gejala**. Menambah `if (total === 0) total = ...` hanya menutupi masalah dan akan kembali di kasus lain.

---

## 11. Kesalahan Runtime Umum & Cara Mendiagnosisnya

| Gejala / pesan | Penyebab umum | Cara mendiagnosis |
| --- | --- | --- |
| `Cannot read properties of undefined (reading 'x')` | Mengakses properti dari `undefined`/`null` | Cek dari mana objek itu berasal; validasi data API; pakai optional chaining `?.` bila kosong itu wajar |
| `x is not a function` | Memanggil nilai yang bukan function; salah impor/typo | `console.log(typeof x)`; cek nama method; cek default vs named import |
| `Cannot access 'x' before initialization` | TDZ — akses `let`/`const` sebelum deklarasi | Pindahkan deklarasi ke atas, atau cek urutan eksekusi |
| `x is not defined` | Nama salah / variabel di scope lain | Cek ejaan & scope; pastikan variabel benar-benar di-deklarasikan |
| `NaN` menyebar ke perhitungan | Konversi angka gagal (`Number("abc")`) | `console.log` input sebelum dihitung; validasi dengan `Number.isNaN` |
| `undefined` muncul di string | Nilai belum diisi / field tidak ada | Cek sumber data; beri default `?? ""` |
| Perbandingan object selalu `false` | Membandingkan reference, bukan isi | Bandingkan field satu per satu, atau deep-equal |
| `Unexpected token` / `SyntaxError` | Kurung/kutip/koma tidak seimbang | Lihat baris yang disebut; cek blok sebelumnya |
| Loop tak berhenti / app hang | Kondisi `while` tidak pernah `false`, atau `await` hilang | Cek kondisi loop; pastikan `await` di dalam `async` |
| Angka jadi `"12"` (string) | Penjumlahan string + number | Cek `typeof`; konversi eksplisit ke `Number` |
| `await` tidak menunggu | Lupa `await`, atau pakai `forEach(async ...)` | Cek apakah hasil promise di-`await`; ganti `forEach` → `for...of` |

### 11.1 Optional chaining & nullish coalescing

Dua operator yang mengurangi `TypeError` saat data mungkin kosong:

```js
const user = null;

// ❌ TypeError
// console.log(user.alamat.kota);

// ✅ aman: berhenti dan hasilkan undefined kalau salah satu kosong
console.log(user?.alamat?.kota); // undefined

// ?? hanya memakai default kalau kiri null/undefined (bukan "" atau 0)
const nama = user?.nama ?? "Tamu"; // "Tamu"
```

Ingat bedanya dengan `||`: `0 || "x"` menghasilkan `"x"` (karena `0` falsy), sedangkan `0 ?? "x"` menghasilkan `0`. Untuk nilai yang sah bisa `0`/`""`, pakai `??`.

---

## 12. Logging yang Baik

`console.log` untuk debugging sementara; **logging** untuk jejak jangka panjang (produksi). Prinsipnya:

1. **Sertakan konteks, bukan hanya pesan.** "gagal" tidak berguna; "Gagal memuat profil userId=42 setelah 3 percobaan" berguna.
2. **Pakai level yang tepat** (di Node/browser ada `console.info`, `console.warn`, `console.error`). Nanti di produksi ini dipetakan ke level log (info/warn/error).
3. **Jangan log data sensitif** — password, token, data pribadi. Ini juga bagian keamanan di JD.
4. **Log di batas penting**, bukan di setiap baris: saat operasi keluar/masuk, saat error, saat keputusan penting.
5. **Struktur yang konsisten** memudahkan pencarian. Contoh sederhana:

```js
function logError(konteks, err) {
  console.error(`[${konteks}] ${err.name}: ${err.message}`);
  if (err.cause) console.error("  penyebab:", err.cause.message);
}

try {
  // ...
} catch (err) {
  logError("muatProfil", err);
}
```

> Di fase lanjut (Node/backend) kamu akan memakai logger sungguhan (mis. Pino) yang menghasilkan log terstruktur (JSON). Konsepnya sama: **konteks + level + jangan data sensitif**.

---

## 13. Defensive Programming & Validasi Input

Defensive programming = mengasumsikan input bisa salah, dan menanganinya secara eksplisit di **batas** fungsi. Jangan percaya data dari luar (user, API, file, database).

### 13.1 Validasi di awal fungsi (early return)

```js
function hitungRataRata(nilai) {
  if (!Array.isArray(nilai)) {
    throw new TypeError("nilai harus berupa array");
  }
  if (nilai.length === 0) {
    return 0; // atau throw, tergantung kontrak
  }

  const total = nilai.reduce((a, b) => a + b, 0);
  return total / nilai.length;
}
```

Validasi **di awal** membuat fungsi "gagal cepat" (fail fast) dan sisa kodenya bisa mengasumsikan input sudah benar.

### 13.2 Bedakan validasi dari paranoia

Validasi yang baik **menyatakan kontrak** fungsi. Validasi berlebihan (memeriksa hal yang secara bahasa tidak mungkin terjadi) malah menambah kode mati. Aturannya:

- Validasi **batas sistem**: input dari user, response API, isi file, argumen fungsi publik.
- Jangan validasi ulang data internal yang sudah dijamin tipenya (terutama di TypeScript).

### 13.3 TypeScript sebagai lapisan pertama

TypeScript menangkap banyak kesalahan **sebelum** runtime:

```ts
function sapa(nama: string): string {
  return `Halo, ${nama}`;
}

// sapa(42); // ❌ error saat compile, bukan saat runtime
```

Tapi ingat: **tipe tidak memvalidasi data dari luar** (API/file bisa mengembalikan apa saja walau tipenya diklaim `User`). Karena itu validasi runtime tetap perlu di boundary.

---

## 14. Jangan Menelan Error (Empty Catch)

Kesalahan paling berbahaya: menangkap error lalu **tidak melakukan apa pun**.

```js
// ❌ ANTI-PATTERN: error hilang tanpa jejak
try {
  await simpanData(data);
} catch (err) {
  // diam saja
}
```

Akibatnya: aplikasi "terlihat jalan" tapi data tidak tersimpan, dan tidak ada petunjuk apa pun. Saat bug muncul di produksi, kamu buta.

Pilihan yang benar saat menangkap:

1. **Tangani** — pulihkan / tampilkan pesan / lakukan fallback.
2. **Tambahkan konteks lalu lempar lagi** — `throw new Error("...", { cause: err })`.
3. **Log** — kalau memang tidak bisa dipulihkan, minimal catat.

```js
// ✅ menangani dengan fallback + log
try {
  await simpanData(data);
} catch (err) {
  logError("simpanData", err);
  await simpanKeAntrian(data); // fallback: simpan untuk dicoba lagi nanti
}
```

Kadang kamu **sengaja** mengabaikan error tertentu (mis. `JSON.parse` gagal saat membaca cache → anggap cache kosong). Itu boleh, tapi harus **eksplisit** dan diberi komentar:

```js
let cache = {};
try {
  cache = JSON.parse(isiFile);
} catch {
  // sengaja diabaikan: cache rusak/kosong itu kondisi normal, pakai {} sebagai default
  cache = {};
}
```

Perhatikan `catch {}` tanpa variabel — itu **bukan** empty catch yang menelan, karena ada komentar & penanganan (fallback `{}`). Yang dilarang adalah `catch {}` yang benar-benar tidak berbuat apa-apa.

---

## 15. Latihan Debug — Kode Rusak, Temukan Bug

Untuk setiap potongan: **tulis dulu** dugaanmu (jenis error & penyebab) sebagai komentar, baru jalankan/verifikasi. Tujuannya melatih [scientific debugging](#10-scientific-debugging--hipotesis--uji), bukan menebak.

### Latihan 1 — Rata-rata yang aneh

```js
function rataRata(angka) {
  let total = 0;
  for (const n of angka) {
    total += n;
  }
  return total / angka.length;
}

console.log(rataRata([10, 20, 30]));       // 20
console.log(rataRata([]));                  // ??? apa hasilnya?
console.log(rataRata([10, "20", 30]));      // ??? kenapa?
```

Pertanyaan: Apa hasil dua pemanggilan terakhir, dan **kenapa**? Perbaiki agar input tidak valid ditolak dengan jelas.

### Latihan 2 — Data dari API

```js
function namaKota(user) {
  return user.alamat.kota.toUpperCase();
}

const u1 = { nama: "Dimas", alamat: { kota: "Jakarta" } };
const u2 = { nama: "Sari" }; // tidak punya alamat

console.log(namaKota(u1));
console.log(namaKota(u2)); // error apa? kenapa?
```

Pertanyaan: Error apa yang muncul dan di baris mana? Perbaiki agar `u2` tidak membuat program crash, tanpa menyembunyikan informasi.

### Latihan 3 — Empty catch yang menipu

```js
function simpanProfil(profil) {
  try {
    if (!profil.nama) {
      throw new Error("nama wajib diisi");
    }
    // ... simpan ke storage ...
    return true;
  } catch (err) {
    return false;
  }
}

console.log(simpanProfil({ nama: "Dimas" })); // true
console.log(simpanProfil({}));                // false  <-- tapi kenapa gagal?
```

Pertanyaan: Kode ini mengembalikan `false` tanpa menjelaskan apa pun. Apa masalahnya, dan bagaimana memperbaikinya agar pemanggil tahu **kenapa** gagal?

### Latihan 4 — Async yang tidak menunggu

```js
async function ambilSemua(ids) {
  const hasil = [];
  ids.forEach(async (id) => {
    const data = await ambilData(id);
    hasil.push(data);
  });
  return hasil; // sering kosong / tidak lengkap
}
```

Pertanyaan: Kenapa `hasil` sering kosong? Perbaiki dengan dua cara: `for...of` dan `Promise.all`.

### Latihan 5 — Angka jadi string

```js
function tambah(a, b) {
  return a + b;
}

console.log(tambah(2, 3));       // 5
console.log(tambah(2, "3"));     // ??? apa, dan kenapa
console.log(tambah(2, undefined)); // ??? apa, dan kenapa
```

Pertanyaan: Jelaskan hasil dua pemanggilan terakhir, lalu perbaiki agar `tambah` hanya menerima angka (lempar `TypeError` kalau tidak).

### Latihan 6 — `finally` yang mencuri return

```js
function ambilNilai() {
  try {
    return "nilai benar";
  } finally {
    return "nilai salah";
  }
}

console.log(ambilNilai()); // apa yang tercetak? kenapa?
```

Pertanyaan: Jelaskan kenapa hasilnya begitu, dan tulis versi `finally` yang hanya untuk bersih-bersih.

### Latihan 7 — Baca stack trace

Diberikan output error:

```
TypeError: Cannot read properties of undefined (reading 'id')
    at simpan (D:\app\src\store.ts:8:15)
    at proses (D:\app\src\store.ts:14:5)
    at main (D:\app\src\index.ts:3:1)
```

Pertanyaan: Di file & baris mana error terjadi? Fungsi apa yang memanggilnya? Apa hipotesis penyebabnya, dan langkah pertama apa yang kamu lakukan untuk memverifikasi?

### Latihan 8 — Bungkus error dengan `cause`

Diberikan fungsi yang menangkap error lalu melempar pesan baru. Perbaiki agar error asli tidak hilang:

```js
async function muatUser(id) {
  try {
    return await fetch(`/api/users/${id}`).then((r) => r.json());
  } catch (err) {
    throw new Error("gagal memuat user"); // ⚠️ error asli hilang
  }
}
```

---

## 16. Ringkasan Kata Sendiri

Isi bagian ini **tanpa melihat catatan**. Tulis dengan bahasamu, seperti menjelaskan ke teman:

1. Apa bedanya **bug** dan **error**? Beri satu contoh masing-masing.
2. Jelaskan perbedaan `SyntaxError`, `TypeError`, dan `ReferenceError` — kapan masing-masing muncul?
3. Apa fungsi `finally`, dan kenapa **tidak** boleh `return` di dalamnya?
4. Kenapa `throw new Error("x")` lebih baik daripada `throw "x"`?
5. Kapan kamu memilih **`return null`** dan kapan **`throw`**? Beri satu contoh tiap pilihan.
6. Bagaimana kamu membaca stack trace untuk menemukan baris error, dan untuk memahami alur pemanggilan?
7. Apa langkah-langkah **scientific debugging**? Kenapa mengubah kode secara acak itu buruk?
8. Kenapa `try { setTimeout(() => { throw new Error("x") }) } catch {}` **tidak** menangkap error?
9. Apa itu **empty catch**, kenapa berbahaya, dan apa saja pilihan yang benar saat menangkap error?
10. Kapan pakai `console.log` vs **breakpoint + watch + call stack panel**?

> Kalau kamu bisa menjawab 8 dari 10 tanpa melihat catatan, kamu siap lanjut.

---

## Checklist Paham

Centang hanya kalau kamu bisa menjelaskan **tanpa melihat catatan**:

- [ ] Bisa membedakan `SyntaxError`, `TypeError`, `ReferenceError`, `RangeError` dan menyebut penyebab umumnya.
- [ ] Bisa menjelaskan urutan eksekusi `try` → `catch` → `finally`, termasuk kasus `return` di `try`.
- [ ] Bisa membuat custom `Error` subclass dengan properti tambahan dan menangkapnya dengan `instanceof`.
- [ ] Bisa menjelaskan `name`, `message`, `stack`, dan `cause`.
- [ ] Bisa menjelaskan kenapa menangkap error di setiap fungsi itu salah, dan di mana sebaiknya menangkap (boundary).
- [ ] Bisa memilih antara `return` nilai gagal dan `throw`, dengan alasan.
- [ ] Bisa membaca stack trace dan menunjuk file/baris serta jalur pemanggilan.
- [ ] Bisa memakai `console.table`, `console.time`, `console.count`, `debugger`, breakpoint, watch, dan call stack panel.
- [ ] Bisa menjelaskan langkah scientific debugging dan kenapa "coba-coba ubah kode" itu buruk.
- [ ] Bisa menyebut 5 kesalahan runtime umum dan cara mendiagnosisnya.
- [ ] Bisa menjelaskan kenapa **empty catch** berbahaya dan apa penggantinya.
- [ ] Bisa menambahkan validasi input di awal fungsi dan menjelaskan bedanya validasi vs paranoia.

---

## Referensi

- MDN — [Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- MDN — [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) (properti `name`, `message`, `stack`, `cause`)
- MDN — [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- MDN — [throw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)
- MDN — [Optional chaining `?.`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- MDN — [Nullish coalescing `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- Chrome DevTools — [Debug JavaScript](https://developer.chrome.com/docs/devtools/javascript/) (breakpoint, watch, call stack, source maps)
- VS Code Docs — [Debugging](https://code.visualstudio.com/docs/editor/debugging)
- Node.js Docs — [Errors](https://nodejs.org/api/errors.html) (error bawaan Node & pola penanganannya)

---

*Catatan ini bagian dari `phase-01-fundamentals`. Setelah selesai, kerjakan latihan di `exercises/07/`, lalu lanjut ke materi berikutnya dan project `cli-data-tool`.*
