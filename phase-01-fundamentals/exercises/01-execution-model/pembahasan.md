# Pembahasan Latihan 01 — Value vs Reference

> Baca ini **setelah** kamu mengerjakan `latihan.js`. Tujuannya bukan menghafal jawaban,
> tapi memahamkan **kenapa** hasilnya begitu.

## Analogi kunci

| Jenis data | Saat "disalin" | Seperti |
|---|---|---|
| Angka, teks, boolean (`10`, `"Milo"`, `true`) | **nilainya** disalin | kirim **FILE** — teman dapat salinan |
| Objek, array (`{}`, `[]`) | **alamatnya** disalin | kirim **LINK** — kalian buka folder yang sama |

---

## Soal 1 — `a` tetap `10`

```js
let a = 10;
let b = a;   // b = SALINAN nilai 10
b = 20;      // ubah salinan
console.log(a); // 10
```

**Kenapa:** `b = a` menyalin **nilai**. `a` dan `b` adalah dua wadah terpisah.
Mengubah `b` tidak menyentuh `a`.

**Kata kunci: NILAI disalin.**

---

## Soal 2 — `kucing1.nama` jadi `"Oyen"`

```js
let kucing1 = { nama: "Milo" };
let kucing2 = kucing1;   // kucing2 = LINK ke objek yang SAMA
kucing2.nama = "Oyen";   // buka link, ubah ISI
console.log(kucing1.nama); // "Oyen"
```

**Kenapa:** `kucing2 = kucing1` menyalin **alamat**, bukan isi objek.
Keduanya menunjuk ke objek yang sama, jadi perubahan terlihat oleh keduanya.

**Kata kunci: ALAMAT disalin.**

---

## Soal 3 — `angka` tetap `5`

```js
function ubahAngka(n) { n = 100; }
let angka = 5;
ubahAngka(angka);
console.log(angka); // 5
```

**Kenapa:** parameter `n` menerima **salinan nilai** 5. `n = 100` mengubah salinan lokal
di dalam fungsi saja. `angka` di luar tidak tersentuh. (Sama seperti soal 1.)

---

## Soal 4 — `kucing3.nama` jadi `"Bulu"`

```js
function ubahKucing(k) { k.nama = "Bulu"; }  // ubah ISI lewat link
let kucing3 = { nama: "Milo" };
ubahKucing(kucing3);
console.log(kucing3.nama); // "Bulu"
```

**Kenapa:** parameter `k` menerima **alamat** objek yang sama dengan `kucing3`.
`k.nama = "Bulu"` membuka objek itu dan mengubah isinya. `kucing3` melihat objek yang sama.
(Sama seperti soal 2.)

---

## Soal 5 — `kucing4.nama` tetap `"Milo"`

```js
function gantiKucing(k) { k = { nama: "Baru" }; }  // GANTI link, bukan ubah isi
let kucing4 = { nama: "Milo" };
gantiKucing(kucing4);
console.log(kucing4.nama); // "Milo"
```

**Kenapa:** perhatikan bedanya:

```js
k.nama = "Bulu";       // buka link -> ubah ISI folder      -> folder lama BERUBAH
k = { nama: "Baru" };  // buat folder baru -> tulis LINK baru -> folder lama TIDAK tersentuh
```

`k = { ... }` **membuat objek baru**, lalu menuliskan alamat objek baru itu ke variabel `k`.
Variabel `kucing4` di luar fungsi masih memegang alamat objek lama (isinya "Milo").
Begitu fungsi selesai, `k` dibuang dan objek baru tidak terpakai lagi.

**Kata kunci: `obj.prop = x` mengubah ISI. `obj = {...}` mengganti ALAMAT.**

---

## Ringkasan satu baris

> Kalau kamu mengubah **isi** objek (`obj.prop = ...`), semua yang menunjuk objek itu ikut melihat.
> Kalau kamu **mengganti** variabel dengan objek baru (`obj = {...}`), hanya variabel itu yang berubah.

## Kenapa ini penting untuk React

React mendeteksi perubahan state dengan **membandingkan alamat objek**, bukan isinya.
Karena itu di React kita **selalu membuat objek/array baru** saat mengubah state
(`{ ...state, nama: "X" }`), bukan mengubah yang lama. Kalau ini belum masuk, jangan khawatir —
nanti di Fase 3 (React) kita bahas lagi dengan contoh nyata.
