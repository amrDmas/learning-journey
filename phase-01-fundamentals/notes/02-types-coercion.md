# 02 — Types & Coercion (Tipe Data & Pemaksaan Tipe)

> Prasyarat: `notes/01-*` (variabel, statement, eksekusi dasar) | Bagian dari Phase 01 — JavaScript & TypeScript Fundamentals

## Tujuan Catatan Ini

Setelah membaca dan mengerjakan latihan di sini, kamu bisa:

- Menyebutkan 7 tipe primitif dan menjelaskan kenapa "segala hal lain adalah object".
- Memprediksi hasil `typeof` **sebelum** menjalankannya, termasuk kasus aneh (`typeof null`).
- Menjelaskan kapan `==` dan `===` memberi hasil berbeda, dan **kenapa**.
- Menghafal daftar falsy lengkap dan tahu kenapa `[]` justru truthy.
- Menjelaskan kenapa `NaN !== NaN` dan beda `Number.isNaN` vs `isNaN`.
- Tahu batas presisi `Number` dan kapan harus pindah ke `BigInt`.
- Membedakan `undefined` dan `null` secara mental model, bukan sekadar hafalan.
- Tahu bedanya shallow copy dan deep copy, serta kapan `structuredClone` gagal.
- Menjelaskan "pass by value" untuk object tanpa salah kaprah "pass by reference".

**Cara pakai:** setiap blok "Prediksi output" — tulis jawabanmu dulu di kertas/editor, baru jalankan di Node (`node file.js`) atau DevTools console. Salah prediksi itu bagus; di situ letak belajarnya.

---

## 1. Mental Model — Value Punya Tipe, Variable Tidak

Kesalahpahaman umum: "variabel punya tipe". Bukan. **Value yang punya tipe.** Variabel hanyalah *nama* yang menunjuk ke sebuah value.

```js
let x = 42;        // value 42 punya tipe number
x = "empat puluh dua"; // x sekarang menunjuk value string, tipe value-nya berubah
```

Yang penting bukan label di variabel, tapi **value apa yang sedang ditunjuk saat kode dieksekusi**. Ini jadi kunci memahami coercion: JavaScript memutuskan konversi berdasarkan value aktual saat runtime, bukan berdasarkan "niat" kita.

JavaScript punya dua "dunia" value:

1. **Primitive** — value sederhana, immutable (tidak bisa diubah).
2. **Object** — kumpulan properti, mutable (bisa diubah), dan disimpan/dioper sebagai *referensi*.

---

## 2. 7 Tipe Primitif + Object

### Tujuh primitive

| Tipe | Contoh | Catatan |
|---|---|---|
| `string` | `"halo"`, `'a'`, `` `x` `` | Urutan karakter, immutable |
| `number` | `42`, `-0.5`, `NaN`, `Infinity` | Selalu floating point 64-bit (IEEE 754) |
| `boolean` | `true`, `false` | |
| `undefined` | `undefined` | Absen karena default/belum di-set |
| `null` | `null` | Absen secara **sengaja** |
| `symbol` | `Symbol("id")` | Identifier unik (ES2015) |
| `bigint` | `123n`, `9007199254740993n` | Integer besar (ES2020) |

### Object — "sisanya"

Semua yang bukan primitive adalah object. Ini termasuk yang sering dikira tipe sendiri:

- `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`, `Promise`, `Error`, dan semua object literal `{}`.

```js
// Semuanya object
typeof []          // "object"
typeof {}          // "object"
typeof new Date()  // "object"
typeof /abc/       // "object"
typeof new Map()   // "object"
```

> **Jebakan mental model:** `typeof function(){}` mengembalikan `"function"`. Function memang object yang bisa dipanggil (*callable object*), tapi `typeof` memberinya label khusus. Jadi `typeof` bukan cara lengkap memeriksa tipe.

### Cara memeriksa tipe yang lebih andal

```js
Array.isArray([])              // true  — cara resmi cek array
Number.isInteger(3)            // true
value === null                 // satu-satunya cara pasti cek null
```

---

## 3. `typeof` dan Keanehannya

`typeof` mengembalikan **string** yang menyatakan tipe operand.

```js
typeof "halo"        // "string"
typeof 42            // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof 123n          // "bigint"
typeof {}            // "object"
typeof []            // "object"   ← array bukan tipe sendiri
typeof function(){}  // "function" ← special case
typeof null          // "object"   ← BUG historis, bukan salahmu
```

### Kenapa `typeof null === "object"`?

Ini bug dari implementasi JavaScript versi awal (1995). Value disimpan dengan tag; tag untuk object adalah `000`, dan `null` secara tidak sengaja juga bertag `000`. Sudah tidak bisa diperbaiki karena akan memecah jutaan situs. Kita hanya perlu **menghafalnya**.

Karena itu, **jangan** pakai `typeof x === "object"` untuk mendeteksi null:

```js
const v = null;
typeof v === "object"   // true — menyesatkan!
v === null              // true — ini yang benar
```

### `typeof` pada variabel yang belum dideklarasikan

Satu-satunya operator yang **tidak** melempar error untuk identifier yang belum ada:

```js
typeof variabelYangTidakAda   // "undefined" (tidak error)
variabelYangTidakAda          // ReferenceError
```

**Prediksi output:**

```js
console.log(typeof typeof 1);
```

<details>
<summary>Jawaban</summary>

`typeof 1` → `"number"`. Lalu `typeof "number"` → `"string"`. Hasil: `"string"`.
</details>

---

## 4. Primitive vs Object Wrapper (Autoboxing)

Secara desain, primitive **tidak punya** properti atau method. Tapi kok ini jalan?

```js
"halo".toUpperCase()   // "HALO"
(42).toFixed(2)        // "42.00"
true.toString()        // "true"
```

Yang terjadi: JavaScript **sementara** membungkus primitive itu dengan object wrapper (`String`, `Number`, `Boolean`), memanggil method, lalu membuang wrapper-nya. Proses ini disebut **autoboxing**.

```js
// Yang "sebenarnya" terjadi (mirip, bukan persis)
const s = new String("halo"); // bikin wrapper object
s.toUpperCase();              // "HALO"
// s dibuang, "halo" aslinya tidak berubah
```

### Perbedaan penting: primitive vs wrapper object

```js
const a = "halo";              // primitive string
const b = new String("halo");  // wrapper OBJECT

typeof a        // "string"
typeof b        // "object"

a === b         // false! (tipe beda)
a == b          // true  (b di-coerce jadi "halo")

// Wrapper object adalah object → selalu truthy
if (new Boolean(false)) {
  console.log("ini tercetak!"); // tercetak, karena object selalu truthy
}
```

> **Aturan praktis:** jangan pernah `new String()`, `new Number()`, `new Boolean()`. Pakai literal (`"x"`, `42`, `true`). Wrapper object nyaris selalu bug.

Karena primitive immutable, method string mengembalikan **value baru**:

```js
let nama = "dimas";
nama.toUpperCase();     // "DIMAS" — tapi tidak mengubah `nama`
console.log(nama);      // "dimas"
nama = nama.toUpperCase();
console.log(nama);      // "DIMAS"
```

---

## 5. Mutability — Primitive vs Object

**Primitive immutable**: nilainya tidak bisa diubah. Operasi menghasilkan value baru.

**Object mutable**: propertinya bisa diubah di tempat (*in-place*).

```js
// Primitive: operasi bikin value baru
let n = 1;
let m = n + 1;   // m = 2, n tetap 1

// Object: bisa diubah di tempat
const user = { nama: "Dimas" };
user.nama = "Budi";       // BOLEH — mengubah isi object
user["umur"] = 23;        // BOLEH
console.log(user);        // { nama: "Budi", umur: 23 }
```

### Kenapa `const` object masih bisa diubah?

`const` mengunci **binding** (nama tidak bisa diarahkan ke value lain), **bukan** isi object-nya.

```js
const user = { nama: "Dimas" };
user.nama = "Budi";        // OK — mengubah properti
user = { nama: "Cici" };   // TypeError — mengubah binding
```

Kalau benar-benar ingin object tidak bisa diubah, bekukan:

```js
const cfg = Object.freeze({ retries: 3 });
cfg.retries = 5;           // gagal diam-diam (mode non-strict)
console.log(cfg.retries);  // 3

// Perhatian: freeze itu SHALLOW — nested object masih bisa diubah
const cfg2 = Object.freeze({ nested: { a: 1 } });
cfg2.nested.a = 99;        // BOLEH! nested tidak ikut dibekukan
```

---

## 6. `==` vs `===` dan Aturan Coercion

- `===` (*strict equality*): bandingkan **tipe dulu**, kalau beda → langsung `false`. Tidak ada konversi.
- `==` (*loose equality*): kalau tipe beda, JS **mengonversi** salah satu operand, lalu membandingkan.

**Default: selalu pakai `===`.** Pakai `==` hanya untuk kasus `== null` (lihat bawah).

### Yang sering menipu dengan `===`

```js
console.log(NaN === NaN);             // false  (lihat bagian NaN)
console.log(0 === -0);                // true
console.log(+0 === -0);               // true
console.log(({}) === ({}));           // false  ← dua object berbeda, dibandingkan by reference
console.log([] === []);               // false
const a = []; console.log(a === a);   // true  ← referensi yang sama
```

> **Catatan:** semua contoh di bagian ini dibungkus `console.log(...)` supaya bisa di-*paste* langsung ke `node file.js`. Kalau `{}` ditulis di **awal statement**, parser menganggapnya **blok kode**, bukan object literal — makanya `{} === {}` di baris terpisah menghasilkan `SyntaxError`. Bungkus dengan tanda kurung `({})` atau taruh di posisi ekspresi (mis. sebagai argumen `console.log`). Hal yang sama berlaku untuk `{}` di blok `==` di bawah.

### Aturan coercion `==` (urutan yang perlu dihafal)

1. **Tipe sama** → sama seperti `===`.
2. **`null == undefined`** → `true` (dan hanya satu sama lain).
3. **number vs string** → string dikonversi ke number.
4. **boolean vs apa pun** → boolean dikonversi ke number dulu.
5. **object vs primitive** → object dikonversi ke primitive (`ToPrimitive`, memakai `valueOf` lalu `toString`).

```js
// 1. tipe sama
console.log(1 == 1);              // true
console.log("a" == "a");          // true

// 2. null & undefined
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(null == 0);           // false ← PENTING, null tidak sama dengan 0
console.log(undefined == 0);      // false

// 3. number vs string
console.log(1 == "1");            // true  ("1" → 1)
console.log(0 == "");             // true  ("" → 0)
console.log(0 == "0");            // true

// 4. boolean
console.log(true == 1);           // true  (true → 1)
console.log(false == 0);          // true  (false → 0)
console.log(true == "1");         // true  (true → 1, lalu "1" → 1)
console.log(true == "true");      // false ("true" → NaN)

// 5. object vs primitive
console.log([] == "");            // true  ([] → "")
console.log([] == 0);             // true  ([] → "" → 0)
console.log([1] == 1);            // true  ([1] → "1" → 1)
console.log([1, 2] == "1,2");     // true  ([1,2] → "1,2")
console.log(({}) == "[object Object]"); // true
```

> **Catatan:** setiap baris diakhiri `;` dan dibungkus `console.log(...)`. Tanpa itu, ASI (*Automatic Semicolon Insertion*) bisa menyambung dua baris jadi satu ekspresi yang salah — mis. `true == "true"` diikuti `[] == ""` di-parse sebagai `"true"[] == ""` → `SyntaxError`. Untuk `{}` di awal statement, parser menganggapnya blok kode; karena itu ditulis `({})`.

### `== null` — satu-satunya idiom `==` yang aman

Karena `null == undefined` bernilai `true` dan keduanya tidak sama dengan nilai lain, `x == null` adalah cara ringkas mengecek "null **atau** undefined":

```js
function cek(x) {
  if (x == null) return "kosong (null/undefined)";
  return "ada";
}
cek(null)        // "kosong (null/undefined)"
cek(undefined)   // "kosong (null/undefined)"
cek(0)           // "ada"
cek("")          // "ada"
cek(false)       // "ada"
```

Bandingkan dengan `x === null` yang hanya menangkap `null` saja.

### `+` vs `-` — kenapa hasilnya bisa beda jauh

- Operator `+` **ganda fungsi**: kalau salah satu operand string → **concatenation** (penggabungan teks).
- Operator `-` (juga `*`, `/`) **selalu numerik** → memaksa konversi ke number.

```js
"5" + 1     // "51"   ← string concat, bukan 6!
"5" - 1     // 4      ← dikonversi ke number
"5" * 2     // 10
"abc" - 1   // NaN

1 + 2 + "3" // "33"   ← (1+2)=3, lalu 3 + "3" = "33"
"1" + 2 + 3 // "123"  ← ("1"+2)="12", lalu "12"+3="123"
```

> **Mental model:** `+` melihat operand kiri-ke-kanan. Begitu ketemu string, sisa perhitungan berubah jadi penggabungan teks. Karena itu "5" + 1 ≠ "5" - 1.

### Boolean context (truthy/falsy) juga coercion

Di `if`, `&&`, `||`, `!`, ternary — value dikonversi ke boolean lewat `ToBoolean`. Daftar lengkapnya di bagian berikut.

**Prediksi output:**

```js
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

<details>
<summary>Jawaban</summary>

- `[] + []` → `""` (dua array → string kosong, digabung → `""`)
- `[] + {}` → `"[object Object]"` (`[]` → `""`, `{}` → `"[object Object]"`)
- `{} + []` → hati-hati! Di REPL/statement awal, `{}` bisa dianggap **blok kode**, bukan object. Di Node `console.log({} + [])` hasilnya `"[object Object]"`. Kasus ini terkenal ambigu; di praktiknya jangan pernah menulis kode seperti ini.
</details>

---

## 7. Truthy & Falsy — Daftar Lengkap

Ada **tepat 8** value falsy di JavaScript. Selain ini, semuanya truthy.

| Falsy | Catatan |
|---|---|
| `false` | |
| `0` | |
| `-0` | negatif nol |
| `0n` | BigInt nol |
| `""` | string kosong |
| `null` | |
| `undefined` | |
| `NaN` | |

Yang **sering disangka falsy tapi sebenarnya truthy**:

```js
Boolean("0")        // true  ← string berisi "0" itu non-kosong
Boolean("false")    // true
Boolean(" ")        // true  ← spasi = string non-kosong
Boolean([])         // true  ← array kosong tetap object
Boolean({})         // true  ← object kosong tetap object
Boolean(function(){}) // true
Boolean(-1)         // true
Boolean(Infinity)   // true
Boolean(new Boolean(false)) // true  ← object wrapper!
```

### Kenapa `[]` truthy padahal "kosong"?

Karena aturan `ToBoolean` untuk object **selalu** `true`, tanpa melihat isinya. Array kosong tetap object.

### Implikasi praktis

```js
// BAHAYA: array kosong dianggap "ada"
const items = [];
if (items) {
  console.log("ada items"); // tercetak, padahal kosong!
}

// BENAR: cek panjang
if (items.length > 0) {
  console.log("ada items");
}

// BAHAYA: angka 0 dianggap "tidak ada"
const jumlah = 0;
const total = jumlah || 10;   // 10 — mungkin bukan yang kamu mau

// BENAR: nullish coalescing (hanya null/undefined yang memicu fallback)
const total2 = jumlah ?? 10;  // 0
```

`||` jatuh ke kanan jika kiri **falsy** (termasuk `0` dan `""`).
`??` jatuh ke kanan hanya jika kiri **null/undefined**. Pilih sesuai maksud.

**Prediksi output:**

```js
console.log(Boolean("") === Boolean("0"));
console.log([] ? "A" : "B");
console.log(0 || "x");
console.log(0 ?? "x");
```

<details>
<summary>Jawaban</summary>

`false` (karena `false === true` salah), `"A"`, `"x"`, `0`.
</details>

---

## 8. `NaN` — Not a Number yang Justru Bertipe number

`NaN` adalah value bertipe `number` yang merepresentasikan hasil operasi numerik tak terdefinisi.

```js
typeof NaN          // "number"
0 / 0               // NaN
"abc" - 1           // NaN
Number("abc")       // NaN
parseInt("abc")     // NaN
Math.sqrt(-1)       // NaN
```

### Kenapa `NaN !== NaN`?

Ini mengikuti standar IEEE 754 (standar angka floating point). IEEE 754 menetapkan bahwa operasi perbandingan apa pun yang melibatkan `NaN` bersifat **unordered** (tidak terurut) — sehingga setiap perbandingan `==`, `===`, `<`, `>`, `<=`, `>=` dengan `NaN` bernilai `false`. Karena itu `NaN` tidak sama dengan apa pun, **termasuk dirinya sendiri**: satu-satunya value di JS yang tidak sama dengan dirinya sendiri.

```js
NaN === NaN   // false
NaN == NaN    // false
NaN !== NaN   // true
```

Konsekuensinya: **tidak bisa** cek NaN pakai `===`.

### `Number.isNaN` vs `isNaN` — beda besar

```js
// isNaN GLOBAL: meng-COERCE argumen ke number dulu
isNaN("abc")      // true  ← "abc" → NaN → true (bisa menyesatkan)
isNaN("123")      // false ← "123" → 123 → false
isNaN(undefined)  // true
isNaN({})         // true

// Number.isNaN: TIDAK meng-coerce, hanya true untuk NaN asli
Number.isNaN("abc")     // false ← "abc" bukan NaN, dia string
Number.isNaN(NaN)       // true
Number.isNaN(undefined) // false
Number.isNaN("123")     // false
```

> **Selalu pakai `Number.isNaN`.** `isNaN` global mengonversi dulu sehingga `isNaN("abc")` bernilai `true` — sering bukan yang kamu maksud.

### Idiom lama (sebelum ES2015)

```js
// Trick klasik: satu-satunya value yang tidak sama dengan dirinya sendiri
const x = NaN;
x !== x   // true  → berarti x adalah NaN
```

### Menangani NaN

```js
const hasil = parseInt("12px"); // 12
const hasil2 = parseInt("px12"); // NaN

if (Number.isNaN(hasil2)) {
  console.log("input tidak valid");
}

// Nilai default saat NaN
const n = Number("abc");
const aman = Number.isNaN(n) ? 0 : n; // 0
```

---

## 9. Presisi `Number` dan Kapan Pakai `BigInt`

Semua `number` di JS adalah **double precision 64-bit** (IEEE 754). Artinya ada batas ketelitian.

### `0.1 + 0.2`

```js
0.1 + 0.2           // 0.30000000000000004
0.1 + 0.2 === 0.3   // false!
```

Ini **bukan bug JS**, tapi konsekuensi representasi biner: `0.1` dan `0.2` tidak bisa dinyatakan persis dalam biner, sama seperti `1/3` tidak bisa persis dalam desimal.

### Cara mengatasinya (tergantung konteks)

```js
// 1. Bulatkan untuk tampilan
(0.1 + 0.2).toFixed(2)             // "0.30"

// 2. Bandingkan dengan toleransi (epsilon)
const eps = Number.EPSILON;
Math.abs((0.1 + 0.2) - 0.3) < eps // true

// 3. Untuk uang: hitung dalam satuan terkecil (sen/rupiah), bukan float
const harga = 1999;   // rupiah, integer
const qty = 3;
const total = harga * qty; // 5997 — aman

// 4. Untuk angka besar: BigInt (lihat bawah)
```

### Batas integer aman

```js
Number.MAX_SAFE_INTEGER   // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER   // -9007199254740991

Number.isSafeInteger(9007199254740991)   // true
Number.isSafeInteger(9007199254740992)   // false

// Di luar batas aman, integer mulai kehilangan presisi
9007199254740992 === 9007199254740993   // true  ← dua angka berbeda dianggap sama!
```

Kalau butuh integer di atas `2^53 - 1` (misalnya ID besar, kripto), pakai `BigInt`.

### BigInt sekilas

```js
const besar = 9007199254740993n;   // literal BigInt pakai suffix n
typeof besar                        // "bigint"
besar + 1n                          // 9007199254740994n
besar === 9007199254740992n         // false ← presisi terjaga

// Konversi
BigInt(42)      // 42n
Number(42n)     // 42

// ATURAN: BigInt TIDAK bisa dicampur dengan Number di operator aritmetika
1n + 1   // TypeError: Cannot mix BigInt and other types
1n + 1n  // 2n
Number(1n) + 1 // 2 — konversi dulu kalau perlu
```

**Prediksi output:**

```js
console.log(0.1 + 0.2);
console.log(0.3 - 0.1);
console.log(0.3 - 0.1 === 0.2);
```

<details>
<summary>Jawaban</summary>

`0.30000000000000004`, `0.19999999999999998`, `false`.
</details>

---

## 10. `Symbol` Sekilas

`Symbol` membuat identifier yang **dijamin unik**. Setiap pemanggilan menghasilkan symbol baru, walaupun deskripsinya sama.

```js
const s1 = Symbol("id");
const s2 = Symbol("id");
s1 === s2         // false — selalu unik
typeof s1         // "symbol"
s1.description    // "id"
s1.toString()     // "Symbol(id)"
```

Kegunaan utama: **key properti yang tidak bentrok**, sering untuk "properti tersembunyi" di library.

```js
const ID = Symbol("id");
const user = { nama: "Dimas", [ID]: 123 };

user[ID]                 // 123
Object.keys(user)        // ["nama"] ← symbol tidak muncul
JSON.stringify(user)     // '{"nama":"Dimas"}' ← symbol dilewati
Object.getOwnPropertySymbols(user) // [Symbol(id)] ← cara mengambilnya
```

Symbol juga dipakai JS untuk perilaku bawaan, misalnya `Symbol.iterator` (dasar `for...of`). Untuk sekarang cukup tahu keberadaannya; detail iterator dibahas di catatan lanjutan.

---

## 11. `undefined` vs `null`

Dua-duanya menandakan "tidak ada value", tapi **maksudnya beda**.

| | `undefined` | `null` |
|---|---|---|
| Arti | Belum di-set / absen karena default | Sengaja dikosongkan |
| `typeof` | `"undefined"` | `"object"` (bug) |
| Default value | Ya (variabel, parameter, properti hilang) | Tidak |
| `JSON.stringify` | Dihilangkan | Jadi `null` |
| `==` | `undefined == null` → `true` | sama |
| `===` | `undefined === null` → `false` | sama |

### Kapan `undefined` muncul otomatis

```js
let a;                     // a = undefined
function f(x) { return x; }
f();                       // undefined (argumen tidak diberi)
const obj = {};
obj.hilang;                // undefined (properti tidak ada)
[1,2,3][99];               // undefined (indeks di luar jangkauan)
function g() {} g();       // undefined (tidak ada return)
```

### Kapan memakai `null` (sengaja)

```js
// Menandai "kosong secara sengaja", misalnya belum ada user yang login
let currentUser = null;

// Setelah login
currentUser = { nama: "Dimas" };

// Setelah logout
currentUser = null;
```

### Gotcha JSON

```js
JSON.stringify({ a: undefined, b: null })
// '{"b":null}'  ← undefined hilang, null dipertahankan

// Sebaliknya, dalam array undefined jadi null
JSON.stringify([undefined, null])
// '[null,null]'
```

### Cek aman

```js
const v = undefined;

v === undefined        // true
v === null             // false
v == null              // true  ← menangkap keduanya
typeof v === "undefined" // true (berguna kalau identifier mungkin tidak ada)
```

**Aturan praktis:** biarkan `undefined` sebagai default bawaan JS; pakai `null` **hanya** kalau kamu benar-benar ingin menyatakan "sengaja kosong".

---

## 12. Shallow Copy vs Deep Copy

Saat "menyalin" object, ada dua tingkat kedalaman:

- **Shallow copy**: hanya level atas yang disalin. Nested object **masih dibagi** (referensi sama).
- **Deep copy**: seluruh isi disalin rekursif, tidak ada yang dibagi.

```js
const asli = {
  nama: "Dimas",
  alamat: { kota: "Bandung", kode: "40111" }
};
```

### Shallow copy dengan spread

```js
const salinan = { ...asli };

salinan.nama = "Budi";
console.log(asli.nama);        // "Dimas" ← aman, level atas terpisah

salinan.alamat.kota = "Jakarta";
console.log(asli.alamat.kota); // "Jakarta" ← BAHAYA! nested dibagi
```

### Shallow copy dengan `Object.assign`

```js
const salinan2 = Object.assign({}, asli); // sama-sama shallow
```

### Shallow copy array

```js
const arr = [1, 2, { x: 3 }];
const arrCopy = [...arr];       // shallow
const arrCopy2 = arr.slice();   // shallow juga

arrCopy[0] = 99;
console.log(arr[0]);            // 1 ← aman

arrCopy[2].x = 999;
console.log(arr[2].x);          // 999 ← BAHAYA! nested dibagi
```

### Deep copy dengan `structuredClone` (modern, direkomendasikan)

```js
const deep = structuredClone(asli);

deep.alamat.kota = "Surabaya";
console.log(asli.alamat.kota);  // "Bandung" ← benar-benar terpisah
```

`structuredClone` menangani `Date`, `Map`, `Set`, `RegExp`, `ArrayBuffer`, dan bahkan **referensi melingkar** (circular). Tapi **tidak bisa** meng-clone `function`, `Symbol`, node DOM, atau properti yang tidak "structured-cloneable".

```js
structuredClone({ fn: () => {} }); // DataCloneError
```

### Deep copy lama: `JSON.parse(JSON.stringify())`

Sering dipakai, tapi punya banyak jebakan:

```js
const j = JSON.parse(JSON.stringify({
  d: new Date(),
  u: undefined,
  f: () => {},
  n: NaN
}));
// d → string (Date jadi hilang tipe)
// u → hilang
// f → hilang
// n → null (NaN tidak valid di JSON)
```

Ringkasnya: JSON round-trip **kehilangan tipe dan data**. Pakai `structuredClone` kalau tersedia (Node 17+, browser modern).

### Kapan shallow cukup?

Seringkali iya. Kalau object hanya berisi primitive, shallow copy sudah "cukup dalam". Shallow copy juga **lebih cepat** dan merupakan pola standar di React (update immutable).

```js
// Pola umum di React: shallow copy + ganti satu field
const state = { nama: "Dimas", umur: 22, kota: "Bandung" };
const next = { ...state, umur: 23 }; // kota & nama tetap
```

**Prediksi output:**

```js
const a = { n: { v: 1 } };
const b = { ...a };
b.n.v = 2;
console.log(a.n.v);
```

<details>
<summary>Jawaban</summary>

`2`. Spread hanya menyalin referensi `n`, jadi `a.n` dan `b.n` menunjuk object yang sama.
</details>

---

## 13. Pass by Value vs Pass by Reference

Kalimat yang paling sering salah: "object dilewatkan by reference". **Bukan.** JavaScript **selalu pass by value**. Bedanya: untuk object, yang di-pass adalah **value dari referensi** (alamat object), bukan object-nya sendiri.

Mental model: bayangkan object adalah rumah, dan variabel menyimpan **alamat rumah**. Saat memanggil fungsi, yang kamu berikan adalah **salinan kertas berisi alamat**, bukan rumahnya.

### Reassign parameter → tidak memengaruhi pemanggil

```js
function ganti(obj) {
  obj = { nama: "Baru" }; // mengarahkan ulang SALINAN referensi
}

const user = { nama: "Dimas" };
ganti(user);
console.log(user.nama); // "Dimas" ← tidak berubah
```

Karena `obj` di dalam fungsi hanyalah salinan alamat. Mengganti isi kertas tidak mengubah rumah asli.

### Mutasi isi → memengaruhi pemanggil

```js
function ubah(obj) {
  obj.nama = "Budi"; // mengubah isi RUMAH yang ditunjuk alamat tsb
}

const user2 = { nama: "Dimas" };
ubah(user2);
console.log(user2.nama); // "Budi" ← berubah
```

Karena dua kertas menunjuk alamat rumah yang sama.

### Untuk primitive: benar-benar salinan nilai

```js
function tambah(n) {
  n = n + 1;
}

let x = 5;
tambah(x);
console.log(x); // 5 ← tidak berubah
```

### Tabel ringkas

| Yang dikirim | Isi "value" | Reassign parameter | Mutasi parameter |
|---|---|---|---|
| Primitive (`number`, `string`, ...) | nilainya | tidak berpengaruh | tidak berlaku (immutable) |
| Object / array / function | alamat (referensi) | tidak berpengaruh | **berpengaruh** |

### Implikasi praktis

```js
// Fungsi yang "merusak" input
function tandaiSelesai(todo) {
  todo.done = true;   // memutasi argumen pemanggil
}

// Fungsi yang aman (immutable style)
function withSelesai(todo) {
  return { ...todo, done: true }; // bikin object baru
}
```

Gaya immutable (`with...`) lebih aman dan wajib dipahami sebelum masuk React, karena React mengandalkan perbandingan referensi untuk tahu state berubah.

**Prediksi output:**

```js
function f(arr) {
  arr.push(4);
  arr = [9, 9];
  arr.push(5);
}
const a = [1, 2, 3];
f(a);
console.log(a);
```

<details>
<summary>Jawaban</summary>

`[1, 2, 3, 4]`.

`arr.push(4)` memutasi array asli → `a` jadi `[1,2,3,4]`. Lalu `arr = [9,9]` mengarahkan **salinan referensi** ke array baru (tidak memengaruhi `a`). `arr.push(5)` hanya mengubah array baru itu. Jadi `a` = `[1,2,3,4]`.
</details>

---

## 14. Ringkasan Pakai Kata Sendiri

Tulis ulang dengan bahasamu sendiri (jangan copas) — ini yang membuat mental model lengket:

1. **Tipe menempel pada value, bukan variabel.** JS memutuskan konversi saat runtime berdasarkan value aktual.
2. **7 primitive + object.** Array, function, Date semua object. `typeof` punya keanehan: `null` → `"object"`, function → `"function"`.
3. **Primitive immutable; object mutable.** `const` mengunci binding, bukan isi.
4. **`===` tanpa konversi, `==` dengan konversi.** Default `===`. Satu-satunya `==` yang aman: `x == null`.
5. **`+` bisa concat, `-` selalu numerik.** Itu sebabnya `"5"+1` beda dari `"5"-1`.
6. **Ada 8 value falsy; semua object truthy** — termasuk `[]` dan `{}`.
7. **`NaN` bertipe number dan tidak sama dengan dirinya sendiri.** Pakai `Number.isNaN`, bukan `isNaN`.
8. **Float punya batas presisi.** `0.1+0.2 ≠ 0.3`. Integer aman sampai `2^53-1`; lebih dari itu pakai `BigInt`.
9. **`undefined` = default, `null` = sengaja kosong.**
10. **Spread/`Object.assign` itu shallow.** Nested masih dibagi. Deep copy → `structuredClone`.
11. **JS selalu pass by value.** Untuk object, value-nya adalah alamat. Mutasi isi terlihat pemanggil; reassign tidak.

---

## 15. Latihan

Kerjakan di file `.js` sendiri, jalankan dengan Node, dan tulis prediksimu **sebelum** run.

### Latihan 1 — Prediksi output

Tulis prediksi, lalu verifikasi:

```js
console.log(typeof null);
console.log(typeof []);
console.log(typeof (() => {}));
console.log(1 + "2" + 3);
console.log("1" + 2 + 3);
console.log(1 - "2" + 3);
console.log([] == ![]);
console.log(null == undefined);
console.log(null === undefined);
```

### Latihan 2 — Fungsi `isPrimitive`

Buat fungsi `isPrimitive(value)` yang mengembalikan `true` hanya untuk 7 tipe primitif. Ingat `null` juga primitive meski `typeof null === "object"`.

<details>
<summary>Petunjuk</summary>

Cek `value === null` dulu, lalu `typeof value !== "object" && typeof value !== "function"`.
</details>

### Latihan 3 — Bug dari coercion

Perbaiki kode berikut agar menjumlahkan dua input angka dengan benar (input dari `prompt`/form selalu string):

```js
function jumlah(a, b) {
  return a + b; // bug: kalau a,b string → concatenation
}
console.log(jumlah("5", "3")); // harusnya 8, sekarang "53"
```

Tulis minimal dua solusi berbeda dan jelaskan trade-off-nya.

### Latihan 4 — Shallow vs deep

Buat object bertingkat `{ profil: { nama, kontak: { email } } }`. Buat salinan shallow dan deep, ubah `email` di tiap salinan, lalu buktikan mana yang "bocor" ke object asli. Jelaskan hasilnya.

### Latihan 5 — `Number.isNaN` vs `isNaN`

Buat tabel hasil untuk `isNaN` dan `Number.isNaN` terhadap input: `NaN`, `"abc"`, `"123"`, `undefined`, `null`, `{}`, `[]`. Jelaskan kenapa keduanya berbeda pada beberapa baris.

### Latihan 6 — Kata sendiri

Tanpa melihat catatan, tulis 5 kalimat: apa itu coercion, kapan `==` dan `===` beda, kenapa `[]` truthy, kenapa `NaN !== NaN`, dan apa itu shallow copy. Bandingkan dengan ringkasan di atas.

---

## 16. Referensi

- MDN — JavaScript data types and data structures: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
- MDN — Equality comparisons and sameness (`==` vs `===`): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
- MDN — `typeof`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
- MDN — `NaN` & `Number.isNaN`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
- MDN — `structuredClone`: https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
- MDN — `BigInt`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
- ECMAScript spec — Abstract Equality Comparison (aturan `==`): https://tc39.es/ecma262/#sec-abstract-equality-comparison
- "What Every JavaScript Developer Should Know About Floating Points" — presisi number
