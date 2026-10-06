# Pembahasan Latihan 02 — Types & Coercion

> **Baca ini SETELAH kamu mencoba `latihan.js` sendiri.** Kalau langsung membaca,
> kamu akan merasa paham — tapi belum tentu benar-benar paham. Cara mengujinya:
> tutup file ini, lalu isi ulang `latihan.js` tanpa melihat.

Semua jawaban di bawah sudah **diuji langsung dengan Node** (bukan dari ingatan).

---

## 📖 Cara berpikir yang dipakai di seluruh latihan ini

Tiga pertanyaan sakti yang menyelesaikan hampir semua soal:

1. **"Ini benda apa?"** → untuk soal `typeof`
2. **"Jenisnya sama?"** → untuk soal `===`
3. **"Apakah nilainya salah satu dari 8 nilai mati?"** → untuk soal truthy/falsy

---

# BAGIAN 1 — `typeof` ("ini benda apa?")

| Soal | Kode | Jawaban | Kenapa |
|---|---|---|---|
| 1a | `typeof 5` | `"number"` | angka |
| 1b | `typeof "5"` | `"string"` | teks |
| 1c | `typeof true` | `"boolean"` | benar/salah |
| 1d | `typeof undefined` | `"undefined"` | nilainya sendiri |
| 1e | `typeof null` | `"object"` | ⚠️ **Jebakan bersejarah** |
| 1f | `typeof []` | `"object"` | array itu sejenis objek |
| 1g | `typeof {}` | `"object"` | objek |
| 1h | `typeof (() => {})` | `"function"` | fungsi punya label sendiri |

## 🔍 Kenapa `typeof null` hasilnya `"object"`?

Ini **bug dari tahun 1995** yang tidak bisa diperbaiki lagi.

Ceritanya: JavaScript pertama dibuat dalam 10 hari. Waktu itu, cara komputer menyimpan nilai
memakai **penanda** di awal data:
- `000` = objek
- `1` = angka
- `100` = teks, dst.

Masalahnya, `null` disimpan sebagai **semua angka nol** (`000...`). Jadi penandanya terbaca `000`
= "objek". Bug!

Kenapa tidak diperbaiki? Karena **sudah terlalu banyak kode di dunia** yang mengandalkan perilaku ini.
Kalau diperbaiki, jutaan website rusak. Jadi dibiarkan selamanya.

> **Cara benar mengecek `null`:**
> ```js
> nilai === null          // ✅ benar
> typeof nilai === "object"  // ❌ tidak bisa dipercaya
> ```

## 🔍 Kenapa `typeof []` hasilnya `"object"`, bukan `"array"`?

Karena array **memang** sejenis objek — array itu objek khusus yang isinya berurutan.
`typeof` tidak membedakannya.

> **Cara benar mengecek array:**
> ```js
> Array.isArray([])   // true ✅
> ```

## 🔍 Kenapa fungsi dapat label sendiri `"function"`?

Karena fungsi itu **bisa dipanggil** (`()`), beda dari objek biasa. Jadi JavaScript
memberinya label khusus supaya bisa dibedakan.

---

# BAGIAN 2 — `===` vs `==` ("jenisnya sama?")

| Soal | Kode | Jawaban | Kenapa |
|---|---|---|---|
| 2a | `5 === 5` | `true` | sama persis |
| 2b | `5 === "5"` | `false` | angka vs teks → beda jenis |
| 2c | `5 == "5"` | `true` | `==` ubah `"5"` jadi angka dulu |
| 2d | `0 == ""` | `true` | ⚠️ `""` diubah jadi `0` |
| 2e | `0 == false` | `true` | ⚠️ `false` diubah jadi `0` |
| 2f | `null == undefined` | `true` | aturan khusus (lihat bawah) |
| 2g | `null === undefined` | `false` | jenisnya beda |
| 2h | `NaN === NaN` | `false` | ⚠️ aneh tapi benar |

## 🧠 Aturan emas

> **`===`** (tiga) = **kaku & jujur**. Jenis beda → langsung `false`.
> **`==`** (dua) = **suka mengakali**. Ubah tipe dulu, baru bandingkan.

## 🔍 Kenapa `0 == ""` bernilai `true`?

Ikuti langkah-langkah yang dilakukan `==`:

```
0 == ""     ← teks kosong "" diubah jadi angka → 0
0 == 0      ← sekarang keduanya angka
true        ← sama!
```

Bayangkan `==` itu resepsionis yang **selalu berusaha mencocokkan**:
*"Kamu bilang `""` (kosong), dan ini `0`. Ya sudah, aku ubah `""` jadi `0` biar cocok. Sama!"*

**Inilah kenapa `==` berbahaya.** Angka `0` dan teks kosong `""` itu jelas **beda makna**
di kepala manusia, tapi `==` bilang sama.

## 🔍 Kenapa `null == undefined` itu `true`, tapi `null === undefined` itu `false`?

Ini **satu-satunya pengecualian** di mana `==` berguna:

- `null` dan `undefined` **sama-sama berarti "kosong"** → secara makna, `==` bilang sama (`true`)
- Tapi secara **jenis**, keduanya beda → `===` bilang beda (`false`)

Programmer berpengalaman memakai idiom ini:

```js
if (nilai == null) { ... }   // menangkap undefined DAN null sekaligus
```

Karena `undefined == null` itu `true`, satu perbandingan menangkap keduanya.

## 🔍 Kenapa `NaN === NaN` hasilnya `false`?

`NaN` artinya **"hasil perhitungan yang gagal"**.

Dua kegagalan **belum tentu kegagalan yang sama**. Contoh:
- `Number("halo")` → gagal
- `0 / 0` → gagal

Dua-duanya `NaN`, tapi penyebabnya beda. JavaScript bilang: *"Aku tidak bisa memastikan dua
kegagalan ini identik."* Jadi hasilnya `false`.

> **Cara benar mengecek NaN:**
> ```js
> Number.isNaN(nilai)   // ✅
> ```

---

# BAGIAN 3 — Truthy & Falsy ("nyala atau mati?")

## 📋 Daftar LENGKAP nilai "mati" (falsy)

Hanya ada **8** nilai di seluruh JavaScript yang dianggap "mati":

| # | Nilai | Arti |
|---|---|---|
| 1 | `false` | salah |
| 2 | `0` | nol |
| 3 | `-0` | nol negatif |
| 4 | `0n` | nol BigInt |
| 5 | `""` | teks kosong |
| 6 | `null` | sengaja kosong |
| 7 | `undefined` | belum diisi |
| 8 | `NaN` | gagal hitung |

**Semua nilai lain = NYALA (truthy).**

| Soal | Kode | Jawaban | Kenapa |
|---|---|---|---|
| 3a | `cek("")` | `mati` | teks kosong = falsy |
| 3b | `cek("0")` | `NYALA` | teks `"0"` **ada isinya** (1 karakter) |
| 3c | `cek(0)` | `mati` | angka nol = falsy |
| 3d | `cek(" ")` | `NYALA` | spasi itu **ada isinya** |
| 3e | `cek([])` | `NYALA` | array (walau kosong) tetap objek |
| 3f | `cek({})` | `NYALA` | objek (walau kosong) tetap objek |
| 3g | `cek(NaN)` | `mati` | NaN = falsy |
| 3h | `cek(-1)` | `NYALA` | angka selain 0 = truthy (termasuk negatif!) |

## 🔍 Jebakan paling sering: `"0"` vs `0`

```js
let dariForm = "0";   // dari input HTML, selalu TEKS
if (dariForm) {
  console.log("ada isinya");   // ✅ jalan! karena teks "0" ada isinya
}

let dariHitung = 0;   // angka nol
if (dariHitung) {
  console.log("ada isinya");   // ❌ tidak jalan! karena angka 0 itu falsy
}
```

Dua-duanya "nol", tapi **perilakunya beda**. Ini penyebab bug nyata di aplikasi.

## 🔍 Kenapa `[]` dan `{}` dianggap NYALA?

Karena pertanyaannya bukan *"isinya banyak atau sedikit?"* tapi *"bendanya ada atau tidak?"*.

- `[]` = **ada sebuah array** (isinya kosong, tapi array-nya ada) → NYALA
- `""` = **teks yang isinya nol karakter** → mati

> Analogi: kotak kosong tetap **sebuah kotak** (ada bendanya). Tapi kertas kosong yang
> tidak ditulisi apa pun dianggap "tidak ada isi".

## 🔍 Kenapa `-1` NYALA?

Karena aturannya: **angka `0` itu mati, angka lain nyala**. `-1` bukan `0`, jadi nyala.
Angka negatif tetap dianggap "ada".

---

# BAGIAN 4 — `undefined` vs `null` (dua jenis "kosong")

## 🧠 Analogi: dua kotak di gudang

- 📦 **Kotak yang belum pernah diisi** → `undefined`
  *"Belum ada yang menaruh apa-apa di sini."*

- 📦 **Kotak yang sengaja dikosongkan** → `null`
  *"Ada orang yang sengaja mengosongkan ini, dan mencatat 'ini kosong'."*

| Soal | Kode | Jawaban | Kenapa |
|---|---|---|---|
| 4a | `belumDiisi` | `undefined` | variabel dibuat, belum diisi |
| 4b | `sengajaKosong` | `null` | sengaja diisi `null` |
| 4c | `typeof belumDiisi` | `"undefined"` | jenisnya undefined |
| 4d | `typeof sengajaKosong` | `"object"` | ⚠️ `typeof null` = `"object"` (jebakan 1e) |
| 4e | `undefined == null` | `true` | sama-sama "kosong" |
| 4f | `undefined === null` | `false` | jenisnya beda |
| 4g | `user.umur` | `undefined` | properti tidak ada → JS isi undefined |

## 🔍 Kapan `undefined` muncul **otomatis** (bukan pilihan kita)?

```js
let x;                     // → undefined (dibuat, belum diisi)
const user = { nama: "Dimas" };
user.umur;                 // → undefined (properti tidak ada)
function f(a) {}
f();                       // → a = undefined (argumen tidak dikirim)
```

👉 **`undefined` = JavaScript sendiri yang mengisi**, karena kita belum memberi nilai.

## 🔍 Kapan pakai `null` **sengaja**?

```js
let userLogin = null;      // "belum ada user login" — ini PILIHAN saya
```

👉 **`null` = SAYA sengaja bilang "kosong"**, bukan karena lupa.

**Nanti di backend/Firebase ini penting:**
- Simpan `null` ke database → tersimpan sebagai "kosong" secara eksplisit
- Simpan `undefined` → biasanya datanya **tidak ikut tersimpan** sama sekali

Beda perilaku! Ini akan kamu temui di Fase 5–7.

---

# BAGIAN 5 — `NaN` ("Not a Number")

| Soal | Kode | Jawaban | Kenapa |
|---|---|---|---|
| 5a | `typeof NaN` | `"number"` | ⚠️ NaN itu **bertipe number** |
| 5b | `NaN === NaN` | `false` | dua kegagalan ≠ kegagalan sama |
| 5c | `Number.isNaN(NaN)` | `true` | cara benar cek NaN |
| 5d | `Number.isNaN("halo")` | `false` | `"halo"` itu teks, bukan NaN |
| 5e | `isNaN("halo")` | `true` | ⚠️ versi lama, ubah tipe dulu |
| 5f | `Number("halo")` | `NaN` | "halo" tidak bisa jadi angka |

## 🔍 Kenapa `typeof NaN` = `"number"`?

Karena `NaN` adalah **hasil dari operasi matematika yang gagal**. Ia "keluar" dari
perhitungan angka, jadi jenisnya tetap number — hanya nilainya yang berarti "bukan angka".

```js
Number("halo")   // NaN ← mencoba ubah teks jadi angka, gagal
0 / 0            // NaN
"abc" * 2        // NaN
```

## 🔍 Beda `Number.isNaN` vs `isNaN` — INI PENTING

```js
Number.isNaN("halo")   // false ✅  ← cek apa adanya: "halo" itu teks, BUKAN NaN
isNaN("halo")          // true  ❌  ← ubah "halo" jadi angka dulu (jadi NaN), lalu bilang true
```

`isNaN` (tanpa `Number.`) itu **versi lama yang menipu** — ia mengubah dulu nilainya
jadi angka. Karena `Number("halo")` = `NaN`, ia lapor `true`. Padahal `"halo"` itu
**teks**, bukan `NaN`.

> **Aturan: selalu pakai `Number.isNaN()`.** Yang tanpa `Number.` bikin bug.

---

# BAGIAN 6 — Jebakan tanda `+`

| Soal | Kode | Jawaban | Kenapa |
|---|---|---|---|
| 6a | `"5" + 1` | `"51"` | `+` menyambung (ada teks) |
| 6b | `"5" - 1` | `4` | `-` selalu matematika |
| 6c | `1 + 2 + "3"` | `"33"` | dihitung kiri→kanan |
| 6d | `"1" + 2 + 3` | `"123"` | teks di depan → semua jadi teks |

## 🔍 Kenapa `+` punya dua wajah?

Tanda `+` punya **dua tugas**:
1. **Menjumlah** angka → `2 + 3 = 5`
2. **Menyambung** teks → `"ha" + "lo" = "halo"`

Kalau salah satu sisi berupa **teks**, `+` memilih tugas **menyambung**:

```js
"5" + 1     // "51"  ← teks "5" disambung teks "1"
"5" - 1     // 4     ← tanda - cuma punya satu tugas: matematika
```

## 🔍 Kenapa `1 + 2 + "3"` = `"33"` (bukan `"123"`)?

Karena JavaScript menghitung **dari kiri ke kanan**:

```
1 + 2 + "3"
  ↓
  3 + "3"      ← 1+2 = 3 dulu (keduanya angka)
  ↓
  "33"          ← sekarang ada teks → menyambung
```

Bandingkan dengan 6d:

```
"1" + 2 + 3
  ↓
 "12" + 3      ← "1"+2 → ada teks → "12"
  ↓
 "123"         ← "12"+3 → masih teks → "123"
```

**Pelajaran:** urutan dan jenis operand menentukan hasil. Ini sumber bug klasik
saat mengambil angka dari form HTML (selalu berupa teks).

> **Solusinya:** ubah dulu ke angka.
> ```js
> Number("5") + 1    // 6 ✅
> ```

---

# 📝 Jawaban Pertanyaan A–D

## A) Kenapa `typeof null` hasilnya `"object"`?

Karena **bug dari tahun 1995**. Saat itu, nilai disimpan dengan penanda di awal:
`000` berarti objek. `null` disimpan sebagai semua nol, jadi penandanya terbaca `000`
= objek. Bug ini **tidak bisa diperbaiki** karena sudah terlalu banyak kode di dunia
yang bergantung padanya.

**Cara benar cek null:** `nilai === null`

## B) Kenapa `0 == ""` berbahaya? Apa yang sebaiknya dipakai?

Karena `==` mengubah tipe otomatis: `""` diubah jadi `0`, lalu `0 == 0` → `true`.
Padahal di kepala manusia, angka `0` dan teks kosong itu **jelas beda**.

**Yang sebaiknya dipakai:** `===` (tiga sama dengan), yang tidak mengubah tipe.

## C) Kenapa `"5" + 1` = `"51"` tapi `"5" - 1` = `4`?

Karena **`+` punya dua tugas** (menjumlah angka **dan** menyambung teks), sedangkan
**`-` hanya punya satu tugas** (matematika).

- `+` melihat ada teks → memilih tugas **menyambung** → `"51"`
- `-` tidak punya tugas menyambung → memaksa keduanya jadi angka → `5 - 1 = 4`

## D) Kenapa `NaN === NaN` hasilnya `false`?

Karena `NaN` berarti **"hasil perhitungan yang gagal"**. Dua kegagalan belum tentu
kegagalan yang **sama**. JavaScript tidak bisa memastikan `Number("halo")` (gagal) dan
`0/0` (gagal) itu kegagalan yang identik. Jadi ia bilang: **tidak sama**.

**Cara benar cek NaN:** `Number.isNaN(nilai)`

---

# ✅ Ringkasan — 5 hal yang wajib kamu ingat

1. **`typeof null` → `"object"`** (bug bersejarah). Cek null pakai `=== null`.
2. **Selalu pakai `===`**, jangan `==`. Pengecualian: `== null` untuk menangkap `null` dan `undefined` sekaligus.
3. **8 nilai falsy:** `false, 0, -0, 0n, "", null, undefined, NaN`. Selain itu **nyala** — termasuk `"0"`, `" "`, `[]`, `{}`.
4. **`undefined`** = belum diisi (JS yang isi). **`null`** = sengaja dikosongkan.
5. **`NaN !== NaN`**. Pakai `Number.isNaN()`, jangan `isNaN()`.

---

# 🎯 Uji diri (tanpa buka catatan)

Kalau kamu bisa jawab kelima ini dengan benar, berarti topik ini **lulus**:

1. Hasil `typeof null`? Kenapa begitu?
2. `0 == ""` hasilnya apa? Kenapa itu berbahaya?
3. Sebutkan 8 nilai falsy.
4. Beda `undefined` dan `null`?
5. `"5" + 1` dan `"5" - 1` hasilnya apa? Kenapa beda?
