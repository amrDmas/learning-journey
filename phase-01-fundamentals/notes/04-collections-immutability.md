# 04 — Collections & Immutability

> Bagian dari **Phase 01 — JavaScript & TypeScript Fundamentals**
> Prasyarat: sudah paham `let`/`const`, tipe primitif, fungsi, dan `if`/loop (notes 01–03).
> Tujuan notes ini: kamu punya *mental model* tentang array & object sebagai **kumpulan data di memory**, tahu kapan tiap method dipakai, dan paham **kenapa immutability itu wajib** sebelum masuk React.

---

## 1. Mental model dulu: reference vs value

Ini pondasi semua isi notes ini. Baca pelan-pelan.

Ada dua "jenis" nilai di JS:

| Jenis | Contoh | Disimpan sebagai |
| --- | --- | --- |
| **Primitive** | `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint` | Nilainya langsung (dibandingkan & dicopy **by value**) |
| **Reference** | `object`, `array`, `function`, `Map`, `Set` | Alamat/penunjuk ke data di heap (**by reference**) |

Artinya:

```js
// Primitive: copy nilai
let a = 10;
let b = a;
b = 99;
console.log(a); // 10  -> a tidak berubah, karena b adalah salinan nilainya

// Reference: copy alamat
const arr1 = [1, 2, 3];
const arr2 = arr1;      // arr2 menunjuk ke ARRAY YANG SAMA
arr2.push(4);
console.log(arr1);      // [1, 2, 3, 4] -> arr1 ikut berubah!
console.log(arr1 === arr2); // true -> memang objek yang sama
```

**Konsekuensi yang harus kamu pahami betul:**

- `a === b` untuk objek/array mengecek **identitas** (apakah alamat sama), **bukan isi**.
- `[1,2] === [1,2]` → `false` (dua array berbeda di memory).
- Mengubah lewat satu variabel, variabel lain yang menunjuk objek yang sama akan ikut "berubah", karena sebenarnya cuma ada **satu** objek.

> 💡 Ini alasan kenapa React bisa cepat: React membandingkan `prevState === nextState` (identitas), bukan membandingkan isi satu per satu. Kalau kamu *mutate* (ubah di tempat), identitasnya tetap sama → React mengira tidak ada perubahan → **UI tidak re-render**. Ingat ini, akan dibahas di bagian 4.

---

## 2. Array methods penting

Array punya dua kelompok method yang wajib dibedakan:

- **Mutating** (mengubah array asli): `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`.
- **Non-mutating** (mengembalikan array/ nilai baru, asli tidak disentuh): `map`, `filter`, `slice`, `concat`, `flat`, `flatMap`, `find`, `some`, `every`, `includes`, `reduce`.

> Aturan praktis: untuk data yang dipakai di state (React), **hindari yang mutating**.

### 2.1 `map` — transformasi 1:1

`map` selalu mengembalikan array **baru** dengan panjang **sama**. Setiap elemen dipetakan ke nilai baru.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3]  -> asli tidak berubah

const users = [{ id: 1, name: "Dimas" }, { id: 2, name: "Rina" }];
const names = users.map((u) => u.name);
console.log(names); // ["Dimas", "Rina"]
```

**Kapan dipakai:** mengubah bentuk data (ambil 1 field, tambah field, hitung nilai turunan). `map` **bukan** untuk memfilter atau mencari.

### 2.2 `filter` — menyaring

Mengembalikan array baru berisi elemen yang lolos kondisi. Panjang bisa berkurang.

```js
const nums = [1, 2, 3, 4, 5];
const even = nums.filter((n) => n % 2 === 0);
console.log(even); // [2, 4]
```

### 2.3 `reduce` — melipat jadi satu nilai

`reduce(callback, nilaiAwal)` menjalankan callback berulang, membawa **accumulator** (`acc`) dari iterasi ke iterasi.

```js
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum); // 10

// Bentuk umum: acc bisa apa saja — number, string, object, array
const words = ["halo", "dunia"];
const sentence = words.reduce((acc, w) => acc + " " + w, "").trim();
console.log(sentence); // "halo dunia"
```

**Jebakan:** kalau **tanpa** nilai awal, `acc` diisi elemen pertama dan iterasi mulai dari indeks 1. Array kosong tanpa nilai awal → **TypeError**. Biasakan selalu kasih nilai awal.

### 2.4 `find` & `findIndex` — mencari

- `find` → mengembalikan **elemen** pertama yang cocok, atau `undefined`.
- `findIndex` → mengembalikan **indeks** pertama yang cocok, atau `-1`.

```js
const users = [{ id: 1, name: "Dimas" }, { id: 2, name: "Rina" }];
console.log(users.find((u) => u.id === 2));      // { id: 2, name: "Rina" }
console.log(users.find((u) => u.id === 99));     // undefined
console.log(users.findIndex((u) => u.id === 2)); // 1
console.log(users.findIndex((u) => u.id === 99));// -1
```

**Kapan dipakai:** cari **satu** item. Kalau butuh semua yang cocok → `filter`.

### 2.5 `some` & `every` — uji kondisi (boolean)

```js
const nums = [2, 4, 6];
console.log(nums.some((n) => n > 5));  // true  -> minimal satu > 5
console.log(nums.every((n) => n % 2 === 0)); // true -> semua genap
console.log([].every((n) => n > 0));   // true  -> array kosong: "semua" benar secara vacuous
console.log([].some((n) => n > 0));    // false -> tidak ada yang cocok
```

**Kapan dipakai:** validasi ("apakah ada error?", "apakah semua field terisi?"). `some`/`every` **short-circuit** — berhenti begitu jawabannya pasti.

### 2.6 `includes` — cek keberadaan nilai

```js
const roles = ["admin", "editor"];
console.log(roles.includes("admin")); // true
console.log([1, 2, NaN].includes(NaN)); // true  -> pakai SameValueZero, jadi NaN ketemu
console.log([1, 2, NaN].indexOf(NaN));  // -1    -> indexOf pakai ===, NaN !== NaN
```

**Catatan:** `includes` untuk **primitive** bagus. Untuk objek, `includes` membandingkan **referensi**, jadi `[{a:1}].includes({a:1})` → `false`. Untuk cari objek pakai `find`/`some` dengan predikat.

### 2.7 `flat` & `flatMap` — meratakan array bersarang

```js
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());     // [1, 2, 3, 4, [5, 6]]  (kedalaman default 1)
console.log(nested.flat(2));    // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity)); // ratakan sampai habis

// flatMap = map lalu flat(1) — sering dipakai saat 1 item menghasilkan banyak item
const orders = [
  { id: "A", items: ["buku", "pulpen"] },
  { id: "B", items: ["tas"] },
];
const allItems = orders.flatMap((o) => o.items);
console.log(allItems); // ["buku", "pulpen", "tas"]
```

### 2.8 `sort` — mengurutkan (dan jebakannya)

`sort` **mutating** dan mengembalikan array yang sama. Default-nya mengubah elemen jadi **string** lalu membandingkan secara **leksikografis** — sumber bug klasik:

```js
const nums = [10, 1, 5, 2];
console.log([...nums].sort());              // [1, 10, 2, 5]  ❌ bukan angka!
console.log([...nums].sort((a, b) => a - b)); // [1, 2, 5, 10] ✅ ascending
console.log([...nums].sort((a, b) => b - a)); // [10, 5, 2, 1] ✅ descending
console.log(nums); // [10, 1, 5, 2] -> asli aman karena kita pakai [...nums]
```

**Comparator** `(a, b) => ...` harus mengembalikan:

- **negatif** → `a` sebelum `b`
- **positif** → `a` setelah `b`
- **0** → urutan dianggap sama

```js
// Urutkan objek berdasarkan field
const users = [
  { name: "Rina", age: 30 },
  { name: "Dimas", age: 22 },
];
users.sort((a, b) => a.age - b.age);
console.log(users.map((u) => u.name)); // ["Dimas", "Rina"]

// Urutkan string: pakai localeCompare
["b", "A", "c"].sort((a, b) => a.localeCompare(b)); // ["A", "b", "c"]
```

> ⚠️ Karena `sort` mutating, sebelum mengurutkan state selalu copy dulu: `[...arr].sort(...)`.

### 2.9 `slice` vs `splice` — sering tertukar

| | `slice(start, end)` | `splice(start, deleteCount, ...items)` |
| --- | --- | --- |
| Mutating? | **Tidak** | **Ya** |
| Mengembalikan | salinan bagian array | array elemen yang **dibuang** |
| `end` | eksklusif, boleh negatif | — |
| Guna | ambil potongan | hapus/sisip/ganti di tempat |

```js
const arr = ["a", "b", "c", "d"];

console.log(arr.slice(1, 3)); // ["b", "c"]  -> arr TIDAK berubah
console.log(arr);             // ["a", "b", "c", "d"]

const removed = arr.splice(1, 2, "X"); // mulai index 1, buang 2, sisip "X"
console.log(removed); // ["b", "c"]  -> yang dibuang
console.log(arr);     // ["a", "X", "d"] -> arr BERUBAH
```

**Ibu jari:** "s**p**lice" = **P**otong (mutating). `slice` = "iris tipis" yang aman (non-mutating).

### 2.10 `push`/`pop`/`shift`/`unshift` — antrian ujung & depan

Keempatnya **mutating**:

| Method | Aksi | Return |
| --- | --- | --- |
| `push(x)` | tambah di **belakang** | panjang baru |
| `pop()` | buang dari **belakang** | elemen yang dibuang |
| `unshift(x)` | tambah di **depan** | panjang baru |
| `shift()` | buang dari **depan** | elemen yang dibuang |

```js
const q = [1, 2, 3];
q.push(4);      console.log(q); // [1, 2, 3, 4]
q.unshift(0);   console.log(q); // [0, 1, 2, 3, 4]
console.log(q.pop());   // 4  -> q jadi [0, 1, 2, 3]
console.log(q.shift()); // 0  -> q jadi [1, 2, 3]
```

**Versi immutable-nya** (pakai di state):

```js
const base = [1, 2, 3];
const addedEnd   = [...base, 4];      // seperti push
const addedFront = [0, ...base];      // seperti unshift
const withoutFirst = base.slice(1);   // seperti shift
const withoutLast  = base.slice(0, -1); // seperti pop
```

---

## 3. Chaining

Karena `map`/`filter`/`slice` mengembalikan array baru, kita bisa menyambungnya seperti pipa. Data "mengalir" dari kiri ke kanan.

```js
const products = [
  { name: "Kopi", price: 20000, stock: 5 },
  { name: "Teh", price: 10000, stock: 0 },
  { name: "Roti", price: 15000, stock: 3 },
];

const totalAvailable = products
  .filter((p) => p.stock > 0)          // buang yang habis
  .map((p) => p.price * p.stock)       // nilai per produk
  .reduce((sum, v) => sum + v, 0);     // jumlahkan

console.log(totalAvailable); // 20000*5 + 15000*3 = 100000 + 45000 = 145000
```

**Tips:**

- Urutan penting: `filter` dulu (mengurangi jumlah data) baru `map` → lebih efisien.
- Jangan over-chain sampai tak terbaca. Kalau >3–4 langkah, pecah jadi variabel bernama.
- Setiap method mengembalikan array baru → ada biaya memory. Untuk data kecil, abaikan; untuk data besar, sadari.

---

## 4. Immutability — kenapa ini krusial

**Immutable** = tidak mengubah data lama; sebagai gantinya kita **membuat salinan baru** dengan perubahan.

### Kenapa penting (bukan sekadar gaya)?

1. **React mendeteksi perubahan lewat identitas referensi.** Ketiganya memakai `Object.is`, tapi pada hal yang berbeda: `useState` melewati re-render bila value baru `Object.is`-sama dengan yang sekarang; `useEffect` membandingkan **tiap dependency** dengan `Object.is` untuk memutuskan apakah effect perlu dijalankan ulang; `React.memo` membandingkan **props** secara shallow. Mutate → referensi sama → React mengira tidak ada perubahan → UI basi.
2. **Prediktabilitas.** Kalau data lama tidak pernah berubah diam-diam, debugging jauh lebih mudah — kamu tahu nilai di titik mana pun tidak berubah tiba-tiba.
3. **Time-travel / undo / riwayat.** Menyimpan snapshot state jadi mungkin, karena state lama tetap utuh.
4. **Concurrency aman.** Beberapa bagian kode yang membaca data lama tidak "kejutan" karena ada yang mengubah di belakang layar.

### Contoh bug nyata karena mutate (di React)

```tsx
// ❌ SALAH: mutate langsung -> React tidak re-render
function addTodoBad(todo) {
  todos.push(todo);      // array yang sama, identitas sama
  setTodos(todos);       // React: "state belum berubah" -> tidak render
}

// ✅ BENAR: bikin array baru
function addTodoGood(todo) {
  setTodos([...todos, todo]); // identitas baru -> React render ulang
}
```

### Pola update immutable

**Array:**

```js
const todos = [
  { id: 1, text: "Belajar", done: false },
  { id: 2, text: "Olahraga", done: false },
];

// TAMBAH (di akhir)
const added = [...todos, { id: 3, text: "Baca", done: false }];

// TAMBAH (di awal)
const prepended = [{ id: 0, text: "Bangun", done: true }, ...todos];

// UPDATE satu item -> pakai map, kembalikan objek baru untuk yang cocok
const toggled = todos.map((t) =>
  t.id === 1 ? { ...t, done: true } : t
);

// HAPUS satu item -> pakai filter
const removed = todos.filter((t) => t.id !== 2);

// GANTI seluruh item
const replaced = todos.map((t) =>
  t.id === 1 ? { id: 1, text: "Belajar JS", done: false } : t
);
```

**Object:**

```js
const user = { name: "Dimas", role: "user", address: { city: "Bandung" } };

// Update field (top-level)
const promoted = { ...user, role: "admin" };

// Update nested -> harus copy tiap level yang berubah
const moved = {
  ...user,
  address: { ...user.address, city: "Jakarta" },
};

console.log(user.address.city);  // "Bandung" -> asli aman
console.log(moved.address.city); // "Jakarta"
```

**Tambah/hapus key tanpa mutate:**

```js
// Hapus key (immutable): destructure buang key-nya
const { role, ...withoutRole } = user;
console.log(withoutRole); // { name: "Dimas", address: {...} }

// Pakai rest spread juga bisa untuk "omit"
```

> ⚠️ **Jebakan besar:** spread itu **shallow** (lihat bagian 5). `{ ...user }` tidak meng-copy `address`; `address` masih menunjuk objek yang sama. Makanya nested update harus copy tiap level.

---

## 5. Shallow copy vs deep copy

| | Shallow copy | Deep copy |
| --- | --- | --- |
| Yang dicopy | level teratas saja | semua level, rekursif |
| Nested object | **masih dibagi** (referensi sama) | benar-benar independen |
| Cara | `{...obj}`, `[...arr]`, `Object.assign({}, obj)`, `arr.slice()` | `structuredClone(obj)`, `JSON.parse(JSON.stringify(obj))` |

```js
const original = { a: 1, nested: { b: 2 } };

// Shallow
const shallow = { ...original };
shallow.a = 99;
shallow.nested.b = 88;      // ⚠️ ini menembus ke original!
console.log(original.a);        // 1   -> aman (top-level)
console.log(original.nested.b); // 88  -> IKUT berubah (nested dibagi)

// Deep
const deep = structuredClone(original);
deep.nested.b = 0;
console.log(original.nested.b); // 88 -> tidak terpengaruh
```

**`structuredClone`** (modern, tersedia di Node 17+ dan browser modern):

- Menangani `Date`, `Map`, `Set`, `ArrayBuffer`, dan **circular reference**.
- **Tidak** bisa menyalin `function` dan DOM node — keduanya melempar `DataCloneError`.
- Instance class **bukan** error: datanya tersalin, tapi **prototype-nya hilang** — hasilnya plain object, jadi `instanceof` menjadi `false` dan `constructor` menjadi `Object`.

**`JSON.parse(JSON.stringify(obj))`** (cara lama):

- Kehilangan `Date` (jadi string), `undefined`, `function`, `Map`/`Set` jadi `{}`.
- **Error** kalau ada circular reference.
- Pakai hanya untuk data "JSON-safe" sederhana.

```js
const data = { when: new Date("2026-01-01"), n: undefined, f: () => {} };
console.log(JSON.parse(JSON.stringify(data)));
// { when: "2026-01-01T00:00:00.000Z" }  -> Date jadi string, undefined & function hilang
```

**Di React:** untuk state update, shallow copy **sudah cukup dan justru diinginkan** — kamu hanya perlu copy level yang berubah. Deep copy seluruh tree setiap update itu mahal dan tidak perlu.

---

## 6. Object methods yang wajib tahu

```js
const user = { name: "Dimas", age: 22, role: "dev" };

console.log(Object.keys(user));    // ["name", "age", "role"]
console.log(Object.values(user));  // ["Dimas", 22, "dev"]
console.log(Object.entries(user)); // [["name","Dimas"], ["age",22], ["role","dev"]]
```

**`Object.entries` + `map`** — pola sangat sering dipakai:

```js
const prices = { kopi: 20000, teh: 10000 };

const list = Object.entries(prices).map(([name, price]) => ({ name, price }));
console.log(list);
// [{ name: "kopi", price: 20000 }, { name: "teh", price: 10000 }]
```

**`Object.fromEntries`** — kebalikannya (array of pairs → object):

```js
const pairs = [["a", 1], ["b", 2]];
console.log(Object.fromEntries(pairs)); // { a: 1, b: 2 }

// Kombinasi: filter object berdasarkan value
const expensive = Object.fromEntries(
  Object.entries(prices).filter(([, price]) => price >= 15000)
);
console.log(expensive); // { kopi: 20000 }
```

**`Object.assign(target, ...sources)`** — merge shallow, **mutating pada `target`**:

```js
const target = { a: 1 };
const result = Object.assign(target, { b: 2 }, { c: 3 });
console.log(result); // { a: 1, b: 2, c: 3 }
console.log(result === target); // true -> target ikut berubah!

// Untuk versi non-mutating: target kosong {}
const merged = Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
// Sama dengan: { ...{a:1}, ...{b:2} }
```

**`Object.freeze`** — membekukan objek (tidak bisa diubah/ditambah/dihapus):

```js
const config = Object.freeze({ env: "prod", level: 3 });
config.level = 99;        // diabaikan (non-strict) / TypeError (strict mode)
config.newKey = true;     // diabaikan
console.log(config);      // { env: "prod", level: 3 }
console.log(Object.isFrozen(config)); // true
```

> ⚠️ `Object.freeze` itu **shallow**. Objek bersarang **masih bisa** diubah:
> ```js
> const cfg = Object.freeze({ nested: { x: 1 } });
> cfg.nested.x = 99;      // tetap berhasil!
> console.log(cfg.nested.x); // 99
> ```
> Untuk beku total perlu deep freeze manual (rekursif) atau pakai library.

---

## 7. Destructuring

### Array (berdasarkan posisi)

```js
const coords = [10, 20, 30];
const [x, y] = coords;
console.log(x, y); // 10 20

const [, second] = coords;   // lewati yang pertama (pakai koma kosong)
console.log(second); // 20

const [first, ...rest] = coords;
console.log(first); // 10
console.log(rest);  // [20, 30]
```

### Object (berdasarkan nama key)

```js
const user = { name: "Dimas", age: 22, role: "dev" };

const { name, age } = user;
console.log(name, age); // Dimas 22

// Rename: ambil 'name', simpan sebagai 'nama'
const { name: nama, role: jabatan } = user;
console.log(nama, jabatan); // Dimas dev

// Default value (dipakai kalau key undefined)
const { city = "Bandung" } = user;
console.log(city); // Bandung
```

### Nested destructuring

```js
const profile = {
  user: { name: "Dimas", address: { city: "Bandung", zip: "40123" } },
};

const {
  user: {
    name,
    address: { city, zip },
  },
} = profile;
console.log(name, city, zip); // Dimas Bandung 40123
```

### Sering dipakai di parameter fungsi

```js
function greet({ name, role = "guest" }) {
  return `Halo ${name} (${role})`;
}
console.log(greet({ name: "Dimas" })); // "Halo Dimas (guest)"
```

### Swap tanpa variabel bantu

```js
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1
```

---

## 8. Spread `...` dan Rest `...`

Sintaksnya sama (`...`), bedanya **arah data**:

- **Spread** = *mengeluarkan/menyebar* isi → dipakai saat **membuat** array/objek atau mengirim argumen.
- **Rest** = *mengumpulkan* sisa → dipakai saat **menerima** (parameter fungsi / destructuring). Rest harus di **paling akhir**.

```js
// SPREAD
const a = [1, 2];
const b = [3, 4];
console.log([...a, ...b]);        // [1, 2, 3, 4]
console.log([...a, 99]);          // [1, 2, 99]
console.log(Math.max(...a));      // 2 -> spread jadi argumen: max(1, 2)

const base = { x: 1 };
const extended = { ...base, y: 2 }; // { x: 1, y: 2 }
const overridden = { ...base, x: 9 }; // { x: 9 } -> yang belakangan menang

// REST — parameter fungsi
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// REST — destructuring
const [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail); // 1 [2, 3, 4]

const { id, ...restProps } = { id: 1, name: "Dimas", age: 22 };
console.log(restProps); // { name: "Dimas", age: 22 }
```

**Catatan:** spread untuk objek adalah **shallow copy** — sama seperti yang dibahas di bagian 5.

---

## 9. Optional chaining `?.` dan nullish coalescing `??`

### `?.` — aman saat nilai mungkin `null`/`undefined`

Tanpa `?.`:

```js
const user = { profile: null };
// console.log(user.profile.name); // 💥 TypeError: Cannot read properties of null
```

Dengan `?.`:

```js
console.log(user.profile?.name);            // undefined (tidak error)
console.log(user.address?.city ?? "N/A");   // "N/A"
```

Bentuk-bentuknya:

```js
const obj = { a: { b: 1 }, fn: () => 42, list: [10, 20] };

console.log(obj?.a?.b);       // 1   -> property
console.log(obj?.missing?.x); // undefined -> berhenti di 'missing'
console.log(obj.list?.[0]);   // 10  -> index
console.log(obj.fn?.());      // 42  -> panggil fungsi kalau ada
console.log(obj.nope?.());    // undefined -> tidak error
```

**Penting:** `?.` hanya **short-circuit** kalau bagian kirinya `null`/`undefined`. `obj.fn?.()` tetap akan error kalau `fn` bukan fungsi (mis. `obj.fn = 5`).

### `??` — default hanya untuk `null`/`undefined`

Beda krusial dengan `||`:

```js
const count = 0;
console.log(count || 10); // 10  ❌ karena 0 falsy
console.log(count ?? 10); // 0   ✅ 0 bukan null/undefined

const label = "";
console.log(label || "default"); // "default" ❌
console.log(label ?? "default"); // ""        ✅

const flag = false;
console.log(flag || true);  // true  ❌
console.log(flag ?? true);  // false ✅
```

**Aturan:** pakai `??` saat `0`, `""`, `false` adalah nilai **valid** yang harus dipertahankan. Pakai `||` saat kamu memang ingin "falsy apa pun dianggap kosong".

> ⚠️ Tidak boleh mencampur `??` dengan `||`/`&&` tanpa tanda kurung: `a ?? b || c` → **SyntaxError**. Tulis `(a ?? b) || c`.

---

## 10. Map vs Set vs Object vs Array — kapan pakai apa

| Struktur | Key | Duplikat | Urutan | Kasus pakai utama |
| --- | --- | --- | --- | --- |
| **Array** | indeks angka | boleh | insertion | daftar terurut, akses by posisi |
| **Object** | string/symbol | key unik | insertion (untuk string key) | record dengan field tetap/terkenal (user, config) |
| **Map** | **apa saja** (objek, fungsi, angka) | key unik | insertion terjaga | lookup dengan key non-string, sering tambah/hapus, butuh `.size` |
| **Set** | — (hanya nilai) | **tidak boleh** | insertion | dedup, cek keanggotaan cepat |

### Object vs Map

```js
// Object: key selalu jadi string
const o = {};
o[1] = "satu";
o["1"] = "dua";        // key yang SAMA dengan sebelumnya (1 -> "1")
console.log(o);        // { "1": "dua" }  -> tertimpa

// Map: key mempertahankan tipe
const m = new Map();
m.set(1, "angka satu");
m.set("1", "string satu");
console.log(m.size);       // 2 -> dianggap dua key berbeda
console.log(m.get(1));     // "angka satu"
console.log(m.get("1"));   // "string satu"
```

**Pilih `Map` kalau:**

- Key-nya **bukan string** (objek, angka, fungsi).
- Sering **tambah/hapus** banyak entry (Map dioptimalkan untuk itu).
- Butuh `.size`, iterasi langsung (`for...of`), atau urutan insertion yang dijamin untuk semua tipe key.
- Ingin menghindari tabrakan dengan properti bawaan objek (mis. key `"constructor"`, `"__proto__"`).

**Pilih `Object` kalau:**

- Bentuknya tetap dan "berbentuk record" (mis. `{ id, name, email }`).
- Perlu **serialisasi JSON** (Map tidak langsung jadi JSON — perlu `Object.fromEntries(map)`).
- Data datang dari API/JSON.

```js
// Konversi
const map = new Map([["a", 1], ["b", 2]]);
const obj = Object.fromEntries(map);   // Map -> Object
const back = new Map(Object.entries(obj)); // Object -> Map
```

### Set — dedup & keanggotaan

```js
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3]

const seen = new Set();
seen.add("a");
console.log(seen.has("a")); // true
console.log(seen.size);     // 1

// Untuk objek, Set membandingkan REFERENSI (sama seperti ===)
const s = new Set([{ id: 1 }]);
console.log(s.has({ id: 1 })); // false -> objek berbeda
```

**Kapan `Set` menang:** cek "sudah pernah lihat ini?" pada data besar, karena `has` rata-rata O(1) vs `array.includes` O(n).

---

## 11. JSON.stringify / parse dan jebakannya

JSON hanya mendukung: object, array, string, number, boolean, `null`. **Bukan** format JS — banyak nilai JS hilang saat dilewatkan.

```js
const data = {
  name: "Dimas",
  when: new Date("2026-01-01"),
  score: NaN,
  big: undefined,
  fn: function () {},
  tags: [1, undefined, () => {}],
};

const json = JSON.stringify(data);
console.log(json);
// {"name":"Dimas","when":"2026-01-01T00:00:00.000Z","score":null,"tags":[1,null,null]}
```

Perhatikan yang terjadi:

| Nilai asal | Di dalam **object** | Di dalam **array** |
| --- | --- | --- |
| `undefined` | key **dihapus** | jadi `null` |
| `function` | key **dihapus** | jadi `null` |
| `NaN` / `Infinity` | jadi `null` | jadi `null` |
| `Date` | jadi **string** ISO | jadi string ISO |
| `Symbol` (sebagai value) | key dihapus | `null` |
| `Map` / `Set` | jadi `{}` (tidak ada own enumerable props) | jadi `{}` |

**`Date` hilang tipe-nya** — ini sumber bug umum:

```js
const parsed = JSON.parse('{"when":"2026-01-01T00:00:00.000Z"}');
console.log(typeof parsed.when);           // "string", bukan Date!
console.log(parsed.when instanceof Date);  // false

// Harus dikonversi manual
const fixed = { ...parsed, when: new Date(parsed.when) };
console.log(fixed.when instanceof Date);   // true
```

**Circular reference → error:**

```js
const a = {};
a.self = a; // a menunjuk dirinya sendiri
// JSON.stringify(a); // 💥 TypeError: Converting circular structure to JSON
```

**`BigInt` → error:**

```js
// JSON.stringify({ n: 10n }); // 💥 TypeError: Do not know how to serialize a BigInt
```

### Alat bantu saat stringify

**Replacer** (fungsi atau array key) untuk mengontrol apa yang disertakan:

```js
const obj = { name: "Dimas", password: "rahasia", age: 22 };

// Array allowlist: hanya key ini
console.log(JSON.stringify(obj, ["name", "age"])); // {"name":"Dimas","age":22}

// Fungsi replacer: sembunyikan password
const safe = JSON.stringify(obj, (key, value) =>
  key === "password" ? undefined : value
);
console.log(safe); // {"name":"Dimas","age":22}
```

**Parameter `space`** untuk pretty-print:

```js
console.log(JSON.stringify({ a: 1 }, null, 2));
// {
//   "a": 1
// }
```

**`toJSON`** — method yang dipanggil `JSON.stringify` otomatis:

```js
const point = {
  x: 1,
  y: 2,
  toJSON() {
    return `(${this.x},${this.y})`;
  },
};
console.log(JSON.stringify(point)); // "\"(1,2)\""
```

**`JSON.parse` dengan reviver** — ubah value saat parse (bisa "menghidupkan" Date):

```js
const json = '{"when":"2026-01-01T00:00:00.000Z","n":1}';
const revived = JSON.parse(json, (key, value) => {
  // hanya konversi string yang bentuknya tanggal
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
});
console.log(revived.when instanceof Date); // true
```

**Cara aman deep clone** — pilih sesuai kebutuhan:

| Kebutuhan | Pakai |
| --- | --- |
| JSON-safe, sederhana | `JSON.parse(JSON.stringify(x))` |
| Date/Map/Set/circular, modern | `structuredClone(x)` |
| Hanya butuh copy top-level | `{...x}` / `[...x]` |

---

## 12. Prediksi output

Coba tebak dulu **sebelum** lihat jawaban. Ini latihan mental model.

**Soal 1**

```js
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length, a === b);
```

<details><summary>Jawaban</summary>

`4 true` — `b` menunjuk array yang sama dengan `a`. `push` mutating, jadi `a` ikut berubah. `===` true karena identitas sama.

</details>

---

**Soal 2**

```js
const nums = [3, 1, 2];
const sorted = [...nums].sort();
console.log(sorted, nums);
```

<details><summary>Jawaban</summary>

`[1, 2, 3] [3, 1, 2]` — angka satu digit, jadi sort default (leksikografis) kebetulan benar. `[...nums]` melindungi `nums` dari mutasi.

</details>

---

**Soal 3**

```js
const arr = [10, 9, 100];
console.log([...arr].sort());
```

<details><summary>Jawaban</summary>

`[10, 100, 9]` — sort default mengubah ke string: `"10" < "100" < "9"` secara leksikografis. **Bukan** urutan numerik. Harus pakai `(a, b) => a - b` untuk angka.

</details>

---

**Soal 4**

```js
const user = { name: "Dimas", nested: { n: 1 } };
const copy = { ...user };
copy.nested.n = 99;
console.log(user.nested.n);
```

<details><summary>Jawaban</summary>

`99` — spread itu **shallow**. `copy.nested` masih menunjuk objek yang sama dengan `user.nested`.

</details>

---

**Soal 5**

```js
const obj = { a: 0, b: "", c: false };
console.log(obj.a || "x", obj.a ?? "x");
console.log(obj.b || "y", obj.b ?? "y");
console.log(obj.c || true, obj.c ?? true);
```

<details><summary>Jawaban</summary>

`"x" 0` → `0` falsy jadi `||` ambil `"x"`, `??` pertahankan `0`.
`"y" ""` → `""` falsy jadi `||` ambil `"y"`, `??` pertahankan `""`.
`true false` → `false` falsy jadi `||` ambil `true`, `??` pertahankan `false`.

</details>

---

**Soal 6**

```js
const data = { a: 1, b: undefined, c: () => {}, d: NaN };
console.log(JSON.stringify(data));
```

<details><summary>Jawaban</summary>

`{"a":1,"d":null}` — `b` (undefined) dan `c` (function) hilang dari object; `NaN` jadi `null`.

</details>

---

**Soal 7**

```js
const list = [1, 2, 3, 4];
const result = list
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10);
console.log(result, list);
```

<details><summary>Jawaban</summary>

`[20, 40] [1, 2, 3, 4]` — `filter` & `map` non-mutating, `list` tetap utuh.

</details>

---

**Soal 8**

```js
const m = new Map();
m.set(1, "a");
m.set("1", "b");
console.log(m.size, m.get(1), m.get("1"));
```

<details><summary>Jawaban</summary>

`2 "a" "b"` — Map mempertahankan tipe key. `1` (number) dan `"1"` (string) adalah dua key berbeda.

</details>

---

**Soal 9**

```js
const o = { x: 1 };
const frozen = Object.freeze(o);
frozen.x = 99;
console.log(frozen.x);
```

<details><summary>Jawaban</summary>

`1` — `Object.freeze` mencegah perubahan pada level atas. (Di strict mode/ES module, ini malah melempar `TypeError`.)

</details>

---

**Soal 10**

```js
const u = { profile: null };
console.log(u.profile?.name);
console.log(u.profile?.name ?? "kosong");
```

<details><summary>Jawaban</summary>

`undefined` lalu `"kosong"` — `?.` berhenti aman di `null` (tidak error), menghasilkan `undefined`, lalu `??` memberi default.

</details>

---

## 13. Ringkasan dengan kata sendiri

Tulis ulang ini dengan bahasamu, lalu bandingkan dengan poin di bawah.

- **Array itu reference.** Mengubah array lewat variabel apa pun = mengubah array yang sama. `===` cek identitas, bukan isi.
- **`map` = ubah 1:1, `filter` = saring, `reduce` = lipat jadi satu.** Ketiganya non-mutating, bisa di-chain.
- **`find` cari satu, `filter` cari banyak, `some`/`every` untuk boolean.** `includes` untuk primitive, bukan objek.
- **`slice` aman (copy), `splice` mutating (potong di tempat).** `sort` juga mutating dan default-nya string-sort.
- **Immutability = bikin salinan baru, bukan ubah yang lama.** Wajib di React karena React deteksi perubahan lewat identitas referensi.
- **Pola update immutable:** tambah `[...arr, x]`, update `arr.map(...)`, hapus `arr.filter(...)`, update object `{...obj, key}`, nested copy tiap level.
- **Spread = shallow.** Nested object masih dibagi. Untuk copy dalam pakai `structuredClone` atau `JSON.parse(JSON.stringify())` (dengan jebakan).
- **Object.keys/values/entries** untuk iterasi object; **fromEntries** untuk balik ke object; **assign** merge (mutating target); **freeze** membekukan level atas saja.
- **Destructuring** = ambil isi by posisi (array) atau by nama (object); bisa nested, rename, default.
- **`?.`** aman saat `null`/`undefined`; **`??`** default hanya untuk `null`/`undefined` (beda dengan `||` yang kena semua falsy).
- **Map** untuk key non-string/ sering hapus-tambah; **Set** untuk dedup & cek keanggotaan cepat; **Object** untuk record + JSON; **Array** untuk list terurut.
- **JSON** menghilangkan `undefined`/`function`/`Symbol`, mengubah `Date` jadi string, `NaN` jadi `null`, error pada circular & BigInt.

---

## 14. Latihan (kerjakan, jangan cuma dibaca)

1. **Transformasi data.** Diberikan array transaksi `{ id, amount, category }`, buat fungsi yang mengembalikan total `amount` per `category` (pakai `reduce`), tanpa mengubah array asli.
2. **Update immutable.** Diberikan array `todos`, tulis fungsi: `addTodo`, `toggleTodo(id)`, `removeTodo(id)`, `renameTodo(id, text)` — semua **tanpa mutasi**.
3. **Nested update.** Diberikan `{ user: { settings: { theme, lang } } }`, tulis fungsi `setTheme(state, theme)` yang mengembalikan state baru tanpa mengubah aslinya.
4. **Dedup & cari.** Dari array angka dengan duplikat, hasilkan array unik **terurut ascending** (pakai `Set` + `sort` dengan comparator).
5. **JSON aman.** Tulis **dua** fungsi: `toSafeJSON(obj)` yang memakai **replacer** saat `JSON.stringify` untuk membuang key `password`, dan `fromSafeJSON(json)` yang memakai **reviver** saat `JSON.parse` untuk mengubah semua string ISO-date menjadi `Date`. Jelaskan kenapa ini tidak bisa dilakukan satu fungsi saja.
6. **Refactor mutating → immutable.** Ambil satu potong kode yang memakai `push`/`splice`/`sort` di tempat, tulis ulang versi immutable-nya, lalu jelaskan di komentar kenapa versi baru lebih aman untuk state.

Untuk setiap latihan, tulis juga: **prediksi output** sebelum run, lalu bandingkan.

---

## 15. Checklist pemahaman

- [ ] Bisa menjelaskan reference vs value dan kenapa `[1] === [1]` itu `false`.
- [ ] Bisa memilih method array yang tepat (map/filter/reduce/find/some/every) tanpa googling.
- [ ] Tahu mana method yang mutating dan bisa menulis versi immutable-nya.
- [ ] Bisa menulis update immutable untuk array (tambah/ubah/hapus) dan object (top-level & nested).
- [ ] Paham beda shallow vs deep copy dan tahu kapan `structuredClone` dipakai.
- [ ] Hafal jebakan `sort` default dan cara pakai comparator.
- [ ] Bisa memakai `?.` dan `??` dengan benar, termasuk bedanya `??` vs `||`.
- [ ] Bisa memilih Map/Set/Object/Array sesuai kebutuhan.
- [ ] Tahu apa yang hilang saat `JSON.stringify` dan bagaimana mengatasinya.

---

## 16. Referensi

- MDN — [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- MDN — [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- MDN — [Optional chaining (`?.`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- MDN — [Nullish coalescing (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- MDN — [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) / [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- MDN — [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) / [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- MDN — [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
- React Docs — [Updating Objects in State](https://react.dev/learn/updating-objects-in-state) / [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- 《JavaScript.info》 — [Arrays](https://javascript.info/array) / [Object.keys, values, entries](https://javascript.info/keys-values-entries) / [Destructuring assignment](https://javascript.info/destructuring-assignment)
