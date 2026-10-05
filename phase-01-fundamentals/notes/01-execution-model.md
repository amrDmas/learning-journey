# Notes 01 — Model Eksekusi JavaScript (Execution Model)

> Ini catatan paling penting di Phase 01. Kalau kamu paham isi file ini, separuh teka-teki "kenapa kode ini jalan begitu?" sudah terjawab.
>
> Prasyarat: sudah bisa menulis variabel, `if`, `for`, dan `function` dasar.
> Cara pakai: baca → jalankan contohnya sendiri di terminal/Node → **sebelum** melihat jawaban, tulis prediksimu dulu di kertas/editor.

---

## 0. Cara berpikir yang ingin dibangun

Banyak orang belajar JS dengan hafalan: "kalau `var` di dalam for, pakai `let` biar benar". Itu tidak cukup. Yang membuatmu jadi engineer adalah bisa menjawab pertanyaan **"kenapa"**:

- Kenapa variabel ini bernilai `undefined` padahal belum aku deklarasikan di baris itu?
- Kenapa dua variabel bisa "saling mengubah" padahal aku tidak menyuruhnya?
- Kenapa fungsi kecil ini bisa mengingat nilai dari fungsi lain yang sudah selesai jalan?
- Kenapa program lambat / memori naik terus?

Semua jawaban itu bersumber dari **empat konsep**:

1. **Call stack** — di mana kode "sedang berjalan".
2. **Memory (stack vs heap)** — di mana data disimpan.
3. **Scope & closure** — siapa yang boleh melihat variabel apa.
4. **Garbage collection** — kapan data dibuang.

Sisa catatan ini membangun mental model tersebut dari nol.

---

## 1. Perjalanan kode: dari teks sampai dijalankan

Kamu menulis file `.js` berisi teks. Komputer tidak menjalankan teks; komputer menjalankan instruksi mesin. Jadi ada rantai terjemahan.

```
kode sumber (.js / .ts)
      │  di-parse
      ▼
   AST (Abstract Syntax Tree)
      │  dikompilasi
      ▼
  bytecode  ──►  dijalankan oleh interpreter
      │  (kalau sering dipakai & dianggap "panas")
      ▼
 kode mesin (machine code) lewat JIT compiler
```

### 1.1 Parser → AST

**Parser** membaca teks dan memeriksa apakah sintaksnya valid. Hasilnya adalah **AST**: struktur pohon yang merepresentasikan kode.

```js
const total = harga + pajak;
```

Secara mental, AST-nya kira-kira:

```
VariableDeclaration (const)
└── VariableDeclarator
    ├── id: Identifier "total"
    └── init: BinaryExpression (+)
        ├── left:  Identifier "harga"
        └── right: Identifier "pajak"
```

Kenapa ini penting? Karena semua tooling modern bekerja di level AST, bukan di level teks:

- **TypeScript** mem-parse lalu memeriksa tipe.
- **Prettier** mem-parse lalu mencetak ulang dengan format rapi.
- **ESLint** mem-parse lalu mencari pola berbahaya.
- **Babel / esbuild** mem-parse lalu menulis ulang kode ke versi JS yang lebih tua.

Kalau kode punya **SyntaxError**, itu terjadi di tahap parse — kode tidak pernah sampai dijalankan sama sekali.

### 1.2 Interpreter, bytecode, dan JIT

Setelah AST, engine (mis. **V8** di Chrome & Node.js) tidak langsung menerjemahkan semuanya ke kode mesin. Ia mengompilasi AST menjadi **bytecode** — instruksi level-menengah yang lebih sederhana.

V8 punya beberapa "tahap" yang bekerja bersama:

| Komponen (V8) | Peran singkat |
|---|---|
| **Ignition** | Interpreter. Menjalankan bytecode. Cepat mulai, tapi per instruksi lebih lambat. |
| **Sparkplug** | Compiler baseline. Menerjemahkan bytecode ke kode mesin sederhana, cepat, tanpa banyak optimasi. |
| **TurboFan** | Optimizing compiler. Menganalisis kode yang **panas** (sering dipanggil) lalu menghasilkan kode mesin yang sangat dioptimalkan. |

**JIT (Just-In-Time)** artinya kompilasi terjadi **saat runtime**, berdasarkan perilaku program yang sebenarnya — bukan sekali di awal seperti bahasa yang dikompilasi penuh.

Kenapa desain "interpreter dulu, baru optimasi belakangan" ini dipakai? Karena ada trade-off:

- Kompilasi penuh ke kode mesin mahal dan lambat saat startup.
- Interpretasi cepat dimulai tetapi lambat saat berjalan.
- JIT mengambil dua-duanya: **mulai cepat**, lalu **semakin cepat** untuk kode yang memang sering dipakai.

**Konsekuensi praktis yang perlu kamu tahu:** kalau kode berubah bentuk saat runtime (mis. sebuah fungsi kadang menerima `number`, kadang `string`), compiler bisa "batal optimasi" (deoptimization) dan kembali ke bytecode. Inilah alasan versi kode yang **konsisten tipe-nya** cenderung lebih cepat. Di TypeScript, tipe membantumu menulis kode yang konsisten — walau tipe TS sendiri tidak ada saat runtime.

> Catatan: nama komponen (Ignition, Sparkplug, TurboFan) adalah detail implementasi V8 dan bisa berubah antar versi. Konsep umumnya — *parse → AST → bytecode → interpreter + JIT* — berlaku di semua engine JS modern.

### 1.3 Dua fase besar: creation vs execution

Satu hal krusial: sebelum mengeksekusi baris pertama, engine melakukan **fase creation** (persiapan). Pada fase ini ia:

- Menyiapkan **global scope**.
- Mendaftarkan (menaikkan / *hoist*) deklarasi `var` dan `function` — lihat bagian 7.
- Menyiapkan `this` dan variabel global lain.

Setelah itu baru masuk **fase execution** baris per baris. Banyak "keanehan" JS hanya masuk akal kalau kamu ingat bahwa ada fase persiapan ini.

---

## 2. Call stack & stack frame

**Call stack** adalah struktur data (stack = tumpukan, LIFO: *last in, first out*) yang melacak **fungsi mana yang sedang berjalan**.

Setiap kali sebuah fungsi dipanggil, engine membuat **stack frame** untuknya. Frame menyimpan:

- Parameter & variabel lokal fungsi itu.
- Alamat "titik kembali" — baris mana yang harus dilanjutkan setelah fungsi selesai.
- Nilai `this` (kalau ada).

Saat fungsi selesai, frame-nya **di-pop** (dibuang) dari tumpukan.

### 2.1 Contoh trace

```js
function multiply(a, b) {
  return a * b;
}

function area(width, height) {
  const result = multiply(width, height);
  return result;
}

function main() {
  const total = area(3, 4);
  console.log(total);
}

main(); // 12
```

Trace call stack dari waktu ke waktu:

| Langkah | Kejadian | Isi call stack (bawah → atas) |
|---|---|---|
| 1 | Program mulai | `[ (global) ]` |
| 2 | `main()` dipanggil | `[ (global), main ]` |
| 3 | `area(3, 4)` dipanggil | `[ (global), main, area ]` |
| 4 | `multiply(3, 4)` dipanggil | `[ (global), main, area, multiply ]` |
| 5 | `multiply` selesai, `return 12` | `[ (global), main, area ]` |
| 6 | `area` selesai, `return 12` | `[ (global), main ]` |
| 7 | `console.log(12)` selesai | `[ (global), main ]` |
| 8 | `main` selesai | `[ (global) ]` |

Perhatikan: **fungsi yang dipanggil terakhir selesai lebih dulu** (LIFO). Itulah kenapa disebut *stack*.

### 2.2 Kenapa ini penting: stack trace & stack overflow

Ketika error terjadi, pesan `at multiply (file.js:2:10)` yang kamu lihat adalah **snapshot dari call stack**. Belajar membaca stack trace = belajar membaca jejak ini dari atas ke bawah.

Dan kalau fungsi memanggil dirinya tanpa henti:

```js
function recurse() {
  return recurse();
}
recurse(); // RangeError: Maximum call stack size exceeded
```

Setiap panggilan menambah frame, tetapi tidak ada yang di-pop. Tumpukan punya **batas ukuran** (pada V8/Node.js default sekitar **10.000–15.000 frame** — dapat berubah lewat flag `--stack-size` dan berbeda antar engine). Begitu penuh → **stack overflow**. Ini bukan error logika biasa, ini error *struktur eksekusi*.

---

## 3. Memory: stack vs heap

Data di program JS hidup di dua area utama:

| | **Stack** | **Heap** |
|---|---|---|
| Isinya | Nilai primitif & referensi (alamat) | Objek, array, fungsi, closure |
| Ukuran | Kecil, terbatas | Besar, fleksibel |
| Kecepatan | Sangat cepat (cuma geser pointer) | Lebih lambat (alokasi dinamis) |
| Masa hidup | Otomatis: hilang saat frame di-pop | Sampai tidak ada yang mereferensikannya (GC) |
| Susunan | Rapi, LIFO | Tersebar (tidak berurutan) |

**Model sederhana yang berguna:**

- **Stack** = meja kerja. Cepat, rapi, hanya untuk yang sedang dipakai.
- **Heap** = gudang. Besar, bisa menampung apa saja, tapi butuh pengelolaan (garbage collector).

### 3.1 Nilai vs referensi di memori

```js
const umur = 25;              // angka (primitif) → nilainya di stack
const nama = "Dimas";         // string (primitif) → nilainya di stack
const user = { nama: "Dimas", umur: 25 }; // objek → datanya di HEAP,
                                          // variabel di stack menyimpan ALAMAT ke heap
```

Secara visual:

```
STACK                          HEAP
┌───────────────┐
│ umur  = 25    │
│ nama  = "Dimas"│
│ user  = 0x1A2 ───────────►  ┌───────────────────────────┐
└───────────────┘              │ { nama: "Dimas", umur: 25 }│
                               └───────────────────────────┘
```

Yang disimpan variabel objek **bukan objeknya**, melainkan **alamat (referensi)** ke objek di heap. Inilah kunci untuk memahami bagian berikutnya.

> Detail teknis: V8 mengoptimalkan banyak hal (mis. *small integers* dan *tagged pointers*). Model "primitif di stack, objek di heap" adalah penyederhanaan yang akurat secara konseptual dan cukup untuk 95% kasus. Jangan jadikan alasan untuk berdebat implementasi — fokus ke **semantik** yang kamu rasakan di kode.

---

## 4. Primitive vs reference (value vs reference semantics)

### 4.1 Primitive: disalin berdasarkan nilai

Primitif di JS: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`.

```js
let a = 10;
let b = a;   // b menyalin NILAI 10
b = 20;

console.log(a); // 10  → a tidak terpengaruh
console.log(b); // 20
```

`a` dan `b` adalah dua kotak terpisah yang masing-masing menyimpan angka. Mengubah `b` tidak menyentuh `a`.

### 4.2 Objek: disalin berdasarkan referensi

Objek (termasuk array dan fungsi) berperilaku berbeda:

```js
const a = { n: 1 };
const b = a;      // b menyalin ALAMAT, bukan objeknya
b.n = 2;

console.log(a.n); // 2  ← a "ikut berubah"!
```

Kenapa? Karena `a` dan `b` menunjuk ke **objek yang sama** di heap:

```
STACK                     HEAP
a = 0x1A2 ──┐
            ├──────►  { n: 2 }
b = 0x1A2 ──┘
```

Hanya ada **satu** objek. Ada **dua** variabel yang menunjuk ke sana.

### 4.3 Konsekuensi: parameter fungsi

Argumen objek diteruskan dengan referensi yang disalin:

```js
function mutate(o) {
  o.n = 99;        // mengubah objek yang SAMA → terlihat oleh pemanggil
  o = { n: 0 };    // menugaskan ULANG parameter lokal → TIDAK terlihat pemanggil
}

const data = { n: 1 };
mutate(data);

console.log(data.n); // 99
```

Baca ulang dua baris di dalam `mutate`:

- `o.n = 99` → kita menembus referensi dan mengubah isi objek. Pemanggil melihatnya.
- `o = { n: 0 }` → kita hanya mengubah **ke mana variabel lokal `o` menunjuk**. Variabel `data` di pemanggil masih menunjuk ke objek lama.

**Kalimat kunci:** *mengubah isi objek* ≠ *mengganti referensi*. Ini sumber bug paling umum bagi pemula.

### 4.4 `const` tidak berarti "tidak bisa berubah"

```js
const user = { nama: "Dimas" };
user.nama = "Dimas Prasetyo"; // ✅ boleh — isi objek berubah
user = { nama: "Lain" };      // ❌ TypeError: Assignment to constant variable
```

`const` mengunci **binding** (variabel tidak boleh menunjuk ke alamat lain), **bukan** isi objeknya. Untuk mengunci isi, pakai `Object.freeze()` (dangkal) atau pola lain.

### 4.5 Perbandingan

```js
console.log(1 === 1);                     // true  (nilai sama)
console.log("a" === "a");                 // true

console.log({} === {});                   // false (dua objek berbeda di heap)
console.log([] === []);                   // false

const x = { n: 1 };
const y = x;
console.log(x === y);                     // true  (alamat sama)
```

Aturan: `===` pada primitif membandingkan **nilai**; pada objek membandingkan **identitas** (alamat), bukan bentuk.

### 4.6 Menyalin objek dengan benar

```js
const asli = { n: 1, nested: { v: 5 } };

// Shallow copy: hanya level pertama yang disalin
const dangkal = { ...asli };
dangkal.n = 99;             // aman: tidak memengaruhi asli.n
dangkal.nested.v = 100;     // BAHAYA: nested masih objek yang sama!
console.log(asli.nested.v); // 100  ← asli ikut berubah

// Deep copy: semua level disalin (struktur data sederhana)
const dalam = structuredClone(asli); // tersedia di Node.js modern & browser modern
dalam.nested.v = 7;
console.log(asli.nested.v); // 100 ← asli aman
```

> `structuredClone` tidak bisa menyalin fungsi atau beberapa objek khusus (mis. DOM node, beberapa class instance). Untuk data JSON murni, `JSON.parse(JSON.stringify(x))` juga bisa — dengan keterbatasan yang sama (tidak menyalin `undefined`, `Date` berubah jadi string, dll).

---

## 5. Scope

**Scope** = wilayah di mana sebuah variabel "terlihat" dan bisa diakses.

JS punya tiga jenis scope utama:

### 5.1 Global scope

```js
const appName = "Learning Journey"; // global

function show() {
  console.log(appName); // bisa diakses dari mana saja
}
show();
```

### 5.2 Function scope

```js
function hitung() {
  const hasil = 42; // hanya hidup di dalam hitung()
  console.log(hasil);
}

hitung();       // 42
console.log(hasil); // ❌ ReferenceError: hasil is not defined
```

Setiap pemanggilan fungsi membuat scope baru. Dua pemanggilan = dua scope terpisah.

### 5.3 Block scope

Dibuat oleh `{ ... }` — misalnya blok `if`, `for`, atau blok telanjang:

```js
if (true) {
  const diDalam = "hanya di dalam blok";
  console.log(diDalam); // ✅
}
console.log(diDalam);   // ❌ ReferenceError
```

**Penting:** `var` **mengabaikan** block scope; `let`/`const` **menghormatinya**.

```js
{
  var a = 1;
  let b = 2;
}
console.log(a); // 1  ← bocor keluar blok
console.log(b); // ❌ ReferenceError
```

### 5.4 Shadowing

Variabel di scope dalam dapat **menutupi** variabel di scope luar dengan nama yang sama:

```js
const nilai = "luar";

function test() {
  const nilai = "dalam"; // menutupi (shadow) yang luar
  console.log(nilai);    // "dalam"
}

test();
console.log(nilai);      // "luar"
```

Scope luar tidak terpengaruh. Ini legal, tetapi sering membingungkan — pakai dengan sadar.

---

## 6. Lexical scope

**Lexical scope** (a.k.a. static scope) adalah aturan: *scope ditentukan oleh posisi kode saat ditulis, bukan oleh dari mana fungsi dipanggil.*

Artinya, fungsi "melihat" variabel di **tempat ia didefinisikan**, bukan di tempat ia dipanggil.

```js
const warna = "merah";

function cetak() {
  console.log(warna); // mencari 'warna' dari tempat cetak DITULIS
}

function lain() {
  const warna = "biru";
  cetak(); // meski dipanggil dari sini, cetak tetap melihat "merah"
}

lain(); // "merah"
```

Kalau JS memakai *dynamic scope*, hasilnya akan `"biru"`. Tapi JS memakai lexical scope → hasilnya `"merah"`.

### 6.1 Scope chain

Ketika sebuah nama dicari, engine menelusuri **rantai scope** dari yang paling dalam ke luar:

```js
const level1 = "L1";

function outer() {
  const level2 = "L2";

  function inner() {
    const level3 = "L3";
    console.log(level3); // ditemukan di scope sendiri
    console.log(level2); // naik satu tingkat
    console.log(level1); // naik lagi ke global
    console.log(levelX); // ❌ tidak ditemukan di mana pun → ReferenceError
  }

  inner();
}

outer();
```

Pencarian berhenti pada kecocokan pertama. Inilah fondasi dari **closure** (bagian 9): karena fungsi membawa "lingkungan leksikal" tempat ia lahir.

---

## 7. Hoisting & Temporal Dead Zone (TDZ)

### 7.1 Apa itu hoisting

**Hoisting** = pada fase creation, engine "mengangkat" deklarasi ke atas scope-nya. Tetapi **cara** mengangkatnya berbeda per jenis deklarasi:

| Deklarasi | Apa yang di-hoist | Nilai awal |
|---|---|---|
| `function deklarasi` | Fungsi **utuh** (badan fungsinya ikut) | Bisa langsung dipanggil |
| `var` | Nama variabelnya saja | `undefined` |
| `let` / `const` | Nama variabelnya saja | **TDZ** (belum bisa diakses) |
| `class` | Nama class-nya saja | **TDZ** |

### 7.2 Function declaration di-hoist penuh

```js
sayHi(); // "hi" — berhasil walau dipanggil sebelum dideklarasikan

function sayHi() {
  console.log("hi");
}
```

### 7.3 `var` di-hoist sebagai `undefined`

```js
console.log(nilai); // undefined  (BUKAN ReferenceError)
var nilai = 5;
console.log(nilai); // 5
```

Kode di atas secara mental sama dengan:

```js
var nilai;          // diangkat, nilainya undefined
console.log(nilai); // undefined
nilai = 5;
console.log(nilai); // 5
```

### 7.4 TDZ: `let` dan `const`

```js
console.log(nilai); // ❌ ReferenceError: Cannot access 'nilai' before initialization
let nilai = 5;
```

Variabel `let`/`const` **ada** sejak awal blok (di-hoist), tetapi berada di **Temporal Dead Zone** — zona waktu antara masuk blok dan baris deklarasinya. Menyentuhnya di zona itu = error.

TDZ berlaku sampai baris deklarasi dijalankan, dan berlaku **per blok**:

```js
let x = 1;

function f() {
  console.log(x); // ❌ ReferenceError (TDZ)
  let x = 2;      // x lokal ini "menutupi" x global untuk seluruh fungsi
}

f();
```

Meski ada `x` global, di dalam `f` nama `x` terikat ke `x` lokal yang belum diinisialisasi → TDZ.

**Detail penting:** `typeof` biasanya "aman" untuk variabel yang tidak ada, tetapi **tetap melempar error** untuk variabel dalam TDZ:

```js
console.log(typeof belumAda); // "undefined" (variabel tidak pernah dideklarasikan)
console.log(typeof nanti);    // ❌ ReferenceError (nanti ada tapi masih TDZ)
let nanti = 1;
```

---

## 8. `var` vs `let` vs `const`

| Aspek | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function scope | Block scope | Block scope |
| Hoisting | Ya, nilai awal `undefined` | Ya, tetapi TDZ | Ya, tetapi TDZ |
| Bisa di-reassign | ✅ | ✅ | ❌ |
| Bisa dideklarasikan ulang dalam scope yang sama | ✅ | ❌ | ❌ |
| Bisa tanpa nilai awal | ✅ | ✅ | ❌ (wajib diinisialisasi) |
| Sifat | Warisan JS lama | Modern, default | Modern, untuk binding tetap |

```js
var a = 1;
var a = 2;        // ✅ legal (membingungkan!)
let b = 1;
let b = 2;        // ❌ SyntaxError: Identifier 'b' has already been declared
const c = 1;
c = 2;            // ❌ TypeError: Assignment to constant variable
const d;          // ❌ SyntaxError: Missing initializer
```

### 8.1 Pedoman praktis

- **Default ke `const`.** Pakai `let` hanya bila nilainya memang perlu di-reassign (mis. counter, akumulator loop).
- **Hampir tidak pernah pakai `var`** di kode baru.
- `const` pada objek tidak membekukan isinya — lihat 4.4.

---

## 9. Closure

### 9.1 Definisi

**Closure** terjadi ketika sebuah fungsi "mengingat" variabel dari **lingkungan leksikal** tempat ia didefinisikan, bahkan setelah fungsi luar yang membungkusnya selesai dijalankan.

Dengan kata lain: fungsi membawa **scope-nya** bersamanya.

```js
function buatPesan(salam) {
  // 'salam' adalah variabel lokal dari buatPesan
  return function (nama) {
    return `${salam}, ${nama}!`;
  };
}

const sapaPagi = buatPesan("Selamat pagi");
const sapaMalam = buatPesan("Selamat malam");

console.log(sapaPagi("Dimas"));  // "Selamat pagi, Dimas!"
console.log(sapaMalam("Dimas")); // "Selamat malam, Dimas!"
```

Perhatikan: `buatPesan("Selamat pagi")` sudah **selesai** dijalankan (frame-nya sudah di-pop dari call stack). Tetapi `sapaPagi` masih bisa mengakses `salam` = `"Selamat pagi"`.

Bagaimana? Karena `salam` **tidak hidup di stack** frame yang sudah dibuang. Variabel yang ditangkap closure disimpan di **heap**, dan fungsi memegang referensi ke sana. Inilah titik temu antara bagian 3 (stack vs heap) dan bagian 9.

### 9.2 Contoh: counter

```js
function buatCounter() {
  let count = 0;          // "private state"
  return function () {
    count += 1;
    return count;
  };
}

const counterA = buatCounter();
const counterB = buatCounter();

console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterA()); // 3
console.log(counterB()); // 1  ← state terpisah
```

`counterA` dan `counterB` masing-masing menutup atas **`count` yang berbeda**, karena setiap pemanggilan `buatCounter()` membuat scope baru.

### 9.3 Pitfall klasik: loop `var` vs `let`

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log("var:", i);
  }, 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    console.log("let:", j);
  }, 0);
}
```

Output:

```
var: 3
var: 3
var: 3
let: 0
let: 1
let: 2
```

**Kenapa `var` menghasilkan 3, 3, 3?**

- `var i` hanya punya **satu** binding untuk seluruh loop (function scope).
- Ketiga callback menutup atas **`i` yang sama**.
- Callback dijalankan **setelah** loop selesai, saat `i` sudah bernilai `3`.

**Kenapa `let` benar?**

- `let` di header `for` membuat **binding baru untuk setiap iterasi**.
- Setiap callback menutup atas `j` miliknya sendiri → `0`, `1`, `2`.

Cara lama untuk memperbaiki `var` (sebelum `let` ada) adalah membuat scope baru dengan IIFE:

```js
for (var i = 0; i < 3; i++) {
  (function (n) {
    setTimeout(function () {
      console.log("iife:", n);
    }, 0);
  })(i);
}
// iife: 0, iife: 1, iife: 2
```

Ini contoh sempurna: **memahami closure menjelaskan kenapa `let` di loop berperilaku beda.**

### 9.4 Use case 1: factory function

Closure memungkinkan kita "mengonfigurasi" fungsi:

```js
function buatValidator(minLength) {
  return function (teks) {
    return typeof teks === "string" && teks.length >= minLength;
  };
}

const validUsername = buatValidator(3);
const validPassword = buatValidator(8);

console.log(validUsername("dim"));   // true
console.log(validPassword("dim"));   // false
```

### 9.5 Use case 2: memoization

Menangkap cache di closure — pola yang sangat umum untuk performa:

```js
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const hasil = fn(arg);
    cache.set(arg, hasil);
    return hasil;
  };
}

function fibonacciLambat(n) {
  if (n <= 1) return n;
  return fibonacciLambat(n - 1) + fibonacciLambat(n - 2);
}

const fib = memoize(fibonacciLambat);

console.log(fib(30)); // 832040
console.log(fib(30)); // 832040 — instan, diambil dari cache
```

Perhatikan: `cache` **tidak** bisa diakses dari luar. Closure memberimu **enkapsulasi** — data private.

### 9.6 Use case 3: module pattern

Sebelum ES Modules (`import`/`export`) populer, closure dipakai untuk membuat "modul" dengan state private:

```js
const rekening = (function () {
  let saldo = 0; // private — tidak bisa diakses langsung dari luar

  return {
    setor(jumlah) {
      if (jumlah <= 0) throw new Error("Jumlah harus positif");
      saldo += jumlah;
      return saldo;
    },
    ambil(jumlah) {
      if (jumlah > saldo) throw new Error("Saldo tidak cukup");
      saldo -= jumlah;
      return saldo;
    },
    lihatSaldo() {
      return saldo;
    },
  };
})();

console.log(rekening.setor(1000)); // 1000
console.log(rekening.ambil(300));  // 700
console.log(rekening.saldo);       // undefined ← benar-benar private
```

Pola ini masih relevan untuk memahami library lama dan konsep enkapsulasi. Di kode modern, gunakan `class` dengan field private (`#saldo`) atau module scope.

---

## 10. Garbage collection dasar

### 10.1 Ide utama: reachability

JS tidak meminta kamu membebaskan memori manual (`free`, `delete`). Ada **garbage collector (GC)** yang berjalan otomatis.

Aturan intinya: **objek yang "tidak bisa dijangkau lagi" (unreachable) akan dibuang.**

**Root** (titik awal penelusuran) biasanya:

- Variabel global.
- Variabel & parameter yang sedang aktif di call stack.
- Referensi dari closure yang masih hidup.

GC menelusuri dari root, menandai semua yang **bisa dijangkau** (*mark*), lalu membuang yang tidak tertandai (*sweep*). Karena itu algoritma populernya disebut **mark-and-sweep**. (V8 modern memakai varian generational/incremental, tetapi konsep *reachability* tetap jadi dasarnya.)

```js
let user = { nama: "Dimas" }; // objek A bisa dijangkau
user = null;                  // objek A tidak punya referensi lagi
                              // → kandidat untuk dibuang GC
```

Yang penting: **objek hidup selama masih ada yang mereferensikannya** — bukan selama masih ada variabel bernama tertentu.

```js
let a = { n: 1 };
let b = a;     // dua referensi ke objek yang sama
a = null;      // objek TETAP hidup karena b masih menunjuk ke sana
console.log(b.n); // 1
```

### 10.2 Memory leak umum

"Memory leak" di JS bukan berarti GC rusak, melainkan **kita tanpa sadar mempertahankan referensi** ke objek yang sudah tidak kita butuhkan.

**1. Closure menahan referensi besar**

```js
function proses(dataBesar) {
  // ❌ fungsi dalam hanya butuh panjangnya, tetapi menangkap seluruh dataBesar
  return function () {
    return dataBesar.length;
  };
}
```

Di sini closure benar-benar **menahan `dataBesar`**: selama fungsi hasil `proses` masih hidup, seluruh objek besar itu tidak bisa dibuang GC — padahal yang dibutuhkan hanya `length`-nya.

Perbaikan: hitung dulu nilai kecil yang benar-benar dibutuhkan, lalu tutup **hanya nilai itu** — jangan biarkan fungsi dalam menangkap objek besar:

```js
function proses(dataBesar) {
  const ringkasan = dataBesar.length;
  // selesai memakai dataBesar; fungsi dalam tidak menangkapnya lagi
  return function () {
    return ringkasan; // hanya menangkap number kecil
  };
}
```

**2. Event listener tidak dilepas**

```js
function pasang(el) {
  el.addEventListener("click", () => {
    // handler ini menahan `el` dan apa pun yang ditangkapnya
    console.log("diklik");
  });
}
```

Kalau elemen dihapus dari DOM tetapi listener (dan referensi dari luar) masih ada, memori tidak kembali. Di aplikasi besar (mis. React), ini muncul sebagai masalah nyata.

**3. Timer yang tidak dibersihkan**

```js
const id = setInterval(() => {
  // menahan referensi terus-menerus
}, 1000);

// kalau komponen sudah tidak dipakai, WAJIB:
clearInterval(id);
```

**4. Variabel global tak sengaja**

```js
function bug() {
  diam = "aku jadi global"; // lupa 'const'/'let' → bocor ke global (sloppy mode)
}
```

> ⚠️ Ini hanya berlaku pada **sloppy mode** (skrip non-strict). Di **strict mode** — yang merupakan default untuk **ES Modules** dan **TypeScript** — assignment ke identifier yang tidak dideklarasikan justru melempar `ReferenceError: diam is not defined`, bukan membuat global. Jadi bug "variabel global tak sengaja" di atas adalah gejala mode non-strict; di kode TS/modern ia berubah menjadi error yang lebih cepat ketahuan.

**5. Cache yang tumbuh tanpa batas**

`Map`/array yang terus ditambahi tanpa pernah dibersihkan. Gunakan `Map` dengan kebijakan eviksi (mis. LRU) bila perlu.

**Cara mendeteksi (praktik):**

- Chrome DevTools → tab **Memory** → *heap snapshot*: bandingkan dua snapshot, lihat objek yang terus bertambah.
- Tab **Performance** → rekam aktivitas → lihat grafik memori naik terus.
- Node.js: jalankan dengan flag `--inspect` lalu hubungkan DevTools.

---

## 11. Prediksi output

Tulis prediksimu **sebelum** membuka jawaban. Sertakan **alasan** singkat (konsep mana yang dipakai). Kalau salah, baca ulang bagian yang relevan.

**Soal 1**

```js
console.log(typeof a);
var a = 1;
```

**Soal 2**

```js
console.log(typeof b);
let b = 1;
```

**Soal 3**

```js
let x = 1;
function f() {
  console.log(x);
  let x = 2;
}
f();
```

**Soal 4**

```js
const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n);
```

**Soal 5**

```js
const obj = { a: 1 };
function mutate(o) {
  o.a = 99;
  o = { a: 0 };
}
mutate(obj);
console.log(obj.a);
```

**Soal 6**

```js
sayHi();
function sayHi() {
  console.log("hi");
}
sayBye();
var sayBye = function () {
  console.log("bye");
};
```

**Soal 7**

```js
function buatCounter() {
  let c = 0;
  return () => ++c;
}
const inc = buatCounter();
console.log(inc(), inc(), inc());
```

**Soal 8**

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Soal 9**

```js
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
```

**Soal 10**

```js
const a = { n: 1 };
const b = { ...a };
b.n = 2;
console.log(a.n, b.n);
```

**Soal 11**

```js
const asli = { n: { v: 1 } };
const salinan = { ...asli };
salinan.n.v = 99;
console.log(asli.n.v);
```

**Soal 12**

```js
function outer() {
  var hitung = 0;
  return {
    tambah: () => ++hitung,
    ambil: () => hitung,
  };
}
const o1 = outer();
const o2 = outer();
o1.tambah();
o1.tambah();
o2.tambah();
console.log(o1.ambil(), o2.ambil());
```

---

<details>
<summary><strong>Klik untuk melihat jawaban & penjelasan</strong></summary>

### Jawaban Soal 1

Output: `"undefined"`

`var a` di-hoist ke atas scope dengan nilai awal `undefined`. Saat `typeof a` dievaluasi, `a` sudah "ada" tetapi bernilai `undefined`. Tidak error karena `var` tidak punya TDZ.

### Jawaban Soal 2

Output: `ReferenceError: Cannot access 'b' before initialization`

`let b` di-hoist tetapi berada di TDZ. Berbeda dengan `var`, menyentuh `let` sebelum deklarasinya **melempar error** — dan `typeof` **tidak** menyelamatkanmu di sini (ini pengecualian khusus untuk TDZ).

### Jawaban Soal 3

Output: `ReferenceError: Cannot access 'x' before initialization`

Meskipun ada `x` global, di dalam `f` nama `x` terikat ke `x` **lokal** yang dideklarasikan dengan `let`. Deklarasi lokal menutupi (shadow) yang global **untuk seluruh fungsi**, dan pada baris `console.log(x)` lokal tersebut masih di TDZ.

### Jawaban Soal 4

Output: `2`

`b = a` menyalin **referensi**, bukan objek. `a` dan `b` menunjuk ke objek yang sama di heap. Mengubah `b.n` sama dengan mengubah objek tersebut → terlihat dari `a`.

### Jawaban Soal 5

Output: `99`

`o.a = 99` mengubah isi objek yang sama → pemanggil melihatnya. `o = { a: 0 }` hanya menugaskan ulang **variabel lokal** `o`; variabel `obj` di pemanggil tetap menunjuk objek lama. Jadi `obj.a` tetap `99`.

### Jawaban Soal 6

Output:

```
hi
TypeError: sayBye is not a function
```

`function sayHi()` di-hoist **utuh**, jadi bisa dipanggil lebih dulu → `"hi"`. `var sayBye` hanya mengangkat **nama**-nya dengan nilai `undefined`; badan fungsi (assignment) belum dijalankan saat `sayBye()` dipanggil → mencoba memanggil `undefined` → `TypeError`.

### Jawaban Soal 7

Output: `1 2 3`

`c` adalah variabel lokal `buatCounter`. Fungsi yang dikembalikan (closure) menahan referensi ke `c` di heap. Setiap pemanggilan `inc()` menambah dan mengembalikan nilai terbaru. Hanya ada **satu** `c` karena `buatCounter()` dipanggil sekali.

### Jawaban Soal 8

Output:

```
3
3
3
```

`var i` punya satu binding untuk seluruh loop. Ketiga callback menutup atas `i` yang sama dan baru dijalankan setelah loop selesai, saat `i === 3`.

### Jawaban Soal 9

Output:

```
0
1
2
```

`let j` membuat binding **baru per iterasi**. Setiap callback menutup atas `j` miliknya sendiri.

### Jawaban Soal 10

Output: `1 2`

`{ ...a }` melakukan **shallow copy**: properti `n` disalin berdasarkan **nilai** (primitif), jadi `b.n` adalah kotak terpisah. Mengubah `b.n` tidak menyentuh `a.n`.

### Jawaban Soal 11

Output: `99`

Shallow copy hanya menyalin level pertama. `asli.n` dan `salinan.n` menunjuk ke **objek nested yang sama** di heap. Mengubah `salinan.n.v` mengubah objek bersama itu. Untuk menghindari ini, gunakan deep copy (mis. `structuredClone`).

### Jawaban Soal 12

Output: `2 1`

`o1` dan `o2` berasal dari pemanggilan `outer()` yang berbeda → masing-masing punya `hitung` sendiri.
- `o1`: dua kali `tambah()` → `hitung` = 2.
- `o2`: satu kali `tambah()` → `hitung` = 1.

`o1.ambil()` → `2`, `o2.ambil()` → `1`.

</details>

---

## 12. Yang wajib bisa kamu jelaskan dengan kata sendiri

Jangan lanjut sebelum kamu bisa menjelaskan poin-poin ini **tanpa membuka catatan**. Tulis jawabanmu (boleh di file terpisah atau di chat) — mentor akan mereview seperti senior dev.

**Tentang eksekusi:**

- [ ] Jelaskan alur `kode sumber → AST → bytecode → interpreter/JIT` dan **kenapa** JS memakai JIT, bukan kompilasi penuh.
- [ ] Jelaskan apa itu call stack dan kenapa urutannya LIFO.
- [ ] Jelaskan bagaimana membaca stack trace saat error.
- [ ] Jelaskan penyebab `RangeError: Maximum call stack size exceeded`.

**Tentang memori:**

- [ ] Bedakan stack vs heap dan apa saja yang disimpan di masing-masing.
- [ ] Jelaskan kenapa `const a = { n: 1 }; const b = a; b.n = 2;` mengubah `a.n`.
- [ ] Bedakan *mengubah isi objek* vs *mengganti referensi*, dan jelaskan efeknya pada parameter fungsi.
- [ ] Jelaskan kenapa `{} === {}` bernilai `false`.
- [ ] Bedakan shallow copy vs deep copy dan sebutkan satu jebakannya.

**Tentang scope:**

- [ ] Bedakan global, function, dan block scope.
- [ ] Jelaskan lexical scope dengan contoh yang menunjukkan bedanya dari dynamic scope.
- [ ] Jelaskan scope chain saat nama dicari.

**Tentang hoisting & deklarasi:**

- [ ] Jelaskan apa yang di-hoist dari `var`, `let`, `const`, dan `function declaration` — serta nilai awalnya.
- [ ] Jelaskan TDZ dan kenapa `typeof` bisa melempar error untuk variabel TDZ.
- [ ] Jelaskan perbedaan `var` / `let` / `const` dalam tabel di kepalamu, tanpa buka catatan.

**Tentang closure:**

- [ ] Definisikan closure dalam satu kalimat.
- [ ] Jelaskan kenapa closure tetap bisa mengakses variabel setelah fungsi luarnya selesai (hubungkan ke heap).
- [ ] Jelaskan pitfall loop `var` vs `let` dan **kenapa** `let` memperbaikinya.
- [ ] Sebutkan minimal tiga use case closure: factory, memoization, module pattern.

**Tentang garbage collection:**

- [ ] Jelaskan konsep reachability dan root.
- [ ] Jelaskan kenapa `let a = {...}; let b = a; a = null;` tidak membuat objek bisa dibuang.
- [ ] Sebutkan minimal tiga penyebab memory leak umum dan cara menghindarinya.

---

## 13. Referensi

- **MDN Web Docs** — [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (rujukan utama; cari halaman *Closures*, *Hoisting*, *Memory Management*, *Scope*).
- **ECMAScript Language Specification** — [tc39.es/ecma262](https://tc39.es/ecma262/) (untuk yang ingin detail normatif; bagian *Lexical Environments* dan *Execution Contexts*).
- **V8 Blog** — [v8.dev/blog](https://v8.dev/blog) (artikel tentang Ignition, Sparkplug, TurboFan, dan GC).
- **Node.js Docs** — [nodejs.org/docs](https://nodejs.org/docs/latest/api/) (untuk menjalankan contoh dengan `node file.js`).

### Cara menjalankan contoh

Simpan contoh ke file `.js` lalu:

```bash
node namafile.js
```

Untuk contoh TypeScript, simpan sebagai `.ts` dan jalankan dengan runtime/bundler TS pilihanmu (mis. `tsx` atau `ts-node`). Catatan ini fokus pada semantik runtime, jadi contoh ditulis dalam JS agar bisa langsung dijalankan.

---

**Status catatan:** belum selesai dibaca sampai checklist bagian 12 tercentang semua.
