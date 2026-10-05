// ============================================================
// LATIHAN 01 — Value vs Reference
// (beda "menyalin nilai" dan "menyalin alamat")
// ============================================================
//
// CARA PAKAI:
//   1. Baca tiap soal.
//   2. Tulis prediksimu di baris "// PREDIKSI SAYA: ..."
//   3. BARU jalankan:  node latihan.js
//   4. Bandingkan prediksimu dengan hasil. Yang beda = bahan belajar.
//
// PENTING: jangan jalankan sebelum menulis prediksi.
// Menebak dulu itu inti latihannya.
// ============================================================

// ---------- SOAL 1: menyalin angka ----------
let a = 10;
let b = a; // b menyalin NILAI dari a (kertas baru)
b = 20; // ubah b
console.log("Soal 1 -> a =", a);
// PREDIKSI SAYA: a = 10

// ---------- SOAL 2: menyalin objek ----------
let kucing1 = { nama: "Milo" };
let kucing2 = kucing1; // kucing2 menyalin ALAMAT objek yang sama
kucing2.nama = "Oyen"; // ubah lewat kucing2
console.log("Soal 2 -> kucing1.nama =", kucing1.nama);
// PREDIKSI SAYA: kucing1.nama = "Milo"

// ---------- SOAL 3: kirim angka ke fungsi ----------
function ubahAngka(n) {
  n = 100; // ubah parameter
}
let angka = 5;
ubahAngka(angka);
console.log("Soal 3 -> angka =", angka);
// PREDIKSI SAYA: angka = 5

// ---------- SOAL 4: kirim objek ke fungsi, lalu UBAH ISINYA ----------
function ubahKucing(k) {
  k.nama = "Bulu"; // mengubah ISI objek (loker yang sama)
}
let kucing3 = { nama: "Milo" };
ubahKucing(kucing3);
console.log("Soal 4 -> kucing3.nama =", kucing3.nama);
// PREDIKSI SAYA: kucing3.nama = Milo

// ---------- SOAL 5: kirim objek ke fungsi, lalu GANTI SELURUHNYA ----------
function gantiKucing(k) {
  k = { nama: "Baru" }; // membuat objek BARU (kertas baru), bukan mengubah isi loker lama
}
let kucing4 = { nama: "Milo" };
gantiKucing(kucing4);
console.log("Soal 5 -> kucing4.nama =", kucing4.nama);
// PREDIKSI SAYA: kucing4.nama = Milo

// ============================================================
// SETELAH MENJALANKAN, jawab 3 pertanyaan ini dan kirim ke mentor:
//
//   a) Soal 1 dan 3 hasilnya sama-sama "tidak berubah". Kenapa?
//
//   b) Soal 2 dan 4 hasilnya sama-sama "berubah". Kenapa?
//
//   c) Soal 5 objeknya TIDAK berubah, padahal soal 4 berubah.
//      Apa bedanya isi kedua fungsi itu?
//
// Tulis jawabanmu di file ini juga (di bawah), lalu kirim ke chat.
// ============================================================

// JAWABAN SAYA:
// a)
//
// b)
//
// c)
//
