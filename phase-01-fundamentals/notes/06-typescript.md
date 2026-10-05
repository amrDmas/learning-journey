# Note 06 — TypeScript: Type System sebagai Alat Berpikir

> Bagian dari [Phase 01 — JavaScript & TypeScript Fundamentals](../README.md) | Prasyarat: note 01–05 (value vs reference, scope, closure, objects/arrays, async)
> Target: ~4–6 hari. Jangan buru-buru. Setiap konsep: **jalankan contohnya**, lalu **jelaskan dengan kata sendiri**.

---

## 1. Kenapa TypeScript? (Kenapa, bukan cuma Apa)

JavaScript itu **dynamically typed**: tipe sebuah nilai baru "diperiksa" saat program berjalan (runtime). Artinya kesalahan tipe baru ketahuan **setelah** kode dijalankan — kadang baru ketahuan di produksi, saat user sudah memakainya.

```js
// JavaScript murni — tidak ada yang mencegah ini
function hitungTotal(harga, jumlah) {
  return harga + jumlah;
}

hitungTotal("1000", 3); // "10003" 😱 string, bukan 1003
```

Kode di atas **tidak error**. Ia "jalan". Tapi hasilnya salah, dan bug-nya bisa mengendap berhari-hari. Ini persis pola "kode jalan tapi tidak paham kenapa" yang jadi masalah utama fase ini.

TypeScript menambahkan **lapisan pemeriksaan statis** di atas JavaScript: tipe diperiksa **sebelum** kode dijalankan (compile-time / type-check time).

```ts
function hitungTotal(harga: number, jumlah: number): number {
  return harga + jumlah;
}

hitungTotal("1000", 3);
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Sekarang kesalahan ketahuan **sebelum** dijalankan. Ini tiga manfaat utama TS:

| Manfaat | Arti praktisnya | Kaitannya ke JD Full Stack |
| --- | --- | --- |
| **Type safety** | Bug tipe tertangkap sebelum runtime, bukan di produksi | Reliability, "keamanan & reliability" di JD |
| **Dokumentasi hidup** | Tipe adalah dokumentasi yang **tidak bisa basi** — kalau kode berubah dan tipe tidak cocok, compiler teriak | "Dokumentasi teknis", onboarding ke codebase baru |
| **Refactor aman** | Ganti nama field / ubah signature fungsi → compiler menunjukkan **semua** tempat yang rusak | "Refactoring aman & maintainable" di JD |

### Poin krusial yang sering disalahpahami

TypeScript **tidak mengubah perilaku runtime** kode kamu. Setelah dikompilasi, semua anotasi tipe **hilang** — hasilnya JavaScript biasa. Jadi TS bukan pengaman runtime; ia pengaman **saat menulis kode**. (Konsekuensinya penting — kita bahas di bagian runtime validation nanti.)

```ts
const umur: number = 20;
```

Setelah dikompilasi jadi:

```js
const umur = 20; // anotasi : number dibuang
```

> **Model mental:** anggap TypeScript sebagai *reviewer otomatis* yang membaca kode kamu terus-menerus. Ia tidak menjalankan kodemu, tapi ia menunjuk hal yang "tidak masuk akal secara tipe". Ia bisa salah (kadang terlalu cerewet) dan bisa dibohongi (lihat `any` dan `as`), tapi kalau dipakai benar ia menghemat berjam-jam debugging.

---

## 2. Setup Dasar

Kamu tidak butuh banyak alat. Tiga hal:

### 2.1 Instal TypeScript (compiler)

```bash
# sekali per project (lokal, direkomendasikan)
npm install -D typescript

# atau jalankan tanpa install permanen
npx tsc --version
```

`tsc` = **T**ype**S**cript **C**ompiler. Tugasnya dua: (1) memeriksa tipe, (2) mengubah `.ts` → `.js`.

### 2.2 Buat `tsconfig.json`

```bash
npx tsc --init
```

Lalu pastikan opsi inti ini aktif. `strict: true` adalah **keputusan paling penting** — ia menyalakan sekumpulan pemeriksaan, terutama `strictNullChecks` (membuat `null` dan `undefined` tidak bisa dipakai sembarangan).

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

| Opsi | Kenapa penting |
| --- | --- |
| `strict: true` | Paket pemeriksaan ketat. **Jangan dimatikan** saat belajar. |
| `noUncheckedIndexedAccess` | `arr[0]` bertipe `T \| undefined` — memaksa kamu memeriksa akses array yang mungkin kosong. Sangat berguna. |
| `target` | Versi JS hasil kompilasi. `ES2022` modern dan aman untuk Node modern. |
| `module` / `moduleResolution` | Cara TS memahami `import`. `NodeNext` untuk project Node modern. |

### 2.3 Menjalankan file `.ts`

Dua cara:

```bash
# 1) Kompilasi dulu, lalu jalankan JS hasilnya
npx tsc
node dist/index.js

# 2) Jalankan langsung tanpa langkah build (paling praktis saat belajar)
npx tsx index.ts
```

`tsx` menjalankan TypeScript langsung (di balik layar memakai esbuild). Ia **tidak** memeriksa tipe — jadi biasakan juga menjalankan `npx tsc --noEmit` untuk type-check tanpa menghasilkan file:

```bash
npx tsc --noEmit   # hanya periksa tipe, tidak menulis file apa pun
```

> **Praktik harian:** tulis kode dengan `tsx` supaya cepat, lalu sebelum commit jalankan `npx tsc --noEmit` supaya yakin tidak ada error tipe yang terlewat.

---

## 3. Type Inference — TS Sering Sudah Tahu

Kamu **tidak wajib** menulis tipe di mana-mana. TypeScript bisa menyimpulkan (infer) tipe dari nilai.

```ts
let nama = "Dimas";     // inferred: string
let umur = 20;          // inferred: number
const aktif = true;     // inferred: true (literal, karena const)

function tambah(a: number, b: number) {
  return a + b;         // inferred return: number
}
```

### Kapan menulis tipe eksplisit vs biarkan inferensi?

| Situasi | Saran |
| --- | --- |
| Variabel lokal sederhana | **Biarkan** inferensi. `let x = 5` lebih baik daripada `let x: number = 5`. |
| Parameter fungsi | **Tulis** — TS tidak bisa menebak maksud pemanggil. |
| Return type fungsi publik / API | **Tulis** — mengunci kontrak agar perubahan internal tidak diam-diam mengubah API. |
| Nilai awal `let` yang nanti diisi | **Tulis** kalau tipe awalnya terlalu sempit (`let status: string = "idle"`). |
| Object/array literal kompleks | Biarkan, lalu ekstrak jadi `type` bila dipakai ulang. |

```ts
// Tulis return type untuk fungsi yang dipakai orang lain
function bagi(a: number, b: number): number {
  return a / b;
}
```

> **Model mental inference:** TS menyimpulkan tipe dari **nilai**, bukan dari niat. Kalau hasil inference terasa aneh, itu sinyal kodenya kurang jelas — tambahkan tipe eksplisit untuk menyatakan niat.

---

## 4. `type` vs `interface` — Kapan Pakai Mana

Keduanya mendeskripsikan bentuk sebuah object.

```ts
type User = {
  id: string;
  nama: string;
};

interface UserI {
  id: string;
  nama: string;
}
```

Sebagian besar kasus keduanya bisa saling menggantikan. Perbedaan praktisnya:

| Aspek | `type` | `interface` |
| --- | --- | --- |
| Object / function shape | ✅ | ✅ |
| Union (`A \| B`) | ✅ | ❌ tidak bisa |
| Tuple, primitive alias | ✅ | ❌ |
| Mapped / conditional type | ✅ | ❌ |
| **Declaration merging** (bisa digabung otomatis) | ❌ | ✅ |
| `extends` / `implements` | lewat intersection `&` | `extends` bawaan |

```ts
// type bisa union, interface tidak
type Status = "idle" | "loading" | "success" | "error";

// interface bisa "diperluas" lewat extends
interface Animal { nama: string; }
interface Dog extends Animal { ras: string; }
```

**Rekomendasi praktis (dan ini pilihan yang aman untuk pemula):**

- Pakai **`type` sebagai default**. Ia lebih fleksibel (union, tuple, mapped types).
- Pakai **`interface`** bila kamu memang butuh declaration merging (jarang), atau saat menulis library yang sengaja membiarkan konsumen memperluas tipe.
- **Yang terpenting: konsisten dalam satu codebase.** Jangan campur-campur tanpa alasan.

> Banyak tim (termasuk TypeScript sendiri di banyak tempat) memilih `type` sebagai default dan `interface` untuk objek publik yang bisa diperluas. Ikuti aturan tim; kalau tidak ada, pilih satu dan konsisten.

---

## 5. Union & Intersection

### Union (`|`) — "salah satu dari"

```ts
type Id = string | number;

function cetakId(id: Id) {
  console.log(id);
}

cetakId("abc"); // ok
cetakId(123);   // ok
cetakId(true);  // ❌ Error
```

Union berarti nilai boleh bertipe **salah satu** anggota.

### Intersection (`&`) — "gabungan dari semuanya"

```ts
type PunyaNama = { nama: string };
type PunyaUmur = { umur: number };

type Orang = PunyaNama & PunyaUmur; // harus punya keduanya

const dimas: Orang = { nama: "Dimas", umur: 22 }; // ok
const salah: Orang = { nama: "Dimas" };           // ❌ Error: umur hilang
```

> **Hati-hati:** jangan tertukar dengan logika boolean. Union itu "OR" pada tipe (nilai boleh salah satu), intersection itu "AND" (nilai harus punya semua).

---

## 6. Literal Types — Tipe yang Spesifik

Selain `string`, kamu bisa bilang "hanya string ini":

```ts
let arah: "kiri" | "kanan";
arah = "kiri";   // ok
arah = "atas";   // ❌ Error: Type '"atas"' is not assignable to type '"kiri" | "kanan"'.

let dadu: 1 | 2 | 3 | 4 | 5 | 6;
dadu = 6;  // ok
dadu = 7;  // ❌ Error
```

Literal types sering dipadukan dengan union untuk membuat "pilihan yang terbatas":

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function request(method: HttpMethod, url: string) { /* ... */ }

request("GET", "/users");  // ok
request("FETCH", "/users"); // ❌ Error — typo tertangkap!
```

Ini jauh lebih aman daripada `method: string` (typo baru ketahuan saat runtime).

> `const` cenderung menghasilkan literal type (`const x = "a"` → tipe `"a"`), sedangkan `let` melebarkannya (`let x = "a"` → tipe `string`). Gunakan `as const` untuk memaksa literal pada object/array:
>
> ```ts
> const konfig = { mode: "dark", level: 3 } as const;
> // tipe: { readonly mode: "dark"; readonly level: 3 }
> ```

---

## 7. `any` vs `unknown` vs `never`

Ini tiga tipe istimewa yang wajib kamu pahami bedanya.

### `any` — "matikan pemeriksaan tipe"

```ts
let data: any = JSON.parse('{"x": 1}');
data.apapun.bisa(); // tidak ada error — dan inilah masalahnya
```

`any` mematikan type checking untuk nilai itu. Ia "menular": apa pun yang bersentuhan dengan `any` jadi `any`. **Hindari `any`** kecuali terpaksa (mis. kode lama / library tanpa tipe).

### `unknown` — "sesuatu yang belum diketahui, aman"

```ts
let data: unknown = JSON.parse('{"x": 1}');

data.apapun.bisa(); // ❌ Error: 'data' is of type 'unknown'.

if (typeof data === "object" && data !== null && "x" in data) {
  // setelah dicek (narrowing), baru boleh dipakai
}
```

`unknown` artinya "aku belum tahu tipenya, jadi **kamu harus memeriksa dulu** sebelum memakai". Ini adalah cara yang benar dan aman untuk menangani input dari luar (JSON, response API, `catch`).

> Aturan praktis: **pakai `unknown` untuk data dari luar, hindari `any`.** `unknown` memaksa kamu melakukan narrowing, dan narrowing itulah yang menemukan bug.

### `never` — "tidak mungkin ada nilai"

`never` adalah tipe untuk nilai yang **tidak pernah** terjadi.

```ts
function gagal(msg: string): never {
  throw new Error(msg);
}

// never juga muncul di union yang "habis"
type Mustahil = string & number; // never
```

Kegunaan praktisnya: **exhaustiveness check** — memastikan kamu sudah menangani semua kemungkinan.

```ts
type Status = "idle" | "loading" | "success" | "error";

function render(s: Status) {
  switch (s) {
    case "idle": return "…";
    case "loading": return "⏳";
    case "success": return "✅";
    case "error": return "❌";
    default: {
      const _cek: never = s; // kalau ada case baru yang belum ditangani, baris ini error
      return _cek;
    }
  }
}
```

### Ringkasan

| Tipe | Arti | Kapan pakai |
| --- | --- | --- |
| `any` | "apa saja, jangan periksa" | Hindari. Hanya untuk interop darurat. |
| `unknown` | "belum diketahui, periksa dulu" | Data dari luar: JSON, API, `catch (e)`. |
| `never` | "tidak ada nilai yang mungkin" | Fungsi yang selalu throw / infinite loop; exhaustiveness check. |

---

## 8. Narrowing — Mempersempit Tipe

Narrowing = TypeScript **mempersempit** tipe dari yang lebar (union) ke yang spesifik, berdasarkan pemeriksaan runtime yang kamu tulis.

### 8.1 `typeof`

```ts
function cetak(nilai: string | number) {
  if (typeof nilai === "string") {
    console.log(nilai.toUpperCase()); // di sini: string
  } else {
    console.log(nilai.toFixed(2));    // di sini: number
  }
}
```

### 8.2 `in` — cek keberadaan properti

```ts
type Kucing = { mengeong: () => void };
type Anjing = { menggonggong: () => void };

function suara(hewan: Kucing | Anjing) {
  if ("mengeong" in hewan) {
    hewan.mengeong();     // di sini: Kucing
  } else {
    hewan.menggonggong(); // di sini: Anjing
  }
}
```

### 8.3 `instanceof` — cek kelas

```ts
class ApiError extends Error {
  constructor(public status: number, msg: string) { super(msg); }
}

function tangani(err: unknown) {
  if (err instanceof ApiError) {
    console.log(err.status); // di sini: ApiError
  } else if (err instanceof Error) {
    console.log(err.message); // di sini: Error
  } else {
    console.log("error tak dikenal:", err); // di sini: unknown
  }
}
```

### 8.4 Discriminated Union — pola paling berguna

Ini pola yang akan kamu pakai terus (mis. state React, hasil request, event). Kuncinya: setiap anggota union punya **satu properti penanda** (discriminant) dengan literal type berbeda.

```ts
type Hasil<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function tampilkan<T>(hasil: Hasil<T>): string {
  switch (hasil.status) {
    case "loading":
      return "Memuat…";
    case "success":
      return `Berhasil: ${JSON.stringify(hasil.data)}`; // hasil.data tersedia
    case "error":
      return `Gagal: ${hasil.error}`;                   // hasil.error tersedia
  }
}
```

Perhatikan: setelah `case "success"`, TS **tahu** `hasil.data` ada. Tidak perlu `as` atau `!`. Ini contoh sempurna "tipe membantu, bukan menghambat".

### 8.5 Type Predicate — membuat fungsi pemeriksa sendiri

Kadang narrowing bawaan belum cukup. Kamu bisa menulis fungsi yang "mengajari" TS:

```ts
function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}

function proses(input: unknown) {
  if (isStringArray(input)) {
    input.forEach((s) => console.log(s.toUpperCase())); // input: string[]
  }
}
```

`x is string[]` adalah **type predicate**. Fungsinya harus benar-benar memeriksa (ia tetap kode runtime biasa) — TS hanya mempercayai klaimnya.

> ⚠️ Kalau type predicate-mu salah, TS tidak akan menangkapnya; kamu "berbohong" ke compiler. Tulis pemeriksaannya dengan hati-hati.

---

## 9. Generics — Tipe sebagai Parameter

Generics memungkinkan fungsi/tipe bekerja untuk **banyak tipe** tanpa kehilangan informasi tipe.

### 9.1 Fungsi generic

Masalahnya:

```ts
function pertama(arr: any[]): any {
  return arr[0];
}
const x = pertama([1, 2, 3]); // x bertipe any — informasi tipe hilang
```

Solusinya:

```ts
function pertama<T>(arr: T[]): T | undefined {
  return arr[0];
}

const angka = pertama([1, 2, 3]);       // T = number → angka: number | undefined
const teks = pertama(["a", "b"]);       // T = string → teks: string | undefined
```

`T` adalah "parameter tipe". Ia diisi otomatis dari argumen (inference).

> Perhatikan return type `T | undefined`: dengan `noUncheckedIndexedAccess: true` (bagian 2.2), `arr[0]` bertipe `T | undefined` karena array bisa saja kosong. Menulis `T` saja akan error `Type 'T | undefined' is not assignable to type 'T'`. Ini justru contoh bagus — compiler memaksamu mengakui kemungkinan array kosong. Kalau kamu yakin array tidak pernah kosong, itu keputusan yang harus dinyatakan eksplisit, bukan diasumsikan diam-diam.

### 9.2 Constraint dengan `extends`

Batasi tipe apa yang boleh masuk:

```ts
function panjangnya<T extends { length: number }>(x: T): number {
  return x.length;
}

panjangnya("halo");        // ok — string punya length
panjangnya([1, 2, 3]);     // ok — array punya length
panjangnya(42);            // ❌ Error: number tidak punya length
```

Constraint juga dipakai untuk "kunci dari object":

```ts
function ambil<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { nama: "Dimas", umur: 22 };
const n = ambil(user, "nama"); // n: string
const u = ambil(user, "umur"); // u: number
ambil(user, "alamat");         // ❌ Error: "alamat" bukan key dari user
```

### 9.3 Default type parameter

```ts
type Kotak<T = string> = { isi: T };

const a: Kotak = { isi: "halo" };     // T default = string
const b: Kotak<number> = { isi: 42 }; // T = number
```

### 9.4 Kapan TIDAK pakai generics

Jangan pakai generic kalau tidak ada hubungan antar tipe yang perlu dijaga:

```ts
// Berlebihan — T tidak dipakai untuk menghubungkan apa pun
function cetak<T>(x: T): void { console.log(x); }

// Lebih jujur
function cetak2(x: unknown): void { console.log(x); }
```

> **Model mental generic:** generic adalah **variabel untuk tipe**. Ia berguna saat kamu ingin "tipe input menentukan tipe output" — seperti `pertama<T>(arr: T[]): T | undefined`. Kalau tidak ada ketergantungan seperti itu, generic hanya menambah kerumitan.

---

## 10. Utility Types — Alat Bantu Bawaan

TypeScript menyediakan tipe bawaan untuk mentransformasi tipe lain. Ini yang membuat TS terasa seperti bahasa "meta".

```ts
type User = {
  id: string;
  nama: string;
  email: string;
  umur: number;
};
```

| Utility | Artinya | Contoh hasil |
| --- | --- | --- |
| `Partial<T>` | Semua properti jadi opsional | `{ id?: string; ... }` |
| `Required<T>` | Semua properti jadi wajib | kebalikan `Partial` |
| `Readonly<T>` | Semua properti jadi `readonly` | tidak bisa di-assign ulang |
| `Pick<T, K>` | Ambil subset properti | `Pick<User, "id" \| "nama">` |
| `Omit<T, K>` | Buang beberapa properti | `Omit<User, "id">` |
| `Record<K, V>` | Object dengan key `K`, value `V` | `Record<string, number>` |
| `ReturnType<F>` | Tipe hasil return sebuah fungsi | dari `() => number` → `number` |
| `Parameters<F>` | Tuple tipe parameter fungsi | `[a: number, b: string]` |
| `Awaited<T>` | Tipe hasil `await` sebuah Promise | `Awaited<Promise<string>>` → `string` |
| `Exclude<T, U>` | Buang anggota union `T` yang ada di `U` | `Exclude<"a" \| "b", "a">` → `"b"` |
| `Extract<T, U>` | Ambil anggota union `T` yang ada di `U` | `Extract<"a" \| "b", "a" \| "c">` → `"a"` |
| `NonNullable<T>` | Buang `null` dan `undefined` | `NonNullable<string \| null>` → `string` |

Contoh konkret:

```ts
// Partial — untuk update parsial
type UpdateUser = Partial<User>;
const patch: UpdateUser = { nama: "Dimas Baru" }; // ok, field lain opsional

// Pick / Omit — membentuk tipe turunan
type UserRingkas = Pick<User, "id" | "nama">;   // { id: string; nama: string }
type UserTanpaId = Omit<User, "id">;             // { nama; email; umur }

// Record — map/peta
const jumlahPerRole: Record<string, number> = { admin: 2, user: 10 };

// ReturnType / Parameters — ekstrak dari fungsi (berguna saat tipe dibuat TS sendiri)
function buatUser(nama: string, umur: number) {
  return { nama, umur, dibuatPada: new Date() };
}
type HasilBuatUser = ReturnType<typeof buatUser>; // { nama: string; umur: number; dibuatPada: Date }
type ArgBuatUser = Parameters<typeof buatUser>;   // [nama: string, umur: number]

// Awaited — tipe hasil await
type HasilFetch = Awaited<Promise<{ ok: boolean }>>; // { ok: boolean }

// Exclude / Extract / NonNullable
type Peran = "admin" | "editor" | "viewer";
type BukanViewer = Exclude<Peran, "viewer">;        // "admin" | "editor"
type HanyaViewer = Extract<Peran, "viewer">;        // "viewer"
type WajibString = NonNullable<string | null | undefined>; // string
```

> **Tips:** kamu tidak perlu menghafal semuanya. Cukup tahu **ada** utility ini, dan cari saat butuh. Yang paling sering dipakai sehari-hari: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`.

---

## 11. Array & Tuple

### Array

```ts
const angka: number[] = [1, 2, 3];
const nama: Array<string> = ["a", "b"]; // bentuk alternatif, sama saja
const campur: (string | number)[] = ["a", 1];
```

### Tuple — array dengan panjang & tipe posisi tetap

```ts
type Titik = [number, number];

const p: Titik = [10, 20];     // ok
const salah: Titik = [10];     // ❌ Error: panjang kurang
const salah2: Titik = [10, 20, 30]; // ❌ Error: panjang lebih

// Label pada tuple membuatnya lebih jelas
type Rentang = [mulai: number, selesai: number];
```

Tuple berguna untuk nilai yang **posisinya bermakna**, misalnya koordinat, pasangan `[key, value]`, atau hasil fungsi yang mengembalikan dua nilai.

```ts
function bagiDenganSisa(a: number, b: number): [hasil: number, sisa: number] {
  return [Math.floor(a / b), a % b];
}

const [hasil, sisa] = bagiDenganSisa(7, 3); // hasil: number, sisa: number
```

> **Peringatan:** jangan berlebihan memakai tuple untuk "record" yang punya nama field. `{ x: number; y: number }` sering lebih jelas daripada `[number, number]` karena field-nya bernama. Pakai tuple saat posisi memang bermakna (mis. `[key, value]` dari `Object.entries`).

---

## 12. `enum` vs Union of Literals — Rekomendasi

Dua cara mendaftar pilihan terbatas:

### `enum`

```ts
enum Status {
  Idle,
  Loading,
  Success,
  Error,
}

let s: Status = Status.Idle;
```

`enum` menghasilkan **objek runtime** (ada di JS hasil kompilasi). Ada dua jenis: `enum` numerik (nilai default 0,1,2…) dan `enum` string:

```ts
enum Arah {
  Atas = "ATAS",
  Bawah = "BAWAH",
}
```

### Union of literals (rekomendasi)

```ts
type Status = "idle" | "loading" | "success" | "error";
let s: Status = "idle";
```

**Rekomendasi modern: pakai union of literals**, bukan `enum`, untuk sebagian besar kasus. Alasan:

1. **Tidak ada kode runtime tambahan.** Union of literals hilang sepenuhnya setelah kompilasi; `enum` meninggalkan objek di bundle.
2. **Lebih mudah dipadukan dengan narrowing & discriminated union** (bagian 8.4).
3. **Lebih mudah diserialisasi** — nilainya sudah string biasa, cocok untuk JSON/API.
4. **Konsisten dengan data dari luar** — JSON dari API tidak tahu apa itu `enum`; ia hanya string.

```ts
// Pola yang direkomendasikan
type Status = "idle" | "loading" | "success" | "error";

// Kalau butuh daftar nilainya saat runtime, buat array biasa:
const STATUSES = ["idle", "loading", "success", "error"] as const;
type Status2 = (typeof STATUSES)[number]; // sama dengan union di atas
```

> Kalau kamu bekerja di codebase yang sudah memakai `enum`, ikuti saja — konsistensi lebih penting. Tapi untuk kode baru, union of literals biasanya pilihan lebih ringan dan fleksibel.

---

## 13. Typing Function & Async

### Parameter & return type

```ts
function tambah(a: number, b: number): number {
  return a + b;
}

// Parameter opsional — perhatikan tanda ?
function sapa(nama: string, gelar?: string): string {
  return gelar ? `${gelar} ${nama}` : nama;
}
sapa("Dimas");            // ok
sapa("Dimas", "Mr.");     // ok

// Default value
function pangkat(basis: number, eksponen: number = 2): number {
  return basis ** eksponen;
}
```

### Tipe fungsi sebagai nilai (function type)

```ts
type Operasi = (a: number, b: number) => number;

const kali: Operasi = (a, b) => a * b;
```

Perhatikan: karena tipe sudah ditulis, parameter `a` dan `b` **tidak perlu** dianotasi ulang — TS menginferensinya dari `Operasi`. Ini disebut **contextual typing**.

### Callback & higher-order function

```ts
function ulang(n: number, aksi: (i: number) => void): void {
  for (let i = 0; i < n; i++) aksi(i);
}

ulang(3, (i) => console.log(i)); // i inferred sebagai number
```

### Async function

Fungsi `async` **selalu** mengembalikan `Promise`. Anotasi return type-nya adalah tipe **nilai yang di-`await`**, bukan Promise-nya:

```ts
async function ambilUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil user");
  return res.json() as Promise<User>;
}

// pemakaian
const user = await ambilUser("1"); // user: User
```

Error handling pada async:

```ts
async function aman(): Promise<string> {
  try {
    const data = await ambilSesuatu();
    return data;
  } catch (e) {
    // e bertipe unknown — WAJIB di-narrow sebelum dipakai
    if (e instanceof Error) return `Gagal: ${e.message}`;
    return "Gagal: error tak dikenal";
  }
}
```

> **Ingat:** di `catch (e)`, `e` bertipe `unknown` (kalau `useUnknownInCatchVariables` aktif, yang merupakan bagian dari `strict`). Itu bagus — ia memaksa kamu memeriksa sebelum memakai `e.message`.

### Overload (sekilas)

Kadang satu fungsi punya beberapa bentuk pemanggilan. TS mendukung *overload signatures*:

```ts
function ubah(x: string): string;
function ubah(x: number): number;
function ubah(x: string | number): string | number {
  return typeof x === "string" ? x.toUpperCase() : x * 2;
}

ubah("a"); // string
ubah(2);   // number
```

Untuk pemula, overload sering bisa digantikan generic atau union yang lebih sederhana. Pakai overload hanya kalau benar-benar perlu.

---

## 14. Optional & `readonly`

### Optional (`?`)

```ts
type Profil = {
  nama: string;
  bio?: string; // boleh tidak ada / undefined
};

const p1: Profil = { nama: "Dimas" };              // ok
const p2: Profil = { nama: "Dimas", bio: "Dev" };  // ok
```

Ingat: `bio?: string` setara dengan `bio: string | undefined`. Jadi saat memakainya, kamu harus memeriksa dulu:

```ts
function tampilBio(p: Profil) {
  console.log(p.bio?.toUpperCase() ?? "(belum ada bio)");
}
```

### `readonly`

Mencegah perubahan setelah dibuat:

```ts
type Titik = { readonly x: number; readonly y: number };

const t: Titik = { x: 1, y: 2 };
t.x = 5; // ❌ Error: Cannot assign to 'x' because it is a read-only property.

// readonly pada array
const angka: readonly number[] = [1, 2, 3];
angka.push(4); // ❌ Error: push tidak ada di readonly array
```

`readonly` adalah **compile-time only** — ia tidak "membekukan" object saat runtime (untuk itu pakai `Object.freeze`). Ia berguna sebagai kontrak: "fungsi ini tidak akan mengubah inputmu".

```ts
function jumlahkan(angka: readonly number[]): number {
  return angka.reduce((a, b) => a + b, 0);
  // angka.push(1); // ❌ tidak bisa — bagus, fungsi ini janji tidak memutasi
}
```

> **Model mental:** `readonly` = janji ke pembaca kode, bukan pengaman runtime. Ia menyelamatkanmu dari mutasi tak sengaja, tetapi tetap bisa ditembus dengan `as` (jangan lakukan).

---

## 15. Structural Typing — "Bentuk yang Menentukan, bukan Nama"

Ini konsep yang **sangat penting** dan sering bikin kaget orang dari bahasa OOP seperti Java/C#.

Di TypeScript, tipe dicocokkan berdasarkan **bentuk (struktur)**, bukan nama class/interface-nya. Kalau bentuknya cocok, ia dianggap cocok.

```ts
type PunyaNama = { nama: string };

function sapa(x: PunyaNama) {
  console.log(`Halo ${x.nama}`);
}

const user = { nama: "Dimas", umur: 22, hobi: "coding" };
sapa(user); // ✅ ok — user punya 'nama', kelebihan field tidak masalah
```

`user` tidak pernah dideklarasikan sebagai `PunyaNama`, tapi karena bentuknya **punya** `nama: string`, ia diterima.

Bandingkan dengan **nominal typing** (Java/C#): di sana tipe dicocokkan berdasarkan **nama** — kamu harus `implements`/`extends` secara eksplisit. TS tidak begitu.

```ts
class Kucing { nama = "Kitty"; }
class Mainan { nama = "Bola"; }

function perkenalkan(x: { nama: string }) { console.log(x.nama); }

perkenalkan(new Kucing()); // ✅ ok
perkenalkan(new Mainan()); // ✅ ok juga! — yang penting punya 'nama'
```

### Konsekuensi praktis

- **Duck typing formal:** "kalau ia jalan seperti bebek dan bersuara seperti bebek, ia bebek."
- Tipe sering kali **implicit** — kamu tidak perlu mendeklarasikan relasi antar tipe.
- Ini membuat kode lebih fleksibel, tapi bisa juga mengejutkan: dua tipe berbeda bisa saling menggantikan tanpa kamu sadari.

> **Model mental:** tipe di TS itu seperti **cetakan kue (cookie cutter)** — yang penting bentuknya pas, bukan merek cetakannya. `{ x: number; y: number }` dari mana pun asalnya adalah tipe yang sama.

---

## 16. Declaration File (`.d.ts`) — Sekilas

File `.d.ts` adalah **file deklarasi tipe**: berisi tipe saja, **tanpa implementasi**. Tujuannya memberi tahu TS bentuk kode JavaScript yang sudah ada (mis. library pihak ketiga tanpa tipe bawaan).

```ts
// math-utils.d.ts
declare function tambah(a: number, b: number): number;
declare const VERSION: string;
```

Sekarang di file `.ts` lain:

```ts
tambah(1, 2); // TS tahu signature-nya dari file .d.ts
```

Kapan kamu menemui `.d.ts`?

- Library pihak ketiga yang ditulis dalam JS — biasanya punya paket tipe terpisah berawalan `@types/` (mis. `@types/node`).
- Kamu memakai kode JS lama dan ingin memberi tipe.

```bash
npm install -D @types/node   # tipe untuk API Node.js (fs, path, dll)
```

Konsep `declare` juga dipakai untuk memberitahu TS tentang variabel global yang disuntik oleh lingkungan:

```ts
// env.d.ts
declare const __DEV__: boolean;
```

> Untuk pemula: kamu **jarang** menulis `.d.ts` sendiri. Cukup tahu bahwa (a) file itu berisi tipe tanpa implementasi, dan (b) kalau library tanpa tipe, biasanya solusinya `npm install -D @types/nama-paket`. Kalau benar-benar tidak ada, buat file `.d.ts` minimal.

---

## 17. Runtime Validation & Kenapa TS Tidak Menghilangkan Kebutuhan Itu

Ini bagian yang **paling sering disalahpahami** oleh pemula TypeScript.

### Fakta kunci: tipe TS hilang saat runtime

Seperti dibahas di bagian 1, semua anotasi tipe **dibuang** saat kompilasi. Artinya:

```ts
async function ambilUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json() as Promise<User>; // ← ini "klaim", bukan pemeriksaan!
}
```

`as Promise<User>` hanyalah **klaim ke compiler**. TS **tidak memeriksa** apakah JSON dari server benar-benar berbentuk `User`. Kalau server mengirim:

```json
{ "id": 1, "nama": null }
```

...TS tetap percaya itu `User`. Saat runtime, `user.nama.toUpperCase()` meledak. **TypeScript tidak menyelamatkanmu di sini** — karena tipe sudah hilang sebelum kode berjalan.

### Prinsipnya

> **TypeScript memeriksa kode yang KAMU tulis. Ia tidak memeriksa data yang MASUK dari dunia luar.**

Data dari luar (response API, input user, isi file, variabel environment, dokumen Firestore) harus **divalidasi saat runtime**.

### Zod — library validasi runtime

[Zod](https://zod.dev/) mendefinisikan schema yang **sekaligus** jadi validator runtime **dan** sumber tipe statis.

```bash
npm install zod
```

```ts
import { z } from "zod";

// 1) Definisikan schema
const UserSchema = z.object({
  id: z.string(),
  nama: z.string(),
  umur: z.number().int().positive(),
  email: z.email(), // Zod 4. Di Zod 3 ini ditulis z.string().email() (kini deprecated).
});

// 2) Tipe TS diturunkan DARI schema — satu sumber kebenaran
type User = z.infer<typeof UserSchema>;

// 3) Validasi saat runtime
async function ambilUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  const data: unknown = await res.json();

  const hasil = UserSchema.safeParse(data);
  if (!hasil.success) {
    // hasil.error berisi detail kesalahan
    throw new Error(`Data user tidak valid: ${hasil.error.message}`);
  }

  return hasil.data; // bertipe User — dan benar-benar sudah diverifikasi
}
```

Perhatikan alurnya: data dari luar masuk sebagai `unknown` → divalidasi dengan schema → **baru** diperlakukan sebagai `User`. Ini menggabungkan kekuatan TS (tipe statis) dan validasi runtime.

### Ringkasan pola yang benar

| Sumber data | Perlakukan sebagai | Validasi |
| --- | --- | --- |
| Kode internal (kamu yang tulis) | Tipe spesifik | Cukup type-check TS |
| Response API / JSON | `unknown` | Zod / validator runtime |
| Input user (form, CLI) | `unknown` / `string` | Zod / validator runtime |
| Environment variable | `string \| undefined` | Cek eksplisit + validator |

> **Model mental:** TypeScript adalah **pemeriksa asumsi internal**; validator runtime adalah **penjaga gerbang untuk data eksternal**. Kamu butuh keduanya. Mengandalkan TS saja untuk data dari luar adalah sumber bug produksi yang klasik.

---

## 18. Contoh Kode Lengkap (Bisa Dijalankan)

Simpan sebagai `src/contoh.ts` dan jalankan `npx tsx src/contoh.ts`.

```ts
// ── Tipe dasar ─────────────────────────────────────────────
type Status = "idle" | "loading" | "success" | "error";

type User = {
  id: string;
  nama: string;
  email?: string;      // opsional
  readonly dibuatPada: Date; // tidak bisa diubah
};

// ── Discriminated union untuk hasil async ──────────────────
type Hasil<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; pesan: string };

// ── Generic dengan constraint ──────────────────────────────
function ambil<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ── Type predicate ─────────────────────────────────────────
// Predicate HARUS memeriksa SEMUA field wajib di User (id, nama, dibuatPada),
// kalau tidak ia "berbohong" ke compiler (lihat bagian 8.5).
function isUser(x: unknown): x is User {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as Record<string, unknown>).id === "string" &&
    typeof (x as Record<string, unknown>).nama === "string" &&
    (x as Record<string, unknown>).dibuatPada instanceof Date &&
    // email opsional: kalau ada, harus string
    ((x as Record<string, unknown>).email === undefined ||
      typeof (x as Record<string, unknown>).email === "string")
  );
}

// ── Fungsi async dengan penanganan error yang benar ────────
async function muatUser(input: unknown): Promise<Hasil<User>> {
  if (!isUser(input)) {
    return { status: "error", pesan: "Bentuk data user tidak valid" };
  }
  // di sini input sudah bertipe User
  return { status: "success", data: input };
}

// ── Exhaustiveness check ───────────────────────────────────
function render<T>(hasil: Hasil<T>): string {
  switch (hasil.status) {
    case "loading":
      return "⏳ Memuat…";
    case "success":
      return `✅ Sukses: ${JSON.stringify(hasil.data)}`;
    case "error":
      return `❌ ${hasil.pesan}`;
    default: {
      const _cek: never = hasil; // error kalau ada case baru yang belum ditangani
      return _cek;
    }
  }
}

// ── Pemakaian ──────────────────────────────────────────────
async function main() {
  const user: User = {
    id: "u1",
    nama: "Dimas",
    dibuatPada: new Date(),
  };

  const nama = ambil(user, "nama"); // nama: string
  console.log("Nama:", nama);

  const hasil = await muatUser(user);
  console.log(render(hasil));

  const gagal = await muatUser({ id: 1 }); // bentuk salah
  console.log(render(gagal));
}

main();
```

Output yang diharapkan (kurang lebih):

```
Nama: Dimas
✅ Sukses: {"id":"u1","nama":"Dimas","dibuatPada":"..."}
❌ Bentuk data user tidak valid
```

---

## 19. Latihan

Kerjakan di `exercises/06-typescript/` (buat foldernya). Untuk setiap latihan: tulis jawaban **dulu**, baru jalankan dengan `npx tsx`, lalu `npx tsc --noEmit` untuk memastikan tidak ada error tipe. Commit tiap latihan selesai.

### Latihan 1 — Ganti `any` menjadi `unknown` + narrowing (mudah)

Diberikan fungsi ini:

```ts
function panjang(x: any): number {
  return x.length;
}
```

Ubah agar `x` bertipe `unknown`, dan hanya mengembalikan `length` kalau `x` benar-benar punya `length` (string atau array). Kalau tidak, kembalikan `0`. Jelaskan kenapa versi `unknown` lebih aman.

### Latihan 2 — Discriminated union untuk state form (sedang)

Buat tipe `FormState` dengan status: `"kosong" | "mengisi" | "mengirim" | "sukses" | "gagal"`.
- Saat `"mengisi"`, simpan `draft: string`.
- Saat `"sukses"`, simpan `id: string`.
- Saat `"gagal"`, simpan `pesan: string`.
- Buat fungsi `deskripsi(state: FormState): string` yang mengembalikan kalimat berbeda untuk tiap status, **dengan exhaustiveness check** (`never`).

### Latihan 3 — Generic `groupBy` (sedang)

Tulis fungsi:

```ts
function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]>
```

yang mengelompokkan array berdasarkan nilai sebuah properti. Contoh:

```ts
const orang = [
  { nama: "A", kota: "Jakarta" },
  { nama: "B", kota: "Bandung" },
  { nama: "C", kota: "Jakarta" },
];
groupBy(orang, "kota");
// { Jakarta: [{nama:"A",...},{nama:"C",...}], Bandung: [{nama:"B",...}] }
```

Petunjuk: `Record<string, T[]>` cukup untuk latihan ini (kunci dikonversi ke string).

### Latihan 4 — Utility types (sedang)

Diberikan:

```ts
type Produk = {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
};
```

Buat tipe-tipe berikut **tanpa menulis ulang field-nya**, hanya memakai utility types:
1. `ProdukBaru` — untuk membuat produk (tanpa `id`).
2. `ProdukUpdate` — semua field opsional (kecuali `id` tetap wajib).
3. `ProdukRingkas` — hanya `id` dan `nama`.
4. `KatalogStok` — `Record<string, number>` untuk memetakan `id` → `stok`.

Jelaskan satu per satu utility yang kamu pakai.

### Latihan 5 — Type predicate (sedang–sulit)

Tulis `isStringArray(x: unknown): x is string[]` yang benar-benar memeriksa:
- `x` adalah array,
- dan **setiap** elemennya `string`.

Lalu pakai di fungsi `hitungKata(input: unknown): number` yang mengembalikan jumlah kata (gabung semua string, split spasi). Kalau `input` bukan string array, kembalikan `0`. Jelaskan kenapa `is` diperlukan di sini (apa yang terjadi tanpa type predicate?).

### Latihan 6 — Runtime validation dengan Zod (sulit)

Definisikan schema Zod untuk `Produk` (dari Latihan 4), lalu:
1. Turunkan tipe `Produk` dari schema dengan `z.infer`.
2. Tulis fungsi `parseProduk(input: unknown): Produk` yang memakai `safeParse`.
3. Uji dengan tiga input: yang valid, yang kurang field, dan yang tipe field-nya salah.
4. Tulis 3 baris: **kenapa TypeScript saja tidak cukup** untuk data dari luar.

### Latihan 7 — Refactor aman (pilihan)

Ambil salah satu file latihan sebelumnya yang masih longgar tipenya. Lalu:
1. Ubah nama satu field di tipe (mis. `nama` → `namaLengkap`).
2. Jalankan `npx tsc --noEmit` dan **catat semua tempat** yang error.
3. Perbaiki, commit.

Tuliskan: berapa tempat yang harus diubah, dan apa yang akan terjadi kalau ini JavaScript murni tanpa tipe.

---

## 20. Jelaskan dengan Kata Sendiri

Tulis jawabanmu (di file catatan atau jelaskan ke mentor). Ini bagian paling penting dari note ini.

1. Kenapa TypeScript tidak bisa menggantikan validasi runtime? Beri satu contoh nyata.
2. Apa bedanya `any`, `unknown`, dan `never`? Kapan masing-masing dipakai?
3. Apa itu structural typing? Kenapa dua class berbeda bisa saling menggantikan di TS?
4. Kapan pakai `type` dan kapan pakai `interface`? Apa rekomendasimu dan kenapa?
5. Apa gunanya discriminated union? Kenapa ia lebih aman daripada `as`?
6. Kenapa `enum` jarang direkomendasikan untuk kode baru, dan apa penggantinya?
7. Apa itu generic constraint (`T extends ...`)? Beri satu contoh di mana ia mencegah bug.

---

## 21. Ringkasan Cepat

- **TypeScript** memeriksa tipe saat menulis kode; ia **hilang saat runtime**.
- **Inference** membuat kode ringkas; tulis tipe eksplisit untuk parameter, return publik, dan saat niat perlu dinyatakan.
- **`type` vs `interface`:** default `type`; `interface` bila butuh declaration merging. Konsisten.
- **Union (`|`)** = salah satu; **intersection (`&`)** = gabungan semua.
- **Literal types** membatasi nilai ke pilihan tertentu — lebih aman dari `string`.
- **`any`** mematikan pemeriksaan (hindari); **`unknown`** aman dan memaksa narrowing; **`never`** untuk hal yang tak mungkin (exhaustiveness).
- **Narrowing** (`typeof`, `in`, `instanceof`, discriminated union, type predicate) adalah cara TS mempersempit tipe.
- **Generics** = variabel untuk tipe; berguna saat tipe input menentukan tipe output.
- **Utility types** (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`, …) mentransformasi tipe yang ada.
- **Array vs tuple:** tuple punya panjang & posisi tetap.
- **Union of literals > `enum`** untuk kode baru.
- **`readonly`** = janji compile-time, bukan pengaman runtime.
- **Structural typing:** bentuk yang menentukan, bukan nama.
- **`.d.ts`** = tipe tanpa implementasi (biasanya dari `@types/...`).
- **Data dari luar wajib divalidasi runtime** (mis. Zod) — TS tidak memeriksa data yang masuk.

---

## 22. Referensi

- **TypeScript Handbook** — <https://www.typescriptlang.org/docs/handbook/intro.html> (baca *Everyday Types*, *Narrowing*, *Generics*, *Utility Types*).
- **TypeScript Playground** — <https://www.typescriptlang.org/play> (eksperimen tipe langsung di browser, tanpa setup).
- **Total TypeScript — Beginner's Tutorial** — <https://www.totaltypescript.com/tutorials/beginners-typescript> (latihan interaktif).
- **Zod** — <https://zod.dev/> (validasi runtime + inferensi tipe).
- **tsx** — <https://tsx.is/> (menjalankan `.ts` langsung).
- **`@types/node`** — <https://www.npmjs.com/package/@types/node> (tipe untuk API Node.js).

> Jangan baca referensi dari awal sampai akhir. Pakai sebagai kamus: saat mentok di satu konsep, baca bagian itu, lalu kembali ke latihan.
