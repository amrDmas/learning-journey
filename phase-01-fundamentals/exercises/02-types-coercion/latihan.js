// ============================================================
// LATIHAN 02 — Types & Coercion
// (tipe data, === vs ==, truthy/falsy, undefined vs null, NaN)
// ============================================================
//
// CARA PAKAI:
//   1. Baca tiap soal. Tulis prediksimu di "// PREDIKSI SAYA: ..."
//   2. BARU jalankan:  node latihan.js
//   3. Bandingkan. Yang beda = bahan belajar (bagus!).
//
// PENTING: jangan jalankan sebelum menulis prediksi.
// ============================================================


// ---------- BAGIAN 1: typeof ----------
// Tulis hasil typeof-nya.
console.log("1a:", typeof 5);          // PREDIKSI SAYA:
console.log("1b:", typeof "5");        // PREDIKSI SAYA:
console.log("1c:", typeof true);       // PREDIKSI SAYA:
console.log("1d:", typeof undefined);  // PREDIKSI SAYA:
console.log("1e:", typeof null);       // PREDIKSI SAYA:   ← ini jebakan terkenal
console.log("1f:", typeof []);         // PREDIKSI SAYA:
console.log("1g:", typeof {});         // PREDIKSI SAYA:
console.log("1h:", typeof (() => {})); // PREDIKSI SAYA:


// ---------- BAGIAN 2: === vs == ----------
// Jawab: true atau false
console.log("2a:", 5 === 5);           // PREDIKSI SAYA:
console.log("2b:", 5 === "5");         // PREDIKSI SAYA:
console.log("2c:", 5 == "5");          // PREDIKSI SAYA:
console.log("2d:", 0 == "");           // PREDIKSI SAYA:   ← jebakan
console.log("2e:", 0 == false);        // PREDIKSI SAYA:   ← jebakan
console.log("2f:", null == undefined); // PREDIKSI SAYA:   ← idiom khusus
console.log("2g:", null === undefined);// PREDIKSI SAYA:
console.log("2h:", NaN === NaN);       // PREDIKSI SAYA:   ← aneh, tapi benar


// ---------- BAGIAN 3: truthy / falsy ----------
// Jawab: NYALA atau mati
const cek = (nilai) => (nilai ? "NYALA" : "mati");
console.log("3a:", cek(""));           // PREDIKSI SAYA:
console.log("3b:", cek("0"));          // PREDIKSI SAYA:
console.log("3c:", cek(0));            // PREDIKSI SAYA:
console.log("3d:", cek(" "));          // PREDIKSI SAYA:
console.log("3e:", cek([]));           // PREDIKSI SAYA:
console.log("3f:", cek({}));           // PREDIKSI SAYA:
console.log("3g:", cek(NaN));          // PREDIKSI SAYA:
console.log("3h:", cek(-1));           // PREDIKSI SAYA:


// ---------- BAGIAN 4: undefined vs null ----------
let belumDiisi;
let sengajaKosong = null;

console.log("4a:", belumDiisi);                    // PREDIKSI SAYA:
console.log("4b:", sengajaKosong);                 // PREDIKSI SAYA:
console.log("4c:", typeof belumDiisi);             // PREDIKSI SAYA:
console.log("4d:", typeof sengajaKosong);          // PREDIKSI SAYA:
console.log("4e:", belumDiisi == sengajaKosong);   // PREDIKSI SAYA:
console.log("4f:", belumDiisi === sengajaKosong);  // PREDIKSI SAYA:

// Akses properti yang tidak ada
const user = { nama: "Dimas" };
console.log("4g:", user.umur);                     // PREDIKSI SAYA:


// ---------- BAGIAN 5: NaN ----------
console.log("5a:", typeof NaN);                    // PREDIKSI SAYA:
console.log("5b:", NaN === NaN);                   // PREDIKSI SAYA:
console.log("5c:", Number.isNaN(NaN));             // PREDIKSI SAYA:
console.log("5d:", Number.isNaN("halo"));          // PREDIKSI SAYA:
console.log("5e:", isNaN("halo"));                 // PREDIKSI SAYA:  ← beda dengan 5d!
console.log("5f:", Number("halo"));                // PREDIKSI SAYA:


// ---------- BAGIAN 6: operasi + yang menjebak ----------
console.log("6a:", "5" + 1);           // PREDIKSI SAYA:   ← perhatikan tanda +
console.log("6b:", "5" - 1);           // PREDIKSI SAYA:   ← perhatikan tanda -
console.log("6c:", 1 + 2 + "3");       // PREDIKSI SAYA:
console.log("6d:", "1" + 2 + 3);       // PREDIKSI SAYA:


// ============================================================
// SETELAH MENJALANKAN, jawab pertanyaan ini:
//
//   A) Kenapa `typeof null` hasilnya "object"? (cari tahu, ini bug
//      bersejarah di JavaScript yang tidak bisa diperbaiki)
//
//   B) Di 2d (`0 == ""`) hasilnya true. Kenapa itu berbahaya?
//      Apa yang sebaiknya kita pakai?
//
//   C) Di 6a (`"5" + 1`) dan 6b (`"5" - 1`) hasilnya BEDA.
//      Kenapa? (petunjuk: tanda + punya dua tugas)
//
//   D) Kenapa `NaN === NaN` hasilnya false?
//
// Tulis jawabanmu di bawah, lalu kirim ke chat.
// ============================================================


// JAWABAN SAYA:
// A)
//
// B)
//
// C)
//
// D)
//
