# 03 — Functions & `this`

> Bagian dari Phase 01 — JavaScript & TypeScript Fundamentals.
> Prasyarat: sudah baca `01-execution-model.md` dan `02-types-coercion.md`.

Tujuan catatan ini: membangun **mental model** tentang function sebagai *objek yang bisa dipanggil*, dan tentang `this` sebagai **nilai yang ditentukan saat pemanggilan**, bukan saat penulisan. Kalau kamu paham dua hal itu, 80% bug aneh JavaScript akan terasa masuk akal.

---

## 1. Kenapa Function Penting Dipahami Secara Mental Model

Di JS, function bukan cuma "blok kode yang dijalankan". Function adalah **nilai** — sama seperti angka atau string. Artinya:

- Function bisa disimpan di variabel.
- Function bisa dikirim sebagai argumen ke function lain.
- Function bisa dikembalikan dari function lain.

Konsekuensinya besar: **sebuah function tidak "menempel" ke tempat ia didefinisikan** kecuali untuk variabel yang di-*capture* lewat closure. Khususnya `this` **tidak** ditentukan di mana function ditulis, melainkan **bagaimana function dipanggil**. Ini sumber kebingungan nomor satu.

Pegang kalimat ini:

> **`this` bergantung pada cara function dipanggil, bukan di mana function ditulis** (kecuali arrow function, yang mewarisi `this` dari sekitarnya).

---

## 2. Tiga Cara Membuat Function

### 2.1 Function Declaration

```js
function tambah(a, b) {
  return a + b;
}

console.log(tambah(2, 3)); // 5
```

Ciri: diawali kata kunci `function`, punya nama, berdiri sendiri sebagai statement.

**Hoisting:** function declaration **diangkat** (hoisted) ke atas scope-nya, jadi bisa dipanggil sebelum baris deklarasinya.

```js
console.log(halo()); // "hai"  <-- tetap jalan!

function halo() {
  return "hai";
}
```

### 2.2 Function Expression

```js
const tambah = function (a, b) {
  return a + b;
};

console.log(tambah(2, 3)); // 5
```

Function diletakkan di sisi kanan assignment. Ia **tidak** di-hoist seperti declaration. Binding `tambah` di-hoist tetapi berada di *temporal dead zone* (TDZ) karena `const`/`let`, jadi memanggilnya sebelum deklarasi melempar `ReferenceError` (bukan `undefined`). Bandingkan: kalau memakai `var`, binding bernilai `undefined` sehingga pemanggilan menghasilkan `TypeError` (bukan `ReferenceError`).

```js
console.log(tambah(2, 3)); // ReferenceError: Cannot access 'tambah' before initialization
const tambah = function (a, b) { return a + b; };
```

Function expression bisa **anonymous** (tanpa nama) atau **named** (nama hanya berguna untuk rekursi / stack trace).

### 2.3 Arrow Function

```js
const tambah = (a, b) => a + b;

console.log(tambah(2, 3)); // 5
```

Bentuk ringkas. Perbedaan penting dibanding dua di atas:

| Aspek | Declaration / Expression | Arrow Function |
|---|---|---|
| `this` | ditentukan saat dipanggil | **mewarisi `this`** dari scope sekitarnya (lexical) |
| `arguments` object | ada | **tidak ada** (pakai rest `...args`) |
| Bisa jadi constructor (`new`) | ya | **tidak** |
| Punya `prototype` | ya | tidak |
| Bisa jadi method yang butuh `this` sendiri | ya | tidak (this ikut luar) |

**Aturan praktis:** pakai arrow function untuk callback pendek (misal di `map`, `filter`, `setTimeout`), dan **hindari** arrow untuk method objek yang butuh `this`.

---

## 3. Parameter: Default, Rest, dan Spread

### 3.1 Default Parameter

Nilai default dipakai kalau argumen **`undefined`** (bukan `null`).

```js
function sapa(nama = "tamu") {
  return `Halo, ${nama}`;
}

console.log(sapa());          // "Halo, tamu"
console.log(sapa("Dimas"));   // "Halo, Dimas"
console.log(sapa(undefined)); // "Halo, tamu"
console.log(sapa(null));      // "Halo, null"  <-- null TIDAK memicu default
```

Default juga bisa memakai parameter sebelumnya:

```js
function buatKotak(lebar, tinggi = lebar) {
  return { lebar, tinggi };
}
console.log(buatKotak(5));      // { lebar: 5, tinggi: 5 }
```

### 3.2 Rest Parameter (`...`)

Menampung sisa argumen jadi **array**. Harus di posisi terakhir.

```js
function jumlahkan(...angka) {
  return angka.reduce((total, n) => total + n, 0);
}

console.log(jumlahkan(1, 2, 3, 4)); // 10
```

```js
function log(level, ...pesan) {
  console.log(`[${level}]`, ...pesan); // spread di sini
}
log("INFO", "server", "menyala"); // [INFO] server menyala
```

### 3.3 Spread (`...`) — kebalikannya rest

Spread **menyebar** isi array/objek. Rest **mengumpulkan**.

```js
const a = [1, 2, 3];
const b = [...a, 4, 5];      // [1, 2, 3, 4, 5]

const profil = { nama: "Dimas", kota: "Bandung" };
const diperbarui = { ...profil, kota: "Jakarta" };
// { nama: "Dimas", kota: "Jakarta" }  <-- yang kanan menang
```

**Jebakan:** spread hanya *shallow copy*. Kalau ada objek bersarang, referensinya masih sama.

```js
const asli = { nama: "Dimas", alamat: { kota: "Bandung" } };
const salinan = { ...asli };
salinan.alamat.kota = "Surabaya";
console.log(asli.alamat.kota); // "Surabaya"  <-- ikut berubah!
```

### Prediksi Output

```js
function info(nama = "anonim", ...nilai) {
  return `${nama}: ${nilai.join(",")}`;
}
console.log(info());
console.log(info("Dimas"));
console.log(info("Dimas", 1, 2, 3));
```

<details>
<summary>Lihat jawaban</summary>

```
anonim: 
Dimas: 
Dimas: 1,2,3
```

Penjelasan: `info()` → `nama` jadi `"anonim"`, `nilai` array kosong → `[].join(",")` = `""`. `info("Dimas")` → rest kosong juga. Ketiga argumen 1,2,3 masuk ke rest.

</details>

---

## 4. Higher-Order Function & Callback

**Higher-order function (HOF)** = function yang (a) menerima function sebagai argumen, atau (b) mengembalikan function.

**Callback** = function yang dikirim sebagai argumen, untuk dipanggil nanti.

```js
// HOF: menerima callback
function ulangi(n, aksi) {
  for (let i = 0; i < n; i++) aksi(i);
}

ulangi(3, (i) => console.log("iterasi", i));
// iterasi 0
// iterasi 1
// iterasi 2
```

```js
// HOF: mengembalikan function
function pengali(faktor) {
  return (n) => n * faktor; // ini closure juga
}

const kaliDua = pengali(2);
console.log(kaliDua(10)); // 20
```

Method array seperti `map`, `filter`, `reduce`, `forEach` adalah HOF bawaan:

```js
const angka = [1, 2, 3, 4];
const genap = angka.filter((n) => n % 2 === 0); // [2, 4]
const kuadrat = angka.map((n) => n * n);         // [1, 4, 9, 16]
const total = angka.reduce((acc, n) => acc + n, 0); // 10
```

**Mental model callback:** kita menyerahkan "resep" ke function lain, dan function itu yang menentukan **kapan** resep dijalankan. Ini pondasi asynchronous programming nanti (event listener, `setTimeout`, `fs.readFile`).

---

## 5. Pure Function vs Side Effect

### Pure Function

Sebuah function disebut **pure** kalau memenuhi dua syarat:

1. **Deterministik** — input sama → output sama, selalu.
2. **Tanpa side effect** — tidak mengubah apa pun di luar dirinya (tidak ubah variabel luar, tidak tulis file, tidak panggil API, tidak `console.log`).

```js
// PURE
function tambah(a, b) {
  return a + b;
}
```

### Side Effect

Segala hal yang "menyentuh dunia luar" atau mengubah state yang bisa diamati:

- mengubah variabel/objek di luar scope-nya
- `console.log`, tulis file, kirim request jaringan
- `Date.now()`, `Math.random()` (bikin tidak deterministik)

```js
// TIDAK PURE — mengubah variabel dari luar
let total = 0;
function tambahKeTotal(n) {
  total += n; // side effect
  return total;
}
```

```js
// TIDAK PURE — input array ikut dimutasi
function tambahItem(arr, item) {
  arr.push(item); // mutasi argumen!
  return arr;
}
```

Perbaikan agar pure (tidak memutasi input):

```js
function tambahItem(arr, item) {
  return [...arr, item]; // bikin array baru
}
```

**Kenapa peduli?** Pure function gampang di-test (cukup bandingkan input→output), gampang di-*reasoning*, dan aman dipakai paralel. Side effect tidak bisa dihindari sepenuhnya (kita butuh I/O), tapi **dorong side effect ke tepi** (fungsi kecil yang menangani I/O), dan simpan logika inti tetap pure.

### Prediksi Output

```js
const daftar = [1, 2, 3];

function rusak(arr) {
  arr.push(4);
  return arr.length;
}

console.log(rusak(daftar)); // ?
console.log(daftar);        // ?
```

<details>
<summary>Lihat jawaban</summary>

```
4
[1, 2, 3, 4]
```

Penjelasan: parameter `arr` menerima **salinan alamat** (bukan salinan array-nya), jadi `arr` dan `daftar` menunjuk array yang sama. `push` mengubah isi array itu → `daftar` ikut berubah. (Catatan: JavaScript **selalu** *pass by value* — yang disalin adalah alamatnya. Istilah "pass by reference" sering dipakai orang secara longgar, tapi menyesatkan; lihat catatan 01 dan 02.)

</details>

---

## 6. Aturan `this` — Inti Materi Ini

`this` adalah **nilai yang disuntikkan ke function saat dipanggil**. Aturannya berbeda per *cara pemanggilan*. Kita bahas lima aturan berikut.

### 6.1 Default Binding (pemanggilan biasa)

Function dipanggil sebagai function biasa → `this` mengacu ke **global object** (`window` di browser, `globalThis` di Node), **kecuali di strict mode** maka `this` = `undefined`.

```js
function siapaIni() {
  console.log(this === globalThis);
}
siapaIni(); // true di skrip non-strict (di Node maksudnya CommonJS biasa, bukan ES module)
```

Di **strict mode**:

```js
"use strict";
function siapaIni() {
  console.log(this); // undefined
}
siapaIni();
```

Catatan: **module ES** (`import`/`export`) otomatis strict, jadi di kode modern `this` pada pemanggilan biasa = `undefined`. Ini justru bagus: error langsung kelihatan daripada diam-diam mengubah global.

### 6.2 Implicit Binding (method)

Kalau function dipanggil sebagai **method** — yaitu lewat `objek.method()` — maka `this` = objek di sebelah kiri titik.

```js
const kucing = {
  nama: "Milo",
  suara() {
    console.log(`${this.nama} mengeong`);
  },
};

kucing.suara(); // "Milo mengeong"  <-- this = kucing
```

Aturan hafalan: **"apa yang ada di kiri titik, itulah `this`"**.

### 6.3 Jebakan: Method Dipisah dari Objek

Begitu method "dilepas" dari objeknya, ia kembali jadi function biasa → implicit binding hilang.

```js
const kucing = {
  nama: "Milo",
  suara() {
    console.log(`${this.nama} mengeong`);
  },
};

const lepas = kucing.suara;
lepas(); // non-strict: "undefined mengeong" ; strict: TypeError
```

Kenapa? Karena saat memanggil `lepas()`, **tidak ada objek di kiri titik**. `this` jatuh ke default binding.

### 6.4 Explicit Binding: `call`, `apply`, `bind`

Kita bisa **memaksa** nilai `this`.

```js
function sapa(greeting, tanda) {
  console.log(`${greeting}, ${this.nama}${tanda}`);
}

const orang = { nama: "Dimas" };
```

| Method | Cara panggil | Argumen | Hasil |
|---|---|---|---|
| `call` | `fn.call(thisArg, a, b)` | argumen satu per satu | menjalankan fn langsung |
| `apply` | `fn.apply(thisArg, [a, b])` | argumen dalam array | menjalankan fn langsung |
| `bind` | `const baru = fn.bind(thisArg, a)` | sebagian argumen boleh di-*pre-fill* | mengembalikan **function baru** |

```js
sapa.call(orang, "Halo", "!");   // "Halo, Dimas!"
sapa.apply(orang, ["Hai", "."]); // "Hai, Dimas."

const sapaDimas = sapa.bind(orang, "Halo");
sapaDimas("!"); // "Halo, Dimas!"  <-- this sudah terkunci ke orang
```

**Perbedaan inti:**
- `call` / `apply` → **langsung jalan**. Bedanya cuma format argumen (individual vs array).
- `bind` → **tidak jalan sekarang**, mengembalikan function baru dengan `this` (dan argumen awal) yang "dikunci" permanen.

Sifat "terkunci permanen" itu tidak bisa dibatalkan oleh `bind` berikutnya (atau `call`/`apply` di atas hasil `bind`): keduanya **diabaikan**, dan `this` tetap milik `bind` yang pertama. (Satu-satunya pengecualian: memanggil hasil `bind` dengan `new` — `new` selalu menang, lihat 6.7.)

```js
const lain = { nama: "Budi" };
sapaDimas.call(lain, "?");              // "Halo, Dimas?" — this tetap orang, bukan lain
const sapaLagi = sapaDimas.bind(lain);  // bind berulang: yang menang tetap bind pertama
sapaLagi("!");                          // "Halo, Dimas!" — bukan "Budi"
```

`bind` berguna untuk method yang akan dipakai sebagai callback:

```js
const kucing = {
  nama: "Milo",
  suara() {
    console.log(`${this.nama} mengeong`);
  },
};

const lepas = kucing.suara.bind(kucing);
lepas(); // "Milo mengeong"
```

### 6.5 Arrow Function — `this` Lexical

Arrow function **tidak punya `this` sendiri**. Ia mengambil `this` dari scope tempat ia ditulis (lexical). `call`/`apply`/`bind` **tidak bisa** mengubah `this` arrow function.

```js
const kucing = {
  nama: "Milo",
  suara: () => {
    console.log(this.nama); // this di sini = this dari scope luar (bukan kucing!)
  },
};
kucing.suara(); // skrip non-module: undefined (this = objek top-level: window di browser, module.exports di Node CommonJS; .nama tidak ada); ES module: TypeError (this = undefined)
```

Contoh di mana arrow **menyelamatkan** kita — method dengan callback:

```js
const penghitung = {
  angka: 0,
  mulai() {
    // arrow di dalam method: this mewarisi `this` = penghitung
    setInterval(() => {
      this.angka++;
      console.log(this.angka);
    }, 1000);
  },
};
```

Bandingkan dengan `function` biasa yang **rusak**:

```js
const penghitungRusak = {
  angka: 0,
  mulai() {
    setInterval(function () {
      this.angka++; // this bukan penghitungRusak!
      console.log(this.angka);
    }, 1000);
  },
};
```

Ini jebakan `setTimeout`/`setInterval` yang klasik: callback `function` biasa tidak dipanggil sebagai method dari objek kita, jadi `this` bukan objek itu — di browser `this` = `window`, sedangkan di Node bukan `globalThis` melainkan objek timer (`Timeout`). Solusinya: pakai arrow, atau `.bind(this)`.

### 6.6 Constructor Binding (`new`)

Kalau function dipanggil dengan `new`, JavaScript membuat objek baru, dan `this` menunjuk ke objek baru itu.

```js
function Orang(nama) {
  this.nama = nama;
}

const d = new Orang("Dimas");
console.log(d.nama); // "Dimas"
```

Kalau constructor mengembalikan **objek eksplisit**, objek itulah yang dipakai (objek `new` tadi dibuang). Kalau yang dikembalikan nilai primitif (atau `null`), nilai itu **diabaikan** dan tetap objek baru yang dipakai:

```js
function A() { this.x = 1; return { y: 2 }; }
function B() { this.x = 1; return 42; }

new A(); // { y: 2 }      <-- return objek eksplisit menang
new B(); // B { x: 1 }    <-- return primitif diabaikan
```

Arrow function **tidak bisa** dipakai dengan `new`:

```js
const OrangArrow = (nama) => { this.nama = nama; };
const d = new OrangArrow("Dimas"); // TypeError: OrangArrow is not a constructor
```

Ini bukan sekadar gaya — ini konsekuensi dari aturan lexical `this`: objek yang dibuat `new` tidak punya cara untuk "menyuntik" `this` ke arrow function.

### 6.7 Ringkasan Prioritas `this`

Urutan dari yang paling mengikat:

1. `new` → objek baru
2. `call`/`apply`/`bind` → nilai eksplisit
3. `obj.method()` → objek di kiri titik
4. default → global object (non-strict) atau `undefined` (strict)

**Arrow function TIDAK mengikuti urutan prioritas ini.** Ia tidak punya `this` sendiri dan selalu memakai `this` lexical (dari scope tempat ia ditulis), sehingga `call`/`apply`/`bind` tidak berpengaruh — tidak ada `this` miliknya yang bisa "dikalahkan" oleh aturan lain.

### Prediksi Output

```js
const user = {
  nama: "Dimas",
  halo1() {
    console.log("halo1:", this.nama);
  },
  halo2: () => {
    console.log("halo2:", this.nama);
  },
};

user.halo1();            // ?
user.halo2();            // ?

const f = user.halo1;
f();                     // ?

const g = user.halo1.bind(user);
g();                     // ?
```

<details>
<summary>Lihat jawaban (asumsi non-strict, `this` global = {nama: undefined})</summary>

```
halo1: Dimas      // implicit binding
halo2: undefined  // arrow mewarisi this dari module/global, bukan user
halo1: undefined  // method dilepas → default binding (this = global, .nama tidak ada)
halo1: Dimas      // bind mengunci this ke user
```

Di ES module: `f()` dan `halo2` keduanya melempar `TypeError: Cannot read properties of undefined (reading 'nama')` (di module, `this` top-level = `undefined`). Sedangkan di strict script (non-module), `this` top-level tetap objek top-level (`window` di browser, `module.exports` di Node CommonJS), jadi `halo2` tidak error — hanya `f()` yang error karena `this` = `undefined`. Itu justru bagus — errornya jujur.

</details>

---

## 7. IIFE — Immediately Invoked Function Expression

IIFE = function yang **langsung dipanggil** saat didefinisikan. Gunanya: membuat scope lokal terisolasi (sebelum ada `let`/`const` dan module, ini cara menghindari "mengotori" global).

```js
(function () {
  const rahasia = 42;
  console.log(rahasia); // 42
})();

console.log(typeof rahasia); // "undefined" — tidak bocor ke luar
```

Dengan arrow:

```js
(() => {
  console.log("jalan langsung");
})();
```

**Kenapa butuh tanda kurung?** Karena `function () {}` di awal baris dianggap *declaration* (butuh nama). Dibungkus `( ... )` membuatnya jadi *expression*, lalu `()` di belakang memanggilnya.

Di era module ES, IIFE jarang dipakai lagi untuk isolasi — tapi masih sering muncul di library lama dan sebagai pola "async IIFE":

```js
(async () => {
  const res = await fetch("/api/data");
  console.log(await res.json());
})();
```

---

## 8. Closure Dipakai di Function

**Closure** = function yang "mengingat" variabel dari scope tempat ia dibuat, walau scope itu sudah selesai. (Detail ada di catatan 01; di sini kita lihat penerapannya.)

```js
function buatCounter() {
  let hitung = 0; // variabel ini "ditangkap" closure
  return function () {
    hitung++;
    return hitung;
  };
}

const counter = buatCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

Setiap pemanggilan `buatCounter()` membuat **lingkungan baru** yang independen:

```js
const c1 = buatCounter();
const c2 = buatCounter();
console.log(c1()); // 1
console.log(c1()); // 2
console.log(c2()); // 1  <-- counter sendiri, tidak terpengaruh c1
```

Kombinasi closure + HOF menghasilkan pola seperti **factory** dan **currying** (berikutnya).

---

## 9. Currying & Partial Application

**Currying** = mengubah function ber-argumen banyak menjadi rangkaian function ber-argumen satu.

```js
// biasa
function tambah(a, b) {
  return a + b;
}

// curried
function tambahCurry(a) {
  return function (b) {
    return a + b;
  };
}

console.log(tambahCurry(2)(3)); // 5
```

Dengan arrow jadi ringkas (pakai nama lain supaya tidak bentrok kalau kedua blok dijalankan dalam satu file):

```js
const tambahCurryRingkas = (a) => (b) => a + b;
```

**Partial application** = "mengunci" sebagian argumen lebih dulu, sisanya nanti. (Secara praktik sering dicampur dengan `bind`.)

```js
const tambahDasar = (a, b) => a + b;
const tambahLima = tambahDasar.bind(null, 5); // argumen pertama dikunci
console.log(tambahLima(10)); // 15
```

**Kenapa berguna?** Membuat function yang lebih spesifik dari function umum, tanpa mengulang kode:

```js
// pakai nama lain supaya tidak bentrok dengan `log` (§3.2) dan `info` (§3) kalau blok digabung
const buatLog = (level) => (pesan) => console.log(`[${level}] ${pesan}`);

const logInfo = buatLog("INFO");
const logError = buatLog("ERROR");

logInfo("server menyala");  // [INFO] server menyala
logError("koneksi putus");  // [ERROR] koneksi putus
```

### Prediksi Output

```js
const bagi = (a) => (b) => a / b;
const bagiDua = bagi(2);

console.log(bagiDua(10)); // ?
console.log(bagi(10)(5)); // ?
```

<details>
<summary>Lihat jawaban</summary>

```
0.2
2
```

Penjelasan: `bagi = (a) => (b) => a / b` — jadi `a` selalu pembilang dan `b` penyebut.

- `bagiDua = bagi(2)` mengunci `a = 2`. Lalu `bagiDua(10)` = `2 / 10` = **0.2**.
- `bagi(10)(5)` = `a = 10`, `b = 5` → `10 / 5` = **2**.

Ini contoh kenapa nama variabel penting: `bagiDua` terdengar seperti "membagi dua", padahal artinya "pembilangnya 2". Mental model harus mengikuti urutan argumen, bukan nama.

</details>

---

## 10. Recursion Dasar

**Recursion** = function yang memanggil dirinya sendiri. Wajib punya **base case** (kondisi berhenti), kalau tidak → *stack overflow*.

```js
function faktorial(n) {
  if (n <= 1) return 1;      // base case
  return n * faktorial(n - 1); // recursive case
}

console.log(faktorial(5)); // 120
```

Alur eksekusi (bayangkan **call stack**):

```
faktorial(5)
= 5 * faktorial(4)
= 5 * (4 * faktorial(3))
= 5 * (4 * (3 * faktorial(2)))
= 5 * (4 * (3 * (2 * faktorial(1))))
= 5 * (4 * (3 * (2 * 1)))
= 120
```

Setiap pemanggilan menaruh satu *frame* di call stack. Base case menghentikan penumpukan, lalu hasil "mengalir balik" ke atas.

Contoh lain — menelusuri struktur bersarang (umum untuk data JSON/tree):

```js
function jumlahAngka(node) {
  if (typeof node === "number") return node;          // base case
  if (Array.isArray(node)) {
    return node.reduce((acc, anak) => acc + jumlahAngka(anak), 0);
  }
  return 0;
}

console.log(jumlahAngka([1, [2, [3, 4]], 5])); // 15
```

**Kapan pakai recursion?** Untuk struktur rekursif (tree, nested JSON, filesystem, komponen UI bersarang). Untuk iterasi linear sederhana, loop biasanya lebih efisien dan lebih mudah dibaca.

### Prediksi Output

```js
function mundur(n) {
  if (n < 0) return;
  console.log(n);
  mundur(n - 1);
}
mundur(3);
```

<details>
<summary>Lihat jawaban</summary>

```
3
2
1
0
```

Base case `n < 0` menghentikan saat `n = -1`. Output muncul menurun karena `console.log` dijalankan **sebelum** pemanggilan rekursif (pre-order).

</details>

---

## 11. Ringkasan dengan Kata Sendiri

> Tulis ulang bagian ini dengan bahasamu sendiri sebelum lanjut ke latihan. Kalau ada yang belum bisa kamu jelaskan tanpa melihat, ulangi bagian itu.

- **Function adalah nilai.** Bisa disimpan, dikirim, dikembalikan.
- **Declaration di-hoist; expression & arrow tidak** (untuk arrow/expression lewat `const`, masih kena temporal dead zone).
- **Arrow** tidak punya `this`, `arguments`, dan tidak bisa `new`. Ia mewarisi `this` dari sekitarnya.
- **Rest** mengumpulkan argumen jadi array; **spread** menyebar isi array/objek. Spread = shallow copy.
- **HOF** menerima/mengembalikan function; **callback** adalah function yang dikirim untuk dipanggil nanti.
- **Pure function**: input sama → output sama, tanpa side effect. Mudah di-test, mudah di-reasoning.
- **`this` ditentukan saat pemanggilan**: `new` > explicit (`call`/`apply`/`bind`) > implicit (objek di kiri titik) > default (global / `undefined` di strict). Arrow mewarisi lexical.
- **Jebakan**: method dipisah dari objek kehilangan `this`; callback `function` di `setTimeout`/`setInterval` juga kehilangan `this`.
- **`call`/`apply`** langsung menjalankan; bedanya format argumen. **`bind`** mengembalikan function baru dengan `this` terkunci.
- **IIFE** = function yang langsung dipanggil, untuk scope terisolasi (atau pola async IIFE).
- **Closure** membuat function mengingat variabel dari scope asalnya.
- **Currying** = rangkaian function satu-argumen; **partial application** = mengunci sebagian argumen.
- **Recursion** wajib punya **base case**, kalau tidak → stack overflow.

---

## 12. Latihan

Kerjakan di file terpisah (`latihan/03-functions-this.js`), lalu minta mentor mereview.

1. **Pure/impure.** Ambil 3 function yang pernah kamu tulis, tandai mana yang pure dan mana yang tidak. Perbaiki yang impure agar tidak memutasi input.

2. **Method & `this`.** Buat objek `kalkulator` dengan `riwayat: []` dan method `tambah(a, b)` yang mencatat `"a + b = hasil"` ke `riwayat`. Panggil lewat objek, lalu coba "lepas" method-nya dan buktikan apa yang terjadi pada `this`. Perbaiki dengan `bind`.

3. **Arrow vs function di timer.** Buat dua objek dengan pola `penghitung` dari bagian 6.5 — satu pakai arrow, satu pakai `function` biasa. Jalankan keduanya dan jelaskan bedanya.

4. **HOF sendiri.** Tulis `mapSendiri(arr, fn)` yang meniru `Array.prototype.map` tanpa memakai `map` bawaan. Bonus: `filterSendiri`.

5. **Currying.** Ubah `function kirimEmail(server, dari, ke, subjek) { ... }` menjadi bentuk curried, lalu buat `kirimDariServerProduksi` dengan partial application.

6. **Recursion.** Tulis `flatSendiri(arr)` yang meratakan array bersarang sedalam apa pun menjadi satu array datar, memakai recursion.

7. **Prediksi dulu, jalankan kemudian.** Untuk setiap contoh "Prediksi Output" di catatan ini, tulis jawabanmu di kertas **sebelum** menjalankan kodenya di Node. Bandingkan. Bagian yang salah = bagian yang mental model-nya belum matang.

---

## 13. Checklist Paham

- [ ] Bisa jelaskan perbedaan declaration / expression / arrow dari sisi hoisting & `this` tanpa melihat.
- [ ] Bisa sebutkan 5 aturan binding `this` beserta urutan prioritasnya.
- [ ] Bisa jelaskan kenapa `setTimeout(function () { this.x })` rusak dan kenapa arrow memperbaikinya.
- [ ] Bisa jelaskan beda `call`, `apply`, `bind` dalam satu kalimat masing-masing.
- [ ] Bisa menulis satu pure function dan satu impure function, lalu menjelaskan bedanya.
- [ ] Bisa menulis recursion dengan base case yang benar dan menjelaskan call stack-nya.
- [ ] Bisa menulis curried function dan partial application.

---

## Referensi

- MDN — [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- MDN — [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- MDN — [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- MDN — [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) & [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- MDN — [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- "You Don't Know JS Yet" — Kyle Simpson (bab Scope & Closures, bab `this` & Object Prototypes)
